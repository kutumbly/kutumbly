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
