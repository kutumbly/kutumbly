const fs = require('fs');
let code = fs.readFileSync('lib/i18n.ts', 'utf8');

const target1 = `"NEVATA_WE_HOSTED": {
    en: "We Hosted", hi: "हमने किया", mr: "आम्ही केले", gu: "અમે કર્યું", pa: "ਅਸੀਂ ਕੀਤਾ",
    ta: "நாங்கள் ஏற்பாடு செய்தோம்", bho: "हमन के", kn: "ನಾವು ಮಾಡಿದ್ದೇವೆ", te: "మేము నిర్వహించాము",
    ne: "हामीले गर्यौं", bn: "আমরা আয়োজন করেছি", mni: "অমসুং তৌখিবা"
  },`;

const replace1 = `"NEVATA_WE_HOSTED": {
    en: "Our Nimantran", hi: "दिया निमंत्रण", mr: "आमचे निमंत्रण", gu: "આપેલું નિમંત્રણ", pa: "ਸਾਡਾ ਨਿਮੰਤ੍ਰਣ",
    ta: "நாங்கள் அனுப்பிய அழைப்பு", bho: "दीहल निमंत्रण", kn: "ನಮ್ಮ ಆಮಂತ್ರಣ", te: "మా ఆహ్వానం",
    ne: "हाम्रो निमन्त्रणा", bn: "আমাদের নিমন্ত্রণ", mni: "ঐখোয়গী নিমনত্রন"
  },`;

const target2 = `"NEVATA_THEY_HOSTED": {
    en: "They Hosted", hi: "उन्होंने किया", mr: "त्यांनी केले", gu: "તેઓએ કર્યું", pa: "ਉਨ੍ਹਾਂ ਨੇ ਕੀਤਾ",
    ta: "அவர்கள் ஏற்பாடு செய்தார்கள்", bho: "उनन के", kn: "ಅವರು ಮಾಡಿದ್ದಾರೆ", te: "వారు నిర్వహించారు",
    ne: "उनीहरूले गरे", bn: "তারা আয়োজন করেছে", mni: "মখোয়না তৌখিবা"
  },`;

const replace2 = `"NEVATA_THEY_HOSTED": {
    en: "Received Nimantran", hi: "प्राप्त निमंत्रण", mr: "प्राप्त निमंत्रण", gu: "મળેલ નિમંત્રણ", pa: "ਮਿਲਿਆ ਨਿਮੰਤ੍ਰਣ",
    ta: "பெற்ற அழைப்பு", bho: "आयल निमंत्रण", kn: "ಸ್ವೀಕರಿಸಿದ ಆಮಂತ್ರಣ", te: "అందుకున్న ఆహ్వానం",
    ne: "प्राप्त निमन्त्रणा", bn: "প্রাপ্ত নিমন্ত্রণ", mni: "ফংবা নিমনত্রন"
  },`;

code = code.replace(target1, replace1);
code = code.replace(target2, replace2);

fs.writeFileSync('lib/i18n.ts', code);
console.log('updated i18n');
