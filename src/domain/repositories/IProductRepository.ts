import { Product } from "../entities/Product.js";

export interface IProductRepository {
    findById(id: string): Promise<Product | null>;
    findByIds(ids: string[]): Promise<Product[]>;
}