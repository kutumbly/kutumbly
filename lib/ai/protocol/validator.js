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

function validate(output) {
  const required = ["Understanding", "Plan", "Code", "Test Cases"];

  for (const key of required) {
    if (!output.includes(key)) {
      throw new Error(`Protocol violation: Missing ${key}`);
    }
  }

  return true;
}

async function enforceWithRetry(prompt, callLLM, maxRetry = 3) {
  for (let i = 0; i < maxRetry; i++) {
    const output = await callLLM(prompt);

    try {
      validate(output);
      return output;
    } catch (err) {
      prompt += `\nYour previous response violated protocol. Fix it strictly. Error: ${err.message}`;
    }
  }

  throw new Error("Agent failed to comply with protocol");
}

module.exports = { validate, enforceWithRetry };
