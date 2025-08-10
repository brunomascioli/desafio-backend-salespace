import type { OrderContext } from "../../application/contexts/OrderContext.js";
import { type IDiscountRule } from "../rules/IDiscountRule.js";

export class DiscountEngine {
    private readonly rules: IDiscountRule[];

    constructor(rules: IDiscountRule[]) {
        this.rules = rules;
    }

    public process(context: OrderContext): void {
        for (const rule of this.rules) {
            rule.apply(context);
        }
    }
}