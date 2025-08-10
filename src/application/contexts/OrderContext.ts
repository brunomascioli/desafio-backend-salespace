import type { ProductCategory } from "../../domain/entities/Product.js";

export interface AppliedDiscount {
    readonly code: string;
    readonly name: string;
    readonly basis: number;
    readonly amount: number;
    readonly metadata?: Record<string, any>;
}

export interface ContextItem {
    readonly productId: string;
    readonly category: ProductCategory; 
    readonly unitPrice: number;
    readonly quantity: number;
    readonly subtotal: number;
    total: number;
    appliedDiscounts: AppliedDiscount[];
}

export class OrderContext {
    public readonly items: ContextItem[];
    public readonly initialSubtotal: number;
    public runningTotal: number;
    public appliedOrderDiscounts: AppliedDiscount[];

    constructor(items: ContextItem[]) {
        this.items = items;
        this.appliedOrderDiscounts = [];

        this.initialSubtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
        
        this.runningTotal = this.initialSubtotal;
    }

    public getTotalQuantity(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }
}