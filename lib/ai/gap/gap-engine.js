// Company: Prathamone
// System: GAP Engine

const { enforceProtocol } = require("../protocol/enforcer");
const { enforceWithRetry } = require("../protocol/validator");
const { runAnthropicLayer } = require("../anthropic/loop");

async function callLLM(prompt) {
  // 🔥 Replace with OpenAI / Claude / API
  // Returning dummy valid structure for testing
  return `Understanding\nPlan\nCode\nTest Cases\nLLM RESPONSE: ` + prompt.slice(0, 100);
}

async function runGAP(userInput) {
  const finalPrompt = enforceProtocol(userInput);

  // ❗ LLM Call WITH Validator & Retry Logic
  let output = await enforceWithRetry(finalPrompt, callLLM);

  // ⚡ Anthropic Critic & Improver Loop (with final validation)
  output = await runAnthropicLayer(output, callLLM);

  return output;
}

module.exports = { runGAP };
