export interface AppliedDiscount {
    readonly code: string;
    readonly name: string;
    readonly basis: number;
    readonly amount: number;
    readonly metadata?: Record<string, any>;
}