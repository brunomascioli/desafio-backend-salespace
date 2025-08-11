import type { AppliedDiscount } from "../../domain/valueObjects/AppliedDiscount.js";
import type { ContextItem } from "../../domain/valueObjects/ContextItem.js";

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