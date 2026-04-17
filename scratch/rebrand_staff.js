const fs = require('fs');

// 1. Update i18n
let i18n = fs.readFileSync('lib/i18n.ts', 'utf8');
const i18nChanges = [
  ['"SUPPORT_STAFF"', 'Karmchari Hub', 'कर्मचारी हब', 'करमचारी हब'],
  ['"STAFF_ROSTER"', 'Karmchari Roster', 'कर्मचारी रोस्टर', 'करमचारी लिस्ट'],
  ['"ONBOARD_STAFF"', 'Add Karmchari', 'कर्मचारी जोड़ें', 'करमचारी जोड़ीं'],
  ['"MONTHLY_PAYOUT"', 'Masik Vetan', 'मासिक वेतन', 'महिना के वेतन'],
  ['"PAYMENT_HISTORY"', 'Vetan History', 'वेतन इतिहास', 'वेतन के इतिहास']
];

i18nChanges.forEach(([k, en, hi, bho]) => {
  const lineRegex = new RegExp(`${k}:\\s*\\{.*\\},`);
  const replLine = `${k}: { en: "${en}", hi: "${hi}", mr: "${en}", gu: "${en}", pa: "${en}", ta: "${en}", bho: "${bho}", kn: "${en}", te: "${en}", ne: "${hi}", bn: "${en}", mni: "${en}" },`;
  i18n = i18n.replace(lineRegex, replLine);
});

// Update the non-standard single-object keys at the bottom of i18n.ts
i18n = i18n.replace(/"NAV_STAFF":\s*\{[^}]+\},/, '"NAV_STAFF": { en: "Karmchari", hi: "कर्मचारी", mr: "Karmchari", gu: "Karmchari", pa: "Karmchari", ta: "Karmchari", bho: "करमचारी", kn: "Karmchari", te: "Karmchari", ne: "Karmchari", bn: "Karmchari", mni: "Karmchari" },');

fs.writeFileSync('lib/i18n.ts', i18n);
console.log("i18n.ts culturally injected for Staff!");

// 2. Update HomeStaffModule.tsx
let staff = fs.readFileSync('components/dashboard/HomeStaffModule.tsx', 'utf8');

const tsxChanges = [
  [/Managing household support/g, "Managing household Karmcharis"],
  [/Gross Salary/g, "Gross Vetan"],
  [/Unpaid Leave/g, "Bin-vetan (Unpaid) Leave"],
  [/Khata\/Advance Recovery/g, "Khata (Advance) Recovery"],
  [/NET PAYOUT/g, "NET VETAN"],
  [/\+ Process Pay/g, "+ Process Vetan"],
  [/\+ Mark Present/g, "+ Mark Upasthit"],
  [/Mark Absent Unpaid/g, "Mark Anupasthit (Unpaid)"],
  [/Advance Adj\./g, "Khata Adj."],
  [/Salary/g, "Vetan"],
  [/No staff/g, "No karmcharis"],
  [/Housemaid/g, "Ghar Sahayak (Maid)"],
  [/Cook/g, "Rasoiya (Cook)"],
  [/Gardener/g, "Mali (Gardener)"]
];

tsxChanges.forEach(([regex, repl]) => {
  staff = staff.replace(regex, repl);
});

fs.writeFileSync('components/dashboard/HomeStaffModule.tsx', staff);
console.log("HomeStaffModule.tsx culturally injected!");
