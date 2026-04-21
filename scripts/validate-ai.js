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

/**
 * Kutumbly Sovereign Validator — v1.1.0
 *
 * Usage:
 *   node scripts/validate-ai.js <file>           # standard
 *   node scripts/validate-ai.js <file> --strict  # also checks section bodies
 *   node scripts/validate-ai.js <file> --code    # code-only checks (skips structure)
 *
 * Exit codes:
 *   0 = PASS
 *   1 = FAIL
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// V1 — Structural Completeness
// ---------------------------------------------------------------------------
function validateStructure(content) {
  const sections = [
    { name: "Understanding", pattern: /^##\s+(1\.\s+)?Understanding/m },
    { name: "Plan",          pattern: /^##\s+(2\.\s+)?Plan/m },
    { name: "Code",          pattern: /^##\s+(3\.\s+)?Code/m },
    { name: "Test Cases",    pattern: /^##\s+(4\.\s+)?Test Cases/m },
    { name: "Notes",         pattern: /^##\s+(5\.\s+)?Notes/m },
  ];
  const missing = sections.filter(s => !s.pattern.test(content)).map(s => s.name);
  return {
    pass: missing.length === 0,
    message: missing.length
      ? `V1 FAIL — Missing sections: ${missing.join(", ")}`
      : "V1 PASS — All 5 sections present",
  };
}

// ---------------------------------------------------------------------------
// V2 — Sovereignty Compliance (no banned cloud deps)
// ---------------------------------------------------------------------------
function validateSovereignty(content) {
  const banned = [
    "firebase", "firestore", "@supabase/supabase-js", "supabase",
    "prisma", "@prisma/client", "mongoose", "mongodb",
  ];
  const found = banned.filter(dep => {
    const re = new RegExp(`(import|require|from|install)\\s.*${dep.replace("/", "\\/")}`, "i");
    return re.test(content);
  });
  return {
    pass: found.length === 0,
    message: found.length
      ? `V2 FAIL — Banned cloud dependencies found: ${found.join(", ")}`
      : "V2 PASS — No banned cloud dependencies",
  };
}

// ---------------------------------------------------------------------------
// V3 — Storage API Compliance (no browser persistence outside .kutumb)
// ---------------------------------------------------------------------------
function validateStorageAPI(content) {
  const banned = ["localStorage", "sessionStorage", "indexedDB"];
  const found = banned.filter(api => content.includes(api));
  return {
    pass: found.length === 0,
    message: found.length
      ? `V3 FAIL — Banned storage APIs found: ${found.join(", ")}`
      : "V3 PASS — No banned storage APIs",
  };
}

// ---------------------------------------------------------------------------
// V4 — Golden Rule (saveVault / mutateVault after every mutation)
//
// Accepts EITHER pattern:
//   (a) Legacy: raw SQL mutation followed by saveVault() within 10 lines
//   (b) Preferred: mutateVault() call (structural guarantee — no proximity check needed)
//
// Files that exclusively use mutateVault() pass V4 automatically.
// Files with raw SQL mutations must have a saveVault() nearby OR use mutateVault().
// ---------------------------------------------------------------------------
function validateGoldenRule(content) {
  const lines = content.split("\n");
  const mutationPattern = /\b(INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM)\b/i;
  const saveVaultPattern = /saveVault\s*\(/;
  const mutateVaultPattern = /mutateVault\s*\(/;

  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    if (mutationPattern.test(lines[i])) {
      // Check: is this line already inside a mutateVault call? (same line or within 3 lines above)
      const contextAbove = lines.slice(Math.max(0, i - 3), i + 1).join("\n");
      if (mutateVaultPattern.test(contextAbove)) {
        continue; // Covered by mutateVault — pass
      }

      // Check: is there a saveVault or mutateVault within 10 lines below?
      const window = lines.slice(i, Math.min(lines.length, i + 11)).join("\n");
      if (saveVaultPattern.test(window) || mutateVaultPattern.test(window)) {
        continue; // Legacy saveVault pattern — pass
      }

      violations.push(`Line ${i + 1}: "${lines[i].trim()}"`);
    }
  }

  if (violations.length === 0) {
    return { pass: true, message: "V4 PASS — All mutations covered by saveVault/mutateVault" };
  }

  return {
    pass: false,
    message:
      `V4 FAIL — ${violations.length} mutation(s) not followed by saveVault/mutateVault:\n` +
      violations.map(v => `    ${v}`).join("\n") +
      "\n  TIP: Refactor raw SQL mutations to use mutateVault() from lib/vault.ts for automatic compliance.",
  };
}

// ---------------------------------------------------------------------------
// V5 — File Signature
// ---------------------------------------------------------------------------
function validateSignature(content) {
  const required = [
    "KUTUMBLY SOVEREIGN OS",
    "Jawahar R. M.",
    "Memory, Not Code.",
  ];
  const missing = required.filter(fragment => !content.includes(fragment));
  return {
    pass: missing.length === 0,
    message: missing.length
      ? `V5 FAIL — Sovereign signature missing fragments: ${missing.map(f => `"${f}"`).join(", ")}`
      : "V5 PASS — Sovereign file signature present",
  };
}

// ---------------------------------------------------------------------------
// V6 — Terminology Compliance
// ---------------------------------------------------------------------------
function validateTerminology(content) {
  const hardFail = [/database\.sqlite/i, /data\.db/i];
  const warnings = ["TallyPrime", "Notion", "Obsidian"];

  const fails = hardFail.filter(re => re.test(content)).map(re => re.source);
  const warns = warnings.filter(w => content.includes(w));

  const messages = [];
  if (fails.length) messages.push(`V6 FAIL — Raw SQLite filename(s) found: ${fails.join(", ")} — use .kutumb extension`);
  if (warns.length) messages.push(`V6 WARN — Competitor name(s) mentioned: ${warns.join(", ")}`);

  return {
    pass: fails.length === 0,
    message: messages.length ? messages.join("\n  ") : "V6 PASS — Terminology is compliant",
  };
}

// ---------------------------------------------------------------------------
// V7 — Section Body Completeness (--strict only)
// ---------------------------------------------------------------------------
function validateSectionBodies(content) {
  const sectionPattern = /^##\s+(?:\d+\.\s+)?(Understanding|Plan|Code|Test Cases|Notes)/gm;
  const shallow = [];
  let match;

  while ((match = sectionPattern.exec(content)) !== null) {
    const name = match[1];
    const bodyStart = match.index + match[0].length;
    const nextHeading = content.indexOf("\n## ", bodyStart);
    const body = (nextHeading === -1 ? content.slice(bodyStart) : content.slice(bodyStart, nextHeading)).trim();
    if (body.length < 30) shallow.push(name);
  }

  return {
    pass: shallow.length === 0,
    message: shallow.length
      ? `V7 FAIL — Section(s) with insufficient body content (<30 chars): ${shallow.join(", ")}`
      : "V7 PASS — All sections have meaningful content",
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  const args = process.argv.slice(2);
  const filePath = args.find(a => !a.startsWith("--"));
  const isStrict = args.includes("--strict");
  const isCodeOnly = args.includes("--code");

  if (!filePath) {
    console.error("Usage: node scripts/validate-ai.js <file> [--strict] [--code]");
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(fullPath, "utf-8");
  const fileName = path.basename(fullPath);

  console.log(`\n🛡️  Kutumbly Sovereign Validator v1.1.0`);
  console.log(`   File : ${fileName}`);
  console.log(`   Mode : ${isCodeOnly ? "code-only" : isStrict ? "strict" : "standard"}`);
  console.log("─".repeat(56));

  const results = [];

  if (!isCodeOnly) results.push(validateStructure(content));
  results.push(validateSovereignty(content));
  results.push(validateStorageAPI(content));
  results.push(validateGoldenRule(content));
  results.push(validateSignature(content));
  results.push(validateTerminology(content));
  if (isStrict && !isCodeOnly) results.push(validateSectionBodies(content));

  let hasFail = false;
  for (const r of results) {
    const icon = r.pass ? "✅" : "❌";
    console.log(`${icon}  ${r.message}`);
    if (!r.pass) hasFail = true;
  }

  console.log("─".repeat(56));

  if (hasFail) {
    console.log("RESULT: REJECTED — Fix violations and regenerate.\n");
    process.exit(1);
  } else {
    console.log("RESULT: ACCEPTED — Meets Kutumbly Sovereign Standard.\n");
    process.exit(0);
  }
}

main();
