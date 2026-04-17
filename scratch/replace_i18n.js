const fs = require('fs');
let content = fs.readFileSync('lib/i18n.ts', 'utf8');

content = content.replace(/"nav\.nevata":\s*\{[^}]+\},/g, '"nav.nevata": { en: "Utsav Hub", hi: "उत्सव हब", mr: "उत्सव हब", gu: "ઉત્સવ હબ", pa: "ਉਤਸਵ ਹਬ", ta: "உத்சவ் ஹப்", bho: "उत्सव हब", kn: "ಉತ್ಸವ್ ಹಬ್", te: "ఉత్సవ్ హబ్", ne: "उत्सव हब", bn: "উৎসব হাব", mni: "উত্সব হব" },');

content = content.replace(/"NAV_NEVATA":\s*\{[^}]+\},/g, '"NAV_NEVATA": { en: "Utsav Hub", hi: "उत्सव हब", mr: "Utsav Hub", gu: "Utsav Hub", pa: "Utsav Hub", ta: "Utsav Hub", bho: "उत्सव हब", kn: "Utsav Hub", te: "Utsav Hub", ne: "Utsav Hub", bn: "Utsav Hub", mni: "Utsav Hub" },');

content = content.replace(/"NEVATA":\s*\{[^}]+\},/g, '"NEVATA": { en: "Utsav Hub", hi: "उत्सव हब", mr: "Utsav Hub", gu: "Utsav Hub", pa: "Utsav Hub", ta: "Utsav Hub", bho: "उत्सव हब", kn: "Utsav Hub", te: "Utsav Hub", ne: "Utsav Hub", bn: "Utsav Hub", mni: "Utsav Hub" },');

fs.writeFileSync('lib/i18n.ts', content);
console.log("i18n.ts updated!");
