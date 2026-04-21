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
 * HEALTH MODULE — PUBLIC CONTRACT
 * ─────────────────────────────────────────────────────────────
 * These are the ONLY types that other modules may import from Health.
 * Internal types (repo shapes, service params) stay inside the module.
 * ─────────────────────────────────────────────────────────────
 */

export interface HealthReading {
  id: string;
  member_id: string;
  reading_date: string;
  weight?: number | null;
  bp_systolic?: number | null;
  bp_diastolic?: number | null;
  blood_sugar?: number | null;
  notes?: string | null;
  created_at: string;
}

export interface MedicalPrescription {
  id: string;
  member_id: string;
  doctor_name?: string | null;
  generic_name: string;
  brand_name?: string | null;
  medicine_type: 'Tablet' | 'Syrup' | 'Capsule' | 'Ointment' | 'Injection' | 'Drops' | string;
  dosage?: string | null;
  schedule_code: '1-0-1' | '1-1-1' | '1-0-0' | '0-0-1' | '0-1-0' | 'SOS' | string;
  meal_instruction: 'AC' | 'PC' | 'ANY';
  purpose?: string | null;
  start_date: string;
  end_date?: string | null;
  stock_remaining?: number;
  notes?: string | null;
  created_at?: string;
}

export interface HealthAdvancedProfile {
  id: string;
  member_id: string;
  prakriti?: string | null;
  agni?: string | null;
  ahaar?: string | null;
  current_regimen?: string | null;
  updated_at?: string | null;
}

export interface HealthMedication {
  id: string;
  member_id: string;
  name: string;
  dosage?: string | null;
  frequency?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface HealthVaccination {
  id: string;
  member_id: string;
  vaccine_name: string;
  date_given: string;
  next_due?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface HealthMedicalProfile {
  id: string;
  member_id: string;
  blood_group?: string | null;
  allergies?: string | null;
  chronic_conditions?: string | null;
  emergency_contact?: string | null;
  insurance_info?: string | null;
  updated_at?: string | null;
}
