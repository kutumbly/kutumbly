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
 * Cash Hub (Money & Wealth) Models 
 */
export interface CashTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  member_id: string | null;
  created_at?: string;
}

export interface CashBudget {
  id: string;
  category: string;
  monthly_limit: number;
  month: string; // YYYY-MM
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

export interface HealthProfile {
  member_id: string;
  blood_group: string | null;
  allergies: string | null;
  chronic_conditions: string | null;
  primary_doctor: string | null;
  emergency_contact: string | null;
  insurance_details: string | null;
  // Advanced fields
  prakriti: string | null;
  agni: string | null;
  diet: string | null;
  surgical_history: string | null;
  family_history: string | null;
  current_treatment: string | null;
  updated_at: string;
}

export interface HealthPrescription {
  id: string;
  member_id: string;
  doctor_name: string | null;
  generic_name: string;
  brand_name: string | null;
  medicine_type: 'Tablet' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops' | 'Other' | string;
  dosage: string | null;
  schedule_code: string;
  meal_instruction: 'AC' | 'PC' | 'ANY' | string | null;
  purpose: string | null;
  start_date: string;
  end_date: string | null;
  stock_remaining: number;
  notes: string | null;
  created_at: string;
}

export interface Vaccination {
  id: string;
  member_id: string;
  name: string;
  date: string | null;
  provider: string | null;
  next_due_date: string | null;
  notes: string | null;
  created_at: string;
}

/** 
 * Saman Hub (Household Supply) Models 
 */
export interface SamanList {
  id: string;
  name: string;
  created_at: string;
  status: string;
}

export interface SamanItem {
  id: string;
  list_id: string;
  name: string;
  quantity: string;
  unit: string;
  category: string;
  estimated_price: number;
  checked: boolean | number;
  current_stock: number;
  threshold?: number;
  expiry_date?: string | null;
  last_purchased_date?: string | null;
}

/** 
 * Utsav Hub (Social & Events) Models 
 */
export interface UtsavEvent {
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

export interface UtsavShagun {
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

export interface UtsavFamilyLedger {
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
export type UtsavLedgerEntry = UtsavFamilyLedger;

/** 
 * Utsav Hub 2.0 (Event Operating System) High-Fidelity Models 
 */
export interface UtsavInventoryItem {
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

export interface UtsavVendor {
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

export interface UtsavActivityLog {
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

export interface UtsavGuest {
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
 * Sewak Hub (Staff Management) Models
 */
export interface SewakMember {
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
  emergency_contact?: string | null;
  shift_timing?: string | null;
}

export interface SewakPayment {
  id: string;
  sewak_id: string;
  month: string;
  gross: number;
  deductions: number;
  net: number;
  paid_on: string;
  advance: number;
}

/** Sovereign alias — VetanPayment (Vetan = Salary in Hindi) */
export type VetanPayment = SewakPayment;

export interface SewakAttendance {
  id: string;
  sewak_id: string;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'absent_unpaid' | 'leave_paid' | 'half_day';
  notes: string;
}

export interface SewakAdvance {
  id: string;
  sewak_id: string;
  amount: number;
  date: string;
  reason: string;
  status: 'ACTIVE' | 'RECOVERED';
}

export interface SewakWelfare {
  id: string;
  sewak_id: string;
  welfare_type: 'FESTIVAL_BONUS' | 'SCHOOL_FEES' | 'MEDICAL' | 'OTHER';
  amount: number;
  event_date: string;
  notes: string;
}

export interface SewakDocument {
  id: string;
  sewak_id: string;
  doc_type: 'POLICE_VERIFICATION' | 'AADHAAR' | 'AGENCY_CONTRACT' | 'OTHER';
  vault_ref: string | null;
  expiry_date: string | null;
  verification_status: 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'REJECTED';
}

/**
 * Investment Models
 */
export interface Investment {
  id: string;
  member_id?: string | null;           // Link to family member
  goal_id?: string | null;             // Link to specific goal
  name: string;
  type: string;
  principal: number;
  current_value: number;
  units: number | string | null;       // Grams for gold, units for MF
  monthly_sip: number | null;
  start_date: string;
  maturity_date: string | null;
  notes: string | null;
}

export interface InvestmentGoal {
  id: string;
  name: string;
  target_amount: number;
  member_id: string | null;
  deadline: string | null;
  category: 'Retirement' | 'Education' | 'Marriage' | 'Home' | 'Vehicle' | string;
  is_completed: number;                // 0 | 1
  created_at?: string;
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

/**
 * Suvidha Hub (Utility & Daily Tally) Module Models
 */
export interface SuvidhaVendor {
  id: string;
  name: string;
  type: 'milk' | 'water' | 'paper' | 'internet' | 'trash' | 'helper' | string;
  rate_per_unit: number;       // Price for 1L milk or fixed monthly salary
  billing_cycle_day: number;   // 1 to 31
  member_id: string | null;    // Who manages this vendor
  is_active: number;           // 1 | 0
  created_at?: string;
}

export interface SuvidhaLog {
  id: string;
  vendor_id: string;
  date: string;                // YYYY-MM-DD
  quantity: number;            // 2 for 2L milk, 1 for attendance
  quality: number;             // 1-10 rating
  notes: string | null;
  created_at?: string;
}

export interface SuvidhaPayment {
  id: string;
  vendor_id: string;
  amount: number;
  date: string;
  period_month: string;        // '01' to '12'
  period_year: string;         // '2024'
  notes: string | null;
  created_at?: string;
}

/**
 * Vahan Hub (Vehicle & Fleet) Module Models
 */
export interface VahanVehicle {
  id: string;
  name: string;
  vehicle_number: string | null;
  owner_id: string | null;
  vehicle_type: 'Car' | 'Bike' | 'Scooter' | 'Cycle' | 'Other' | string;
  fuel_type: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid' | string | null;
  insurance_expiry: string | null;
  puc_expiry: string | null;
  fitness_expiry: string | null;
  insurance_policy_no: string | null;
  notes: string | null;
  created_at: string;
}

export interface VahanLog {
  id: string;
  vehicle_id: string;
  log_type: 'Service' | 'Fuel' | 'Fine' | 'Toll' | 'Expense' | string;
  date: string;
  amount: number;
  odometer: number | null;
  notes: string | null;
  created_at: string;
}
