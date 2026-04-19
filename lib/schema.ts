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

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  role TEXT, dob TEXT, avatar_initials TEXT
);
CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY, date TEXT, content TEXT,
  mood INTEGER, mood_label TEXT,
  title TEXT, subtitle TEXT, tags TEXT, weather TEXT, location TEXT, is_locked INTEGER DEFAULT 0,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, title TEXT, description TEXT,
  priority TEXT, status TEXT DEFAULT 'pending', category TEXT DEFAULT 'Home',
  assigned_to TEXT, due_date TEXT, created_at TEXT, completed_at TEXT
);

-- CASH HUB (VITT)
CREATE TABLE IF NOT EXISTS cash_transactions (
  id TEXT PRIMARY KEY, date TEXT, amount REAL,
  type TEXT, category TEXT, description TEXT,
  member_id TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS cash_budgets (
  id TEXT PRIMARY KEY, category TEXT, monthly_limit REAL, month TEXT
);
CREATE TABLE IF NOT EXISTS cash_investments (
  id TEXT PRIMARY KEY, 
  member_id TEXT,
  goal_id TEXT,
  name TEXT, type TEXT,
  principal REAL, current_value REAL, units REAL,
  monthly_sip REAL, start_date TEXT, maturity_date TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS cash_investment_txs (
  id TEXT PRIMARY KEY, investment_id TEXT NOT NULL,
  type TEXT, amount REAL, date TEXT, notes TEXT,
  created_at TEXT,
  FOREIGN KEY (investment_id) REFERENCES cash_investments(id)
);
CREATE TABLE IF NOT EXISTS cash_wealth_goals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  member_id TEXT,
  deadline TEXT,
  category TEXT,
  is_completed INTEGER DEFAULT 0,
  created_at TEXT
);

-- SAMAN HUB (HOUSEHOLD SUPPLY)
CREATE TABLE IF NOT EXISTS saman_lists (
  id TEXT PRIMARY KEY, name TEXT, created_at TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS saman_items (
  id TEXT PRIMARY KEY, list_id TEXT, name TEXT,
  quantity TEXT, unit TEXT, estimated_price REAL, checked INTEGER DEFAULT 0, category TEXT,
  current_stock REAL DEFAULT 0, threshold REAL DEFAULT 1, expiry_date TEXT, last_purchased_date TEXT
);

-- SEWAK HUB (KUTUMB SEWAK)
CREATE TABLE IF NOT EXISTS sewak_members (
  id TEXT PRIMARY KEY, name TEXT, role TEXT,
  monthly_salary REAL, join_date TEXT, phone TEXT,
  advance_balance REAL DEFAULT 0,
  paid_leaves_quota INTEGER DEFAULT 0,
  kyc_status TEXT DEFAULT 'PENDING',
  gov_id_number TEXT
);
CREATE TABLE IF NOT EXISTS sewak_attendance (
  id TEXT PRIMARY KEY, sewak_id TEXT, date TEXT, status TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS sewak_payments (
  id TEXT PRIMARY KEY, sewak_id TEXT, month TEXT,
  gross REAL, deductions REAL, net REAL, paid_on TEXT, advance REAL DEFAULT 0
);

-- UTSAV HUB (SOCIAL & EVENTS)
-- UTSAV HUB (INTERNAL EVENTS)
CREATE TABLE IF NOT EXISTS utsav_internal_events (
  id TEXT PRIMARY KEY, title TEXT, date TEXT,
  type TEXT, description TEXT, budget REAL,
  gift_idea TEXT, recurring INTEGER DEFAULT 0
);
-- UTSAV HUB (SOCIAL EVENTS)
CREATE TABLE IF NOT EXISTS utsav_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  direction TEXT NOT NULL,
  family_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT,
  our_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'upcoming',
  notes TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS utsav_shagun (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  direction TEXT NOT NULL,
  amount REAL DEFAULT 0,
  gift_desc TEXT,
  given_by TEXT,
  received_from TEXT,
  is_confirmed INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id)
);
CREATE TABLE IF NOT EXISTS utsav_guests (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  family_tag TEXT,
  guest_count INTEGER DEFAULT 1,
  rsvp_status TEXT DEFAULT 'pending',
  phone TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id)
);
CREATE TABLE IF NOT EXISTS utsav_gift_registry (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  estimated_price REAL,
  status TEXT DEFAULT 'baaki',
  source_url TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id)
);
CREATE TABLE IF NOT EXISTS utsav_ledger (
  id TEXT PRIMARY KEY,
  family_name TEXT NOT NULL,
  event_id TEXT,
  diya REAL DEFAULT 0,
  mila REAL DEFAULT 0,
  net REAL DEFAULT 0,
  notes TEXT,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS utsav_inventory (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity_expected REAL DEFAULT 0,
  quantity_received REAL DEFAULT 0,
  quantity_used REAL DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  status TEXT DEFAULT 'ORDERED',
  vendor_id TEXT,
  assigned_to_id TEXT,
  backup_person_id TEXT,
  delivery_date_expected TEXT,
  delivery_date_actual TEXT,
  is_returnable INTEGER DEFAULT 0,
  return_deadline TEXT,
  cost_estimated REAL DEFAULT 0,
  cost_actual REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id)
);
CREATE TABLE IF NOT EXISTS utsav_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service_type TEXT,
  contact TEXT,
  rating REAL DEFAULT 5,
  reliability_score REAL DEFAULT 100,
  advance_paid REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  payment_status TEXT DEFAULT 'PENDING',
  last_used_event TEXT,
  notes TEXT
);
CREATE TABLE IF NOT EXISTS utsav_activity_log (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  item_id TEXT,
  vendor_id TEXT,
  user_id TEXT,
  timestamp TEXT NOT NULL,
  metadata TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id)
);

