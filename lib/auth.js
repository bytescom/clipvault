import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
export const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),

    emailAndPassword: {
        enabled: true,
    },

    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
                unique: true,
            },
        },
    },
});