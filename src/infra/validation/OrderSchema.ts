import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string()
    .min(1, { message: "Product ID is required and cannot be empty" }),

  quantity: z.number()
    .refine(val => Number.isInteger(val), { message: "Quantity must be an integer" })
    .positive({ message: "Quantity must be greater than zero" }),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema)
    .nonempty({ message: "At least one item is required" }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;