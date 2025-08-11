import { Product, ProductCategory } from '../../domain/entities/Product.js';
import type { IProductRepository } from '../../domain/repositories/IProductRepository.js';
import productsData from '../../data/products.json' with { type: 'json' };

export class MockProductRepository implements IProductRepository {
    private products: Map<string, Product> = new Map();

    constructor() {
        this.products = new Map();

        productsData.forEach((p) => {
            const product = new Product(
                p.id,
                p.name,
                p.unitPrice,
                p.category as ProductCategory
            );
            this.products.set(product.id, product);
        })
    }

    public async findById(id: string): Promise<Product | null> {
        const product = this.products.get(id);
        return Promise.resolve(product || null);
    }

    public async findByIds(ids: string[]): Promise<Product[]> {
        const products = ids
            .map(id => this.products.get(id))
            .filter((product): product is Product => product !== undefined);
     
        return Promise.resolve(products);
    }
}
    