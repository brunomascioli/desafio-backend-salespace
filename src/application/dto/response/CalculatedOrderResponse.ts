import type { AppliedDiscount } from "../../../domain/valueObjects/AppliedDiscount.js";
import type { ContextItem } from "../../../domain/valueObjects/ContextItem.js"

export type CalculatedOrderResponse = {
    currency: string;
    items: Array<ContextItem>;
    discounts: Array<AppliedDiscount>;
    total: number;
    subtotal: number;
}