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

export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'ta' | 'bho';

export const UI_STRINGS: Record<string, Record<Language, string>> = {
  // Navigation & General
  'HOME': {
    en: 'Home', hi: 'होम', mr: 'होम', gu: 'હોમ', pa: 'ਮੁੱਖ ਪੰਨਾ', ta: 'முகப்பு', bho: 'घर'
  },
  'VYAVASTHA': {
    en: 'Setup & Settings', hi: 'व्यवस्था', mr: 'सेटिंग्ज', gu: 'સેટિંગ્સ', pa: 'ਸੈਟਿੰਗਜ਼', ta: 'அமைப்புகள்', bho: 'व्यवस्था'
  },
  'SYSTEM_LANG': {
    en: 'System Language', hi: 'सिस्टम की भाषा', mr: 'सिस्टमची भाषा', gu: 'સિસ્ટમની ભાષા', pa: 'ਸਿਸਟਮ ਦੀ ਭਾષા', ta: 'கணினி மொழி', bho: 'सिस्टम क भाषा'
  },
  'VAULT_SECURITY': {
    en: 'Vault Security', hi: 'वॉल्ट सुरक्षा', mr: 'वॉल्ट सुरक्षा', gu: 'વોલ્ટ સુરક્ષા', pa: 'ਵਾਲਟ ਸੁਰੱਖਿਆ', ta: 'பெட்டக பாதுகாப்பு', bho: 'वॉल्ट सुरक्षा'
  },
  'CHOOSE_LANG': {
    en: 'Choose Language', hi: 'भाषा चुनें', mr: 'भाषा निवडा', gu: 'ભાષા પસંદ કરો', pa: 'ਭਾષા ਚੁਣੋ', ta: 'மொழியைத் தேர்ந்தெடுக்கவும்', bho: 'भाषा चुनीं'
  },
  
  // Dashboard Modules
  'DIARY': {
    en: 'Diary', hi: 'डायरी', mr: 'डायरी', gu: 'ડાયરી', pa: 'ਡਾਇਰੀ', ta: 'நாள்குறிப்பு', bho: 'डायरी'
  },
  'TASKS': {
    en: 'Tasks', hi: 'कार्य', mr: 'कामे', gu: 'કાર્યો', pa: 'ਕੰਮ', ta: 'பணிகள்', bho: 'काम'
  },
  'MONEY': {
    en: 'Money', hi: 'पैसा', mr: 'पैसे', gu: 'પૈસા', pa: 'ਪੈਸੇ', ta: 'பணம்', bho: 'पइसा'
  },
  'NEVATA': {
    en: 'Nevata', hi: 'नेवता', mr: 'निमंत्रण', gu: 'આમંત્રણ', pa: 'ਸੱਦਾ', ta: 'அழைப்பு', bho: 'नेवता'
  },
  'HEALTH': {
    en: 'Health', hi: 'स्वास्थ्य', mr: 'आरोग्य', gu: 'આરોગ્ય', pa: 'ਸਿਹਤ', ta: 'சுகாதாரம்', bho: 'तबीयत'
  },
  'INVEST': {
    en: 'Invest', hi: 'निवेश', mr: 'गुंतवणूक', gu: 'રોકાણ', pa: 'ਨਿਵੇਸ਼', ta: 'முதலீடு', bho: 'निवेश'
  },
  'GROCERY': {
    en: 'Grocery', hi: 'किराना', mr: 'किराणा', gu: 'કરિયાણું', pa: 'ਕਰਿਆਨਾ', ta: 'மளிகை', bho: 'किराना'
  },
  'HOME_STAFF': {
    en: 'HomeStaff', hi: 'कर्मचारी', mr: 'कर्मचारी', gu: 'કર્મચારી', pa: 'ਕਰਮਚਾਰੀ', ta: 'பணியாளர்', bho: 'मजदूर/नौकर'
  },
  'NETWORK': {
    en: 'Network', hi: 'नेटवर्क', mr: 'नेटवर्क', gu: 'નેટવર્ક', pa: 'ਨੈੱਟਵਰਕ', ta: 'நெட்வொர்க்', bho: 'नेटवर्क'
  },
  
  // Vault & Gateway Info
  'CREATE_VAULT': {
    en: 'Create Vault', hi: 'नया वॉल्ट बनाएं', mr: 'नवीन वॉल्ट तयार करा', gu: 'નવું વોલ્ટ બનાવો', pa: 'ਨਵਾਂ ਵਾਲਟ ਬਣਾਓ', ta: 'புதிய பெட்டகத்தை உருவாக்கு', bho: 'नया वॉल्ट बनाईं'
  },
  'ENTER_PIN': {
    en: 'Enter PIN', hi: 'पिन दर्ज करें', mr: 'पिन प्रविष्ट करा', gu: 'પિન દાખલ કરો', pa: 'ਪਿੰਨ ਦਰਜ ਕਰੋ', ta: 'பின்னை உள்ளிடவும்', bho: 'पिन डालीं'
  },
  'UNLOCK': {
    en: 'Unlock', hi: 'खोलें', mr: 'उघडा', gu: 'ખોલો', pa: 'ਖੋਲ੍ਹੋ', ta: 'திற', bho: 'खोलीं'
  },
};

/**
 * Hook to use translations inside components
 * By default falls back to english if string is missing
 */
export function getTranslation(key: string, lang: Language): string {
  if (!UI_STRINGS[key]) return key;
  return UI_STRINGS[key][lang] || UI_STRINGS[key]['en'];
}

export function useTranslation(lang: Language) {
  return function t(key: string): string {
    return getTranslation(key, lang);
  };
}
