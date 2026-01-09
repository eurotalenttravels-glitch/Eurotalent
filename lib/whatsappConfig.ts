// WhatsApp Configuration
// Update this number with your business WhatsApp number
// Format: Country code + number (e.g., +1234567890, +919876543210)

export const WHATSAPP_NUMBER = '+351920076707' // ⚠️ CHANGE THIS TO YOUR WHATSAPP NUMBER

// Helper function to clean phone number for WhatsApp URL
export function getCleanWhatsAppNumber(): string {
  return WHATSAPP_NUMBER.replace(/[\s\+\-\(\)]/g, '')
}

// Helper function to create WhatsApp URL with message
export function createWhatsAppUrl(message: string): string {
  const cleanNumber = getCleanWhatsAppNumber()
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`
}
