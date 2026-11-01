import { auth, db } from "@/lib/auth";
import { NextResponse } from "next/server";

// 3-30 chars of [a-zA-Z0-9_-]. Usernames are always stored lowercase, so the
// public profile URL /<username> is case-insensitive after normalization.
const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;

// Names that would shadow real app routes — static routes win over
// /[username], so profiles with these names would be unreachable.
const RESERVED_USERNAMES = new Set([
    "api", "auth", "vault", "user", "create-username", "login", "signin",
    "sign-in", "signup", "sign-up", "reset-password", "forgot-password",
    "favicon.svg", "public", "static", "assets", "admin", "settings", "profile",
]);

/**
 * @GET /api/create-username?username=… → { available: boolean }
 * Availability check for a single username (session required). Never returns
 * the full user base — that would be user enumeration.
 */
export async function GET(request) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const username = (searchParams.get("username") || "").trim().toLowerCase();

        if (!USERNAME_REGEX.test(username) || RESERVED_USERNAMES.has(username)) {
            return NextResponse.json({ available: false });
        }

        // A name the current user already owns is "available" to them —
        // re-checking your own just-claimed username must not flash
        // "already taken" (e.g. during the post-claim transition).
        if (session.user.username && session.user.username === username) {
            return NextResponse.json({ available: true });
        }

        const existing = await db.collection("user").findOne({ username });
        return NextResponse.json({ available: !existing });
    } catch (error) {
        console.error("[/api/create-username GET]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

/**
 * @POST /api/create-username  body: { username }
 * Claims a username for the logged-in user. One-time: once set, the username
 * cannot be changed, because the old /<username> profile link would break.
 */
export async function POST(request) {
    try {
        // 1. Verify session
        const session = await auth.api.getSession({ headers: request.headers });
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { username } = await request.json();
        const normalized = typeof username === "string" ? username.trim().toLowerCase() : "";

        if (!USERNAME_REGEX.test(normalized)) {
            return NextResponse.json(
                { message: "Username must be 3-30 characters (letters, numbers, _ or -)." },
                { status: 400 }
            );
        }
        if (RESERVED_USERNAMES.has(normalized)) {
            return NextResponse.json({ message: "That username is reserved." }, { status: 400 });
        }

        // 2. Claiming is one-time per account
        const me = await db.collection("user").findOne(
            { _id: session.user.id },
            { projection: { username: 1 } }
        );
        if (me?.username) {
            return NextResponse.json(
                { message: `You already have a username (@${me.username}).` },
                { status: 409 }
            );
        }

        // 3. Check uniqueness in better-auth's user collection
        const existing = await db.collection("user").findOne({ username: normalized });
        if (existing) {
            return NextResponse.json({ message: "Username already taken" }, { status: 409 });
        }

        // 4. Save via better-auth — updates the logged-in user's document.
        //    The unique index on user.username (created in lib/auth.js) makes
        //    this race-safe: if another request claims the same name between
        //    the check above and this write, the write fails with E11000 and
        //    is reported as "taken" below.
        await auth.api.updateUser({
            headers: request.headers,
            body: { username: normalized },
        });

        return NextResponse.json({ message: "Username saved successfully" });
    } catch (error) {
        if (error?.code === 11000 || /E11000|duplicate key/i.test(error?.message || "")) {
            return NextResponse.json({ message: "Username already taken" }, { status: 409 });
        }
        console.error("[/api/create-username POST]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
