import { Router } from "express";
import { OrderController } from "../controller/OrderController.js";
import { DiscountEngine } from "../../domain/services/DiscountEngine.js";
import { CartValueDiscountRule } from "../../domain/rules/CartValueDiscountRule.js";
import { CategoryDiscountRule } from "../../domain/rules/CategoryDiscountRule.js";
import { VolumeDiscountRule } from "../../domain/rules/VolumeDiscountRule.js";
import { MockProductRepository } from "../repositories/MockProductRepository.js";
import { OrderService } from "../../application/services/OrderService.js";

const orderRoutes = Router();

const discountEngine = new DiscountEngine(
    [
        new CategoryDiscountRule(),
        new VolumeDiscountRule(),
        new CartValueDiscountRule()
    ]
);

const productRepository = new MockProductRepository();

const orderService = new OrderService(discountEngine, productRepository);

const orderController = new OrderController(orderService);

orderRoutes.post('/', (req, res, next) => orderController.calculateOrder(req, res, next));

export { orderRoutes };