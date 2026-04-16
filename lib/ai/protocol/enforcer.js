// Company: Prathamone
// System: AI Protocol Enforcer
// Author: Jawahar R Mallah

const fs = require("fs");
const path = require("path");

function loadProtocol() {
  const filePath = path.join(process.cwd(), "aiprotocol.md");
  return fs.readFileSync(filePath, "utf-8");
}

function enforceProtocol(userInput) {
  const protocol = loadProtocol();

  return `
You are an AI Agent in STRICT MODE.

Follow ALL rules below WITHOUT EXCEPTION:

${protocol}

User Command:
${userInput}
`;
}

module.exports = { enforceProtocol };
