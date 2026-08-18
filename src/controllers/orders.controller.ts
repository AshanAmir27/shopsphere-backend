import type { Request, Response, NextFunction } from "express";
import * as ordersService from "../services/orders.service.js";
import { successResponse } from "../utils/response.js";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const { items, totalAmountAtPurchase, shippingAddress, paymentMethod } = req.body;
        const order = await ordersService.createOrder({ userId: userId as string, items, totalAmountAtPurchase, shippingAddress, paymentMethod });
        res.status(201).json(successResponse(201, "Order created successfully", order));
    } catch (error) {
        next(error);
    }
};

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const orders = await ordersService.getOrders({userId});
        res.status(200).json(successResponse(200, "Orders fetched successfully", orders));
    } catch (error) {
        next(error);
    }
};

export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        const order = await ordersService.getOrderById({id: id as string, userId: userId as string});
        res.status(200).json(successResponse(200, "Order fetched successfully", order));
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        const { items, totalAmountAtPurchase, shippingAddress, paymentMethod } = req.body;
        const order = await ordersService.updateOrder({id: id as string, userId: userId as string, order: { items, totalAmountAtPurchase, shippingAddress, paymentMethod, userId: userId as string } });
        res.status(200).json(successResponse(200, "Order updated successfully", order));
    } catch (error) {
        next(error);
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;
        await ordersService.deleteOrder({id: id as string, userId: userId as string});
        res.status(200).json(successResponse(200, "Order deleted successfully", null));
    } catch (error) {
        next(error);
    }
};