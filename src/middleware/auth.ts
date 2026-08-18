import type { NextFunction, Request, Response } from "express";
import { AppError } from "./appError.js";
import jwt from "jsonwebtoken";

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = (req as any).cookies.accessToken;

    if (!token) {
        return next(new AppError("Unauthorized", 401));
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        const payload = decoded as {
            id: string;
            role: "customer" | "admin";
        };

        req.userId = payload.id;
        req.role = payload.role;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(new AppError("Token has expired", 401));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return next(new AppError("Invalid token", 401));
        }

        if (error instanceof jwt.NotBeforeError) {
            return next(new AppError("Token is not active", 401));
        }

        return next(error);
    }
};
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.role || !roles.includes(req.role)) {
            return next(new AppError("You are not authorized to access this resource", 403));
        }
        next();
    };
};
