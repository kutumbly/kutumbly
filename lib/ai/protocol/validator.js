// Company: Prathamone
// System: Strict Validator

function validate(output) {
  const required = ["Understanding", "Plan", "Code", "Test Cases"];

  for (let key of required) {
    if (!output.includes(key)) {
      throw new Error(`Protocol violation: Missing ${key}`);
    }
  }

  return true;
}

async function enforceWithRetry(prompt, callLLM, maxRetry = 3) {
  for (let i = 0; i < maxRetry; i++) {
    let output = await callLLM(prompt);

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
