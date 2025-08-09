import type { OrderItem } from "./OrderItem.js";

export class Order {
    constructor(
        public readonly items: OrderItem[]
    ) {
       if (!this.items || this.items.length === 0) {
        throw new Error("Order must have at least one item.");
       }
    }
}