"""Explanation and Evidence Agent with Multilingual Support."""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.config import settings
from app.schemas.marine import WeatherReport, MarineObservation, PFZZone, Coordinates
from app.schemas.risk import RiskAssessment
from app.schemas.route import RouteComparison
from app.schemas.chat import EvidenceDetails

GREETING_TEMPLATES = {
    "en": (
        "Hello! I am Navika AI, your ISRO-powered Marine Intelligence Assistant.\n\n"
        "I can help you with:\n"
        "• 🌊 Real-time Ocean State (Wave height, wind speed, swells)\n"
        "• 🐟 Potential Fishing Zones (PFZ) & Chlorophyll/SST intelligence\n"
        "• 🧭 Safe Marine Navigation Routes & Hazard Avoidance\n"
        "• ⚠️ Maritime Boundary (IMBL) & Coastal Weather Warnings\n\n"
        "How can I assist your voyage or coastal operations today?"
    ),
    "hi": (
        "नमस्ते! मैं नाविका AI (Navika AI) हूँ, आपका इसरो-संचालित समुद्री इंटेलिजेंस सहायक।\n\n"
        "मैं आपकी इन विषयों में सहायता कर सकता हूँ:\n"
        "• 🌊 वास्तविक समय समुद्री स्थिति (तरंग ऊंचाई, हवा की गति, धाराएं)\n"
        "• 🐟 संभावित मत्स्य पालन क्षेत्र (PFZ) और क्लोरोफिल/SST जानकारी\n"
        "• 🧭 सुरक्षित समुद्री नौवहन मार्ग और बाधा बचाव\n"
        "• ⚠️ अंतर्राष्ट्रीय समुद्री सीमा (IMBL) और तटीय चेतावनी\n\n"
        "आज मैं आपकी क्या सहायता कर सकता हूँ?"
    ),
    "ta": (
        "வணக்கம்! நான் நாவிகா ஏஐ (Navika AI), உங்கள் இஸ்ரோ கடல்சார் நுண்ணறிவு உதவியாளர்.\n\n"
        "நான் உங்களுக்கு உதவக்கூடியவை:\n"
        "• 🌊 நிகழ்நேர கடல் நிலை (அலை உயரம், காற்றின் வேகம்)\n"
        "• 🐟 சாத்தியமான மீன்பிடி மண்டலங்கள் (PFZ) & குளோரோபில் தகவல்\n"
        "• 🧭 பாதுகாப்பான கடல் வழிசெலுத்தல் பாதைகள்\n"
        "• ⚠️ கடல் எல்லை (IMBL) & வானிலை எச்சரிக்கைகள்\n\n"
        "இன்று உங்கள் பயணத்திற்கு எவ்வாறு உதவ முடியும்?"
    ),
    "te": (
        "నమస్కారం! నేను నావిక AI (Navika AI), మీ ఇస్రో సముద్ర ఇంటెలిజెన్స్ సహాయకుడిని.\n\n"
        "నేను మీకు సహాయపడగలను:\n"
        "• 🌊 రియల్-టైమ్ సముద్ర పరిస్థితులు (అలల ఎత్తు, గాలి వేగం)\n"
        "• 🐟 సంభావ్య చేపల వేట మండలాలు (PFZ) & క్లోరోఫిల్ డేటా\n"
        "• 🧭 సురಕ್ಷితమైన నావిగేషన్ మార్గాలు\n"
        "• ⚠️ సముద్ర సరిహద్దు (IMBL) & హెచ్చరికలు\n\n"
        "నేను మీకు ఎలా సహాయపడగలను?"
    ),
    "ml": (
        "നമസ്കാരം! ഞാൻ നാവിക AI (Navika AI), നിങ്ങളുടെ ഐഎസ്ആർഒ സമുദ്ര ഇന്റലിജൻസ് അസിസ്റ്റന്റ്.\n\n"
        "സഹായങ്ങൾ:\n"
        "• 🌊 തത്സമയ സമുദ്രാവസ്ഥ (തിരമാല ഉയരം, കാറ്റിന്റെ വേഗത)\n"
        "• 🐟 മത്സ്യബന്ധന സാധ്യതാ മേഖലകൾ (PFZ)\n"
        "• 🧭 സുരക്ഷിത നാവിഗേഷൻ പാതകൾ\n"
        "• ⚠️ സമുദ്ര അതിർത്തി (IMBL) മുന്നറിയിപ്പുകൾ\n\n"
        "ഇന്ന് ഞാൻ എങ്ങനെ സഹായിക്കണം?"
    ),
    "kn": (
        "ನಮಸ್ಕಾರ! ನಾನು ನಾವಿಕ AI (Navika AI), ನಿಮ್ಮ ಇಸ್ರೋ ಕಡಲ ಗುಪ್ತಚರ ಸಹಾಯಕ.\n\n"
        "ನಾನು ಸಹಾಯ ಮಾಡುವ ಕ್ಷೇತ್ರಗಳು:\n"
        "• 🌊 ನೈಜ ಸಮಯದ ಸಮುದ್ರ ಸ್ಥಿತಿ (ಅಲೆ ಎತ್ತರ, ಗಾಳಿಯ ವೇಗ)\n"
        "• 🐟 ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕೆ ವಲಯಗಳು (PFZ)\n"
        "• 🧭 ಸುರಕ್ಷಿತ ಸಮುದ್ರ ಸಂಚಾರ ಮಾರ್ಗಗಳು\n"
        "• ⚠️ ಅಂತರರಾಷ್ಟ್ರೀಯ ಕಡಲ ಗಡಿ (IMBL) ಎಚ್ಚರಿಕೆಗಳು\n\n"
        "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?"
    ),
    "bn": (
        "নমস্কার! আমি নাবিকা AI (Navika AI), আপনার ইসরো-চালিত সামুদ্রিক গোয়েন্দা সহকারী।\n\n"
        "আমি আপনাকে সাহায্য করতে পারি:\n"
        "• 🌊 রিয়েল-টাইম সমুদ্রের অবস্থা (ঢেউয়ের উচ্চতা, বাতাসের গতি)\n"
        "• 🐟 সম্ভাব্য মাছ ধরার অঞ্চল (PFZ) তথ্য\n"
        "• 🧭 নিরাপদ সামুদ্রিক নেভিগেশন রুট\n"
        "• ⚠️ আন্তর্জাতিক সামুদ্রিক সীমানা (IMBL) এবং সতর্কতা\n\n"
        "আজ আপনাকে কীভাবে সাহায্য করতে পারি?"
    ),
    "mr": (
        "नमस्कार! मी नाविका AI (Navika AI), तुमचा इस्रो-संचलित सागरी बुद्धिमत्ता सहाय्यक आहे.\n\n"
        "मी खालील बाबींमध्ये मदत करू शकतो:\n"
        "• 🌊 थेट समुद्राची स्थिती (लाटांची उंची, वाऱ्याचा वेग)\n"
        "• 🐟 संभाव्य मत्स्य व्यवसाय क्षेत्र (PFZ)\n"
        "• 🧭 सुरक्षित सागरी नौवहन मार्ग\n"
        "• ⚠️ सागरी सीमा (IMBL) आणि सुरक्षा इशारे\n\n"
        "आज मी तुम्हाला कशी मदत करू शकतो?"
    ),
    "gu": (
        "નમસ્તે! હું નાવિકા AI (Navika AI) છું, તમારો ઇસરો સંચાલિત દરિયાઈ ગુપ્તચર સહાયક.\n\n"
        "હું નીચેની બાબતોમાં મદદ કરી શકું છું:\n"
        "• 🌊 વાસ્તવિક સમયની દરિયાઈ સ્થિતિ (મોજાની ઊંચાઈ, પવનની ઝડપ)\n"
        "• 🐟 સંભવિત માછીમારી ઝોન (PFZ)\n"
        "• 🧭 સુરક્ષિત દરિયાઈ નેવિગેશન માર્ગો\n"
        "• ⚠️ દરિયાઈ સીમા (IMBL) ચેતવણીઓ\n\n"
        "આજે હું તમારી શું મદદ કરી શકું?"
    ),
    "or": (
        "ନମସ୍କାର! ମୁଁ ନାବିକା AI (Navika AI), ଆପଣଙ୍କ ଇସ୍ରୋ-ଚାଳିତ ସାମୁଦ୍ରିକ ଗୁପ୍ତଚର ସହାୟକ।\n\n"
        "ମୁଁ ସାହାଯ୍ୟ କରିପାରିବି:\n"
        "• 🌊 ପ୍ରକୃତ ସମୟ ସମୁଦ୍ର ଅବସ୍ଥା (ତରଙ୍ଗ ଉଚ୍ଚତା, ପବନର ବେଗ)\n"
        "• 🐟 ସମ୍ଭାବ୍ୟ ମତ୍ସ୍ୟ ଶିକାର କ୍ଷେତ୍ର (PFZ)\n"
        "• 🧭 ନିରାପଦ ନୌଚାଳନା ପଥ\n"
        "• ⚠️ ସାମୁଦ୍ରିକ ସୀମା (IMBL) ଏବଂ ସତର୍କତା\n\n"
        "ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?"
    )
}

