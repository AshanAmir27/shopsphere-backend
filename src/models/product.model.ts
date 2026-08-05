import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    brand: {
        type: String,
        required: true,
        trim: true,
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    tags: [
        {
            type: String,
            required: true,
        }
    ],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    isFeatured: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
},
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;