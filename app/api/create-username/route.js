import { auth, db } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    const users = await db.collection("user")
        .find({}, { projection: { username: 1, _id: 0 } })
        .toArray();

    const usernames = users.map(u => u.username).filter(Boolean);

    return NextResponse.json({ usernames });
}

export async function POST(request) {
    // 1. Verify session
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username } = await request.json();

    if (!username || !/^[a-zA-Z0-9_-]{3,}$/.test(username)) {
        return NextResponse.json({ message: "Invalid username" }, { status: 400 });
    }

    // 2. Check uniqueness in better-auth's user collection
    const existing = await db.collection("user").findOne({ username: username.toLowerCase() });
    if (existing) {
        return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }

    // 3. Save via better-auth — updates the logged-in user's document
    await auth.api.updateUser({
        headers: request.headers,
        body: { username: username.toLowerCase() },
    });

    return NextResponse.json({ message: "Username saved successfully" });
}