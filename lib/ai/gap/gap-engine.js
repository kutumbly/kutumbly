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

const { enforceProtocol } = require("../protocol/enforcer");
const { enforceWithRetry } = require("../protocol/validator");
const { runAnthropicLayer } = require("../anthropic/loop");

/**
 * LLM adapter — resolves to the configured provider at runtime.
 *
 * Set ONE of the following environment variables before running:
 *   KUTUMBLY_LLM=anthropic  →  uses ANTHROPIC_API_KEY
 *   KUTUMBLY_LLM=openai     →  uses OPENAI_API_KEY
 *
 * In development (no env vars set), a structure-compliant stub is returned
 * so the validator and critic/improver loop can be exercised without a live key.
 */
async function callLLM(prompt) {
  const provider = process.env.KUTUMBLY_LLM;

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("[GAP] ANTHROPIC_API_KEY is not set.");
    // TODO: wire Anthropic SDK call here
    throw new Error("[GAP] Anthropic adapter not yet implemented. Set KUTUMBLY_LLM=stub to use the dev stub.");
  }

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("[GAP] OPENAI_API_KEY is not set.");
    // TODO: wire OpenAI SDK call here
    throw new Error("[GAP] OpenAI adapter not yet implemented. Set KUTUMBLY_LLM=stub to use the dev stub.");
  }

  // Default: development stub — returns a structure-valid response for pipeline testing
  if (!provider || provider === "stub") {
    return (
      "## 1. Understanding\nStub understanding for: " + prompt.slice(0, 80) + "\n\n" +
      "## 2. Plan\nStub plan.\n\n" +
      "## 3. Code\n```js\n// stub\n```\n\n" +
      "## 4. Test Cases\nStub test cases.\n\n" +
      "## 5. Notes\nThis is a development stub. Set KUTUMBLY_LLM=anthropic or openai for production."
    );
  }

  throw new Error(`[GAP] Unknown KUTUMBLY_LLM provider: "${provider}". Valid values: anthropic, openai, stub.`);
}

async function runGAP(userInput) {
  const finalPrompt = enforceProtocol(userInput);

  // Validator + retry loop (structure compliance)
  let output = await enforceWithRetry(finalPrompt, callLLM);

  // Critic + improver loop (quality gate)
  output = await runAnthropicLayer(output, callLLM);

  return output;
}

module.exports = { runGAP, callLLM };
