# Kutumbly Sovereign OS — Architecture & Product Overview

> **"Memory, Not Code."**  
> *Zero Cloud · Local First · Encrypted · Offline Forever*

**Kutumbly** is an Enterprise-grade, Local-First Family Operating System. It is designed to act as an impenetrable digital vault for the modern family, managing everything from finances and health to social obligations (Nevata) and education (Vidya), without ever leaking personal data to centralized cloud servers.

---

## 1. Core Philosophy & Value Proposition
* **Zero Cloud:** The application runs entirely in the user's browser. Data never leaves the device unless explicitly exported or backed up by the user.
* **Local-First & OPFS:** Data is stored as an encrypted **`.kutumb`** file in the browser's Origin Private File System (OPFS), meaning the OS works offline forever with zero latency.
* **Sovereignty & Privacy:** Built on the belief that "Uncompromising privacy is a fundamental human right."
* **Bharat Focus:** Ships with built-in, culturally resonant support for 12 Indian languages including deep regional dialects like Bhojpuri.

---

## 2. Technical Stack
* **Framework:** Next.js (App Router), React, TypeScript.
* **Styling & UI:** Tailwind CSS, Framer Motion (for premium micro-animations), Lucide React (for iconography).
* **Database Layer:** `sqlocal` powering the proprietary `.kutumb` file format, running in isolation via WebAssembly (Wasm) inside Web Workers, persisting to OPFS.
* **State Management:** Zustand (`lib/store.ts`) for reactive, lightweight global state sharing.
* **Localization (i18n):** Custom-built hook and dictionary (`lib/i18n.ts`) for instant, client-side language switching without page reloads.
* **Backup/Sync:** Google Drive API integration (`lib/gdrive.ts`) for encrypted, user-controlled backups (Cloud Syncript Engine).

---

## 3. Product Modules (The Ecosystem)

Kutumbly is heavily modularized, mimicking a complete OS for managing a household:

### 🏠 1. Gateway & Setup (The Vault)
* Users create a highly encrypted digital vault locked with a secure PIN.
* Initial database seeding and schema execution happen instantly on the edge.
* Setup flow guides users seamlessly into their decentralized dashboard.

### 💰 2. Finance & Investments
* **Ledger:** Track daily income and expenses by category.
* **Yield (Investments):** Track Mutual Funds, Fixed Deposits, Gold (Physical & SGBs), and Equities. Keeps track of current value vs. principal.

### 💖 3. Social & Cultural (Nevata Engine)
A deeply specialized module for managing Indian weddings, functions, and social reciprocation.
* **Ledgers:** Track *Shagun* mapping (Diya/Mila - Given/Received).
* **Guest Lists & RSVP:** Log attendees from different sides (Ladke waale, Ladki waale).
* **Inventory & Vendors:** Caterers, decorators, item tracking (status from 'ORDERED' to 'USED').

### 📚 4. Education (Vidya / Study Buddy)
* Dedicated profiles for learners (kids or self-studying adults).
* Track Subjects, target scores, and link multi-media resources (YouTube, PDFs).
* Session logs to track study focus (duration, mood).

### ❤️ 5. Health & Wellness
* Track critical daily metrics: Blood Pressure, Pulse, Blood Sugar, Weight.
* Dedicated ledgers mapped to individual family members.

### 📙 6. Personal Diary & Tasks
* Secure, mood-tagged journaling.
* To-do lists with priority, assignment to specific family members, and due dates.

### 🧑‍🤝‍🧑 7. Staff & Household Management
* Track housekeeping, drivers, cooks.
* Salary ledgers featuring gross pay, advance tracking, deductions, and attendance logic.

### 🛒 8. Grocery & Inventory
* Dynamic *Kirana* lists sorted by category (Dairy, Veggies, Grains).

---

## 4. Enterprise-Grade Reporting & Drill-Down Mechanics (Tally-Style Navigation)

Kutumbly brings enterprise software behavior (inspired by systems like TallyPrime) to the family level. Users never look at flat lists; instead, they navigate data through hierarchical drill-down paradigms from the Dashboard all the way to atomic transactions.

