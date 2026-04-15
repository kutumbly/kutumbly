
import sys
import re

file_path = r'd:\IMP\GitHub\kutumbly\lib\i18n.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

updates = {
    '"product.spec.no_server"': r'    en: "Zero Server Reliance", hi: "शून्य सर्वर निर्भरता", mr: "शून्य सर्व्हर अवलंबन", gu: "સર્વર વગરનું કાર્ય", pa: "ਸਰਵਰ ਦੀ ਕੋਈ ਲੋੜ ਨਹੀਂ", ta: "சர்வர் சார்பு பூஜ்ஜியம்", bho: "बिना सर्वर के", kn: "ಶೂನ್ಯ ಸರ್ವರ್ ಅವಲಂಬನೆ", te: "సర్వర్ అవసరం లేదు", ne: "शून्य सर्भर निर्भरता", bn: "শূন্য সার্ভার নির্ভরতা", mni: "সরভর তাদবা" },',
    '"product.cta.title"': r'  "product.cta.title": { en: "The Last OS You\'ll Ever Need", hi: "अंतिम ओएस जिसकी आपको आवश्यकता होगी", mr: "तुम्हाला गरज असलेला शेवटचा ओएस", gu: "તમારી છેલ્લી જરૂરિયાતનું ઓએસ", pa: "ਉਹ ਆਖ਼ਰੀ ਓਐਸ ਜਿਸਦੀ ਤੁਹਾਨੂੰ ਲੋੜ ਹੋਵੇਗੀ", ta: "உங்களுக்குத் தேவையான இறுதி ஓஎஸ்", bho: "आपन आखिरी ओएस जउना के जरूरत होई", kn: "ನಿಮಗೆ ಬೇಕಾದ ಕೊನೆಯ ಓಎಸ್", te: "మీకు అవసరమయ్యే చివరి OS", ne: "तपाईंलाई चाहिने अन्तिम ओएस", bn: "আপনার প্রয়োজনের শেষ ওএস", mni: "অরোইবা ওএস অমা" },',
    '"product.cta.quote"': r'  "product.cta.quote": { en: "Privacy is not negotiable.", hi: "गोपनीयता पर समझौता नहीं किया जा सकता।", mr: "गोपनीयतेशी तडजोड केली जाऊ शकत नाही.", gu: "ગોપનીયતા અટાપટી નથી.", pa: "ਪਰਦੇਦারি ਨਾਲ ਕੋਈ ਸਮਝੌਤਾ ਨਹੀਂ।", ta: "தனியுரிமையில் சமரசம் கிடையாது.", bho: "प्राइवेसी से कौनों समझौता नाही।", kn: "ಗೌಪ್ಯತೆಯೊಂದಿಗೆ ಯಾವುದೇ ਰਾಜಿ ಇಲ್ಲ.", te: "గోప్యతపై రాజీ లేదు.", ne: "गोपनीयता समझौतायोग्य छैन।", bn: "গোপনীয়তা নিয়ে কোনো আপোস করা যায় না।", mni: "প্রাইভেসি অমা লৈগদবনি।" },',
    '"product.cta.btn"': r'  "product.cta.btn": { en: "Initialize My Vault", hi: "मेरा वॉल्ट शुरू करें", mr: "माझे वॉल्ट सुरू करा", gu: "મારું વૉલ્ટ શરૂ કરો", pa: "ਮેਰਾ ਵਾਲਟ ਸ਼ੁਰੂ ਕਰੋ", ta: "எனது வால்ட்டைத் தொடங்குங்கள்", bho: "आपन तिजोरी चालू करीं", kn: "ನನ್ನ ವಾಲ್ಟ್ ಪ್ರಾರಂಭಿಸಿ", te: "నా వాల్ట్‌ను ప్రారంభించండి", ne: "मेरो भल्ट सुरु गर्नुहोस्", bn: "আমার ভল্ট শুরু করুন", mni: "ভোল্ট হৌহনবীয়ু" }'
}

new_lines = []
for line in lines:
    updated = False
    for key, val in updates.items():
        if key in line:
            match = re.match(r'^(\s*)', line)
            indent = match.group(1) if match else ""
            new_lines.append(indent + val + "\n")
            updated = True
            break
    if not updated:
        # Standardize other common issues if found (optional but good)
        # Replacing informal terms if any missed
        line = line.replace("नईखे", "नाही बा")
        line = line.replace("बानी", "हवे")
        line = line.replace("हऽ", "हवे")
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Updated successfully")
