export function normalizePhone(phone: string): string {
  // Remove everything except digits
  let digits = phone.replace(/\D/g, "")
  // Add Brazil country code if not present
  if (digits.length <= 11) digits = "55" + digits
  return digits
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = normalizePhone(phone)
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}
