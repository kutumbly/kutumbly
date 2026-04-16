/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
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

import { DICTIONARY, Language } from '../lib/i18n';

/**
 * Audit script for i18n dictionary.
 * Checks for missing keys and missing translations across all supported languages.
 */
function validateI18n() {
  const languages: Language[] = [
    "en", "hi", "mr", "gu", "pa", "ta", "bho", "kn", "te", "ne", "bn", "mni"
  ];
  const keys = Object.keys(DICTIONARY);
  let errorCount = 0;
  let warningCount = 0;

  console.log(`\n🔍 AUDITING KUTUMBLY I18N DICTIONARY`);
  console.log(`-----------------------------------`);
  console.log(`Total Keys: ${keys.length}`);
  console.log(`Languages: ${languages.join(', ')}`);
  console.log(`-----------------------------------\n`);

  keys.forEach(key => {
    const entry = DICTIONARY[key];
    
    languages.forEach(lang => {
      if (!entry[lang]) {
        console.error(`❌ [ERROR] Key "${key}" is missing translation for: ${lang}`);
        errorCount++;
      } else if (lang !== 'en' && entry[lang] === entry['en']) {
        // Optional: Check if translation is same as English (might be intentional for tech terms)
        console.warn(`⚠️  [WARN]  Key "${key}" in "${lang}" is identical to English.`);
        warningCount++;
      }
    });
  });

  console.log(`\n-----------------------------------`);
  console.log(`Audit Summary:`);
  console.log(`Errors (Missing): ${errorCount}`);
  console.log(`Warnings (Duplicate): ${warningCount}`);
  
  if (errorCount > 0) {
    console.log(`\nResult: ❌ FAILED - Fix missing keys!`);
    process.exit(1);
  } else {
    console.log(`\nResult: ✅ PASSED - 100% Fidelity!`);
    process.exit(0);
  }
}

validateI18n();
