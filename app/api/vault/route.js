import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db.config";
import { Vault } from "@/models/vault.models";


/**
 * @GET
 * Handles GET requests to retrieve all Vault items (todos) for the currently authenticated user.
 * It verifies the user's session and queries the database for items matching their userId.
 */
export async function GET(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const todos = await Vault.find({ userId: session.user.id });
        return NextResponse.json(todos);

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


/**
 * @POST
 * Handles POST requests to create a new Vault item (todo).
 * It expects a JSON body with { id, text, visibility }, validates the user's session,
 * and saves the new item to the database associated with the user's ID.
 */
export async function POST(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id, text, isPrivate } = body;

        await connectDB();
        const newTodo = await Vault.create({
            id,
            text,
            isPrivate: isPrivate !== undefined ? isPrivate : true,
            userId: session.user.id
        });

        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


/**
 * @PUT
 * Handles PUT requests to update an existing Vault item (todo).
 * It expects a JSON body with the updated { id, text, visibility }, validates the session,
 * and updates the corresponding document in the database only if it belongs to the user.
 */
export async function PUT(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { id, text, isPrivate } = body;

        // Build update only from fields that were actually sent
        const updateFields = {};
        if (text !== undefined)      updateFields.text      = text;
        if (isPrivate !== undefined) updateFields.isPrivate = isPrivate;

        await connectDB();
        const updatedTodo = await Vault.findOneAndUpdate(
            { id, userId: session.user.id },
            { $set: updateFields },
            { new: true }
        );

        if (!updatedTodo) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updatedTodo);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


/**
 * @DELETE
 * Handles DELETE requests to remove a Vault item (todo).
 * It extracts the item's `id` from the URL search parameters, validates the session,
 * and deletes the document from the database if it belongs to the authenticated user.
 */
export async function DELETE(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await connectDB();
        const deletedTodo = await Vault.findOneAndDelete({ id, userId: session.user.id });

        if (!deletedTodo) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
