import type { NextFunction, Request, Response } from "express";
import type { OrderService } from "../../application/services/OrderService.js";
import { createOrderSchema } from "../validation/OrderSchema.js";

export class OrderController {
    private readonly orderService: OrderService;

    constructor(orderService: OrderService) {
        this.orderService = orderService;
    }

    public async calculateOrder(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const input = createOrderSchema.parse(req.body);

            const calculateOrder = await this.orderService.calculateOrder(input.items);

            return res.status(200).json(calculateOrder);
        } catch(err) {
            return next(err);
        }
    }
}