import type { IProductRepository } from "../../domain/repositories/IProductRepository.js";
import type { DiscountEngine } from "../../domain/services/DiscountEngine.js";
import type { ContextItem } from "../../domain/valueObjects/ContextItem.js";
import logger from "../../infra/lib/logger.js";
import { OrderContext } from "../contexts/OrderContext.js";
import type { OrderItemRequest } from "../dto/request/OrderItemRequest.js";
import type { CalculatedOrderResponse } from "../dto/response/CalculatedOrderResponse.js";

export class OrderService {
    
    constructor(
        private readonly discountEngine: DiscountEngine,
        private readonly productRepository: IProductRepository
    ){}

    public async calculateOrder(requestItems: OrderItemRequest[]): Promise<CalculatedOrderResponse> {
        const productIds = requestItems.map(item => item.productId);
        const products = await this.productRepository.findByIds(productIds);

        if (products.length !== requestItems.length) {
            const foundIds = products.map(p => p.id);
            const notFoundIds = productIds.filter(id => !foundIds.includes(id));
            throw new Error(`Os seguintes produtos não foram encontrados: ${notFoundIds.join(', ')}`);
        }

        const productMap = new Map(products.map(p => [p.id, p]));

        const contextItems: ContextItem[] = requestItems.map(itemReq => {
            const product = productMap.get(itemReq.productId);
            if (!product) {
                throw new Error(`Produto com ID ${itemReq.productId} não encontrado.`);
            }
            const subtotal = product.unitPrice * itemReq.quantity;

            return {
                productId: product.id,
                category: product.category,
                unitPrice: product.unitPrice,
                quantity: itemReq.quantity,
                subtotal: subtotal,
                total: subtotal, 
                appliedDiscounts: [],
            }
        }) 

        const context = new OrderContext(contextItems);

        this.discountEngine.process(context);
        
        return this.mapContextToResponse(context);
    }
    
    private mapContextToResponse(context: OrderContext): CalculatedOrderResponse{
        return {
            currency: 'BRL',
            items: context.items.map(item => ({
                productId: item.productId,
                unitPrice: item.unitPrice,
                category: item.category,
                quantity: item.quantity,
                subtotal: parseFloat(item.subtotal.toFixed(2)),
                appliedDiscounts: item.appliedDiscounts.map(d => ({...d, amount: parseFloat(d.amount.toFixed(2))})),
                total: parseFloat(item.total.toFixed(2)),
            })),
            discounts: context.appliedOrderDiscounts.map(d => ({...d, amount: parseFloat(d.amount.toFixed(2))})),
            subtotal: parseFloat(context.initialSubtotal.toFixed(2)),
            total: parseFloat(context.runningTotal.toFixed(2)),
        };
    }
}