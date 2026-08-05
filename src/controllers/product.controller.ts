import type { NextFunction, Request, Response } from "express";
import { successResponse } from "../utils/response.js";
import * as productService from "../services/product.service.js";
import { AppError } from "../middleware/appError.js";
import uploadImages from "../config/cloudinary.js";

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
        const { page, limit, sort, order, search, description, category, brand, stock, discount, tags, rating, isFeatured, status } = req.query;
        let limitNumber = limit ? parseInt(limit as string) : 10;
        let pageNumber = page ? parseInt(page as string) : 1;
        let sortBy = sort ? sort as string : "createdAt";
        let orderBy = order ? order as string : "desc";

        const query: Record<string, unknown> = {};

        if (search) {
            query.$or =[
                { name: { $regex: search as string, $options: "i" } },
                { slug: { $regex: search as string, $options: "i" } },
                { description: { $regex: search as string, $options: "i" } },
                { brand: { $regex: search as string, $options: "i" } },
                // { stock: { $regex: search as string, $options: "i" } },
                // { discount: { $regex: search as string, $options: "i" } },
                // { tags: { $regex: search as string, $options: "i" } },
                // { rating: { $regex: search as string, $options: "i" } },
                // { isFeatured: { $regex: search as string, $options: "i" } },
                { status: { $regex: search as string, $options: "i" } },
            ]
        }
        
        if (category) query.category = category;
        
        if (stock) query.stock = Number(stock);
        if (discount) query.discount = Number(discount);
        if (tags) query.tags = tags;
        // if (rating) query.rating = Number(rating);
        if (isFeatured !== undefined) query.isFeatured = isFeatured;
        // if (status) query.status = status;

        const products = await productService.getProducts({ query, limitNumber, pageNumber, sortBy, orderBy });

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