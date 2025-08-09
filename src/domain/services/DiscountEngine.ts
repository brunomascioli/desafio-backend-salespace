import { type IDiscountRule } from "../rules/IDiscountRule.js";

export class DiscountEngine {
    private readonly rules: IDiscountRule[];
    
    constructor() {
        this.rules = [];
    }

    public process(context: any): void {
        for (const rule of this.rules) {
            rule.apply(context);
        }
    }
}