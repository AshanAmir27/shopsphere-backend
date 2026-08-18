import Order from "../models/order.model.js";
import type { IOrder } from "../types/orders.types.js";
import { AppError } from "../middleware/appError.js";
import User from "../models/user.model.js";

export const createOrder = async (order: IOrder) => {
    const user = await User.findById(order.userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const newOrder = await Order.create({ ...order, userId: user._id });
    if (!newOrder) {
        throw new AppError("Failed to create order", 500);
    }
    return newOrder.toObject();
};

export const getOrders = async ({ userId }: { userId: string }) => {
    const orders = await Order.find({ userId });
    return orders.map(order => order.toObject());
};

export const getOrderById = async ({ id, userId }: { id: string, userId: string }) => {
    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    return order?.toObject() || null;
};

export const updateOrder = async ({ id, userId, order }: { id: string, userId: string, order: IOrder }) => {
    const updatedOrder = await Order.findOneAndUpdate({ _id: id, userId }, { ...order, userId }, { new: true });
    if (!updatedOrder) {
        throw new AppError("Order not found", 404);
    }
    return updatedOrder?.toObject() || null;
};

export const deleteOrder = async ({ id, userId }: { id: string, userId: string }) => {
    const deletedOrder = await Order.findOneAndDelete({ _id: id, userId });
    if (!deletedOrder) {
        throw new AppError("Order not found", 404);
    }
    return deletedOrder.toObject();
};