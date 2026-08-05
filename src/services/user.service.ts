import User from "../models/user.model.js";
import type { IUser } from "../types/user.types.ts";
import bcrypt from "bcrypt";
import { AppError } from "../middleware/appError.js";
import jwt from "jsonwebtoken";

const stripPassword = (user: InstanceType<typeof User>) => {
    const userWithoutPassword = user.toObject();
    delete (userWithoutPassword as { password?: string }).password;
    return userWithoutPassword;
};

export const issueTokens = (user: { _id: unknown; role: string }) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
};

export const registerUser = async (userData: IUser) => {
    const { name, email, password, role, addresses } = userData;
    if (!password) throw new AppError("Password is required", 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role as "customer" | "admin",
        addresses: addresses || [],
    });
    return stripPassword(user);
};

export const loginUser = async (userData: IUser) => {
    const { email, password } = userData;
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User not found", 404);
    }
    if (!password) {
        throw new AppError("Password is required", 400);
    }
    if (!user.password) {
        throw new AppError("Invalid password", 401);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError("Invalid password", 401);
    }
    const tokens = issueTokens(user);
    return { user: stripPassword(user), ...tokens };
};

export const refreshToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new AppError("Refresh token not found", 401);
    }
    const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
    ) as { id: string; role: "customer" | "admin" };

    if (!decoded || !decoded.id) {
        throw new AppError("Invalid refresh token", 401);
    }
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    return { user: stripPassword(user), accessToken };
};

export const getMe = async (userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return stripPassword(user);
};
