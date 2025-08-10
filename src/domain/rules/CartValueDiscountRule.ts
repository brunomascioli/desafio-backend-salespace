import type { IDiscountRule } from "./IDiscountRule.js";

export class CartValueDiscountRule implements IDiscountRule{

    public apply(context: any): void {
        const basis = context.initialSubtotal;
        let fixedDiscount = 0;
        let tierInfo = "";

        if (basis >= 2000) {
            fixedDiscount = 150.00;
            tierInfo = ">= R$ 2000.00";
        } else if (basis >= 1000) {
            fixedDiscount = 50.00;
            tierInfo = ">= R$ 1000.00";
        }

        if (fixedDiscount > 0) {
            const discountAmount = Math.min(context.runningTotal, fixedDiscount);

            context.runningTotal -= discountAmount;

            if (!context.appliedOrderDiscounts) {
                context.appliedOrderDiscounts = [];
            }
            context.appliedOrderDiscounts.push({
                code: `CART_VALUE_FIXED_${fixedDiscount}`,
                name: `Desconto de R$ ${fixedDiscount.toFixed(2)} por valor do carrinho`,
                basis: context.runningTotal + discountAmount, 
                amount: discountAmount,
                metadata: {
                    justification: `Subtotal inicial de R$ ${basis.toFixed(2)} se enquadra na faixa de R$ ${fixedDiscount.toFixed(2)} de desconto (${tierInfo}).`
                }
            });
        }
    }
}