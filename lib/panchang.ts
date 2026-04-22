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
 * Offline Panchang Logic for Kutumbly
 * Provides Tithi, Nakshatra, and Rahu Kaal approximations.
 */

const TITHIS = [
  "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", 
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", 
  "Trayodashi", "Chaturdashi", "Purnima",
  "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", 
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", 
  "Trayodashi", "Chaturdashi", "Amavasya"
];

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", 
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const PAKSHA = ["Shukla", "Krishna"];

const RAHU_KAAL_TABLE: Record<number, { start: string, end: string }> = {
  1: { start: "07:30", end: "09:00" }, // Mon
  2: { start: "15:00", end: "16:30" }, // Tue
  3: { start: "12:00", end: "13:30" }, // Wed
  4: { start: "13:30", end: "15:00" }, // Thu
  5: { start: "10:30", end: "12:00" }, // Fri
  6: { start: "09:00", end: "10:30" }, // Sat
  0: { start: "16:30", end: "18:00" }, // Sun
};

/**
 * Julian Date calculation
 */
function getJD(date: Date) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate() + (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
  
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

/**
 * Simplified Lunar Calculation
 * Returns Tithi (1-30) and Nakshatra (1-27)
 */
export function getPanchang(date: Date = new Date()) {
  const jd = getJD(date);
  
  // Reference: New Moon on Jan 6, 2000, 18:14 UTC (JD 2451550.26)
  const referenceJD = 2451550.26;
  const synodicMonth = 29.530588853;
  const siderealMonth = 27.321661;
  
  const daysSinceRef = jd - referenceJD;
  
  // Tithi Calculation (Phase of Moon)
  const lunarCycle = (daysSinceRef / synodicMonth) % 1;
  const tithiIndex = Math.floor(lunarCycle * 30);
  const pakshaIndex = tithiIndex < 15 ? 0 : 1;
  const tithiLabel = TITHIS[tithiIndex];
  
  // Nakshatra Calculation (Position of Moon)
  // Approximate based on sidereal month
  const nakshatraCycle = (daysSinceRef / siderealMonth) % 1;
  const nakshatraIndex = Math.floor(nakshatraCycle * 27);
  const nakshatraLabel = NAKSHATRAS[nakshatraIndex];
  
  // Rahu Kaal
  const dayOfWeek = date.getDay();
  const rahuKaal = RAHU_KAAL_TABLE[dayOfWeek];
  
  return {
    tithi: tithiLabel,
    paksha: PAKSHA[pakshaIndex],
    nakshatra: nakshatraLabel,
    rahuKaal,
    isPurnima: tithiIndex === 14,
    isAmavasya: tithiIndex === 29,
    dayName: date.toLocaleDateString('en-IN', { weekday: 'long' })
  };
}
