// Company: Prathamone

async function critic(output, callLLM) {
const prompt = `
You are a STRICT AI auditor.

Evaluate:
1. Protocol compliance (strict)
2. Code correctness
3. Missing edge cases
4. Security risks

Give score (0-10):
If <8 → MUST improve

Output format:
Score: X
Issues:
- ...
Fix:
- ...

Output:
${output}
`;

  return await callLLM(prompt);
}

module.exports = { critic };
