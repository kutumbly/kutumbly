const fs = require('fs');
let i18n = fs.readFileSync('lib/i18n.ts', 'utf8');

const changes = [
  ['"STUDY_BUDDY"', 'Vidya Hub', 'विद्या हब', 'विद्या हब'],
  ['"SMART_LEARNING"', 'Gurukul Framework', 'गुरुकुल', 'गुरुकुल'],
  ['"LEARNERS"', 'Vidyarthi', 'विद्यार्थी', 'विद्यार्थी'],
  ['"LEARNER_NAME"', 'Vidyarthi Name', 'विद्यार्थी का नाम', 'विद्यार्थी के नाम'],
  ['"ADD_LEARNER"', 'Add Vidyarthi', 'विद्यार्थी जोड़ें', 'विद्यार्थी जोड़ीं'],
  ['"NEW_LEARNER"', 'New Vidyarthi', 'नया विद्यार्थी', 'नया विद्यार्थी'],
  ['"LOG_SESSION"', 'Log Sadhana (Session)', 'साधना (सत्र) दर्ज करें', 'साधना लिखीं'],
  ['"ATTENDANCE"', 'Upasthiti', 'उपस्थिति', 'उपस्थिति']
];

changes.forEach(([k, en, hi, bho]) => {
  const regex = new RegExp(`(${k}:\\s*\\{[^}]+)\\}`);
  // Instead of a dangerous regex replace, I will just blindly replace the english and hindi translations in that specific line block.
  // The simplest is to replace the entire line for that key.
  const lineRegex = new RegExp(`${k}:\\s*\\{.*\\},`);
  const replLine = `${k}: { en: "${en}", hi: "${hi}", mr: "${en}", gu: "${en}", pa: "${en}", ta: "${en}", bho: "${bho}", kn: "${en}", te: "${en}", ne: "${hi}", bn: "${en}", mni: "${en}" },`;
  i18n = i18n.replace(lineRegex, replLine);
});

// One special key for nav.vidya if it exists
i18n = i18n.replace(/"nav\.vidya":\s*\{[^}]+\},/, '"nav.vidya": { en: "Vidya Hub", hi: "विद्या हब", mr: "विद्या हब", gu: "Vidya Hub", pa: "Vidya Hub", ta: "Vidya Hub", bho: "विद्या हब", kn: "Vidya Hub", te: "Vidya Hub", ne: "Vidya Hub", bn: "Vidya Hub", mni: "Vidya Hub" },');

fs.writeFileSync('lib/i18n.ts', i18n);
console.log("i18n.ts culturally injected!");

let vidya = fs.readFileSync('components/dashboard/VidyaModule.tsx', 'utf8');
vidya = vidya.replace(/Refine Learner Profile/g, "Refine Vidyarthi Profile");
vidya = vidya.replace(/DAY STREAK/g, "DAY TAPASYA");
vidya = vidya.replace(/Completion Signal/g, "Siddhi (Completion) Signal");
vidya = vidya.replace(/'Finished' : 'Mark Done'/g, "'Sampurna' : 'Mark Siddhi'");
vidya = vidya.replace(/Independent Study/g, "Swadhyaya (Independent Study)");
vidya = vidya.replace(/Specific Subject/g, "Specific Vishay");

fs.writeFileSync('components/dashboard/VidyaModule.tsx', vidya);
console.log("VidyaModule.tsx culturally injected!");
