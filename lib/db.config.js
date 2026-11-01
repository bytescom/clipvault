import mongoose from "mongoose";

/**
 * Cache the connection.
 * So, we don't reconnect on every API call
 */
let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log(`Connected to database: ${db.connection.host}`);
    } catch (error) {
        // Rethrow so route handlers fail fast with a 500 instead of letting
        // queries buffer against a dead connection until they time out.
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}
