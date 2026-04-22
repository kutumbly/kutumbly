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

export const SCHEMA_SQL = `
-- CORE SYSTEM TABLES
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  role TEXT, dob TEXT, avatar_initials TEXT,
  is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY, date TEXT, content TEXT,
  mood INTEGER, mood_label TEXT,
  title TEXT, subtitle TEXT, tags TEXT, weather TEXT, location TEXT,
  entry_type TEXT DEFAULT 'reflection', -- 'reflection' | 'activity' | 'milestone'
  visibility TEXT DEFAULT 'normal',     -- 'normal' | 'vault'
  metadata TEXT,                         -- JSON for extra data
  is_locked INTEGER DEFAULT 0,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, title TEXT, description TEXT,
  priority TEXT, status TEXT DEFAULT 'pending', category TEXT DEFAULT 'Home',
  assigned_to TEXT, due_date TEXT, created_at TEXT, completed_at TEXT
);

-- UTSAV HUB (EVENTS & LEDGER)
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
  FOREIGN KEY (event_id) REFERENCES utsav_events(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS utsav_ledger (
  id TEXT PRIMARY KEY,
  family_name TEXT NOT NULL,
  event_id TEXT,
  diya REAL DEFAULT 0,
  mila REAL DEFAULT 0,
  net REAL DEFAULT 0,
  notes TEXT,
  updated_at TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS utsav_guests (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  family_tag TEXT,
  guest_count INTEGER DEFAULT 1,
  rsvp_status TEXT DEFAULT 'pending',
  phone TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS utsav_inventory (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity_expected REAL DEFAULT 1,
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
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS utsav_vendors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  service_type TEXT,
  rating REAL DEFAULT 0,
  reliability_score INTEGER DEFAULT 100,
  advance_paid REAL DEFAULT 0,
  total_amount REAL DEFAULT 0,
  payment_status TEXT DEFAULT 'PENDING',
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS utsav_activity_log (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  type TEXT NOT NULL,
  action TEXT NOT NULL,
  item_id TEXT,
  vendor_id TEXT,
  user_id TEXT,
  timestamp TEXT,
  metadata TEXT,
  FOREIGN KEY (event_id) REFERENCES utsav_events(id) ON DELETE CASCADE
);

-- VITT HUB (CASH & WEALTH)
CREATE TABLE IF NOT EXISTS cash_transactions (
  id TEXT PRIMARY KEY, date TEXT, amount REAL,
  type TEXT, category TEXT, description TEXT,
  member_id TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS cash_budgets (
  id TEXT PRIMARY KEY, category TEXT, monthly_limit REAL, month TEXT
);
CREATE TABLE IF NOT EXISTS cash_investments (
  id TEXT PRIMARY KEY, member_id TEXT, goal_id TEXT,
  name TEXT, type TEXT, principal REAL, current_value REAL, units REAL,
  monthly_sip REAL, start_date TEXT, maturity_date TEXT, notes TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS cash_investment_txs (
  id TEXT PRIMARY KEY, investment_id TEXT NOT NULL,
  type TEXT, amount REAL, date TEXT, notes TEXT,
  created_at TEXT,
  FOREIGN KEY (investment_id) REFERENCES cash_investments(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS cash_wealth_goals (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, target_amount REAL NOT NULL,
  member_id TEXT, deadline TEXT, category TEXT,
  is_completed INTEGER DEFAULT 0, created_at TEXT
);

-- SAMAN HUB (HOUSEHOLD SUPPLY)
CREATE TABLE IF NOT EXISTS saman_lists (
  id TEXT PRIMARY KEY, name TEXT, created_at TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS saman_items (
  id TEXT PRIMARY KEY, list_id TEXT, name TEXT,
  quantity TEXT, unit TEXT, estimated_price REAL, checked INTEGER DEFAULT 0, category TEXT,
  current_stock REAL DEFAULT 0, threshold REAL DEFAULT 1, expiry_date TEXT, last_purchased_date TEXT,
  FOREIGN KEY (list_id) REFERENCES saman_lists(id) ON DELETE CASCADE
);

-- SEWAK HUB (STAFF & PAYROLL)
CREATE TABLE IF NOT EXISTS sewak_members (
  id TEXT PRIMARY KEY, name TEXT, role TEXT,
  monthly_salary REAL, join_date TEXT, phone TEXT,
  advance_balance REAL DEFAULT 0,
  paid_leaves_quota INTEGER DEFAULT 0,
  kyc_status TEXT DEFAULT 'PENDING',
  gov_id_number TEXT, emergency_contact TEXT, shift_timing TEXT,
  is_active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS sewak_attendance (
  id TEXT PRIMARY KEY, sewak_id TEXT, date TEXT, status TEXT, notes TEXT,
  FOREIGN KEY (sewak_id) REFERENCES sewak_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sewak_payments (
  id TEXT PRIMARY KEY, sewak_id TEXT, month TEXT,
  gross REAL, deductions REAL, net REAL, paid_on TEXT, advance REAL DEFAULT 0,
  FOREIGN KEY (sewak_id) REFERENCES sewak_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sewak_advances (
  id TEXT PRIMARY KEY, sewak_id TEXT, amount REAL, 
  date TEXT, reason TEXT, status TEXT DEFAULT 'ACTIVE',
  FOREIGN KEY (sewak_id) REFERENCES sewak_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sewak_welfare (
  id TEXT PRIMARY KEY, sewak_id TEXT, welfare_type TEXT,
  amount REAL, event_date TEXT, notes TEXT,
  FOREIGN KEY (sewak_id) REFERENCES sewak_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS sewak_documents (
  id TEXT PRIMARY KEY, sewak_id TEXT, doc_type TEXT,
  vault_ref TEXT, expiry_date TEXT, verification_status TEXT,
  FOREIGN KEY (sewak_id) REFERENCES sewak_members(id) ON DELETE CASCADE
);

-- VIDYA HUB (LEARNING)
CREATE TABLE IF NOT EXISTS vidya_learners (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, family_member_id TEXT,
  institution TEXT, standard TEXT, board TEXT, avatar_initials TEXT,
  goal TEXT, goal_deadline TEXT, is_active INTEGER DEFAULT 1,
  created_at TEXT,
  FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS vidya_subjects (
  id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, name TEXT NOT NULL,
  category TEXT DEFAULT 'General', color TEXT DEFAULT '#c9971c',
  target_score TEXT, notes TEXT, created_at TEXT,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS vidya_resources (
  id TEXT PRIMARY KEY, subject_id TEXT NOT NULL, learner_id TEXT NOT NULL,
  title TEXT NOT NULL, resource_type TEXT NOT NULL, url TEXT,
  thumbnail_url TEXT, description TEXT, chapter TEXT, lesson TEXT,
  tags TEXT, is_bookmarked INTEGER DEFAULT 0, is_completed INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'medium', duration_mins INTEGER, created_at TEXT,
  FOREIGN KEY (subject_id) REFERENCES vidya_subjects(id) ON DELETE CASCADE,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS vidya_sessions (
  id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, subject_id TEXT,
  resource_id TEXT, date TEXT NOT NULL, duration_mins INTEGER NOT NULL,
  notes TEXT, mood TEXT DEFAULT 'neutral', created_at TEXT,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id) ON DELETE CASCADE
);

-- VAHAN HUB (VEHICLES)
CREATE TABLE IF NOT EXISTS vahan_vehicles (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, vehicle_number TEXT,
  owner_id TEXT, vehicle_type TEXT DEFAULT 'Car', fuel_type TEXT,
  insurance_expiry TEXT, puc_expiry TEXT, fitness_expiry TEXT,
  insurance_policy_no TEXT, notes TEXT, created_at TEXT,
  FOREIGN KEY (owner_id) REFERENCES family_members(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS vahan_logs (
  id TEXT PRIMARY KEY, vehicle_id TEXT NOT NULL, log_type TEXT NOT NULL,
  date TEXT NOT NULL, amount REAL DEFAULT 0, odometer INTEGER,
  notes TEXT, created_at TEXT,
  FOREIGN KEY (vehicle_id) REFERENCES vahan_vehicles(id) ON DELETE CASCADE
);

-- HEALTH HUB (AROGYA)
CREATE TABLE IF NOT EXISTS health_profiles (
  member_id TEXT PRIMARY KEY,
  blood_group TEXT, allergies TEXT, chronic_conditions TEXT,
  primary_doctor TEXT, emergency_contact TEXT, insurance_details TEXT,
  prakriti TEXT, agni TEXT, diet TEXT, surgical_history TEXT,
  family_history TEXT, current_treatment TEXT, updated_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS health_readings (
  id TEXT PRIMARY KEY, member_id TEXT, date TEXT,
  bp_systolic INTEGER, bp_diastolic INTEGER,
  blood_sugar REAL, pulse INTEGER, weight REAL, 
  notes TEXT, created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS health_prescriptions (
  id TEXT PRIMARY KEY, member_id TEXT NOT NULL, doctor_name TEXT,
  generic_name TEXT NOT NULL, brand_name TEXT, medicine_type TEXT NOT NULL,
  dosage TEXT, schedule_code TEXT NOT NULL, meal_instruction TEXT,
  purpose TEXT, start_date TEXT NOT NULL, end_date TEXT,
  stock_remaining INTEGER DEFAULT 0, notes TEXT, created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS health_vaccinations (
  id TEXT PRIMARY KEY, member_id TEXT NOT NULL, name TEXT NOT NULL,
  date TEXT, provider TEXT, next_due_date TEXT, notes TEXT, created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
);

-- SUVIDHA HUB (UTILITY & DAILY TALLY)
CREATE TABLE IF NOT EXISTS suvidha_vendors (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL,
  rate_per_unit REAL DEFAULT 0, billing_cycle_day INTEGER DEFAULT 1,
  member_id TEXT, is_active INTEGER DEFAULT 1, created_at TEXT,
  FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS suvidha_logs (
  id TEXT PRIMARY KEY, vendor_id TEXT NOT NULL, date TEXT NOT NULL,
  quantity REAL DEFAULT 1, unit TEXT DEFAULT 'unit', quality INTEGER DEFAULT 5, notes TEXT, created_at TEXT,
  FOREIGN KEY (vendor_id) REFERENCES suvidha_vendors(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS suvidha_payments (
  id TEXT PRIMARY KEY, vendor_id TEXT NOT NULL, amount REAL NOT NULL,
  date TEXT NOT NULL, period_month TEXT NOT NULL, period_year TEXT NOT NULL,
  payment_mode TEXT DEFAULT 'CASH', member_id TEXT, paid_on TEXT,
  notes TEXT, created_at TEXT,
  FOREIGN KEY (vendor_id) REFERENCES suvidha_vendors(id) ON DELETE CASCADE
);

-- SANSKRITI HUB (TRADITION & HERITAGE)
CREATE TABLE IF NOT EXISTS sanskriti_dharma_profile (
  id TEXT PRIMARY KEY, gotra TEXT, pravar TEXT, kuldevta TEXT,
  kuldevi TEXT, kulguru TEXT, shaakha TEXT, veda TEXT, upadevyas TEXT,
  is_locked INTEGER DEFAULT 0, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS sanskriti_village_roots (
  id TEXT PRIMARY KEY, village_name TEXT NOT NULL, district TEXT,
  state TEXT, gramdevi_name TEXT, gramdevi_rituals TEXT,
  sthan_address TEXT, notes TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS sanskriti_ritual_logs (
  id TEXT PRIMARY KEY, date TEXT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL,
  performer_id TEXT, sankalpa_text TEXT, notes TEXT, created_at TEXT,
  FOREIGN KEY (performer_id) REFERENCES family_members(id) ON DELETE SET NULL
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_cash_tx_date ON cash_transactions(date);
CREATE INDEX IF NOT EXISTS idx_sewak_attendance_date ON sewak_attendance(date);
CREATE INDEX IF NOT EXISTS idx_suvidha_logs_date ON suvidha_logs(date);
CREATE INDEX IF NOT EXISTS idx_health_readings_date ON health_readings(date);
CREATE INDEX IF NOT EXISTS idx_vahan_logs_date ON vahan_logs(date);
`;
