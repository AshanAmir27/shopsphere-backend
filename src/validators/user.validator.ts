import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/appError.js";

export const validateRegisterUser = (req: Request, _res: Response, next: NextFunction) => {
  const { name, email, password,  addresses, role } = req.body;

  if (!name || !email || !password || !addresses) {
    return next(new AppError("All fields are required", 400));
  }

  if (role) {
    return next(new AppError("Role is not allowed to register", 400));
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