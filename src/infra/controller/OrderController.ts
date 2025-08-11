import type { NextFunction, Request, Response } from "express";
import type { OrderService } from "../../application/services/OrderService.js";
import { createOrderSchema } from "../validation/OrderSchema.js";
import logger from "../lib/logger.js";

export class OrderController {
    private readonly orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
    }

    public async calculateOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const input = createOrderSchema.parse(req.body);

            logger.debug("[OrderController] Calculando pedido com os dados fornecidos");
            logger.debug("[OrderController] Payload recebido", input);

            const calculateOrder = await this.orderService.calculateOrder(input.items);

            return res.status(200).json(calculateOrder);
        } catch(err) {
            logger.error("[OrderController] Erro ao calcular pedido", err);
            return next(err);
        }
    }
}