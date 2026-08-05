import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/appError.js";

export const validateRegisterUser = (req: Request, _res: Response, next: NextFunction) => {
  const { name, email, password, role, addresses } = req.body;

  if (!name || !email || !password || !role || !addresses) {
    return next(new AppError("All fields are required", 400));
  }
  if (role !== "customer" && role !== "admin") {
    return next(new AppError("Invalid role", 400));
  }
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return next(new AppError("Addresses are required", 400));
  }

  next();
};

export const validateLoginUser = (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }
  next();
};