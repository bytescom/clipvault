import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
export const db = client.db();

// better-auth does not create database indexes for `additionalFields`, so the
// unique constraint on usernames has to live here. Usernames are always
// stored lowercase (normalized by /api/create-username). `sparse` keeps users
// without a username exempt.
db.collection("user")
    .createIndex({ username: 1 }, { unique: true, sparse: true })
    .catch((error) => console.error("Failed to create username unique index:", error));

export const auth = betterAuth({
    database: mongodbAdapter(db),

    emailAndPassword: {
        enabled: true,

        // Password reset: better-auth calls this with the ready-made reset URL.
        // TODO: replace the console logger with a real email provider (Resend,
        // Nodemailer, ...) before deploying — console delivery is dev-only.
        sendResetPassword: async ({ user, url }) => {
            console.log(`[reset-password] Reset link for ${user.email}: ${url}`);
        },
    },

    user: {
        additionalFields: {
            username: {
                type: "string",
                required: false,
            },
        },
    },
});
