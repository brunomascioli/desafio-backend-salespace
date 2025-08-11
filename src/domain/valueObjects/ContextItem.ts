import type { ProductCategory } from "../entities/Product.js";
import type { AppliedDiscount } from "./AppliedDiscount.js";

export interface ContextItem {
    readonly productId: string;
    readonly category: ProductCategory; 
    readonly unitPrice: number;
    readonly quantity: number;
    readonly subtotal: number;
    total: number;
    appliedDiscounts: AppliedDiscount[];
}