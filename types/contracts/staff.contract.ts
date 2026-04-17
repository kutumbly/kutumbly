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
 * STAFF MODULE — PUBLIC CONTRACT
 */
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone?: string | null;
  salary: number;
  join_date?: string | null;
  status: 'active' | 'inactive';
  created_at?: string;
}

export interface StaffAdvance {
  id: string;
  staff_id: string;
  amount: number;
  date: string;
  notes?: string | null;
  created_at?: string;
}
