import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectDB } from "./db.config";
import mongoose from "mongoose";

export const db = await mongoose.connect(connectDB);

export const auth = betterAuth({
    database: mongodbAdapter(db),

    emailAndPassword: {
        enabled: true,
    },
});