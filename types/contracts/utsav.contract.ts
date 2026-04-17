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
 * UTSAV MODULE — PUBLIC CONTRACT
 * ─────────────────────────────────────────────────────────────
 * Cross-module visible types for the Utsav (Bahi-Khata) Hub.
 * ─────────────────────────────────────────────────────────────
 */

export interface UtsavEvent {
  id: string;
  title: string;
  event_type: string;
  direction: 'we_hosted' | 'they_hosted';
  family_name: string;
  event_date: string;
  location?: string | null;
  our_count?: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string | null;
  created_at?: string;
}

export interface UtsavShagunRecord {
  id: string;
  event_id: string;
  direction: 'given' | 'received';
  amount: number;
  gift_desc?: string | null;
  given_by?: string | null;
  received_from?: string | null;
  is_confirmed: boolean | number;
  created_at?: string;
}

export interface UtsavFamilyLedger {
  id: string;
  family_name: string;
  diya: number;    // Total given (Diya Nimantran)
  mila: number;   // Total received (Prapt Nimantran)
  net: number;    // mila - diya (positive = they owe us)
  updated_at?: string;
}

export type UtsavLedgerEntry = UtsavFamilyLedger;
