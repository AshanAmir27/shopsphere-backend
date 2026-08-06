export interface IProduct {
    name: string;
    slug: string;
    description: string;
    price: number;
    discount: number;
    category: string;
    brand: string;
    imageUrl: string;
    stock: number;
    tags: string[];
    rating: number;
    isFeatured: boolean;
    status: string;
}

export type ProductSortField = "createdAt" | "price" | "name" | "rating" | "discount" | "stock";
export type SortOrder = "asc" | "desc";

export interface GetProductsQuery {
    page: number;
    limit: number;
    sort: ProductSortField;
    order: SortOrder;
    search?: string;
    category?: string;
    brand?: string;
    tags?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    isFeatured?: boolean;
    status?: "active" | "inactive";
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}