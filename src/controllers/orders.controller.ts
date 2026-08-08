import type { Request, Response } from "express";
import * as ordersService from "../services/orders.service.js";

export const createOrder = async (req: Request, res: Response) => {
    const { userId, items, totalAmountAtPurchase, shippingAddress, paymentMethod } = req.body;
    const order = await ordersService.createOrder({ userId, items, totalAmountAtPurchase, shippingAddress, paymentMethod, paymentStatus: "pending" });
    res.status(201).json(order);
};

export const getOrders = async (_req: Request, res: Response) => {
    const orders = await ordersService.getOrders();
    res.status(200).json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await ordersService.getOrderById(id as string);
    res.status(200).json(order);
};

export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, items, totalAmountAtPurchase, shippingAddress, paymentMethod, paymentStatus } = req.body;
    const order = await ordersService.updateOrder(id as string, { userId, items, totalAmountAtPurchase, shippingAddress, paymentMethod, paymentStatus: "pending" });
    res.status(200).json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    await ordersService.deleteOrder(id as string);
    res.status(200).json({ message: "Order deleted successfully" });
};