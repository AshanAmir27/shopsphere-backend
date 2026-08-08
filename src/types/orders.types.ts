export type PaymentMethod = "credit card" | "debit card" | "paypal" | "cash";
export type PaymentStatus = "pending" | "processing" | "paid" | "failed" | "refunded";
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface IOrderItem {
    productId: string;
    name: string;
    quantity: number;
    priceAtPurchase: number;
    images: string[];
}


export interface IOrder {
    userId: string;
    items: IOrderItem[];
    totalAmountAtPurchase: number;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    orderStatus?: OrderStatus;
}

