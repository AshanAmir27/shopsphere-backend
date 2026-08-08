import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        default: null,
    },
    emailVerificationTokenExpiresAt: {
        type: Date,
        default: null,
    },
    addresses: [
        {
            label: {
                type: String,
                required: true,
                trim: true,
            },
            street: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                trim: true,
            },
            state: {
                type: String,
                required: true,
                trim: true,
            },
            country: {
                type: String,
                required: true,
                trim: true,
            },
            postalCode: {
                type: String,
                required: true,
                trim: true,
            },
            isDefault: {
                type: Boolean,
                default: false,
            },
        }
    ]
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;