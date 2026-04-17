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

/**
 * UTSAV MODULE — PUBLIC INDEX
 * Re-exports the existing useNevata hook from the sealed module path.
 * Usage: import { useUtsav } from '@/src/modules/utsav';
 */
export { useNevata as useUtsav } from '@/hooks/useNevata';
export { useNevataEngine as useUtsavEngine } from '@/hooks/useNevataEngine';
export type { UtsavEvent, UtsavShagunRecord, UtsavFamilyLedger, UtsavLedgerEntry } from '@/types/contracts/utsav.contract';