### 📊 A. Finance & Accounting Drill-Down
* **Level 1 (Dashboard Summary):** High-level view of "Net Household Balance" or "Total Monthly Expense".
* **Level 2 (Group Summary):** Clicking on expenses reveals Category groups (e.g., *Grocery*, *Education*, *Transport*, *Housing*).
* **Level 3 (Ledger View):** Selecting *Education* shows the monthly ledger of education transactions.
* **Level 4 (Voucher Level):** Clicking an entry opens the exact transactional voucher (e.g., "School Books for Priya", ₹1200, Paid by: Sunita).

### 🎊 B. Nevata (Social Obligations) Drill-Down
* **Level 1 (Dashboard Status):** "Net Family Shagun Receivable / Payable". 
* **Level 2 (Pedigree Level):** Shows balance clustered by Family Lineage (e.g., *Verma Khaandaan* or *Agarwal Parivar*).
* **Level 3 (Event Level):** Clicking a lineage shows the mapped functions (e.g., *Rahul ki Shaadi* vs. *Chotu ka Mundan*).
* **Level 4 (Shagun Entry):** Clicking an event shows the specific *Shagun* envelope given or received (amount, gift description).

### 📖 C. Vidya (Education) Drill-Down
* **Level 1 (Goal Dashboard):** Holistic "Study Health" of a learner (e.g., Priya aiming for 90%).
* **Level 2 (Subject Health):** Drill down to see scores & momentum per subject (e.g., Science, Maths).
* **Level 3 (Resource Matrix):** View the exact syllabus chapters, attached NCERT PDFs, or YouTube playlists for that subject.
* **Level 4 (Session Log):** Open an individual study session (Date, Duration, Mood state like 'Focused' or 'Distracted').

### 🩺 D. Health Metrics Drill-Down
* **Level 1 (Family Alerts):** Latest critical alerts across the household (e.g., "Sunita's BP Elevated").
* **Level 2 (Member Dashboard):** A complete historic chart for a specific family member.
* **Level 3 (Metric Trend):** A 30-day view isolating just Systolic/Diastolic BP.
* **Level 4 (Reading Log):** The specific timestamped reading including contextual notes.

---

## 5. System Architecture & Project Structure

The codebase follows a modular feature-based architecture within the Next.js App Router paradigm:

```text
kutumbly/
├── app/                  # Next.js App Router (Pages & Layout)
│   ├── dashboard/        # The Modular OS Interface
│   ├── setup/            # Vault Initialization
│   └── founders/         # Vision / About Us
├── components/           # UI & Feature Components
│   ├── dashboard/        # Module Widgets (Finance, Health, Nevata, etc.)
│   ├── gateway/          # PIN input and DB Creation UI
│   └── shared/           # Reusable generic components
├── lib/                  # Core Business Logic & Infrastructure
│   ├── db/               # SQLite utilities and schema definitions
│   ├── i18n.ts           # 12-Language Dictionary
│   ├── store.ts          # Zustand Global State
│   ├── schema.ts         # Central DB schema configuration
│   ├── seed.ts           # Development seed data generators
│   └── gdrive.ts         # Personal Google Drive Sync Engine
└── public/               # Static assets & icons
```

---

## 6. Security & Data Integrity

1. **Client-Side Encryption:** No centralized database exists. The master database is stored locally.
2. **Volatile Memory:** By leveraging local OPFS, memory structures are cleared efficiently. 
3. **Cloud Syncript Engine:** If a user chooses to back up data, their `.kutumb` digital vault file is bundled and pushed directly to a private *Kutumbly_Sovereign_Backups* folder in their personal Google Drive. AITDL (The Creators) have zero access to this data.

---

## 7. Founders & Visionaries

* **Pushpa D (Head of Sales & Vision):** Brings profound operational, logistical, and financial understanding, driving Kutumbly from an ambitious concept into a sovereign reality.
* **Jawahar R. Mallah (Founder & System Architect):** With over 19 years of deep enterprise-grade engineering (architecting for Tally, Aditya Birla, Raymond), Jawahar engineered Kutumbly to be an impenetrable vault bridging elite technology with family software sovereignty.

---

> **For Collaborators & Reviewers:**  
> We maintain a strict focus on maximizing performance while minimizing external dependencies. Any future feature PRs or improvements should respect the architectural boundaries: Local First, Multi-lingual by Default, and Zero Cloud.
