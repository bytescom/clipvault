import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { sendPasswordResetEmail } from "./email.js";

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

    // Long-lived 30-day session with daily sliding expiration
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24,       // Extend session after 1 day of activity
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 30, // 30 days
        },
    },

    emailAndPassword: {
        enabled: true,

        // Password reset: sends an email via Gmail SMTP (Nodemailer).
        sendResetPassword: async ({ user, url, token }) => {
            await sendPasswordResetEmail({ to: user.email, url, token });
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
