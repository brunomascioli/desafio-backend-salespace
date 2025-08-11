import type { OrderContext } from "../../application/contexts/OrderContext.js";
import logger from "../../infra/lib/logger.js";
import type { IDiscountRule } from "./IDiscountRule.js";

export class CartValueDiscountRule implements IDiscountRule {

    public apply(context: OrderContext): void {
        logger.debug("[CartValueDiscountRule] Aplicando regra de desconto por valor do carrinho");

        const basis = context.initialSubtotal; 
        let fixedDiscount = 0;
        let tierInfo = "";

        if (basis >= 200_000) { 
            fixedDiscount = 15_000; 
            tierInfo = ">= R$ 2000.00";
        } else if (basis >= 100_000) { 
            fixedDiscount = 5_000; 
            tierInfo = ">= R$ 1000.00";
        }

        if (fixedDiscount === 0) {
            logger.debug("[CartValueDiscountRule] Nenhum desconto aplicado por valor do carrinho");
            return;
        }

        logger.debug(`[CartValueDiscountRule] Desconto de R$ ${(fixedDiscount / 100).toFixed(2)} aplicado por valor do carrinho`);

        const discountAmount = Math.min(context.runningTotal, fixedDiscount);

        context.runningTotal -= discountAmount;

        context.appliedOrderDiscounts.push({
            code: `CART_VALUE_FIXED_${(fixedDiscount / 100)}`,
            name: `Desconto de R$ ${(fixedDiscount / 100).toFixed(2)} por valor do carrinho`,
            basis: context.runningTotal + discountAmount,
            amount: discountAmount,
            metadata: {
                justification: `Subtotal inicial de R$ ${(basis / 100).toFixed(2)} se enquadra na faixa de R$ ${(fixedDiscount / 100).toFixed(2)} de desconto (${tierInfo}).`
            }
        });
    }
}