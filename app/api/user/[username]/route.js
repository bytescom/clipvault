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

        const user = await db.collection("user").findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        await connectDB();
        const items = await Vault.find({ userId: user._id.toString() });

        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
