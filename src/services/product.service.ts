import Product from "../models/product.model.js";
import type { IProduct } from "../types/product.types.js";
import type { SortOrder } from "mongoose";

export const createProduct = async (product: IProduct) => {
    const newProduct = await Product.create({ ...product, status: "active" });
    return newProduct;
};

// Update product
export const updateProduct = async (id: string, product: IProduct) => {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
    if (!updatedProduct) {
        throw new Error("Product not found");
    }
    return updatedProduct;
};

// Delete product
export const deleteProduct = async (id: string) => {
    const deletedProduct = await Product.findByIdAndDelete(id);
    return deletedProduct;
};

// Get all products
export const getProducts = async ({ query, limitNumber, pageNumber, sortBy, orderBy }: { query: any, limitNumber: number, pageNumber: number, sortBy: string, orderBy: string }) => {

    const products = await Product.find(query as any)
        .sort({ [sortBy]: orderBy as SortOrder })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    const totalProducts = await Product.countDocuments(query as any);
    return { products, totalProducts, pageNumber, limitNumber };
};

// Get product by id
export const getProductBySlug = async (slug: string) => {
    const product = await Product.findOne({ slug });
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};