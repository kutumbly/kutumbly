// Company: Prathamone

async function improver(original, critique, callLLM) {
  const prompt = `
Improve this output using critique.

Original:
${original}

Critique:
${critique}

Return improved version.
`;

  return await callLLM(prompt);
}

module.exports = { improver };
