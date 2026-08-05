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