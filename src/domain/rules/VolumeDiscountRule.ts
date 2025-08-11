import type { OrderContext } from "../../application/contexts/OrderContext.js";
import logger from "../../infra/lib/logger.js";
import type { IDiscountRule } from "./IDiscountRule.js";

export class VolumeDiscountRule implements IDiscountRule {

    public apply(context: OrderContext): void {
        logger.debug("[VolumeDiscountRule] Aplicando regra de desconto por volume de itens");

        const totalQuantity = context.getTotalQuantity();

        let discountPercentage = 0;
        let tierInfo = "";

        if (totalQuantity >= 50) {
            discountPercentage = 0.20;
            tierInfo = ">= 50 itens";
            logger.debug(`[VolumeDiscountRule] Aplicando desconto de 20% para pedido com ${totalQuantity} itens`);
        } else if (totalQuantity >= 20) {
            discountPercentage = 0.15;
            tierInfo = ">= 20 itens";
            logger.debug(`[VolumeDiscountRule] Aplicando desconto de 15% para pedido com ${totalQuantity} itens`);
        } else if (totalQuantity >= 10) {
            discountPercentage = 0.10;
            tierInfo = ">= 10 itens";
            logger.debug(`[VolumeDiscountRule] Aplicando desconto de 10% para pedido com ${totalQuantity} itens`);
        }

        if (discountPercentage == 0) {
            logger.debug(`[VolumeDiscountRule] Nenhum desconto aplicado por volume de itens`);
            return;
        }

        
        const basis = context.runningTotal;
        const discountAmount = Math.round(basis * discountPercentage);

        context.runningTotal -= discountAmount;

        if (!context.appliedOrderDiscounts) {
            context.appliedOrderDiscounts = [];
        }
        context.appliedOrderDiscounts.push({
            code: `QTY_TIER_${discountPercentage * 100}PCT`,
            name: `Desconto de ${discountPercentage * 100}% por volume`,
            basis: basis,
            amount: discountAmount,
            metadata: {
                justification: `Pedido com ${totalQuantity} itens no total se enquadra na faixa de ${discountPercentage * 100}% (${tierInfo}).`
            }
        });
    }
}