import Product from "../models/product.model.js";
import type {
    GetProductsQuery,
    IProduct,
    PaginationMeta,
} from "../types/product.types.js";
import { AppError } from "../middleware/appError.js";

export const createProduct = async (product: IProduct) => {
    const newProduct = await Product.create({ ...product, status: "active" });
    return newProduct;
};

export const updateProduct = async (id: string, product: IProduct) => {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    if (!updatedProduct) {
        throw new AppError("Product not found", 404);
    }
    return updatedProduct;
};

export const deleteProduct = async (id: string) => {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        throw new AppError("Product not found", 404);
    }
    return deletedProduct;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildProductFilter = (params: GetProductsQuery) => {
    const filter: Record<string, unknown> = {
        status: params.status ?? "active",
    };

    if (params.search) {
        const pattern = escapeRegex(params.search);
        filter.$or = [
            { name: { $regex: pattern, $options: "i" } },
            { slug: { $regex: pattern, $options: "i" } },
            { description: { $regex: pattern, $options: "i" } },
            { brand: { $regex: pattern, $options: "i" } },
            { tags: { $regex: pattern, $options: "i" } },
        ];
    }

    if (params.category) filter.category = params.category;
    if (params.brand) filter.brand = { $regex: `^${escapeRegex(params.brand)}$`, $options: "i" };
    if (params.tags?.length) filter.tags = { $all: params.tags };

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        const price: Record<string, number> = {};
        if (params.minPrice !== undefined) price.$gte = params.minPrice;
        if (params.maxPrice !== undefined) price.$lte = params.maxPrice;
        filter.price = price;
    }

    if (params.minRating !== undefined) {
        filter.rating = { $gte: params.minRating };
    }

    if (params.inStock === true) filter.stock = { $gt: 0 };
    if (params.inStock === false) filter.stock = 0;

    if (params.isFeatured !== undefined) filter.isFeatured = params.isFeatured;

    return filter;
};

export const getProducts = async (params: GetProductsQuery) => {
    const { page, limit, sort, order } = params;
    const filter = buildProductFilter(params);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
        Product.find(filter)
            .populate("category", "name slug")
            .sort({ [sort]: order === "asc" ? 1 : -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 0;
    const pagination: PaginationMeta = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1 && totalPages > 0,
    };

    return { items, pagination };
};

export const getProductBySlug = async (slug: string) => {
    const product = await Product.findOne({ slug, status: "active" })
        .populate("category", "name slug")
        .lean();

    if (!product) {
        throw new AppError("Product not found", 404);
    }
    return product;
};
