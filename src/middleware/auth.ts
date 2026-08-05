import type { NextFunction, Request, Response } from "express";
import { AppError } from "./appError.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = (req as any).cookies.accessToken;
    if (!token) {
        return next(new AppError("Unauthorized", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    (req as any).userId = (decoded as { id: string }).id;
    (req as any).role = (decoded as { role: "customer" | "admin" }).role;
    next();
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes((req as any).role)) {
            return next(new AppError("You are not authorized to access this resource", 403));
        }
        next();
    };
};
