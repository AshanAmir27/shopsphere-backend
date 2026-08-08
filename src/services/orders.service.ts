import Order from "../models/order.model.js";
import type { IOrder } from "../types/orders.types.js";

export const createOrder = async (order: IOrder) => {
    const newOrder = await Order.create(order);
    return newOrder.toObject();
};

export const getOrders = async () => {
    const orders = await Order.find();
    return orders.map(order => order.toObject());
};

export const getOrderById = async (id: string) => {
    const order = await Order.findById(id);
    return order?.toObject() || null;
};

export const updateOrder = async (id: string, order: IOrder) => {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, { new: true });
    return updatedOrder?.toObject() || null;
};

export const deleteOrder = async (id: string) => {
    await Order.findByIdAndDelete(id);
};