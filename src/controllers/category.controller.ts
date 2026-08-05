import type { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response.js";
import * as categoryService from "../services/category.service.js";
import { AppError } from "../middleware/appError.js";
import uploadImages from "../config/cloudinary.js";

// Create category
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await uploadImages(req.files as Express.Multer.File[]);
        if (!images || images.length === 0) {
          return next(new AppError("No images uploaded", 400));
        }
        const category = await categoryService.createCategory({ ...req.body, images: images as string[] });
        res.status(201).json(successResponse(201, "Category created successfully", category));
    } catch (error) {
        next(error);
    }
}

// Update category
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryService.updateCategory(req.params.id as string, req.body);
        res.status(200).json(successResponse(200, "Category updated successfully", category));
    } catch (error) {
        next(error);
    }
}

// Delete category
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await categoryService.deleteCategory(req.params.id as string);
        res.status(200).json(successResponse(200, "Category deleted successfully", null));
    } catch (error) {
        next(error);
    }
}

// Get all categories
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryService.getCategories();
        res.status(200).json(successResponse(200, "Categories fetched successfully", categories));
    } catch (error) {
        next(error);
    }
}

// Get category by id
export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryService.getCategoryBySlug(req.params.slug as string);
        res.status(200).json(successResponse(200, "Category fetched successfully", category));          
    } catch (error) {
        next(error);
    }
}