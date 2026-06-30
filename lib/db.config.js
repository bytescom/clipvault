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
        console.error(error);
    }
}