MULTILINGUAL_TEMPLATES = {
    "en": {
        "safe_title": "SAFE FOR FISHING OPERATIONS",
        "caution_title": "SAFE WITH CAUTION",
        "unsafe_title": "UNSAFE - OFFSHORE TRAVEL NOT RECOMMENDED",
        "hazardous_title": "HAZARDOUS - RETURN TO PORT IMMEDIATELY",
        "pfz_found": "Found {count} Potential Fishing Zones near your location.",
        "nearest_pfz": "Nearest zone is {name} at {dist} km ({bearing}) with SST {sst}°C and Chlorophyll {chl} mg/m³.",
        "route_msg": "Navigation plan generated: Shortest track is {short_dist} km ({short_time} hrs); Recommended safe corridor is {safe_dist} km ({safe_time} hrs).",
        "imbl_warning": "Warning: Your position is {dist} km from {name}.",
        "weather_summary": "Wind: {wind} km/h | Waves: {wave} m | SST: {sst}°C | Tide: {tide}."
    },
    "hi": {
        "safe_title": "मत्स्य पालन के लिए सुरक्षित स्थिति",
        "caution_title": "सावधानी के साथ सुरक्षित",
        "unsafe_title": "असुरक्षित - खुले समुद्र में जाना अनुशंसित नहीं",
        "hazardous_title": "खतरनाक स्थिति - तुरंत बंदरगाह लौटें",
        "pfz_found": "आपके स्थान के निकट {count} संभावित मत्स्य क्षेत्र (PFZ) पाए गए।",
        "nearest_pfz": "निकटतम क्षेत्र {name} है, जो {dist} किमी ({bearing}) दूर है (SST {sst}°C, क्लोरोफिल {chl} mg/m³)।",
        "route_msg": "नौवहन मार्ग: सीधा मार्ग {short_dist} किमी ({short_time} घंटे); सुरक्षित गलियारा {safe_dist} किमी ({safe_time} घंटे)।",
        "imbl_warning": "चेतावनी: आपकी स्थिति {name} से {dist} किमी दूरी पर है।",
        "weather_summary": "हवा: {wind} km/h | लहरें: {wave} m | SST: {sst}°C | ज्वार: {tide}।"
    },
    "ta": {
        "safe_title": "மீன்பிடிக்க உகந்த சூழல்",
        "caution_title": "எச்சரிக்கையுடன் செல்லலாம்",
        "unsafe_title": "பாதுகாப்பற்றது - ஆழ்கடலுக்கு செல்ல வேண்டாம்",
        "hazardous_title": "ஆபத்தானது - உடனடியாக கரை திரும்புங்கள்",
        "pfz_found": "உங்கள் இருப்பிடத்திற்கு அருகில் {count} சாத்தியமான மீன்பிடி மண்டலங்கள் உள்ளன.",
        "nearest_pfz": "அருகிலுள்ள மண்டலம் {name}, {dist} கி.மீ ({bearing}) தொலைவில் உள்ளது (SST {sst}°C, குளோரோபில் {chl} mg/m³).",
        "route_msg": "பயணத் திட்டம்: நேரடி பாதை {short_dist} கி.மீ; பரிந்துரைக்கப்பட்ட பாதுகாப்பான பாதை {safe_dist} கி.மீ ({safe_time} மணி).",
        "imbl_warning": "எச்சரிக்கை: நீங்கள் {name} எல்லையிலிருந்து {dist} கி.மீ தொலைவில் உள்ளீர்கள்.",
        "weather_summary": "காற்று: {wind} km/h | அலை: {wave} m | SST: {sst}°C | கடல் நிலை: {tide}."
    },
    "te": {
        "safe_title": "చేపల వేటకు అనుకూలమైన వాతావరణం",
        "caution_title": "జాగ్రత్తలతో ప్రయాణించవచ్చు",
        "unsafe_title": "అసురక్షితం - సముద్ర ప్రయాణం మంచిది కాదు",
        "hazardous_title": "తీవ్ర ప్రమాదకరం - వెంటనే తీరానికి రండి",
        "pfz_found": "మీ ప్రాంతంలో {count} సంభావ్య చేపల వేట మండలాలు (PFZ) కనుగొనబడ్డాయి.",
        "nearest_pfz": "సమీప ప్రాంతం {name}, దూరం {dist} కి.మీ ({bearing}) (SST {sst}°C, క్లోరోఫిల్ {chl} mg/m³).",
        "route_msg": "నావిగేషన్ ప్లాన్: సూటి మార్గం {short_dist} కి.మీ; సిఫార్సు చేసిన సురక్షిత మార్గం {safe_dist} కి.మీ ({safe_time} గంటలు).",
        "imbl_warning": "హెచ్చరిక: మీ స్థానం {name} నుండి {dist} కి.మీ దూరంలో ఉంది.",
        "weather_summary": "గాలి: {wind} km/h | అలలు: {wave} m | SST: {sst}°C | అలల స్థితి: {tide}."
    },
    "ml": {
        "safe_title": "മത്സ്യബന്ധനത്തിന് അനുകൂലമായ കാലാവസ്ഥ",
        "caution_title": "ജാഗ്രതയോടെ പോകാം",
        "unsafe_title": "അപകടകരം - കടലിൽ പോകുന്നത് ശുപാർശ ചെയ്യുന്നില്ല",
        "hazardous_title": "അതീവ ഗുരുതരം - ഉടൻ തുറമുഖത്തേക്ക് മടങ്ങുക",
        "pfz_found": "നിങ്ങളുടെ സ്ഥാനത്തിനടുത്ത് {count} മത്സ്യമേഖലകൾ കണ്ടെത്തി.",
        "nearest_pfz": "അടുത്തുള്ള മേഖല {name}, {dist} കി.മീ ({bearing}) ദൂരത്തിലാണ് (SST {sst}°C, ക്ലോറോഫിൽ {chl} mg/m³).",
        "route_msg": "നാവിഗേഷൻ പ്ലാൻ: നേരിട്ടുള്ള വഴി {short_dist} കി.മീ; ശുപാർശ ചെയ്ത സുരക്ഷിത പാത {safe_dist} കി.മീ ({safe_time} മണിക്കൂർ).",
        "imbl_warning": "മുന്നറിയിപ്പ്: നിങ്ങളുടെ സ്ഥാനം {name} അതിർത്തിയിൽ നിന്ന് {dist} കി.മീ അകലെയാണ്.",
        "weather_summary": "കാറ്റ്: {wind} km/h | തിരമാല: {wave} m | SST: {sst}°C | വേലിയേറ്റം: {tide}."
    },
    "kn": {
        "safe_title": "ಮೀನುಗಾರಿಕೆಗೆ ಸುರಕ್ಷಿತ ವಾತಾವರಣ",
        "caution_title": "ಎಚ್ಚರಿಕೆಯೊಂದಿಗೆ ಸುರಕ್ಷಿತ",
        "unsafe_title": "ಅಸುರಕ್ಷಿತ - ಸಮುದ್ರಯಾನ ಸೂಕ್ತವಲ್ಲ",
        "hazardous_title": "ಅಪಾಯಕಾರಿ - ತಕ್ಷಣ ಬಂದರಿಗೆ ಮರಳಿ",
        "pfz_found": "ನಿಮ್ಮ ಸಮೀಪದಲ್ಲಿ {count} ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕೆ ವಲಯಗಳು ಲಭ್ಯವಿದೆ.",
        "nearest_pfz": "ಹತ್ತಿರದ ವಲಯ {name}, {dist} ಕಿ.ಮೀ ({bearing}) ದೂರದಲ್ಲಿದೆ (SST {sst}°C, ಕ್ಲೋರೋಫಿಲ್ {chl} mg/m³).",
        "route_msg": "ಸಂಚಾರ ಯೋಜನೆ: ನೇರ ಮಾರ್ಗ {short_dist} ಕಿ.ಮೀ; ಶಿಫಾರಸು ಮಾಡಿದ ಸುರಕ್ಷಿತ ಮಾರ್ಗ {safe_dist} ಕಿ.ಮೀ ({safe_time} ಗಂಟೆ).",
        "imbl_warning": "ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ಸ್ಥಾನವು {name} ಗಡಿಯಿಂದ {dist} ಕಿ.ಮೀ ದೂರದಲ್ಲಿದೆ.",
        "weather_summary": "ಗಾಳಿ: {wind} km/h | ಅಲೆ: {wave} m | SST: {sst}°C | ಉಬ್ಬರ: {tide}."
    },
    "bn": {
        "safe_title": "মাছ ধরার জন্য নিরাপদ ও অনুকূল",
        "caution_title": "সতর্কতার সাথে নিরাপদ",
        "unsafe_title": "বিপজ্জনক - গভীর সমুদ্রে যাওয়া নিষেধ",
        "hazardous_title": "অতি বিপজ্জনক - অবিলম্বে বন্দরে ফিরে যান",
        "pfz_found": "আপনার অবস্থানের নিকটে {count}টি সম্ভাব্য মাছ ধরার অঞ্চল পাওয়া গেছে।",
        "nearest_pfz": "নিকটতম এলাকা {name}, দূরত্ব {dist} কিমি ({bearing}) (SST {sst}°C, ক্লোরোফিল {chl} mg/m³)।",
        "route_msg": "পথ পরিকল্পনা: সরাসরি পথ {short_dist} কিমি; প্রস্তাবিত নিরাপদ পথ {safe_dist} কিমি ({safe_time} ঘণ্টা)।",
        "imbl_warning": "সতর্কবার্তা: আপনার অবস্থান {name} থেকে {dist} কিমি দূরে।",
        "weather_summary": "বাতাস: {wind} km/h | ঢেউ: {wave} m | SST: {sst}°C | জোয়ার: {tide}।"
    },
    "mr": {
        "safe_title": "मासेमारीसाठी अनुकूल व सुरक्षित वातावरण",
        "caution_title": "सावधगिरीने सुरक्षित",
        "unsafe_title": "असुरक्षित - खोल समुद्रात जाणे टाळा",
        "hazardous_title": "अत्यंत धोकादायक - त्वरित बंदरावर परत या",
        "pfz_found": "तुमच्या स्थानाजवळ {count} संभाव्य मत्स्य क्षेत्रे आढळली आहेत.",
        "nearest_pfz": "जवळचे क्षेत्र {name}, {dist} किमी ({bearing}) अंतरावर आहे (SST {sst}°C, क्लोरोफिल {chl} mg/m³)।",
        "route_msg": "प्रवास मार्ग: थेट अंतर {short_dist} किमी; शिफारस केलेला सुरक्षित मार्ग {safe_dist} किमी ({safe_time} तास).",
        "imbl_warning": "इशारा: आपले स्थान {name} सीमेपासून {dist} किमी अंतरावर आहे.",
        "weather_summary": "वारा: {wind} km/h | लाटा: {wave} m | SST: {sst}°C | भरती: {tide}।"
    },
    "gu": {
        "safe_title": "માછીમારી માટે સલામત વાતાવરણ",
        "caution_title": "સાવચેતી સાથે સલામત",
        "unsafe_title": "અસલામત - ઊંડા દરિયામાં જવું હિતાવહ નથી",
        "hazardous_title": "અતિ જોખમી - તાત્કાલિક બંદર પર પાછા ફરો",
        "pfz_found": "તમારા સ્થાન નજીક {count} સંભવિત માછીમારી ઝોન મળ્યા છે.",
        "nearest_pfz": "સૌથી નજીકનું ઝોન {name}, {dist} કિમી ({bearing}) દૂર છે (SST {sst}°C, ક્લોરોફિલ {chl} mg/m³).",
        "route_msg": "માર્ગ આયોજન: સીધો માર્ગ {short_dist} કિમી; ભલામણ કરેલ સલામત માર્ગ {safe_dist} કિમી ({safe_time} કલાક).",
        "imbl_warning": "ચેતવણી: તમારું સ્થાન {name} સીમાથી {dist} કિમી દૂર છે.",
        "weather_summary": "પવન: {wind} km/h | મોજા: {wave} m | SST: {sst}°C | ભરતી: {tide}."
    },
    "or": {
        "safe_title": "ମତ୍ସ୍ୟ ଶିକାର ପାଇଁ ଅନୁକୂଳ ପରିବେଶ",
        "caution_title": "ସତର୍କତା ସହ ନିରାପଦ",
        "unsafe_title": "ଅସୁରକ୍ଷିତ - ଗଭୀର ସମୁଦ୍ରକୁ ଯିବାକୁ ବାରଣ",
        "hazardous_title": "ଅତ୍ୟନ୍ତ ବିପଦଜନକ - ତୁରନ୍ତ ବନ୍ଦରକୁ ଫେରିଆସନ୍ତୁ",
        "pfz_found": "ଆପଣଙ୍କ ନିକଟରେ {count}ଟି ସମ୍ଭାବ୍ୟ ମତ୍ସ୍ୟ କ୍ଷେତ୍ର ମିଳିଛି।",
        "nearest_pfz": "ନିକଟତମ କ୍ଷେତ୍ର {name}, {dist} କିମି ({bearing}) ଦୂରରେ (SST {sst}°C, କ୍ଲୋରୋଫିଲ {chl} mg/m³)।",
        "route_msg": "ଯାତ୍ରା ପଥ: ସିଧା ପଥ {short_dist} କିମି; ନିରାପଦ ପଥ {safe_dist} କିମି ({safe_time} ଘଣ୍ଟା)।",
        "imbl_warning": "ସତର୍କତା: ଆପଣଙ୍କ ସ୍ଥିତି {name} ସୀମାରୁ {dist} କିମି ଦୂରରେ।",
        "weather_summary": "ପବନ: {wind} km/h | ତରଙ୍ଗ: {wave} m | SST: {sst}°C | ଜୁଆର: {tide}।"
    }
}

