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
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  role TEXT, dob TEXT, avatar_initials TEXT
);
CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY, date TEXT, content TEXT,
  mood INTEGER, mood_label TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, title TEXT, description TEXT,
  priority TEXT, status TEXT DEFAULT 'pending',
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
  monthly_salary REAL, join_date TEXT, phone TEXT
);
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY, staff_id TEXT, date TEXT, status TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS salary_payments (
  id TEXT PRIMARY KEY, staff_id TEXT, month TEXT,
  gross REAL, deductions REAL, net REAL, paid_on TEXT, advance REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY, name TEXT, type TEXT,
  principal REAL, current_value REAL, units REAL,
  monthly_sip REAL, start_date TEXT, maturity_date TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS grocery_lists (
  id TEXT PRIMARY KEY, name TEXT, created_at TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS grocery_items (
  id TEXT PRIMARY KEY, list_id TEXT, name TEXT,
  quantity TEXT, unit TEXT, estimated_price REAL, checked INTEGER DEFAULT 0, category TEXT
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
`;
