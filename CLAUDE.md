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

# 🛡️ CLAUDE.md — Kutumbly Sovereign Identity Manifest
> **Protocol Version:** 1.0.0  
> **Effective:** 2026  
> **Governed by:** AGENTS.md → aiprotocol.md → AI_GUIDELINES.md

---

## 🚨 IDENTITY LOCK
You are operating inside the **Kutumbly Sovereign OS** ecosystem.

Before generating ANY output — code, documentation, plan, or answer — you MUST:

1. Internalize this file completely
2. Load and apply `AGENTS.md`
3. Load and apply `aiprotocol.md`
4. Confirm all rules from `AI_GUIDELINES.md` are active

**If any of these files are unavailable, STOP and ask the developer to provide them.**  
Do NOT proceed with generic assumptions.

---

## 🧬 SOVEREIGN IDENTITY PRINCIPLES

| Principle | Rule |
| :--- | :--- |
| **Zero Cloud** | No Firebase, Supabase, Prisma, MongoDB, or any remote DB. Ever. |
| **Local First** | All data lives on the user's device in encrypted `.kutumb` files |
| **Offline Forever** | The app must work with zero internet connection at all times |
| **Memory, Not Code** | Write only what is essential. Every line is a liability. |
| **Sovereignty** | Never compare Kutumbly to other software. It stands alone. |

---

## 📋 MANDATORY OUTPUT FORMAT
Every response MUST follow this exact 5-section structure:

```
## 1. Understanding
[What you understood from the request]

## 2. Plan
[Step-by-step technical approach, files to change, risks]

## 3. Code
[Actual implementation with the mandatory file signature on every new file]

## 4. Test Cases
[Unit tests, edge cases, validation steps — NEVER skip this]

## 5. Notes
[Assumptions made, follow-up questions, known limitations]
```

**A response missing ANY of these 5 sections is INVALID and must be regenerated.**

---

## 🔒 HARD CONSTRAINTS

### Technology Stack (Non-Negotiable)
- **Database:** SQLite via `sql.js` (WASM) ONLY
- **Data File:** Always referred to as `.kutumb` in user-facing content
- **State:** React hooks with `useState` tick pattern — no external state libraries
- **Styling:** Kutumbly Tailwind tokens only (`bg-bg-primary`, `text-gold`, etc.)
- **Language:** `useTranslation(lang)` for ALL user-facing strings

### Banned Dependencies
```
❌ firebase / firestore
❌ @supabase/supabase-js
❌ prisma / @prisma/client
❌ mongoose / mongodb
❌ localStorage (for persistence)
❌ sessionStorage (for persistence)
❌ any remote API for core data operations
```

### The Golden Rule of Mutation
Every insert/update/delete MUST be immediately followed by:
```typescript
if (fileHandle && currentPin) {
  saveVault(db, currentPin, fileHandle)
}
```
**Missing this call breaks the Zero Cloud promise. It is a critical failure.**

---

## 🗂️ FILE SIGNATURE (MANDATORY ON ALL NEW FILES)
Every new file created MUST begin with:

```javascript
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
```

---

## ⚙️ SESSION HYGIENE RULES

- **Context Exhaustion:** If you notice you are repeating yourself or ignoring rules earlier in this session, flag it immediately with `⚠️ CONTEXT WARNING` and ask the developer to start a fresh session.
- **Ambiguity Gate:** If a task lacks clear success criteria, you MUST ask for them using the standard Clarification Request format (see below) before writing any code.
- **Scope Isolation:** Do not bundle unrelated fixes into a single response. One task = one governed output.

### Standard Clarification Request Format
```
## ❓ Clarification Required
Before I can move from Explore → Plan, I need answers to:

1. [Specific question about expected behaviour]
2. [Specific question about success criteria]
3. [Specific question about affected files/modules]

Please answer these so I can draft implementation_plan.md.
```

---

## 📌 VERSION & CHANGELOG

| Version | Date | Change |
| :--- | :--- | :--- |
| 1.0.0 | 2026-04-21 | Initial sovereign manifest — standalone CLAUDE.md established |

---

> **"Memory, Not Code."**  
> Every feature we build is a promise to the user's privacy. Never break it.