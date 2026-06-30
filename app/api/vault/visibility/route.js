import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db.config";
import { Vault } from "@/models/vault.models";

/**
 * @POST  /api/vault/visibility
 * Called by sendBeacon on component unmount to persist the final isPrivate
 * value for a single todo. Body: { id: string, isPrivate: boolean }
 */
export async function POST(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id, isPrivate } = body;

        if (!id || isPrivate === undefined) {
            return NextResponse.json({ error: "Missing id or isPrivate" }, { status: 400 });
        }

        await connectDB();
        await Vault.findOneAndUpdate(
            { id, userId: session.user.id },
            { $set: { isPrivate } },
            { new: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
