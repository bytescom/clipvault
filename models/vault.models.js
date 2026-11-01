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
            required: true,
            index: true
        },
        text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        isPrivate: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

export const Vault = mongoose.models.Vault || mongoose.model("Vault", vaultSchema)
