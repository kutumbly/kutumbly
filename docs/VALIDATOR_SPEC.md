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

# 🛡️ Validator Spec — Kutumbly AI Quality Gate

> **Version:** 1.0.0  
> **Script:** `scripts/validate-ai.js`  
> **Authority:** This document is the single source of truth for what the validator checks and why.

---

## Purpose

Every AI-generated output in the Kutumbly project must pass through this validator before any code reaches production. The validator enforces the Sovereign Standard automatically, removing the need for humans to manually audit protocol compliance on every response.

---

## Usage

```bash
# Validate a Markdown AI output (standard)
node scripts/validate-ai.js ai-output.md

# Validate a Markdown AI output (strict — also checks section bodies)
node scripts/validate-ai.js ai-output.md --strict

# Validate a generated code file only (skips structure checks)
node scripts/validate-ai.js components/dashboard/StaffModule.tsx --code
```

**Exit codes:**
- `0` = PASS — meets Kutumbly Sovereign Standard, safe to proceed
- `1` = FAIL — violations found, AI must regenerate

---

## The 7 Validation Checks

### V1 — Structural Completeness
**Applies to:** Markdown AI output  
**Checks:** All 5 mandatory sections exist by heading

| Section | Regex Pattern |
| :--- | :--- |
| Understanding | `## 1. Understanding` or `## Understanding` |
| Plan | `## 2. Plan` or `## Plan` |
| Code | `## 3. Code` or `## Code` |
| Test Cases | `## 4. Test Cases` or `## Test Cases` |
| Notes | `## 5. Notes` or `## Notes` |

**Failure condition:** Any section heading is absent from the file.  
**Why it matters:** An AI that skips Test Cases has not thought through edge cases. An AI that skips Plan has not thought through the approach. Both are dangerous.

---

### V2 — Sovereignty Compliance
**Applies to:** All files  
**Checks:** No banned cloud/external dependencies are imported or referenced

**Banned list:**
```
firebase, firestore, @supabase/supabase-js, supabase,
prisma, @prisma/client, mongoose, mongodb
```

**Failure condition:** Any `import`, `require`, `from`, or `install` reference to a banned package.  
**Why it matters:** A single rogue dependency silently breaks the Zero Cloud promise and introduces a vendor lock-in that is expensive to reverse.

---

### V3 — Storage API Compliance
**Applies to:** All files  
**Checks:** No browser persistence APIs used

**Banned APIs:** `localStorage`, `sessionStorage`, `indexedDB`

**Failure condition:** Any string match of the banned API names.  
**Why it matters:** These APIs store data outside the encrypted `.kutumb` vault, creating an unencrypted shadow copy of user data — a critical privacy violation.

---

### V4 — Golden Rule (saveVault after every mutation)
**Applies to:** Code files with DB operations  
**Checks:** Every `INSERT`, `UPDATE`, or `DELETE` SQL operation is followed by `saveVault()` within 10 lines

**Failure condition:** A mutation is found without a subsequent `saveVault(` call nearby.  
**Why it matters:** This is the single most critical runtime rule. Without it, data changes exist only in memory and are lost on app close — silently destroying user data.

---

### V5 — File Signature
**Applies to:** All new files  
**Checks:** The mandatory Kutumbly sovereign header is present

**Required fragments:**
- `KUTUMBLY SOVEREIGN OS`
- `Jawahar R. M.`
- `Memory, Not Code.`

**Failure condition:** Any fragment is absent.  
**Why it matters:** The signature is both legal copyright notice and cultural identity marker. It ensures every file is permanently traceable to the Kutumbly ecosystem regardless of where it ends up.

---

### V6 — Terminology Compliance
**Applies to:** All files  
**Checks (hard fail):** Raw SQLite filenames like `database.sqlite`, `data.db`  
**Checks (warning):** Competitor name mentions (TallyPrime, Notion, Obsidian)

**Failure condition:** Raw `.sqlite` or `.db` filename used in user-facing content.  
**Why it matters:** The `.kutumb` file extension is a product identity decision. Inconsistent naming in code, docs, or logs creates user confusion and weakens the brand.

---

### V7 — Section Body Completeness *(Strict Mode Only)*
**Applies to:** Markdown AI output when `--strict` flag is passed  
**Checks:** Each required section contains at least 30 characters of meaningful content

**Failure condition:** A section heading exists but the body is empty or trivially short.  
**Why it matters:** An AI can satisfy V1 by writing headings with no content. Strict mode catches this lazy compliance.

---

## Integration Points

### Pre-commit Hook (recommended)
Add to `.husky/pre-commit` or `.git/hooks/pre-commit`:

```bash
#!/bin/sh
# Validate any staged AI output files
for file in $(git diff --cached --name-only | grep '\.md$'); do
  node scripts/validate-ai.js "$file" --strict
  if [ $? -ne 0 ]; then
    echo "❌ AI output $file failed sovereignty validation. Commit aborted."
    exit 1
  fi
done
```

### CI/CD Pipeline (GitHub Actions example)
```yaml
- name: Validate AI Outputs
  run: |
    for f in docs/ai-outputs/*.md; do
      node scripts/validate-ai.js "$f" --strict
    done
```

### Manual Usage (daily workflow)
```bash
# After receiving AI output, save to file and validate:
node scripts/validate-ai.js output.md

# If REJECTED, paste the error summary back to the AI agent:
# "Your response failed V4 (Golden Rule) and V2 (Sovereignty).
#  Regenerate following aiprotocol.md."
```

---

## Adding New Checks

To add a new validation rule:

1. Create a function `validateXxx(content)` in `validate-ai.js` that returns `true` (pass) or `false` (fail)
2. Add it to the `results.push(...)` array in `main()`
3. Document it here in this spec with: Applies to, Checks, Failure condition, Why it matters
4. Bump the version number in both files

---

## Changelog

| Version | Date | Change |
| :--- | :--- | :--- |
| 1.0.0 | 2026-04-21 | Initial spec — 7 checks defined |