-- VIDYA HUB (LEARNING & SKILLS)
CREATE TABLE IF NOT EXISTS vidya_learners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  family_member_id TEXT,
  institution TEXT,
  standard TEXT,
  board TEXT,
  avatar_initials TEXT,
  goal TEXT,
  goal_deadline TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS vidya_subjects (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  color TEXT DEFAULT '#c9971c',
  target_score TEXT,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id)
);
CREATE TABLE IF NOT EXISTS vidya_resources (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  learner_id TEXT NOT NULL,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  chapter TEXT,
  lesson TEXT,
  tags TEXT,
  is_bookmarked INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'medium',
  duration_mins INTEGER,
  created_at TEXT,
  FOREIGN KEY (subject_id) REFERENCES vidya_subjects(id)
);
CREATE TABLE IF NOT EXISTS vidya_sessions (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  subject_id TEXT,
  resource_id TEXT,
  date TEXT NOT NULL,
  duration_mins INTEGER NOT NULL,
  notes TEXT,
  mood TEXT DEFAULT 'neutral',
  created_at TEXT,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id)
);

-- HEALTH HUB (WELLNESS)
CREATE TABLE IF NOT EXISTS health_readings (
  id TEXT PRIMARY KEY, member_id TEXT, date TEXT,
  bp_systolic INTEGER, bp_diastolic INTEGER,
  blood_sugar REAL, pulse INTEGER, weight REAL, notes TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS health_medications (
  id TEXT PRIMARY KEY, member_id TEXT, name TEXT,
  dosage TEXT, frequency TEXT, start_date TEXT, end_date TEXT
);
CREATE TABLE IF NOT EXISTS health_profiles (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  blood_group TEXT,
  allergies TEXT,
  chronic_conditions TEXT,
  primary_doctor TEXT,
  emergency_contact TEXT,
  insurance_details TEXT,
  updated_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);
CREATE TABLE IF NOT EXISTS health_vaccinations (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  name TEXT NOT NULL,
  date TEXT,
  provider TEXT,
  next_due_date TEXT,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);
CREATE TABLE IF NOT EXISTS health_advanced_profiles (
  member_id TEXT PRIMARY KEY,
  prakriti TEXT,
  agni TEXT,
  diet TEXT,
  surgical_history TEXT,
  family_history TEXT,
  current_treatment TEXT,
  updated_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);
CREATE TABLE IF NOT EXISTS health_prescriptions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  doctor_name TEXT,
  generic_name TEXT NOT NULL,
  brand_name TEXT,
  medicine_type TEXT NOT NULL,
  dosage TEXT,
  schedule_code TEXT NOT NULL,
  meal_instruction TEXT,
  purpose TEXT,
  start_date TEXT NOT NULL,
  end_date TEXT,
  stock_remaining INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);

-- SUVIDHA HUB (UTILITY & DAILY TALLY)
CREATE TABLE IF NOT EXISTS suvidha_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rate_per_unit REAL DEFAULT 0,
  billing_cycle_day INTEGER DEFAULT 1,
  member_id TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);
CREATE TABLE IF NOT EXISTS suvidha_logs (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  date TEXT NOT NULL,
  quantity REAL DEFAULT 1,
  quality INTEGER DEFAULT 5,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (vendor_id) REFERENCES suvidha_vendors(id)
);
CREATE TABLE IF NOT EXISTS suvidha_payments (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,
  period_month TEXT NOT NULL,
  period_year TEXT NOT NULL,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (vendor_id) REFERENCES suvidha_vendors(id)
);

-- SANSKRITI HUB (TRADITION & HERITAGE)
CREATE TABLE IF NOT EXISTS sanskriti_dharma_profile (
  id TEXT PRIMARY KEY,
  gotra TEXT,
  pravar TEXT,
  kuldevta TEXT,
  kuldevi TEXT,
  kulguru TEXT,
  shaakha TEXT,
  veda TEXT,
  upadevyas TEXT,
  is_locked INTEGER DEFAULT 0,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS sanskriti_village_roots (
  id TEXT PRIMARY KEY,
  village_name TEXT NOT NULL,
  district TEXT,
  state TEXT,
  gramdevi_name TEXT,
  gramdevi_rituals TEXT,
  sthan_address TEXT,
  notes TEXT,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS sanskriti_ritual_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  performer_id TEXT,
  sankalpa_text TEXT,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (performer_id) REFERENCES family_members(id)
);
`;
