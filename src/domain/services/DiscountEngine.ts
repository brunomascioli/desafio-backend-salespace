import type { OrderContext } from "../../application/contexts/OrderContext.js";
import logger from "../../infra/lib/logger.js";
import { type IDiscountRule } from "../rules/IDiscountRule.js";

export class DiscountEngine {
    private readonly rules: IDiscountRule[];

    constructor(rules: IDiscountRule[]) {
        this.rules = rules;
    }

    public process(context: OrderContext): void {
        for (const rule of this.rules) {
            logger.debug(`[DiscountEngine] Aplicando regra: ${rule.constructor.name}`);
            rule.apply(context);
        }
    }
}