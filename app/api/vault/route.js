import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db.config";
import { Vault } from "@/models/vault.models";

// Item ids are generated client-side with nanoid (21 chars of [A-Za-z0-9_-]).
// The range leaves headroom while rejecting junk from malformed requests.
const ID_REGEX = /^[A-Za-z0-9_-]{6,40}$/;
const MAX_TEXT_LENGTH = 1000;

const isValidId = (id) => typeof id === "string" && ID_REGEX.test(id);
const isValidText = (text) =>
    typeof text === "string" && text.trim().length > 0 && text.length <= MAX_TEXT_LENGTH;

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const serverError = (error, scope) => {
    console.error(scope, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
};

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
        if (!session) return unauthorized();

        await connectDB();
        const todos = await Vault.find({ userId: session.user.id }).sort({ createdAt: 1, _id: 1 });
        return NextResponse.json(todos);

    } catch (error) {
        return serverError(error, "[/api/vault GET]");
    }
}


/**
 * @POST
 * Handles POST requests to create a new Vault item (todo).
 * It expects a JSON body with { id, text, isPrivate }, validates the user's session,
 * and saves the new item to the database associated with the user's ID.
 */
export async function POST(req) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if (!session) return unauthorized();

        const body = await req.json();
        const { id, text, isPrivate } = body;

        if (!isValidId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        if (!isValidText(text)) {
            return NextResponse.json(
                { error: `Text must be 1-${MAX_TEXT_LENGTH} characters` },
                { status: 400 }
            );
        }
        if (isPrivate !== undefined && typeof isPrivate !== "boolean") {
            return NextResponse.json({ error: "isPrivate must be a boolean" }, { status: 400 });
        }

        await connectDB();
        const newTodo = await Vault.create({
            id,
            text: text.trim(),
            isPrivate: isPrivate !== undefined ? isPrivate : true,
            userId: session.user.id
        });

        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        return serverError(error, "[/api/vault POST]");
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
        if (!session) return unauthorized();

        const body = await req.json();
        const { id, text, isPrivate } = body;

        if (!isValidId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        if (text !== undefined && !isValidText(text)) {
            return NextResponse.json(
                { error: `Text must be 1-${MAX_TEXT_LENGTH} characters` },
                { status: 400 }
            );
        }
        if (isPrivate !== undefined && typeof isPrivate !== "boolean") {
            return NextResponse.json({ error: "isPrivate must be a boolean" }, { status: 400 });
        }

        // Build update only from fields that were actually sent
        const updateFields = {};
        if (text !== undefined)      updateFields.text      = text.trim();
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
        return serverError(error, "[/api/vault PUT]");
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
        if (!session) return unauthorized();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!isValidId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

        await connectDB();
        const deletedTodo = await Vault.findOneAndDelete({ id, userId: session.user.id });

        if (!deletedTodo) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return serverError(error, "[/api/vault DELETE]");
    }
}
