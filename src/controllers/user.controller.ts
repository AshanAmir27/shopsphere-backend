import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import { successResponse } from "../utils/response.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.registerUser(req.body);
    res
      .status(201)
      .json(successResponse(201, "User registered successfully", user));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, accessToken, refreshToken } = await userService.loginUser(
      req.body
    );
    setAuthCookies(res, accessToken, refreshToken);
    res
      .status(200)
      .json(successResponse(200, "User logged in successfully", { user }));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.refreshToken;
    const { user, accessToken } = await userService.refreshToken(token);

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    });
    res
      .status(200)
      .json(successResponse(200, "Token refreshed successfully", { user }));
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("accessToken", "", { ...cookieOptions, maxAge: 0 });
    res.cookie("refreshToken", "", { ...cookieOptions, maxAge: 0 });
    res
      .status(200)
      .json(successResponse(200, "User logged out successfully", null));
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getMe((req as any).userId);
    res
      .status(200)
      .json(successResponse(200, "User fetched successfully", user));
  } catch (error) {
    next(error);
  }
};
