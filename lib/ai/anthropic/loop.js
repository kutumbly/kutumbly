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

/* eslint-disable @typescript-eslint/no-require-imports */

const { critic } = require("./critic");
const { improver } = require("./improver");
const { validate } = require("../protocol/validator");

// Matches "Score: 9", "Score: 9/10", "Score: 9.5", "Score:10" — robust against LLM formatting variance
const HIGH_SCORE_REGEX = /Score:\s*(?:9|10)\b/i;

async function runAnthropicLayer(output, callLLM, maxLoops = 2) {
  let current = output;

  for (let i = 0; i < maxLoops; i++) {
    const critique = await critic(current, callLLM);

    if (HIGH_SCORE_REGEX.test(critique)) {
      try {
        validate(current);
        break; // Passed critic score AND structure validation
      } catch (e) {
        // Score is high but structure is missing — force another improve pass
      }
    }

    current = await improver(current, critique, callLLM);
  }

  // Final hard gate — throws if structure is still non-compliant
  validate(current);

  return current;
}

module.exports = { runAnthropicLayer };
