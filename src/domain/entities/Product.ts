export enum ProductCategory {
    ACESSORIOS = "acessorios"
}

export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly unitPrice: number,
        public readonly category: ProductCategory
    ) {}
}