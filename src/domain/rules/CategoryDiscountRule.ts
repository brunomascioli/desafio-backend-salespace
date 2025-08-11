import type { OrderContext } from "../../application/contexts/OrderContext.js";
import logger from "../../infra/lib/logger.js";
import { ProductCategory } from "../entities/Product.js";
import type { ContextItem } from "../valueObjects/ContextItem.js";
import type { IDiscountRule } from "./IDiscountRule.js";

export class CategoryDiscountRule implements IDiscountRule {
    private readonly CATEGORY_TO_CHECK = ProductCategory.ACESSORIOS;
    private readonly MIN_QUANTITY = 5;
    private readonly DISCOUNT_PERCENTAGE = 0.05;

    public apply(context: OrderContext): void {
        logger.debug(`[CategoryDiscountRule] Aplicando regra de desconto para a categoria '${this.CATEGORY_TO_CHECK}'`);

        const relevantItems = context.items.filter(
            (item: ContextItem) => item.category === this.CATEGORY_TO_CHECK
        );

        const totalQuantityOfCategory = relevantItems.reduce(
            (sum: number, item: ContextItem) => sum + item.quantity,
            0
        );
        if (totalQuantityOfCategory <= this.MIN_QUANTITY) {
            logger.debug(`[CategoryDiscountRule] Quantidade insuficiente de itens na categoria '${this.CATEGORY_TO_CHECK}' para aplicar desconto`);
            return;
        }

        for (const item of relevantItems) {
            const discountAmount = Math.round(item.subtotal * this.DISCOUNT_PERCENTAGE);

            item.total -= discountAmount;
            
            context.runningTotal -= discountAmount;

            if (!item.appliedDiscounts) {
                item.appliedDiscounts = [];
            }
            item.appliedDiscounts.push({
                code: "CAT_ACC_5PCT",
                name: `Desconto de 5% na categoria '${this.CATEGORY_TO_CHECK}'`,
                amount: discountAmount,
                basis: item.subtotal,
            });
        }
        logger.debug(`[CategoryDiscountRule] Desconto de 5% aplicado para ${totalQuantityOfCategory} itens na categoria '${this.CATEGORY_TO_CHECK}'`);
    }
}