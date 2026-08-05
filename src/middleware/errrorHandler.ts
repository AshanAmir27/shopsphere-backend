import type { Request, Response, NextFunction } from "express";
import { AppError } from "./appError.js";
import { errorResponse } from "../utils/response.js";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorResponse(err.statusCode, err.message, err.message)
    );
  }
  return res.status(500).json(
    errorResponse(500, "Internal server error", err.message)
  );
};