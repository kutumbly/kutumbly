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
CREATE TABLE IF NOT EXISTS investment_transactions (
  id TEXT PRIMARY KEY, investment_id TEXT NOT NULL,
  type TEXT, amount REAL, date TEXT, notes TEXT,
  created_at TEXT,
  FOREIGN KEY (investment_id) REFERENCES investments(id)
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
-- Learner profile — one per studying person (self or family member)
CREATE TABLE IF NOT EXISTS vidya_learners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,                   -- learner name (can match family_members.name)
  family_member_id TEXT,                -- optional FK to family_members.id
  institution TEXT,                     -- school / college / online platform name
  standard TEXT,                        -- "Class 10", "B.Tech 3rd Year", "Self-Study" etc.
  board TEXT,                           -- CBSE | ICSE | State Board | University | Self
  avatar_initials TEXT,
  goal TEXT,                            -- e.g. "JEE 2027", "UPSC 2028", "Class 10 95%+"
  goal_deadline TEXT,                   -- YYYY-MM-DD
  is_active INTEGER DEFAULT 1,
  created_at TEXT
);

-- Subject per learner
CREATE TABLE IF NOT EXISTS vidya_subjects (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  name TEXT NOT NULL,                   -- "Physics", "History", "React.js"
  category TEXT DEFAULT 'General',      -- "Science" | "Commerce" | "Arts" | "Tech" | "Language" | "General"
  color TEXT DEFAULT '#c9971c',         -- accent color for UI
  target_score TEXT,                    -- "90%", "Full Marks" etc.
  notes TEXT,
  created_at TEXT,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id)
);

-- Study resource — PDF / Article / YouTube / Website
CREATE TABLE IF NOT EXISTS vidya_resources (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  learner_id TEXT NOT NULL,             -- denormalized for fast query
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL,          -- 'youtube' | 'pdf' | 'article' | 'book' | 'website'
  url TEXT,                             -- for youtube/article/website
  thumbnail_url TEXT,                   -- YouTube thumbnail or article OG image
  description TEXT,
  chapter TEXT,                         -- e.g. "Chapter 5 — Newton's Laws"
  lesson TEXT,                          -- e.g. "Lesson 3 — Force and Motion"
  tags TEXT,                            -- comma-separated
  is_bookmarked INTEGER DEFAULT 0,
  is_completed INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'medium',     -- 'easy' | 'medium' | 'hard'
  duration_mins INTEGER,                -- video length or estimated read time
  created_at TEXT,
  FOREIGN KEY (subject_id) REFERENCES vidya_subjects(id)
);

-- Study session log
CREATE TABLE IF NOT EXISTS vidya_sessions (
  id TEXT PRIMARY KEY,
  learner_id TEXT NOT NULL,
  subject_id TEXT,
  resource_id TEXT,                     -- optional — which resource was studied
  date TEXT NOT NULL,                   -- YYYY-MM-DD
  duration_mins INTEGER NOT NULL,
  notes TEXT,
  mood TEXT DEFAULT 'neutral',          -- 'focused' | 'tired' | 'neutral' | 'distracted'
  created_at TEXT,
  FOREIGN KEY (learner_id) REFERENCES vidya_learners(id)
);
`;
