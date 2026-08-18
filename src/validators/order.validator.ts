import { AppError } from "../middleware/appError.js";
import type { Request, Response, NextFunction } from "express";
import type { PaymentMethod } from "../types/orders.types.js";

const PAYMENT_METHODS: PaymentMethod[] = [
  "credit card",
  "debit card",
  "paypal",
  "cash",
];

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validateItems = (items: unknown) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("items must be a non-empty array", 400);
  }

  items.forEach((item, index) => {
    if (!item || typeof item !== "object") {
      throw new AppError(`items[${index}] must be an object`, 400);
    }

    const { productId, name, quantity, priceAtPurchase, images } = item as Record<
      string,
      unknown
    >;

    if (!isNonEmptyString(productId)) {
      throw new AppError(`items[${index}].productId is required`, 400);
    }
    if (!isNonEmptyString(name)) {
      throw new AppError(`items[${index}].name is required`, 400);
    }
    if (!Number.isInteger(quantity) || (quantity as number) < 1) {
      throw new AppError(`items[${index}].quantity must be a positive integer`, 400);
    }
    if (
      typeof priceAtPurchase !== "number" ||
      Number.isNaN(priceAtPurchase) ||
      priceAtPurchase < 0
    ) {
      throw new AppError(
        `items[${index}].priceAtPurchase must be a non-negative number`,
        400
      );
    }
    if (!Array.isArray(images)) {
      throw new AppError(`items[${index}].images must be an array`, 400);
    }
  });
};

const validateOrderBody = (body: Record<string, unknown>) => {
  const { items, totalAmountAtPurchase, shippingAddress, paymentMethod } = body;

  const required = { items, totalAmountAtPurchase, shippingAddress, paymentMethod };
  const missing = Object.entries(required)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new AppError(`Missing fields: ${missing.join(", ")}`, 400);
  }

  validateItems(items);

  if (
    typeof totalAmountAtPurchase !== "number" ||
    Number.isNaN(totalAmountAtPurchase) ||
    totalAmountAtPurchase < 0
  ) {
    throw new AppError("totalAmountAtPurchase must be a non-negative number", 400);
  }

  if (!isNonEmptyString(shippingAddress)) {
    throw new AppError("shippingAddress must be a non-empty string", 400);
  }

  if (!PAYMENT_METHODS.includes(paymentMethod as PaymentMethod)) {
    throw new AppError(
      `paymentMethod must be one of: ${PAYMENT_METHODS.join(", ")}`,
      400
    );
  }

  if ("userId" in body) {
    throw new AppError("userId cannot be set in the request body", 400);
  }
};

export const validateCreateOrder = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    validateOrderBody(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateUpdateOrder = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    validateOrderBody(req.body);
    next();
  } catch (error) {
    next(error);
  }
};
