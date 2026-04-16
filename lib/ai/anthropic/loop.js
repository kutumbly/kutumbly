// Company: Prathamone

const { critic } = require("./critic");
const { improver } = require("./improver");
const { validate } = require("../protocol/validator");

async function runAnthropicLayer(output, callLLM, maxLoops = 2) {
  let current = output;

  for (let i = 0; i < maxLoops; i++) {
    const critique = await critic(current, callLLM);

    if (critique.includes("Score: 9") || critique.includes("Score: 10")) {
      try {
        validate(current);
        break; // Passed strict auth and validation
      } catch (e) {
        // Force retry because despite score, structure is missing
      }
    }

    current = await improver(current, critique, callLLM);
  }

  // ❗ Validate Again (FINAL CHECK)
  validate(current);

  return current;
}

module.exports = { runAnthropicLayer };
