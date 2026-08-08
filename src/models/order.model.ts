import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            priceAtPurchase: {
                type: Number,
                required: true,
            },
            images: [
                {
                    type: String,
                    required: true,
                }
            ]
        },
    ],
    totalAmountAtPurchase: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["credit card", "debit card", "paypal", "cash"],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "processing", "paid", "failed", "refunded"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
},
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;