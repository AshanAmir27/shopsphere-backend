import type { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/appError.js";
import mongoose from "mongoose";
import type { GetProductsQuery, ProductSortField, SortOrder } from "../types/product.types.js";

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

const SORT_FIELDS: ProductSortField[] = ["createdAt", "price", "name", "rating", "discount", "stock"];
const SORT_ORDERS: SortOrder[] = ["asc", "desc"];
const MAX_LIMIT = 100;

const parsePositiveInt = (value: unknown, field: string, fallback: number): number => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError(`${field} must be a positive integer`, 400);
  }
  return parsed;
};

const parseOptionalNumber = (value: unknown, field: string): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new AppError(`${field} must be a non-negative number`, 400);
  }
  return parsed;
};

const parseOptionalBoolean = (value: unknown, field: string): boolean | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  throw new AppError(`${field} must be true or false`, 400);
};

const parseTags = (value: unknown): string[] | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const raw = Array.isArray(value) ? value : String(value).split(",");
  const tags = raw.map((tag) => String(tag).trim()).filter(Boolean);
  return tags.length > 0 ? tags : undefined;
};

export const validateGetProducts = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const {
      page,
      limit,
      sort,
      order,
      search,
      category,
      brand,
      tags,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      isFeatured,
      status,
    } = req.query;

    const pageNumber = parsePositiveInt(page, "page", 1);
    let limitNumber = parsePositiveInt(limit, "limit", 10);
    if (limitNumber > MAX_LIMIT) {
      throw new AppError(`limit cannot exceed ${MAX_LIMIT}`, 400);
    }

    const sortBy = (sort as string | undefined) ?? "createdAt";
    if (!SORT_FIELDS.includes(sortBy as ProductSortField)) {
      throw new AppError(`sort must be one of: ${SORT_FIELDS.join(", ")}`, 400);
    }

    const orderBy = ((order as string | undefined) ?? "desc").toLowerCase();
    if (!SORT_ORDERS.includes(orderBy as SortOrder)) {
      throw new AppError("order must be asc or desc", 400);
    }

    if (category && !mongoose.Types.ObjectId.isValid(String(category))) {
      throw new AppError("category must be a valid id", 400);
    }

    const parsedMinPrice = parseOptionalNumber(minPrice, "minPrice");
    const parsedMaxPrice = parseOptionalNumber(maxPrice, "maxPrice");
    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      throw new AppError("minPrice cannot be greater than maxPrice", 400);
    }

    const parsedMinRating = parseOptionalNumber(minRating, "minRating");
    if (parsedMinRating !== undefined && parsedMinRating > 5) {
      throw new AppError("minRating cannot be greater than 5", 400);
    }

    const parsedStatus = status === undefined || status === "" ? "active" : String(status);
    if (parsedStatus !== "active" && parsedStatus !== "inactive") {
      throw new AppError("status must be active or inactive", 400);
    }

    const query: GetProductsQuery = {
      page: pageNumber,
      limit: limitNumber,
      sort: sortBy as ProductSortField,
      order: orderBy as SortOrder,
      status: parsedStatus as "active" | "inactive",
    };

    if (search) query.search = String(search).trim();
    if (category) query.category = String(category);
    if (brand) query.brand = String(brand).trim();

    const parsedTags = parseTags(tags);
    if (parsedTags) query.tags = parsedTags;

    if (parsedMinPrice !== undefined) query.minPrice = parsedMinPrice;
    if (parsedMaxPrice !== undefined) query.maxPrice = parsedMaxPrice;
    if (parsedMinRating !== undefined) query.minRating = parsedMinRating;

    const parsedInStock = parseOptionalBoolean(inStock, "inStock");
    if (parsedInStock !== undefined) query.inStock = parsedInStock;

    const parsedIsFeatured = parseOptionalBoolean(isFeatured, "isFeatured");
    if (parsedIsFeatured !== undefined) query.isFeatured = parsedIsFeatured;

    (req as Request & { validatedQuery: GetProductsQuery }).validatedQuery = query;
    next();
  } catch (error) {
    next(error);
  }
};

