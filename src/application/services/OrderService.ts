import type { IProductRepository } from "../../domain/repositories/IProductRepository.js";
import type { DiscountEngine } from "../../domain/services/DiscountEngine.js";
import type { ContextItem } from "../../domain/valueObjects/ContextItem.js";
import { OrderContext } from "../contexts/OrderContext.js";
import type { OrderItemRequest } from "../dto/request/OrderItemRequest.js";
import type { CalculatedOrderResponse } from "../dto/response/CalculatedOrderResponse.js";
import { NotFoundError } from "../errors/AppError.js";

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
            throw new NotFoundError(`Os seguintes produtos não foram encontrados: ${notFoundIds.join(', ')}`);
        }

        const productMap = new Map(products.map(p => [p.id, p]));

        const contextItems: ContextItem[] = requestItems.map(itemReq => {
            const product = productMap.get(itemReq.productId);
            if (!product) {
                throw new NotFoundError(`Produto com ID ${itemReq.productId} não encontrado.`);
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

    /**
     * Converte um valor inteiro em centavos para um número decimal em reais.
     * A função não aplica nenhuma lógica de negócio, apenas formata o valor.
     */
    private centsToReal(cents: number): number {
        return Number((cents / 100).toFixed(2)); 
    }
    
    private mapContextToResponse(context: OrderContext): CalculatedOrderResponse{
        return {
            currency: 'BRL',
            subtotal: this.centsToReal(context.initialSubtotal),
            items: context.items.map(item => ({
                productId: item.productId,
                unitPrice: this.centsToReal(item.unitPrice),
                category: item.category,
                quantity: item.quantity,
                subtotal: this.centsToReal(item.subtotal),
                appliedDiscounts: item.appliedDiscounts.map(d => ({...d, basis: this.centsToReal(d.basis),
                    amount: this.centsToReal(d.amount)})),
                total: this.centsToReal(item.total),
            })),
            discounts: context.appliedOrderDiscounts.map(d => ({...d, basis: this.centsToReal(d.basis), 
                amount: this.centsToReal(d.amount)})),
            total: this.centsToReal(context.runningTotal),
        };
    }
}