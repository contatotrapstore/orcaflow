/**
 * Calculate item total from quantity and unit price in reais.
 * Returns value in cents.
 */
export function calculateItemTotal(quantity: number, unitPrice: number): number {
  // unitPrice in reais, returns cents
  return Math.round(quantity * unitPrice * 100)
}

/**
 * Calculate subtotal from items where unit_price is in cents.
 * Returns value in cents.
 */
export function calculateSubtotal(items: { quantity: number; unit_price: number }[]): number {
  // unit_price in cents, returns cents
  return items.reduce((sum, item) => sum + Math.round(item.quantity * item.unit_price), 0)
}

/**
 * Calculate total after discount.
 * Both subtotal and discountCents must be in cents.
 * Returns value in cents.
 */
export function calculateTotal(subtotal: number, discountCents: number): number {
  return Math.max(0, subtotal - discountCents)
}
