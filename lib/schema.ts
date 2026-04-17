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
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, date TEXT, amount REAL,
  type TEXT, category TEXT, description TEXT,
  member_id TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY, category TEXT, monthly_limit REAL, month TEXT
);
CREATE TABLE IF NOT EXISTS health_readings (
  id TEXT PRIMARY KEY, member_id TEXT, date TEXT,
  bp_systolic INTEGER, bp_diastolic INTEGER,
  blood_sugar REAL, pulse INTEGER, weight REAL, notes TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY, member_id TEXT, name TEXT,
  dosage TEXT, frequency TEXT, start_date TEXT, end_date TEXT
);
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY, name TEXT, role TEXT,
  monthly_salary REAL, join_date TEXT, phone TEXT,
  advance_balance REAL DEFAULT 0,
  paid_leaves_quota INTEGER DEFAULT 0,
  kyc_status TEXT DEFAULT 'PENDING',
  gov_id_number TEXT
);
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY, staff_id TEXT, date TEXT, status TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS salary_payments (
  id TEXT PRIMARY KEY, staff_id TEXT, month TEXT,
  gross REAL, deductions REAL, net REAL, paid_on TEXT, advance REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY, 
  member_id TEXT,                       -- Link to family_member
  goal_id TEXT,                         -- ID of invest_goals if linked
  name TEXT, type TEXT,
  principal REAL, current_value REAL, units REAL,
  monthly_sip REAL, start_date TEXT, maturity_date TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS investment_transactions (
  id TEXT PRIMARY KEY, investment_id TEXT NOT NULL,
  type TEXT, amount REAL, date TEXT, notes TEXT,
  created_at TEXT,
  FOREIGN KEY (investment_id) REFERENCES investments(id)
);

CREATE TABLE IF NOT EXISTS invest_goals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  target_amount REAL NOT NULL,
  member_id TEXT,                       -- Goal for whom?
  deadline TEXT,
  category TEXT,                        -- 'Retirement' | 'Education' | 'Marriage' | 'Home' | 'Vehicle'
  is_completed INTEGER DEFAULT 0,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS grocery_lists (
  id TEXT PRIMARY KEY, name TEXT, created_at TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS grocery_items (
  id TEXT PRIMARY KEY, list_id TEXT, name TEXT,
  quantity TEXT, unit TEXT, estimated_price REAL, checked INTEGER DEFAULT 0, category TEXT,
  current_stock REAL DEFAULT 0, threshold REAL DEFAULT 1, expiry_date TEXT, last_purchased_date TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY, title TEXT, date TEXT,
  type TEXT, description TEXT, budget REAL,
  gift_idea TEXT, recurring INTEGER DEFAULT 0
);

-- NEVATA MODULE TABLES
CREATE TABLE IF NOT EXISTS nevata_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,       -- 'shaadi' | 'janmdin' | 'tilak' | 'mundan' | 'janeu' | 'sagai' | 'pooja' | 'other'
  direction TEXT NOT NULL,        -- 'bheja' (we invited) | 'aaya' (we received invite)
  family_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT,
  our_count INTEGER DEFAULT 1,    -- how many from our side going
  status TEXT DEFAULT 'upcoming', -- 'upcoming' | 'attended' | 'skipped'
  notes TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS nevata_shagun (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  direction TEXT NOT NULL,        -- 'diya' (we gave) | 'mila' (we received)
  amount REAL DEFAULT 0,
  gift_desc TEXT,
  given_by TEXT,                  -- family member name
  received_from TEXT,
  is_confirmed INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);
CREATE TABLE IF NOT EXISTS nevata_guest_list (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,         -- only for direction='bheja' events
  guest_name TEXT NOT NULL,
  family_tag TEXT,                -- 'ladki waale' | 'ladke waale' | 'dost' | 'relative'
  guest_count INTEGER DEFAULT 1,
  rsvp_status TEXT DEFAULT 'pending', -- 'aa_rahe' | 'nahi_aayenge' | 'pending'
  phone TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);
CREATE TABLE IF NOT EXISTS nevata_gift_registry (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  estimated_price REAL,
  status TEXT DEFAULT 'baaki',    -- 'liya' | 'baaki' | 'suggest'
  source_url TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);
CREATE TABLE IF NOT EXISTS nevata_family_ledger (
  id TEXT PRIMARY KEY,
  family_name TEXT NOT NULL,
  event_id TEXT,
  diya REAL DEFAULT 0,
  mila REAL DEFAULT 0,
  net REAL DEFAULT 0,             -- mila - diya (positive = they owe us)
  notes TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS nevata_inventory (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT NOT NULL,       -- 'Catering' | 'Decor' | 'Logistics' | 'Gift'
  quantity_expected REAL DEFAULT 0,
  quantity_received REAL DEFAULT 0,
  quantity_used REAL DEFAULT 0,
  unit TEXT DEFAULT 'pcs',      -- 'kg' | 'pcs' | 'sets'
  status TEXT DEFAULT 'ORDERED', -- 'ORDERED' | 'DISPATCHED' | 'RECEIVED' | 'IN_USE' | 'RETURNED' | 'LOST'
  vendor_id TEXT,
  assigned_to_id TEXT,          -- linked to family_members.id or name
  backup_person_id TEXT,
  delivery_date_expected TEXT,
  delivery_date_actual TEXT,
  is_returnable INTEGER DEFAULT 0,
  return_deadline TEXT,
  cost_estimated REAL DEFAULT 0,
  cost_actual REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);

CREATE TABLE IF NOT EXISTS nevata_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  service_type TEXT,            -- 'Catering' | 'Decor' | 'DJ' | 'Transport'
  contact TEXT,
  rating REAL DEFAULT 5,
  reliability_score REAL DEFAULT 100,
  advance_paid REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  payment_status TEXT DEFAULT 'PENDING',
  last_used_event TEXT,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS nevata_activity_log (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  type TEXT NOT NULL,           -- 'ITEM' | 'PAYMENT' | 'TASK' | 'ALERT'
  action TEXT NOT NULL,         -- 'CREATED' | 'UPDATED' | 'RECEIVED' | 'PAID' | 'ASSIGNED'
  item_id TEXT,                 -- optional link to inventory
  vendor_id TEXT,               -- optional link to vendor
  user_id TEXT,                 -- family member who did it
  timestamp TEXT NOT NULL,
  metadata TEXT,                -- JSON string for extra info
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);

-- VIDYA MODULE TABLES
-- Learner profile
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

-- Subject per learner
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

-- Study resource
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

-- Study session log
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

CREATE TABLE IF NOT EXISTS medical_profiles (
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

CREATE TABLE IF NOT EXISTS vaccinations (
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

-- SUVIDHA HUB (UTILITY & DAILY TALLY) TABLES
CREATE TABLE IF NOT EXISTS utility_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,           -- 'milk' | 'water' | 'paper' | 'internet' | 'trash' | 'helper'
  rate_per_unit REAL DEFAULT 0, -- price for 1L milk or monthly fixed salary
  billing_cycle_day INTEGER DEFAULT 1,
  member_id TEXT,               -- family member who handles this
  is_active INTEGER DEFAULT 1,
  created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id)
);

CREATE TABLE IF NOT EXISTS utility_logs (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  date TEXT NOT NULL,           -- YYYY-MM-DD
  quantity REAL DEFAULT 1,      -- 2L milk, 1 paper, or attendance (1/0)
  quality INTEGER DEFAULT 5,    -- 1-10 rating
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (vendor_id) REFERENCES utility_vendors(id)
);

CREATE TABLE IF NOT EXISTS utility_payments (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL,
  amount REAL NOT NULL,
  date TEXT NOT NULL,           -- Payment date
  period_month TEXT NOT NULL,    -- '01' to '12'
  period_year TEXT NOT NULL,     -- '2024'
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (vendor_id) REFERENCES utility_vendors(id)
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

CREATE TABLE IF NOT EXISTS medical_prescriptions (
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

-- SANSKRITI HUB (TRADITION & HERITAGE) TABLES
CREATE TABLE IF NOT EXISTS sanskriti_dharma_profile (
  id TEXT PRIMARY KEY,
  gotra TEXT,
  pravar TEXT,
  kuldevta TEXT,
  kuldevi TEXT,
  kulguru TEXT,
  shaakha TEXT,
  veda TEXT,
  upadevyas TEXT, -- JSON string array
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
  type TEXT NOT NULL, -- 'DAILY' | 'SPECIAL' | 'TITHI' | 'SANKALPA'
  name TEXT NOT NULL,
  performer_id TEXT, -- Link to family_members.id
  sankalpa_text TEXT,
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (performer_id) REFERENCES family_members(id)
);
`;
