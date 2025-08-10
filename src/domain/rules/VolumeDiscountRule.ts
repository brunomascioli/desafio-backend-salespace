import type { IDiscountRule } from "./IDiscountRule.js";

export class VolumeDiscountRule implements IDiscountRule {

    public apply(context: any): void {
        const totalQuantity = context.items.reduce((sum: number, item: any) => sum + item.quantity, 0);

        let discountPercentage = 0;
        let tierInfo = "";

        if (totalQuantity >= 50) {
            discountPercentage = 0.20;
            tierInfo = ">= 50 itens";
        } else if (totalQuantity >= 20) {
            discountPercentage = 0.15;
            tierInfo = ">= 20 itens";
        } else if (totalQuantity >= 10) {
            discountPercentage = 0.10; 
            tierInfo = ">= 10 itens";
        }

        if (discountPercentage > 0) {
            const basis = context.runningTotal;
            const discountAmount = basis * discountPercentage;

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
}