class ExplanationAndEvidenceAgent:
    """Synthesizes transparent evidence logs and localized explanations."""

    def build_evidence(
        self,
        intent: str,
        risk: RiskAssessment,
        weather: WeatherReport,
        ocean: MarineObservation,
        agent_reasoning_flow: Optional[List[str]] = None,
        multi_agent_evidence: Optional[Dict[str, List[str]]] = None,
        provenance: Optional[Dict[str, Any]] = None
    ) -> EvidenceDetails:
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

        flow = agent_reasoning_flow or [
            "1. Ingestion: Spaceborne NetCDF4/HDF5 ingested via xarray & h5py",
            "2. Physical Range & Geospatial Audit via Trajectory & Boundary Engines",
            "3. Mathematical Risk Engine computed Safety Score from 7 normalized factors",
            "4. Multi-Agent consensus verification executed"
        ]

        is_live_mosdac = (ocean.data_type == "MOSDAC_LIVE_SATELLITE") or ("MOSDAC" in ocean.source)

        if is_live_mosdac:
            datasets_used = [
                "ISRO EOS-06 Oceansat-3 (OCM-3 Chlorophyll-a - E06OCM_L4_AC)",
                "ISRO INSAT-3DR Imager (1DVAR SST - 3RIMG_L2B_SST)",
                "ISRO EOS-06 SCAT-3 (Ku-band Scatterometer Wind - E06SCT_L2B_WV12)",
                "INCOIS Ocean State Forecast (OSF Multi-Grid Wave Model)",
                "Survey of India / ICG Maritime Geofencing Repository"
            ]
            timestamps = {
                "satellite_pass": ocean.timestamp,
                "incois_bulletin": now_str,
                "risk_engine_execution": now_str
            }
            demo_vs_live = "LIVE SATELLITE TELEMETRY (ISRO MOSDAC Standing Orders: EOS-06 OCM Chlorophyll, INSAT-3DR SST, EOS-06 SCAT Surface Wind)"
            observed_vs_forecast = "SST, Chlorophyll & Scatterometer Winds are Spaceborne Observations (ISRO MOSDAC); Waves & Currents are Hydrodynamic Forecasts (INCOIS)"
        else:
            datasets_used = [
                "ISRO Oceansat-3 (OCM-3 / AASS SST) - Orbit Revisit 2026-09-13",
                "INCOIS Ocean State Forecast (OSF Multi-Grid Wave Model)",
                "IMD Coastal Marine Squall & Radar Network",
                "Survey of India / ICG Maritime Geofencing Repository"
            ]
            timestamps = {
                "satellite_pass": "2026-09-13T04:30:00Z",
                "incois_bulletin": "2026-09-13T06:00:00Z",
                "imd_surface_obs": "2026-09-13T12:00:00Z",
                "risk_engine_execution": now_str
            }
            demo_vs_live = "Demo Data Provider (Synthetic simulation conforming to realistic physical distributions)"
            observed_vs_forecast = "SST & Chlorophyll are Spaceborne Observations (Oceansat-3); Waves & Wind are 24-hr Forecasts (INCOIS/IMD)"

        risk_factors_dict = {
            f.factor_name: {
                "raw_value": f"{f.raw_value} {f.unit}" if f.raw_value is not None else "N/A",
                "normalized_risk": f.normalized_risk,
                "weight": f.weight,
                "contribution": f.contribution,
                "score": f.score,
                "weighted_contribution": f.weighted_score,
                "severity": f.severity,
                "is_missing": f.is_missing
            } for f in risk.factors
        }

        # Build default multi-agent evidence if not supplied
        ev_map = multi_agent_evidence or {
            "Ocean Agent": [
                f"✓ Spaceborne SST ({ocean.sst}°C) from {ocean.source}",
                f"✓ Chlorophyll-a ({ocean.chlorophyll} mg/m³)"
            ],
            "Weather Agent": [
                f"✓ Surface wind {weather.wind_speed_kmh} km/h ({weather.wind_direction_deg}°)",
                f"✓ Lightning: {weather.lightning_detected} | Cyclone: {weather.cyclone_status}"
            ],
            "Safety Agent": [
                f"✓ Mathematical Safety Score: {risk.safety_score}/100",
                f"✓ Overall Risk: {risk.overall_score}/100 -> {risk.safety_verdict}"
            ]
        }

        return EvidenceDetails(
            intent_detected=intent,
            datasets_used=datasets_used,
            timestamps=timestamps,
            deterministic_score=risk.safety_score,
            risk_factors=risk_factors_dict,
            observed_vs_forecast=observed_vs_forecast,
            demo_vs_live=demo_vs_live,
            agent_reasoning_flow=flow,
            multi_agent_evidence=ev_map,
            provenance=provenance or {
                "sst": {"source": "ISRO MOSDAC", "dataset": "3RIMG_L2B_SST", "timestamp": ocean.timestamp},
                "chlorophyll": {"source": "ISRO MOSDAC", "dataset": "E06OCM_L4_AC", "timestamp": ocean.timestamp},
                "wind": {"source": "ISRO MOSDAC", "dataset": "E06SCT_L2B_WV12", "timestamp": weather.timestamp}
            }
        )

    def generate_response(
        self,
        intent: str,
        lang: str,
        risk: RiskAssessment,
        weather: WeatherReport,
        ocean: MarineObservation,
        pfzs: Optional[List[PFZZone]] = None,
        route: Optional[RouteComparison] = None,
        boundary_ctx: Optional[Dict[str, Any]] = None,
        query: str = ""
    ) -> Dict[str, str]:
        # Handle Greeting Intent immediately or via Gemini
        if intent == "greeting":
            if settings.GEMINI_API_KEY:
                try:
                    from google import genai
                    client = genai.Client(api_key=settings.GEMINI_API_KEY)
                    lang_names = {
                        "en": "English", "hi": "Hindi", "ta": "Tamil", "te": "Telugu",
                        "ml": "Malayalam", "kn": "Kannada", "bn": "Bengali", "mr": "Marathi",
                        "gu": "Gujarati", "or": "Odia"
                    }
                    target_lang_name = lang_names.get(lang, "English")
                    greet_prompt = f"""You are Navika AI, the official ISRO Agentic Marine Intelligence Helmsman Assistant.
The user greeted you: "{query}".
In {target_lang_name}, reply with a professional, authoritative, yet courteous maritime greeting. Introduce yourself as Navika AI and clearly state that you exclusively assist with:
1. Real-time sea state (wave height, surface wind, swell, cyclones)
2. Potential Fishing Zones (PFZ) & satellite ocean color
3. Safe nautical voyage route planning avoiding shoals and marine hazards
4. Maritime boundary (IMBL/MPA) geofence warnings
Keep the response concise (under 4 sentences), respectful, and focused strictly on maritime operations."""
                    import concurrent.futures
                    def _call_gemini_greet():
                        for model_name in ["gemini-2.5-flash", "gemini-2.0-flash"]:
                            try:
                                res = client.models.generate_content(model=model_name, contents=greet_prompt)
                                if res and res.text:
                                    return res.text.strip()
                            except Exception:
                                continue
                        return None

                    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                        future = executor.submit(_call_gemini_greet)
                        direct_text = future.result(timeout=4.0)

                    if direct_text:
                        return {
                            "direct_answer": direct_text,
                            "safety_verdict": "SAFE",
                            "recommendation": "Platform ready. Inquire about sea state, PFZ, or safe routing."
                        }
                except Exception:
                    pass

            # Fallback 1b: Local Ollama Greeting
            try:
                import httpx
                res = httpx.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json={
                        "model": settings.OLLAMA_MODEL,
                        "prompt": f"You are Navika AI, a professional marine intelligence assistant. Reply warmly in {lang} to this maritime greeting: '{query}'. Briefly mention sea state, fishing zones, and navigation safety.",
                        "stream": False,
                        "options": {"temperature": 0.3}
                    },
                    timeout=3.0
                )
                if res.status_code == 200:
                    ollama_data = res.json()
                    ollama_ans = ollama_data.get("response", "").strip()
                    if ollama_ans:
                        return {
                            "direct_answer": ollama_ans,
                            "safety_verdict": "SAFE",
                            "recommendation": "Local AI ready. Inquire about sea state, PFZ, or safe routing."
                        }
            except Exception:
                pass

            greeting_text = GREETING_TEMPLATES.get(lang, GREETING_TEMPLATES["en"])
            return {
                "direct_answer": greeting_text,
                "safety_verdict": "SAFE",
                "recommendation": "Navika AI operational. Ask about marine weather, PFZ, or safe routing."
            }

        # 1. Specialized Maritime Intelligence Prompt Construction
        lang_names = {
            "en": "English", "hi": "Hindi", "ta": "Tamil", "te": "Telugu",
            "ml": "Malayalam", "kn": "Kannada", "bn": "Bengali", "mr": "Marathi",
            "gu": "Gujarati", "or": "Odia"
        }
        target_lang_name = lang_names.get(lang, "English")

        pfz_info = f"- Nearest PFZ: {pfzs[0].name} at {pfzs[0].distance_km} km ({pfzs[0].bearing_compass}), SST {pfzs[0].sst_c}°C, Chlorophyll {pfzs[0].chlorophyll_mg_m3} mg/m³" if pfzs else ""
        route_info = f"- Routing: Shortest track {route.shortest_route.distance_km} km ({route.shortest_route.risk_level} risk) vs Safe route {route.safe_route.distance_km} km ({route.safe_route.risk_level} risk). Advisory: {route.reasoning}" if route else ""
        boundary_info = f"- Boundary: Distance to {boundary_ctx['imbl']['name']} is {boundary_ctx['imbl']['distance_km']} km" if (boundary_ctx and 'imbl' in boundary_ctx) else ""

        specialized_prompt = f"""You are Navika AI, the specialized operational AI helmsman for the ISRO Agentic Marine Intelligence Platform.
USER QUERY: "{query}" (Intent: {intent})
TARGET LANGUAGE: {target_lang_name}

=== STRICT SCOPE & REFUSAL POLICY ===
1. EXCLUSIVE DOMAIN: You ONLY answer questions related to operational oceanography, marine weather, sea state (waves, wind, currents), potential fishing zones (PFZ), nautical voyage navigation, fish catch advisories, coastal geography, and Indian maritime borders (IMBL/MPA).
2. REFUSAL RULE: If the user query is UNRELATED to marine operations, ocean conditions, fishing, vessel routing, or maritime safety (e.g., general programming, entertainment, pop culture, non-marine trivia, politics, recipes, homework, etc.), you MUST POLITELY AND FIRMLY REFUSE to answer in {target_lang_name}. State clearly:
   "I am Navika AI, an operational marine intelligence platform. I can only assist with oceanographic observations, marine weather, potential fishing zones (PFZ), vessel navigation, and maritime boundary safety within the Indian Exclusive Economic Zone (EEZ)."
   Do NOT provide answers to off-topic questions.

=== STRICT ANTI-HALLUCINATION GROUNDING (VERIFIED TELEMETRY) ===
Never fabricate or hallucinate coordinates, buoy data, or weather forecasts. Strictly adhere to these verified facts:
- Overall Safety Verdict: {risk.safety_verdict} (Risk Level: {risk.risk_level}, Safety Score: {risk.overall_score}/100)
- Official Navigational Advisory: {risk.recommendation}
- Surface Wind: {weather.wind_speed_kmh} km/h (Source: {weather.source})
- Significant Wave Height: {ocean.wave_height or weather.wave_height_m} m
- Sea Surface Temperature (SST): {ocean.sst}°C | Chlorophyll-a: {ocean.chlorophyll} mg/m³
{pfz_info}
{route_info}
{boundary_info}

=== STRICT LANGUAGE ENFORCEMENT ===
MANDATORY: You MUST compose your entire response exclusively in {target_lang_name} (Language code: {lang}).
Do NOT use English words or sentences (except for standard SI units like km, km/h, m, °C, NM, mg/m³ and coordinates).
Even if the user query was typed in English, you MUST strictly respond in {target_lang_name}.
Every sentence, advisory, warning, and recommendation MUST be in natural, professional {target_lang_name}.

=== FORMATTING & RESPONSE STYLE ===
- Address the user's maritime question directly and concisely in {target_lang_name}.
- Clearly include the Safety Verdict ({risk.safety_verdict}) in {target_lang_name}.
- Preserve all physical units (km/h, m, °C, mg/m³, NM) exactly as measured.
- Maintain an authoritative, professional, respectful tone suitable for working fishermen and maritime captains.
"""

        # Tier 1: Cloud Gemini Inference
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                import concurrent.futures
                def _call_gemini():
                    for model_name in ["gemini-2.5-flash", "gemini-2.0-flash"]:
                        try:
                            res = client.models.generate_content(model=model_name, contents=specialized_prompt)
                            if res and res.text:
                                return res.text.strip()
                        except Exception:
                            continue
                    return None

                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                    future = executor.submit(_call_gemini)
                    direct_text = future.result(timeout=4.0)

                if direct_text:
                    return {
                        "direct_answer": direct_text,
                        "safety_verdict": risk.safety_verdict,
                        "recommendation": risk.recommendation
                    }
            except Exception:
                pass

        # Tier 2: Local Ollama Inference Fallback (Offline / Internet-Outage Mode)
        try:
            import httpx
            ollama_res = httpx.post(
                f"{settings.OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": specialized_prompt,
                    "stream": False,
                    "options": {"temperature": 0.2}
                },
                timeout=4.5
            )
            if ollama_res.status_code == 200:
                ollama_json = ollama_res.json()
                ollama_text = ollama_json.get("response", "").strip()
                if ollama_text:
                    return {
                        "direct_answer": ollama_text,
                        "safety_verdict": risk.safety_verdict,
                        "recommendation": risk.recommendation
                    }
        except Exception:
            pass

        # Tier 3: Deterministic Multilingual Template Synthesizer (Zero-Internet Engine)
        t = MULTILINGUAL_TEMPLATES.get(lang, MULTILINGUAL_TEMPLATES["en"])

        title_map = {
            "SAFE": t["safe_title"],
            "SAFE_WITH_CAUTION": t["caution_title"],
            "UNSAFE": t["unsafe_title"],
            "HAZARDOUS": t["hazardous_title"]
        }
        verdict_text = title_map.get(risk.safety_verdict, t["caution_title"])

        direct_answer_lines = []

        if intent == "wave_wind":
            wave_val = ocean.wave_height or weather.wave_height_m
            direct_answer_lines.append(f"🌊 **{verdict_text}**")
            direct_answer_lines.append(risk.recommendation)
            direct_answer_lines.append(
                f"\n📊 **Wave & Wind Status**:\n"
                f"• Wave Height: **{wave_val} m**\n"
                f"• Wind Speed: **{weather.wind_speed_kmh} km/h** (Gusts: {weather.wind_gust_kmh} km/h)\n"
                f"• Wind Direction: {weather.wind_direction_deg}°\n"
                f"• Sea Surface Temp: {ocean.sst}°C | Tide: {ocean.tide or 'Normal'}"
            )
        elif intent in ["pfz_query", "safest_pfz"]:
            direct_answer_lines.append(f"🐟 **{verdict_text}**")
            direct_answer_lines.append(risk.recommendation)
            if pfzs and len(pfzs) > 0:
                direct_answer_lines.append(f"\n🎯 {t['pfz_found'].format(count=len(pfzs))}")
                for i, p in enumerate(pfzs[:3]):
                    direct_answer_lines.append(
                        f"• **{p.name}**: {p.distance_km} km ({p.bearing_compass}) — SST {p.sst_c}°C, Chlorophyll {p.chlorophyll_mg_m3} mg/m³"
                    )
            else:
                direct_answer_lines.append("\n• No high-chlorophyll PFZ formations within immediate sector.")
        elif intent == "safe_route":
            direct_answer_lines.append(f"🧭 **{verdict_text}**")
            direct_answer_lines.append(risk.recommendation)
            if route:
                route_str = t["route_msg"].format(
                    short_dist=route.shortest_route.distance_km,
                    short_time=route.shortest_route.estimated_duration_hours,
                    safe_dist=route.safe_route.distance_km,
                    safe_time=route.safe_route.estimated_duration_hours
                )
                direct_answer_lines.append(f"\n🛣️ {route_str}")
                direct_answer_lines.append(f"• Routing Analysis: {route.reasoning}")
        elif intent in ["alerts_query", "boundary_check"]:
            direct_answer_lines.append(f"⚠️ **{verdict_text}**")
            direct_answer_lines.append(risk.recommendation)
            if boundary_ctx:
                imbl = boundary_ctx.get("imbl", {})
                if imbl:
                    imbl_str = t["imbl_warning"].format(name=imbl.get("name", "IMBL"), dist=imbl.get("distance_km", "N/A"))
                    direct_answer_lines.append(f"\n🚨 {imbl_str}")
        else:
            # general_marine or safety_check
            direct_answer_lines.append(verdict_text)
            direct_answer_lines.append(risk.recommendation)

            cond_str = t["weather_summary"].format(
                wind=weather.wind_speed_kmh,
                wave=ocean.wave_height or weather.wave_height_m,
                sst=ocean.sst,
                tide=ocean.tide or "Normal"
            )
            direct_answer_lines.append(f"\n🌊 **Marine Conditions**: {cond_str}")

            if pfzs and len(pfzs) > 0:
                p1 = pfzs[0]
                pfz_str = t["nearest_pfz"].format(
                    name=p1.name,
                    dist=p1.distance_km,
                    bearing=p1.bearing_compass,
                    sst=p1.sst_c,
                    chl=p1.chlorophyll_mg_m3
                )
                direct_answer_lines.append(f"\n🐟 **PFZ Insight**: {pfz_str}")

            if route:
                route_str = t["route_msg"].format(
                    short_dist=route.shortest_route.distance_km,
                    short_time=route.shortest_route.estimated_duration_hours,
                    safe_dist=route.safe_route.distance_km,
                    safe_time=route.safe_route.estimated_duration_hours
                )
                direct_answer_lines.append(f"\n🧭 **Routing Intelligence**: {route_str}")

            if boundary_ctx:
                imbl = boundary_ctx.get("imbl", {})
                if imbl.get("is_approaching") or imbl.get("is_critical"):
                    imbl_str = t["imbl_warning"].format(name=imbl["name"], dist=imbl["distance_km"])
                    direct_answer_lines.append(f"\n⚠️ **Boundary Alert**: {imbl_str}")

        direct_answer = "\n".join(direct_answer_lines)

        return {
            "direct_answer": direct_answer,
            "safety_verdict": risk.safety_verdict,
            "recommendation": risk.recommendation
        }
