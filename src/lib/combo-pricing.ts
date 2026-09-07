import type { PublicCombo, PublicComboItem } from '../types';

export type BundleShare = PublicComboItem & { unitPrice: number };

export function splitBundlePrices(combo: Pick<PublicCombo, 'price' | 'items'>): BundleShare[] {
  const sum = combo.items.reduce((total, item) => total + item.price * item.quantity, 0);
  if (sum <= 0) return combo.items.map((item) => ({ ...item, unitPrice: item.price }));

  let allocated = 0;
  return combo.items.map((item, index) => {
    const weight = item.price * item.quantity;
    const lineTotal =
      index === combo.items.length - 1
        ? combo.price - allocated
        : Math.round((weight / sum) * combo.price);
    allocated += index === combo.items.length - 1 ? 0 : lineTotal;
    return { ...item, unitPrice: Math.max(1, Math.round(lineTotal / Math.max(1, item.quantity))) };
  });
}

export function comboLineId(comboId: string, productId: string, weight: string) {
  return `combo-${comboId}-${productId}-${weight}`;
}

export function comboQuantityFromLines(
  lines: { productId: string; quantity: number; comboUnitQty?: number }[],
) {
  if (lines.length === 0) return 0;
  return Math.min(
    ...lines.map((line) => Math.floor(line.quantity / Math.max(1, line.comboUnitQty ?? 1))),
  );
}
