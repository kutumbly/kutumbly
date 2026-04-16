# 🚨 AI AGENT RULES (STRICT MODE)

You are working inside Kutumbly AI System.

## 🔒 MANDATORY RULE:
You MUST follow `aiprotocol.md` WITHOUT EXCEPTION.

## ❗ BEFORE ANY RESPONSE:
1. Read aiprotocol.md
2. Apply ALL rules
3. Structure output strictly

## ❌ IF YOU FAIL:
- Your response is INVALID
- You MUST regenerate

## OUTPUT FORMAT (MANDATORY):
1. Understanding
2. Plan
3. Code
4. Test Cases
5. Notes

## ⚠️ STRICT WARNING:
Do NOT:
- Give direct answers
- Skip test cases
- Skip validation

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Mandatory File Signature
Every NEW file created by the agent MUST start with the following official signature block:

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
## Terminology & Branding Protocol
* **Database File:** Internally, the database is SQLite. However, for any external-facing content, documentation, or user communication (unless strictly discussing internal technical implementation details), the database file MUST be referred to as a **`.kutumb`** file. Example: "Kutumbly data is saved as an encrypted `.kutumb` file."
* **Standalone Identity:** Kutumbly is a unique, sovereign product. Never mention or compare it to external software or inspirations (e.g., TallyPrime, Notion, etc.) in documentation, project overviews, or branding. Focus strictly on Kutumbly's own ecosystem and merits.

## ⚡ CORE AGENT DIRECTIVES FOR ANY KUTUMBLY MODULE
Even if you (the Agent) are constrained by limited context, YOU MUST strictly follow this architecture for every single module (e.g., Staff, Nevata, Money, Vidya):

### 1. Database Operations (SQLite via `sql.js` ONLY)
- **NO EXTERNAL DATABASES:** Never import Prisma, Supabase, Firebase, or Mongoose.
- **Single Source of Truth:** `lib/schema.ts` dictates the exact table shape.
- **The Golden Rule of Mutation:** Every single insert/update/delete operation MUST immediately be followed by `if (fileHandle && currentPin) { saveVault(db, currentPin, fileHandle) }`. Failure to trigger `saveVault` breaks the "Zero Cloud" offline promise.

### 2. State & Hook Management (`hooks/use*.ts`)
- **Isolation:** Every module gets its own dedicated hook (e.g., `useMoney()`, `useNevata()`).
- **Reactive Queries:** `sql.js` is not reactive. You MUST use a local `const [tick, setTick] = useState(0)` inside the hook.
  - Queries are cached: `useMemo(() => db.exec(...), [db, tick])`.
  - Mutations end with: `setTick(t => t + 1)` exactly like this to trigger UI re-renders.

### 3. UI/UX & Component Structure (`components/dashboard/*Module.tsx`)
- **Wrapper:** Every dashboard module MUST be wrapped in the `<ModuleShell>` component.
- **Design Tokens:** Strictly use Kutumbly-specific Tailwind tokens: `bg-bg-primary`, `text-text-tertiary`, `text-gold`, `border-border-light`. Do not hardcode HEX colors unless specified in `globals.css`.
- **Empty States:** Modules must elegantly handle empty data paths (array length 0). Display centered faded icons with `opacity-30` or `opacity-40` and tracking-widest uppercase helper text.
- **Language Localization:** Hardcoding English text is FORBIDDEN. Always use `const t = useTranslation(lang)`. Only fallback to literal strings if the translation key doesn't remotely exist.

<!-- END:nextjs-agent-rules -->
