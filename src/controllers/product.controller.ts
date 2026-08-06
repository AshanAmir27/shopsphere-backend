import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import * as productService from "../services/product.service.js";
import { AppError } from "../middleware/appError.js";
import uploadImages from "../config/cloudinary.js";
import type { GetProductsQuery } from "../types/product.types.js";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await uploadImages(req.files as Express.Multer.File[]);
        if (!images) {
            return next(new AppError("No images uploaded", 400));
        }
        const product = await productService.createProduct({ ...req.body, images });
        res.status(201).json(successResponse(201, "Product created successfully", product));
    } catch (error) {
        next(error);
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.updateProduct(req.params.id as string, req.body);
        res.status(200).json(successResponse(200, "Product updated successfully", product));
    } catch (error) {
        next(error);
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await productService.deleteProduct(req.params.id as string);
        res.status(200).json(successResponse(200, "Product deleted successfully", null));
    } catch (error) {
        next(error);
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = (req as Request & { validatedQuery: GetProductsQuery }).validatedQuery;
        const products = await productService.getProducts(query);
        res.status(200).json(successResponse(200, "Products fetched successfully", products));
    } catch (error) {
        next(error);
    }
}

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await productService.getProductBySlug(req.params.slug as string);
        res.status(200).json(successResponse(200, "Product fetched successfully", product));
    } catch (error) {
        next(error);
    }
}