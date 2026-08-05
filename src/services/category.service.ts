import Category from "../models/category.model.js";
import type { ICategory } from "../types/category.types.ts";
import uploadImages from "../config/cloudinary.js";

// Create category
export const createCategory = async (category: ICategory) => {
    const newCategory = await Category.create({ ...category });
    return newCategory;
};

// Update category
export const updateCategory = async (id: string, category: ICategory) => {
    const imageUrls = await uploadImages(category.images as unknown as Express.Multer.File[]);
    if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Failed to upload image");
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, { ...category, images: imageUrls as string[] }, { new: true });
    return updatedCategory;
};

// Delete category
export const deleteCategory = async (id: string) => {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        throw new Error("Category not found");
    }
    return deletedCategory;
};

// Get all categories
export const getCategories = async () => {
    const categories = await Category.find();
    return categories;
};

// Get category by slug
export const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({ slug });
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};