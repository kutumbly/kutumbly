/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

/**
 * lib/whatsapp.ts
 * Professional WhatsApp Mission Broadcasting & Messaging
 */

export type MissionType = 'INVENTORY' | 'VENDOR' | 'PAYMENT' | 'RSVP' | 'CUSTOM';

interface WhatsAppPayload {
  phone?: string;
  name: string;
  missionType: MissionType;
  missionTitle: string;
  bridgeUrl?: string;
  customBody?: string;
}

/**
 * GENERATE MISSION MESSAGE
 * Creates a wa.me URL with a professional, culturally-aligned template.
 */
export function generateWhatsAppLink(payload: WhatsAppPayload): string {
  const { phone, name, missionType, missionTitle, bridgeUrl, customBody } = payload;
  
  const greeting = `Pranam ${name} ji!`;
  const intro = `Kutumbly Sovereign OS se aapko ek mission assign ki gayi hai.`;
  
  let body = "";
  
  switch (missionType) {
    case 'INVENTORY':
      body = `Mission: "${missionTitle}"\n\nKripya niche diye gaye link par click karke actual quantity aur price update karein taaki hum logistics manage kar sakein:`;
      break;
    case 'VENDOR':
      body = `Contract Mission: "${missionTitle}"\n\nAapke services ke liye details aur payment acknowledgment yahan update karein:`;
      break;
    case 'PAYMENT':
      body = `Payment Mission: "${missionTitle}"\n\nKripya payment receipt ya confirmation yahan upload karein:`;
      break;
    case 'CUSTOM':
      body = customBody || `Details: ${missionTitle}`;
      break;
    default:
      body = `Mission Details: ${missionTitle}`;
  }

  const fullMessage = `${greeting}\n\n${intro}\n\n${body}\n${bridgeUrl || ''}\n\nDhanyawad,\nKutumbly OS Mission Control`;
  
  const encodedMessage = encodeURIComponent(fullMessage);
  
  // Format phone number: remove any non-digit characters
  const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
  
  return `https://wa.me/${cleanPhone}/?text=${encodedMessage}`;
}

/**
 * TRIGGER BROADCAST
 * Opens a new window with the WhatsApp link.
 */
export function broadcastMission(payload: WhatsAppPayload) {
  const link = generateWhatsAppLink(payload);
  window.open(link, '_blank');
}
