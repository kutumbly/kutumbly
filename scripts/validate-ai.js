// Company: Prathamone

const fs = require("fs");

function validate(content) {
  const required = ["Understanding", "Plan", "Code", "Test Cases"];

  for (let key of required) {
    if (!content.includes(key)) {
      console.error(`❌ Missing: ${key}`);
      process.exit(1);
    }
  }

  console.log("✅ AI Output Valid");
}

const file = process.argv[2];

const content = fs.readFileSync(file, "utf-8");

validate(content);
