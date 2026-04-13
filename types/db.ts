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
 * Money Module Models 
 */
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  member_id: string;
  created_at?: string;
}

/** 
 * Task Module Models 
 */
export interface FamilyTask {
  id: string;
  title: string;
  description: string | null;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'done';
  assigned_to: string;
  due_date: string | null;
  created_at?: string;
  completed_at?: string | null;
}

/** 
 * Diary Module Models 
 */
export interface DiaryEntry {
  id: string;
  content: string;
  date: string;
  mood_label: string | null;
  tags?: string;
  is_locked?: boolean;
}

/** 
 * Health Module Models 
 */
export interface HealthReading {
  id: string;
  member_id: string;
  date: string;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  blood_sugar: number | null;
  pulse: number | null;
  weight: number | null;
  notes: string | null;
  created_at: string;
}

export interface Medication {
  id: string;
  member_id: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  status?: 'active' | 'completed' | 'paused';
}

/** 
 * Grocery Module Models 
 */
export interface GroceryList {
  id: string;
  name: string;
  created_at: string;
  status: string;
}

export interface GroceryItem {
  id: string;
  list_id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  estimated_price: number;
  checked: boolean | number;
}

/** 
 * Nevata (Family Network) Models 
 */
export interface NevataEvent {
  id: string;
  title: string;
  event_type: string;
  direction: 'they_invited' | 'we_hosted';
  family_name: string;
  event_date: string;
  location: string;
  our_count: number;
  status: string;
  notes: string;
  created_at: string;
}

export interface ShagunRecord {
  id: string;
  event_id: string;
  direction: 'given' | 'received';
  amount: number;
  gift_desc: string;
  given_by: string;
  received_from: string;
  is_confirmed: boolean;
  created_at: string;
}

export interface NevataLedgerEntry {
  family_name: string;
  diya: number;
  mila: number;
  net: number;
  notes: string | null;
  updated_at: string;
}

/** 
 * User & Family Models 
 */
export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  dob: string | null;
  /** DB column: avatar_initials */
  avatar_initials: string;
  /** Alias for backward compat */
  initials?: string;
}

/**
 * Staff & Payroll Models
 */
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  /** DB column: monthly_salary */
  monthly_salary: number;
  /** Convenience alias used in display code */
  salary: number;
  join_date: string;
  phone: string;
}

export interface SalaryPayment {
  id: string;
  staff_id: string;
  month: string;
  gross: number;
  deductions: number;
  net: number;
  paid_on: string;
  advance: number;
}

export interface AttendanceRecord {
  id: string;
  staff_id: string;
  date: string;
  status: 'present' | 'absent' | 'leave';
  notes: string;
}

/**
 * Investment Models
 */
export interface Investment {
  id: string;
  name: string;
  type: string;
  principal: number;
  current_value: number;
  units: string | null;
  monthly_sip: number | null;
  start_date: string;
  maturity_date: string | null;
  notes: string | null;
}
