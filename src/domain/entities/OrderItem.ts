export class OrderItem {
    constructor(
        public readonly productId: string,
        public readonly quantity: number
    ){
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than zero.");
        }
    }
}