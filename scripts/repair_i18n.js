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

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'lib', 'i18n.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find the line starting with common.status.secure
const startIndex = lines.findIndex(line => line.includes('"common.status.secure"'));
const endIndex = lines.findIndex(line => line.includes('"landing.hero.title_part1"'));

if (startIndex !== -1 && endIndex !== -1) {
  const cleanSection = [
    '  "common.status.secure": { en: "Secure", hi: "सुरक्षित", bho: "सुरक्षित" },',
    '',
    '  // Landing Page Header',
    '  "landing.header.nav.product": { en: "Product", hi: "उत्पाद", bho: "सामान" },',
    '  "landing.header.nav.modules": { en: "Modules", hi: "मॉड्यूल", bho: "हब" },',
    '  "landing.header.nav.security": { en: "Security", hi: "सुरक्षा", bho: "सुरक्षा" },',
    '  "landing.header.nav.founders": { en: "Founders", hi: "संस्थापक", bho: "मालिक" },',
    '  "landing.header.nav.contact": { en: "Contact", hi: "संपर्क", bho: "संपर्क" },',
    '  "landing.header.open_os": { en: "Open OS", hi: "ओएस खोलें", bho: "ओएस खोलीं" },',
    '',
    '  "landing.hero.tagline": { en: "NIYANTRAN: ABSOLUTE CONTROL", hi: "नियंत्रण: पूर्ण नियंत्रण", bho: "नियंत्रण: पूरा कंट्रोल" },',
    '  "landing.hero.specs.hubs": { en: "Sovereign Hubs", hi: "संप्रभु हब", bho: "संप्रभु हब" },',
    '  "landing.hero.specs.cloud": { en: "Cloud Dependency", hi: "क्लाउड निर्भरता", bho: "क्लाउड जीरो" },',
    '  "landing.hero.specs.encryption": { en: "AES-256-GCM", hi: "AES-256 सुरक्षा", bho: "पूरा सुरक्षा" },',
    '  "landing.hero.specs.access": { en: "Lifetime Access", hi: "लाइफटाइम एक्सेस", bho: "वरिस भर खातिर" },',
  ];

  lines.splice(startIndex, endIndex - startIndex, ...cleanSection);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log('Successfully repaired i18n.ts');
} else {
  console.error('Could not find start or end index for repair.');
  console.log('startIndex:', startIndex, 'endIndex:', endIndex);
}
