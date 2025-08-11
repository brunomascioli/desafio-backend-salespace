import { DiscountEngine } from "../../../src/domain/services/DiscountEngine.js";
import { CartValueDiscountRule } from "../../../src/domain/rules/CartValueDiscountRule.js";
import { CategoryDiscountRule } from "../../../src/domain/rules/CategoryDiscountRule.js";
import { VolumeDiscountRule } from "../../../src/domain/rules/VolumeDiscountRule.js";
import { OrderContext } from "../../../src/application/contexts/OrderContext.js";
import type { ContextItem } from "../../../src/domain/valueObjects/ContextItem.js";
import { ProductCategory } from "../../../src/domain/entities/Product.js";

describe('DiscountEngine', () => {
  it('should apply volume discount correctly', () => {
    const discountEngine = new DiscountEngine([
      new VolumeDiscountRule(),
    ]);

    const items: ContextItem[] = [
      { productId: 'p1', category: ProductCategory.ELETRONICOS, unitPrice: 10000, quantity: 20, subtotal: 200000, total: 200000, appliedDiscounts: [] }
    ];

    const context = new OrderContext(items);
    discountEngine.process(context);

    // Volume 20 itens => 15% de desconto sobre o total
    expect(context.appliedOrderDiscounts).toHaveLength(1);
    expect(context.appliedOrderDiscounts[0].code).toBe('QTY_TIER_15PCT');
    expect(context.runningTotal).toBeLessThan(context.initialSubtotal);
  });

  it('should apply category discount correctly', () => {
    const discountEngine = new DiscountEngine([
      new CategoryDiscountRule(),
    ]);

    const items: ContextItem[] = [
      { productId: 'p2', category: ProductCategory.ACESSORIOS, unitPrice: 10000, quantity: 6, subtotal: 60000, total: 60000, appliedDiscounts: [] }
    ];

    const context = new OrderContext(items);
    discountEngine.process(context);

    // > 5 itens categoria acessórios -> 5% desconto no item
    expect(context.items[0].appliedDiscounts).toHaveLength(1);
    expect(context.items[0].appliedDiscounts[0].code).toBe('CAT_ACC_5PCT');
    expect(context.items[0].total).toBeLessThan(context.items[0].subtotal);
  });

  it('should apply cart value discount correctly', () => {
    const discountEngine = new DiscountEngine([
      new CartValueDiscountRule(),
    ]);

    const items = [
      { productId: 'p3', category: ProductCategory.ELETRONICOS, unitPrice: 100000, quantity: 1, subtotal: 100000, total: 100000, appliedDiscounts: [] }
    ];

    const context = new OrderContext(items);
    discountEngine.process(context);

    expect(context.appliedOrderDiscounts).toHaveLength(1);
    expect(context.appliedOrderDiscounts[0].code).toContain('CART_VALUE_FIXED');
    expect(context.runningTotal).toBeLessThan(context.initialSubtotal);
  });

  it('should handle multiple discounts correctly', () => {
    const discountEngine = new DiscountEngine([
      new CategoryDiscountRule(),
      new VolumeDiscountRule(),
      new CartValueDiscountRule(),
    ]);

    const items = [
      { productId: 'p1', category: ProductCategory.ACESSORIOS, unitPrice: 100000, quantity: 6, subtotal: 600000, total: 600000, appliedDiscounts: [] },
      { productId: 'p2', category: ProductCategory.ELETRONICOS, unitPrice: 200000, quantity: 15, subtotal: 3000000, total: 3000000, appliedDiscounts: [] },
    ];

    const context = new OrderContext(items);
    discountEngine.process(context);

    // Categoria acessórios > 5 -> 5% no item 1
    expect(context.items[0].appliedDiscounts.some(d => d.code === 'CAT_ACC_5PCT')).toBe(true);

    // Volume total 21 itens -> 15% desconto no total
    expect(context.appliedOrderDiscounts.some(d => d.code === 'QTY_TIER_15PCT')).toBe(true);

    // Valor total > 1000? Se sim, cart discount aplicado também
    expect(context.appliedOrderDiscounts.some(d => d.code.startsWith('CART_VALUE_FIXED'))).toBe(true);
  });

  it('should not apply discounts', () => {
    const discountEngine = new DiscountEngine([
      new CategoryDiscountRule(),
      new VolumeDiscountRule(),
      new CartValueDiscountRule(),
    ]);

    const items = [
      { productId: 'p1', category: ProductCategory.LIVROS, unitPrice: 10000, quantity: 1, subtotal: 10000, total: 10000, appliedDiscounts: [] },
    ];

    const context = new OrderContext(items);
    discountEngine.process(context);

    expect(context.appliedOrderDiscounts).toHaveLength(0);
    expect(context.items[0].appliedDiscounts).toHaveLength(0);
    expect(context.runningTotal).toEqual(context.initialSubtotal);
  });
});