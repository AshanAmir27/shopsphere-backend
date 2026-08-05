import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/appError.js";
import mongoose from "mongoose";

export const validateCreateProduct = (req: Request, _res: Response, next: NextFunction) => {
  const { name, slug, description, price, discount, category, brand, stock, tags, isFeatured, status } = req.body;

  const required = { name, slug, description, price, discount, category, brand, stock, tags, isFeatured, status };
  const missing = Object.entries(required)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([key]) => key);

  // images come from multer files, not body
  if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
    missing.push("images");
  }

  if (missing.length > 0) {
    return next(new AppError(`Missing fields: ${missing.join(", ")}`, 400));
  }

  next();
};

