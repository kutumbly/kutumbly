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
  category: string;
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
  date: string;
  content: string;
  mood: number | null;
  mood_label: string | null;
  title: string | null;
  subtitle: string | null;
  tags: string | null;
  weather: string | null;
  location: string | null;
  is_locked: number;
  created_at?: string;
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
  budget?: number;
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

export interface NevataFamilyLedger {
  id: string;
  family_name: string;
  event_id: string | null;
  diya: number;
  mila: number;
  net: number;
  notes: string | null;
  updated_at: string;
}

// Keep the old name for backward compatibility if needed, but alias it
export type NevataLedgerEntry = NevataFamilyLedger;

/** 
 * Nevata 2.0 (Event Operating System) High-Fidelity Models 
 */
export interface NevataInventoryItem {
  id: string;
  event_id: string;
  item_name: string;
  category: 'Catering' | 'Decor' | 'Logistics' | 'Gift' | string;
  quantity_expected: number;
  quantity_received: number;
  quantity_used: number;
  unit: string;
  status: 'ORDERED' | 'DISPATCHED' | 'RECEIVED' | 'IN_USE' | 'RETURNED' | 'LOST';
  vendor_id: string | null;
  assigned_to_id: string | null;
  backup_person_id: string | null;
  delivery_date_expected: string | null;
  delivery_date_actual: string | null;
  is_returnable: boolean | number;
  return_deadline: string | null;
  cost_estimated: number;
  cost_actual: number;
  notes: string | null;
  created_at: string;
}

export interface NevataVendor {
  id: string;
  name: string;
  service_type: 'Catering' | 'Decor' | 'DJ' | 'Transport' | string;
  contact: string | null;
  rating: number;
  reliability_score: number;
  advance_paid: number;
  total_amount: number;
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID';
  last_used_event: string | null;
  notes: string | null;
}

export interface NevataActivityLog {
  id: string;
  event_id: string;
  type: 'ITEM' | 'PAYMENT' | 'TASK' | 'ALERT' | 'GUEST' | 'LEDGER';
  action: string;
  item_id?: string | null;
  vendor_id?: string | null;
  user_id?: string | null;
  timestamp: string;
  metadata?: string | null; // JSON string
}

export interface NevataGuest {
  id: string;
  event_id: string;
  guest_name: string;
  family_tag: string | null;
  guest_count: number;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  phone: string | null;
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
  advance_balance: number;
  paid_leaves_quota: number;
  kyc_status: string;
  gov_id_number: string | null;
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
  status: 'present' | 'absent' | 'leave' | 'absent_unpaid' | 'leave_paid' | 'half_day';
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

export interface InvestmentTransaction {
  id: string;
  investment_id: string;
  type: 'sip' | 'lumpsum' | 'withdrawal' | 'valuation';
  amount: number;
  date: string;
  notes: string | null;
  created_at?: string;
}

/**
 * Vidya (Study Buddy) Module Models
 */
export interface VidyaLearner {
  id: string;
  name: string;
  family_member_id: string | null;
  institution: string | null;
  standard: string | null;     // "Class 10", "B.Tech 3rd Year", "Self-Study"
  board: string | null;        // CBSE | ICSE | State Board | University | Self
  avatar_initials: string;
  goal: string | null;
  goal_deadline: string | null;
  is_active: number;            // 1 = active, 0 = inactive
  created_at: string;
}

export interface VidyaSubject {
  id: string;
  learner_id: string;
  name: string;
  category: string;             // Science | Commerce | Arts | Tech | Language | General
  color: string;                // CSS hex color for accent
  target_score: string | null;
  notes: string | null;
  created_at: string;
}

export type VidyaResourceType = 'youtube' | 'pdf' | 'article' | 'book' | 'website';

export interface VidyaResource {
  id: string;
  subject_id: string;
  learner_id: string;
  title: string;
  resource_type: VidyaResourceType;
  url: string | null;
  thumbnail_url: string | null;
  description: string | null;
  chapter: string | null;
  lesson: string | null;
  tags: string | null;
  is_bookmarked: number;        // 0 | 1
  is_completed: number;         // 0 | 1
  difficulty: 'easy' | 'medium' | 'hard';
  duration_mins: number | null;
  created_at: string;
}

export interface VidyaSession {
  id: string;
  learner_id: string;
  subject_id: string | null;
  resource_id: string | null;
  date: string;
  duration_mins: number;
  notes: string | null;
  mood: 'focused' | 'tired' | 'neutral' | 'distracted';
  created_at: string;
}
