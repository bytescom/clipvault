import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.config";
import { Vault } from "@/models/vault.models";
import { db } from "@/lib/auth";

export async function GET(req, { params }) {
    try {
        const { username } = await params;
        if (!username) {
            return NextResponse.json({ error: "Username is required" }, { status: 400 });
        }

        // Usernames are stored lowercase — normalize so /John resolves to john.
        const normalized = username.toLowerCase();

        const user = await db.collection("user").findOne({ username: normalized });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await connectDB();

        // Public profile: only items explicitly made public may leave the
        // server. Never send private items and filter on the client — that
        // leaks the user's entire vault to anyone who hits this endpoint.
        const items = await Vault.find({ userId: user._id.toString(), isPrivate: false })
            .sort({ createdAt: 1, _id: 1 });

        return NextResponse.json(items);
    } catch (error) {
        console.error("[/api/user]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
