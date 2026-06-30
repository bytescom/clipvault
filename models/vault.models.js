import mongoose from "mongoose";

export const vaultSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        userId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        isPrivate: {
            type: Boolean,
            default: true
        }
    }
)

export const Vault = mongoose.models.Vault || mongoose.model("Vault", vaultSchema)