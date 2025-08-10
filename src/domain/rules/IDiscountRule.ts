import type { OrderContext } from "../../application/contexts/OrderContext.js";

export interface IDiscountRule {
    apply(context: OrderContext): void;
}