// Multilingual localization engine for the 11-Agent Autonomous Orchestration DAG
// Supports English, Hindi, Malayalam, Tamil, Telugu, and Bengali

export interface LocalizedDAGNode {
  name: string;
  role: string;
  category: string;
  provider: string;
  sampleOutput: string;
}

export const DAG_LOCALIZATIONS: Record<string, Record<string, LocalizedDAGNode>> = {
  planner: {
    en: {
      name: 'Planner Agent',
      role: 'Autonomous Intent Classification & DAG Task Graph Decomposition',
      category: 'PLANNING',
      provider: 'Rule-Based Intent Classifier & Context Engine',
      sampleOutput: "Intent: 'pfz_safe_navigation', Dispatched: 10 Sub-Agents, Coordinates: 9.9312°N, 76.2673°E"
    },
    hi: {
      name: 'नियोजक एजेंट (Planner Agent)',
      role: 'स्वायत्त इरादा वर्गीकरण एवं डीएजी कार्य निष्पादन विभाजन',
      category: 'नियोजन',
      provider: 'नियम-आधारित इरादा क्लासिफायर एवं संदर्भ इंजन',
      sampleOutput: "इरादा: 'सुरक्षित पीएफजेड नेविगेशन', प्रेषित: 10 उप-एजेंट, निर्देशांक: 9.9312°N, 76.2673°E"
    },
    ml: {
      name: 'പ്ലാനർ ഏജന്റ് (Planner Agent)',
      role: 'സ്വയംഭരണ ലക്ഷ്യ നിർണ്ണയവും ടാസ്‌ക് ഗ്രാഫ് വിഭജനവും',
      category: 'ആസൂത്രണം',
      provider: 'ഇന്റന്റ് ക്ലാസിഫയർ & കോൺടെക്സ്റ്റ് എഞ്ചിൻ',
      sampleOutput: "ലക്ഷ്യം: 'സുരക്ഷിത പിഎഫ്‌സെഡ് യാത്ര', നിയോഗിച്ചത്: 10 ഉപ-ഏജന്റുകൾ, കോർഡിനേറ്റുകൾ: 9.9312°N, 76.2673°E"
    },
    ta: {
      name: 'திட்டமிடல் முகவர் (Planner Agent)',
      role: 'தன்னாட்சி நோக்கம் வகைப்பாடு & பணி வரைபட பகுப்பாய்வு',
      category: 'திட்டமிடல்',
      provider: 'விதி அடிப்படையிலான நோக்கம் வகைப்படுத்தி & சூழல் எஞ்சின்',
      sampleOutput: "நோக்கம்: 'பாதுகாப்பான PFZ வழிசெலுத்தல்', அனுப்பப்பட்டது: 10 துணை முகவர்கள், ஆயத்தொலைவுகள்: 9.9312°N, 76.2673°E"
    },
    te: {
      name: 'ప్లానర్ ఏజెంట్ (Planner Agent)',
      role: 'స్వయంప్రతిపత్తి ఉద్దేశ వర్గీకరణ & టాస్క్ విభజన',
      category: 'ప్రణాళిక',
      provider: 'రూల్-బేస్డ్ ఇంటెంట్ క్లాసిఫైయర్ & కాంటెక్స్ట్ ఇంజిన్',
      sampleOutput: "ఉద్దేశం: 'సురక్షిత PFZ నావిగేషన్', పంపబడినవి: 10 సబ్-ఏజెంట్లు, కోఆర్డినేట్లు: 9.9312°N, 76.2673°E"
    },
    bn: {
      name: 'পরিকল্পনাকারী এজেন্ট (Planner Agent)',
      role: 'স্বায়ত্তশাসিত অভিপ্রায় শ্রেণীকরণ ও ডিএজি কার্য বিভাজন',
      category: 'পরিকল্পনা',
      provider: 'নিয়ম-ভিত্তিক অভিপ্রায় ক্লাসিফায়ার ও কনটেক্সট ইঞ্জিন',
      sampleOutput: "অভিপ্রায়: 'নিরাপদ পিএফজেড নেভিগেশন', প্রেরিত: ১০টি সাব-এজেন্ট, স্থানাঙ্ক: ৯.৯৩১২°উ, ৭৬.২৬৭৩°পূ"
    }
  },
  discovery: {
    en: {
      name: 'Data Discovery Agent',
      role: 'Spaceborne Satellite Catalogue & Ingest Pipeline Matching',
      category: 'DATA INGESTION',
      provider: 'ISRO MOSDAC & INCOIS Open Telemetry Catalog',
      sampleOutput: 'Catalog match: EOS-06 OCM-3 (NetCDF4), INSAT-3DR TIR (HDF5), IMD AWS Buoy 42001'
    },
    hi: {
      name: 'डेटा अन्वेषण एजेंट (Data Discovery)',
      role: 'अंतरिक्ष उपग्रह कैटलॉग एवं डेटा अंतर्ग्रहण पाइपलाइन मिलान',
      category: 'डेटा अंतर्ग्रहण',
      provider: 'इसरो मॉसडैक एवं इनकोइस ओपन टेलीमेट्री कैटलॉग',
      sampleOutput: 'कैटलॉग मिलान: EOS-06 OCM-3 (NetCDF4), INSAT-3DR TIR (HDF5), IMD बॉय 42001'
    },
    ml: {
      name: 'ഡാറ്റാ കണ്ടെത്തൽ ഏജന്റ് (Data Discovery)',
      role: 'ഉപഗ്രഹ വിവര കാറ്റലോഗും ഡാറ്റ പൈപ്പ്‌ലൈൻ ഏകോപനവും',
      category: 'വിവര ശേഖരണം',
      provider: 'ഐഎസ്ആർഒ മോസ്ഡാക് & ഇൻകോയിസ് ഓപ്പൺ കാറ്റലോഗ്',
      sampleOutput: 'ലഭ്യമായ വിവരങ്ങൾ: EOS-06 OCM-3, INSAT-3DR TIR, IMD ബോയ് 42001'
    },
    ta: {
      name: 'தரவு கண்டுபிடிப்பு முகவர் (Data Discovery)',
      role: 'செயற்கைக்கோள் பட்டியல் & தரவு பைப்லைன் பொருத்தம்',
      category: 'தரவு பெறுதல்',
      provider: 'இஸ்ரோ MOSDAC & INCOIS டெலிமெட்ரி அட்டவணை',
      sampleOutput: 'பொருந்திய செயற்கைக்கோள்: EOS-06 OCM-3, INSAT-3DR TIR, IMD மிதவை 42001'
    },
    te: {
      name: 'డేటా డిస్కవరీ ఏజెంట్ (Data Discovery)',
      role: 'ఉపగ్రహ కేటలాగ్ & డేటా పైప్‌లైన్ సమన్వయం',
      category: 'డేటా సేకరణ',
      provider: 'ఇస్రో MOSDAC & INCOIS టెలిమెట్రీ కేటలాగ్',
      sampleOutput: 'కేటలాగ్ మ్యాచ్: EOS-06 OCM-3, INSAT-3DR TIR, IMD బోయ్ 42001'
    },
    bn: {
      name: 'উপাত্ত অনুসন্ধান এজেন্ট (Data Discovery)',
      role: 'মহাকাশ উপগ্রহ ক্যাটালগ ও ডেটা সংযোগ পাইপলাইন সমন্বয়',
      category: 'ডেটা গ্রহণ',
      provider: 'ইসরো মসড্যাক ও ইনকোইস মুক্ত টেলিমেট্রি ক্যাটালগ',
      sampleOutput: 'ক্যাটালগ ম্যাচ: EOS-06 OCM-3 (NetCDF4), INSAT-3DR TIR (HDF5), IMD বয়া ৪২০০১'
    }
  },
  weather: {
    en: {
      name: 'Weather Intelligence Agent',
      role: 'Atmospheric Wind Vectors, Sea Gusts & Swell Dynamics',
      category: 'DATA INGESTION',
      provider: 'IMD Coastal AWS & WeatherAPI Integration',
      sampleOutput: 'Wind: 16.5 km/h @ 245° WSW, Gust: 22.0 km/h, Swell: 1.2m @ 8.2s interval'
    },
    hi: {
      name: 'मौसम आसूचना एजेंट (Weather Agent)',
      role: 'वायुमंडलीय पवन वैक्टर, समुद्री झोंके एवं लहरों की गतिशीलता',
      category: 'डेटा अंतर्ग्रहण',
      provider: 'आईएमडी तटीय एडब्ल्यूएस एवं वेदर एपीआई एकीकरण',
      sampleOutput: 'पवन: 16.5 किमी/घंटा @ 245° WSW, झोंके: 22.0 किमी/घंटा, लहरें: 1.2 मी @ 8.2s अंतराल'
    },
    ml: {
      name: 'കാലാവസ്ഥാ ഏജന്റ് (Weather Agent)',
      role: 'കാറ്റിന്റെ വേഗത, ദിശ, കടൽക്ഷോഭ തിരമാലകൾ എന്നിവ നിരീക്ഷിക്കുന്നു',
      category: 'വിവര ശേഖരണം',
      provider: 'ഐഎംഡി കോസ്റ്റൽ എഡബ്ല്യുഎസ് & വെതർ എപിഐ',
      sampleOutput: 'കാറ്റ്: 16.5 കി.മീ/മണിക്കൂർ @ 245° WSW, തിരമാല: 1.2 മീറ്റർ @ 8.2 സെക്കൻഡ് ഇടവേള'
    },
    ta: {
      name: 'வானிலை நுண்ணறிவு முகவர் (Weather Agent)',
      role: 'காற்றின் வேகம், பலத்த காற்று & அலைகளின் இயக்கம்',
      category: 'தரவு பெறுதல்',
      provider: 'IMD கடலோர வானிலை மையம் & WeatherAPI',
      sampleOutput: 'காற்று: 16.5 கி.மீ/மணி @ 245° WSW, அலை உயரம்: 1.2 மீ @ 8.2 நொடி இடைவெளி'
    },
    te: {
      name: 'వాతావరణ ఇంటెలిజెన్స్ ఏజెంట్ (Weather Agent)',
      role: 'గాలి వేగం, ఈదురుగాలులు & సముద్రపు అలల తీవ్రత',
      category: 'డేటా సేకరణ',
      provider: 'IMD కోస్టల్ AWS & WeatherAPI ఇంటిగ్రేషన్',
      sampleOutput: 'గాలి: 16.5 కి.మీ/గం @ 245° WSW, అలల ఎత్తు: 1.2 మీ @ 8.2 సెకన్లు'
    },
    bn: {
      name: 'আবহাওয়া তথ্য এজেন্ট (Weather Agent)',
      role: 'বায়ুমণ্ডলীয় বাতাসের বেগ, দমকা হাওয়া ও সমুদ্রের ঢেউ গতিশীলতা',
      category: 'ডেটা গ্রহণ',
      provider: 'আইএমডি উপকূলীয় এডাব্লিউএস ও ওয়েদার এপিআই',
      sampleOutput: 'বাতাস: ১৬.৫ কিমি/ঘণ্টা @ ২৪৫° ডব্লিউএসডব্লিউ, দমকা: ২২.০ কিমি/ঘণ্টা, ঢেউ: ১.২মি @ ৮.২সে.'
    }
  },
  ocean: {
    en: {
      name: 'Ocean Analytics Agent',
      role: 'Thermal Radiometry & Ocean Color Chlorophyll Inversion',
      category: 'DATA INGESTION',
      provider: 'Oceansat-3 (EOS-06) OCM-3 & INSAT-3DR TIR',
      sampleOutput: 'SST: 28.4°C (Optimal front), Chlorophyll-a: 2.85 mg/m³ (Upwelling plume)'
    },
    hi: {
      name: 'महासागर विश्लेषण एजेंट (Ocean Analytics)',
      role: 'थर्मल रेडियोमेट्री एवं समुद्र रंग क्लोरोफिल इनवर्जन',
      category: 'डेटा अंतर्ग्रहण',
      provider: 'ओशनसैट-3 (EOS-06) OCM-3 एवं इनसैट-3डीआर टीआईआर',
      sampleOutput: 'एसएसटी: 28.4°C (अनुकूल फ्रंट), क्लोरोफिल-ए: 2.85 mg/m³ (अपवेलिंग प्लम)'
    },
    ml: {
      name: 'സമുദ്ര വിശകലന ഏജന്റ് (Ocean Analytics)',
      role: 'സമുദ്ര താപനിലയും ക്ലോറോഫിൽ സാന്ദ്രതയും നിരീക്ഷിക്കുന്നു',
      category: 'വിവര ശേഖരണം',
      provider: 'ഓഷ്യൻസാറ്റ്-3 (EOS-06) & ഇൻസാറ്റ്-3ഡിആർ',
      sampleOutput: 'താപനില (SST): 28.4°C, ക്ലോറോഫിൽ-എ: 2.85 mg/m³ (ഉയർന്ന സാന്നിധ്യം)'
    },
    ta: {
      name: 'கடல் பகுப்பாய்வு முகவர் (Ocean Analytics)',
      role: 'வெப்ப கதிர்வீச்சு & கடல் வண்ண குளோரோபில் பகுப்பாய்வு',
      category: 'தரவு பெறுதல்',
      provider: 'ஓஷன்சாட்-3 (EOS-06) & இன்சாட்-3டிஆர்',
      sampleOutput: 'கடல் வெப்பநிலை: 28.4°C, குளோரோபில்: 2.85 mg/m³ (வளர்ப்பு மண்டலம்)'
    },
    te: {
      name: 'సముద్ర విశ్లేషణ ఏజెంట్ (Ocean Analytics)',
      role: 'ఉపరితల ఉష్ణోగ్రత & క్లోరోఫిల్ తీవ్రత విశ్లేషణ',
      category: 'డేటా సేకరణ',
      provider: 'ఓషన్‌శాట్-3 (EOS-06) & ఇన్‌శాట్-3DR',
      sampleOutput: 'SST: 28.4°C (అనుకూల సరిహద్దు), క్లోరోఫిల్: 2.85 mg/m³'
    },
    bn: {
      name: 'মহাসাগর বিশ্লেষণ এজেন্ট (Ocean Analytics)',
      role: 'থার্মাল রেডিওমেট্রি ও সমুদ্র বর্ণ ক্লোরোফিল ইনভার্শন',
      category: 'ডেটা গ্রহণ',
      provider: 'ওশানস্যাট-৩ (EOS-06) ও ইনস্যাট-৩ডিআর টিআইআর',
      sampleOutput: 'এসএসটি: ২৮.৪°C (অনুকূল ফ্রন্ট), ক্লোরোফিল-এ: ২.৮৫ মিগ্রা/মি³ (পুষ্টিপ্রবাহ)'
    }
  },
  alert: {
    en: {
      name: 'Marine Alert Agent',
      role: 'Early Cyclone Warnings, High Swell Surges & Navigational Hazards',
      category: 'SAFETY',
      provider: 'IMD Coastal Warning System & INCOIS High Wave Alert Service',
      sampleOutput: 'Alert Level: 0 (Normal). No convective lightning within 50 km. Cyclone: None'
    },
    hi: {
      name: 'समुद्री चेतावनी एजेंट (Marine Alert)',
      role: 'प्रारंभिक चक्रवात चेतावनी, तीव्र लहरें एवं नौवहन खतरे',
      category: 'सुरक्षा',
      provider: 'आईएमडी तटीय चेतावनी प्रणाली एवं इनकोइस हाई वेव अलर्ट',
      sampleOutput: 'चेतावनी स्तर: 0 (सामान्य)। 50 किमी के भीतर कोई बिजली नहीं। चक्रवात: कोई नहीं'
    },
    ml: {
      name: 'മുന്നറിയിപ്പ് ഏജന്റ് (Marine Alert)',
      role: 'ചുഴലിക്കാറ്റ്, ഉയർന്ന തിരമാലകൾ, കടൽക്ഷോഭ മുന്നറിയിപ്പുകൾ',
      category: 'സുരക്ഷ',
      provider: 'ഐഎംഡി കോസ്റ്റൽ വാണിംഗ് & ഇൻകോയിസ് അലർട്ട്',
      sampleOutput: 'മുന്നറിയിപ്പ് നില: 0 (സാധാരണ നില). 50 കി.മീറ്ററിനുള്ളിൽ മിന്നൽ സാധ്യതയില്ല'
    },
    ta: {
      name: 'கடல் எச்சரிக்கை முகவர் (Marine Alert)',
      role: 'புயல் எச்சரிக்கை, உயரமான அலைகள் & கடற்பயண ஆபத்துகள்',
      category: 'பாதுகாப்பு',
      provider: 'IMD கடலோர எச்சரிக்கை அமைப்பு & INCOIS அலை எச்சரிக்கை',
      sampleOutput: 'எச்சரிக்கை நிலை: 0 (இயல்பு). 50 கி.மீக்குள் மின்னல் ஆபத்து இல்லை. புயல்: இல்லை'
    },
    te: {
      name: 'సముద్ర హెచ్చరిక ఏజెంట్ (Marine Alert)',
      role: 'ముందస్తు తుఫాను హెచ్చరికలు, భారీ అలల తీవ్రత & నావిగేషన్ ప్రమాదాలు',
      category: 'భద్రత',
      provider: 'IMD తీర హెచ్చరిక వ్యవస్థ & INCOIS అలల హెచ్చరిక సర్వీస్',
      sampleOutput: 'హెచ్చరిక స్థాయి: 0 (సాధారణం). 50 కి.మీ పరిధిలో మెరుపులు లేవు. తుఫాను: లేదు'
    },
    bn: {
      name: 'সামুদ্রিক সতর্কতা এজেন্ট (Marine Alert)',
      role: 'আগাম ঘূর্ণিঝড় সতর্কতা, জলোচ্ছ্বাস ও বিপজ্জনক নৌ-পরিস্থিতি',
      category: 'সুরক্ষা',
      provider: 'আইএমডি উপকূলীয় সতর্কতা ব্যবস্থা ও ইনকোইস হাই ওয়েভ অ্যালার্ট',
      sampleOutput: 'সতর্কতা স্তর: ০ (স্বাভাবিক)। ৫০ কিমির মধ্যে কোনো বজ্রঝড় নেই। ঘূর্ণিঝড়: নেই'
    }
  },
  pfz: {
    en: {
      name: 'PFZ Intelligence Agent',
      role: 'Thermal-Chlorophyll Frontal Convergence Zone Extraction',
      category: 'DATA INGESTION',
      provider: 'INCOIS PFZ Advisories & Spaceborne Chlorophyll Gradients',
      sampleOutput: 'Extracted 8 PFZ candidate clusters. Top spot: Frontal Zone Alpha (18.5 km, 240° WSW)'
    },
    hi: {
      name: 'पीएफजेड आसूचना एजेंट (PFZ Agent)',
      role: 'थर्मल-क्लोरोफिल फ्रंटल अभिसरण क्षेत्र निष्कर्षण',
      category: 'डेटा अंतर्ग्रहण',
      provider: 'इनकोइस पीएफजेड परामर्श एवं उपग्रह क्लोरोफिल प्रवणता',
      sampleOutput: '8 संभावित पीएफजेड क्लस्टर निकाले गए। शीर्ष क्षेत्र: फ्रंटल जोन अल्फा (18.5 किमी, 240° WSW)'
    },
    ml: {
      name: 'പിഎഫ്‌സെഡ് ഏജന്റ് (PFZ Agent)',
      role: 'മത്സ്യ ലഭ്യതയുള്ള തെർമൽ-ക്ലോറോഫിൽ മേഖലകൾ കണ്ടെത്തുന്നു',
      category: 'വിവര ശേഖരണം',
      provider: 'ഇൻകോയിസ് പിഎഫ്‌സെഡ് & ഉപഗ്രഹ ഡാറ്റ',
      sampleOutput: '8 സാധ്യതയുള്ള മത്സ്യ മേഖലകൾ കണ്ടെത്തി. മികച്ച കേന്ദ്രം: ഫ്രണ്ടൽ സോൺ ആൽഫ (18.5 കി.മീ)'
    },
    ta: {
      name: 'PFZ நுண்ணறிவு முகவர் (PFZ Agent)',
      role: 'மீன்வளம் நிறைந்த வெப்பநிலை-குளோரோபில் மண்டலங்களை கண்டறிதல்',
      category: 'தரவு பெறுதல்',
      provider: 'INCOIS PFZ ஆலோசனைகள் & செயற்கைக்கோள் தரவு',
      sampleOutput: '8 மீன்பிடி பகுதிகள் கண்டறியப்பட்டன. சிறந்த இடம்: மண்டலம் ஆல்ஃபா (18.5 கி.மீ)'
    },
    te: {
      name: 'PFZ ఇంటెలిజెన్స్ ఏజెంట్ (PFZ Agent)',
      role: 'చేపల లభ్యత కలిగిన థర్మల్-క్లోరోఫిల్ సరిహద్దుల గుర్తింపు',
      category: 'డేటా సేకరణ',
      provider: 'INCOIS PFZ సలహాలు & ఉపగ్రహ క్లోరోఫిల్ కొలతలు',
      sampleOutput: '8 PFZ క్లస్టర్లు సేకరించబడ్డాయి. ఉత్తమ స్థానం: ఫ్రంటల్ జోన్ ఆల్ఫా (18.5 కి.మీ)'
    },
    bn: {
      name: 'পিএফজেড তথ্য এজেন্ট (PFZ Agent)',
      role: 'মৎস্যসমৃদ্ধ থার্মাল-ক্লোরোফিল ফ্রন্টাল কনভার্জেন্স এলাকা নির্ধারণ',
      category: 'ডেটা গ্রহণ',
      provider: 'ইনকোইস পিএফজেড পরামর্শ ও স্যাটেলাইট ক্লোরোফিল গ্রেডিয়েন্ট',
      sampleOutput: '৮টি পিএফজেড ক্লাস্টার চিহ্নিত। শীর্ষ স্থান: ফ্রন্টাল জোন আলফা (১৮.৫ কিমি, ২৪০° ডব্লিউএসডব্লিউ)'
    }
  },
  gis: {
    en: {
      name: 'Geospatial Reasoning Agent',
      role: 'Sovereign IMBL, 12nm Territorial Waters & MPA Geofencing',
      category: 'SPATIAL REASONING',
      provider: 'Indian Coast Guard GIS Boundary Geodatabase & Bhuvan',
      sampleOutput: 'IMBL Clearance: 48.2 km (SAFE). Nearest Marine Sanctuary: 36.4 km clear'
    },
    hi: {
      name: 'भू-स्थानिक तर्क एजेंट (GIS Agent)',
      role: 'संप्रभु आईएमबीएल, 12nm प्रादेशिक जल एवं संरक्षित क्षेत्र जियोफेंसिंग',
      category: 'स्थानिक विश्लेषण',
      provider: 'भारतीय तटरक्षक बल जीआईएस डेटाबेस एवं भुवन पोर्टल',
      sampleOutput: 'आईएमबीएल दूरी: 48.2 किमी (सुरक्षित)। निकटतम समुद्री अभयारण्य: 36.4 किमी दूर'
    },
    ml: {
      name: 'ഭൂ-വിവര ഏജന്റ് (GIS Agent)',
      role: 'അന്താരാഷ്ട്ര അതിർത്തിയും (IMBL) സംരക്ഷിത സമുദ്ര മേഖലകളും നിരീക്ഷിക്കുന്നു',
      category: 'സ്ഥാനിക വിശകലനം',
      provider: 'കോസ്റ്റ് ഗാർഡ് ജിഐഎസ് & ഭുവൻ ഡാറ്റാബേസ്',
      sampleOutput: 'അതിർത്തിയിലേക്കുള്ള ദൂരം: 48.2 കി.മീ (സുരക്ഷിതം). സംരക്ഷിത മേഖല: 36.4 കി.മീ അകലെ'
    },
    ta: {
      name: 'புவிசார் பகுப்பாய்வு முகவர் (GIS Agent)',
      role: 'சர்வதேச கடல் எல்லை (IMBL) & கடல்சார் சரணாலய எல்லைக் கட்டுப்பாடு',
      category: 'இடஞ்சார்ந்த பகுப்பாய்வு',
      provider: 'இந்திய கடலோர காவல்படை GIS & புவன் தளம்',
      sampleOutput: 'சர்வதேச எல்லை இடைவெளி: 48.2 கி.மீ (பாதுகாப்பானது). சரணாலயம்: 36.4 கி.மீ அப்பால்'
    },
    te: {
      name: 'జియోస్పేషియల్ రీజనింగ్ ఏజెంట్ (GIS Agent)',
      role: 'సార్వభౌమ IMBL సరిహద్దు, 12 నాటికల్ మైళ్ళ సముద్ర జలాలు & జియోఫెన్సింగ్',
      category: 'ప్రాదేశిక విశ్లేషణ',
      provider: 'భారత తీరరక్షక దళం GIS డేటాబేస్ & భువన్',
      sampleOutput: 'IMBL క్లియరెన్స్: 48.2 కి.మీ (సురక్షితం). సమీప సంరక్షిత ప్రాంతం: 36.4 కి.మీ క్లియర్'
    },
    bn: {
      name: 'ভূ-স্থানিক যুক্তি এজেন্ট (GIS Agent)',
      role: 'সার্বভৌম আইএমবিএল সীমান্ত, ১২ নটিক্যাল মাইল জলসীমা ও সংরক্ষিত এলাকা নজরদারি',
      category: 'স্থানিক বিশ্লেষণ',
      provider: 'ইন্ডিয়ান কোস্ট গার্ড জিআইএস ডেটাবেস ও ভূবন পোর্টাল',
      sampleOutput: 'আইএমবিএল দূরত্ব: ৪৮.২ কিমি (নিরাপদ)। নিকটবর্তী সামুদ্রিক অভয়ারণ্য: ৩৬.৪ কিমি মুক্ত'
    }
  },
  trajectory: {
    en: {
      name: 'Trajectory Agent',
      role: 'Forward Predictive Dead Reckoning with Wind Leeway Drift',
      category: 'SPATIAL REASONING',
      provider: 'Kinematic Leeway Drift Integral (60-Min Horizon)',
      sampleOutput: 'Projected 60-min track: Heading 240°, Leeway 1.4 kn. Boundary clearance maintained'
    },
    hi: {
      name: 'प्रक्षेपवक्र एजेंट (Trajectory Agent)',
      role: 'पवन बहाव एवं जलप्रवाह के साथ अग्रगामी भावी गणना',
      category: 'स्थानिक विश्लेषण',
      provider: 'काइनेमैटिक लीवे ड्रिफ्ट इंटीग्रल (60-मिनट क्षितिज)',
      sampleOutput: 'अनुमानित 60-मिनट ट्रैक: हेडिंग 240°, बहाव 1.4 नॉट। सीमा दूरी सुरक्षित'
    },
    ml: {
      name: 'പാത നിർണ്ണയ ഏജന്റ് (Trajectory Agent)',
      role: 'കാറ്റിന്റെ ഗതിയും ഒഴുക്കും കണക്കാക്കിയുള്ള യാത്രാപാതാ പ്രവചനം',
      category: 'സ്ഥാനിക വിശകലനം',
      provider: 'ഡ്രിഫ്റ്റ് ഇന്റഗ്രൽ കാൽക്കുലേറ്റർ (60 മിനിറ്റ്)',
      sampleOutput: 'പ്രതീക്ഷിത 60 മിനിറ്റ് പാത: ഹെഡിംഗ് 240°, ഒഴുക്ക് 1.4 kn. സുരക്ഷിത അതിർത്തി'
    },
    ta: {
      name: 'திசைவேக முன்கணிப்பு முகவர் (Trajectory Agent)',
      role: 'காற்றின் சறுக்கல் மற்றும் நீரோட்டத்துடன் கூடிய முன்னோக்கு கணக்கீடு',
      category: 'இடஞ்சார்ந்த பகுப்பாய்வு',
      provider: 'இயக்கவியல் சறுக்கல் மதிப்பீடு (60-நிமிட கணிப்பு)',
      sampleOutput: '60 நிமிட உத்தேச பாதை: திசை 240°, சறுக்கல் 1.4 நாட். எல்லை தூரம் பராமரிக்கப்பட்டது'
    },
    te: {
      name: 'ట్రాజెక్టరీ ఏజెంట్ (Trajectory Agent)',
      role: 'గాలి మరియు ప్రవాహ దిశ ఆధారంగా భవిష్యత్ నావిగేషన్ అంచనా',
      category: 'ప్రాదేశిక విశ్లేషణ',
      provider: 'కైనెమాటిక్ డ్రిఫ్ట్ ఇంటిగ్రల్ (60-నిమిషాల అంచనా)',
      sampleOutput: 'అంచనా వేసిన 60 నిమిషాల ట్రాక్: హెడ్డింగ్ 240°, డ్రిఫ్ట్ 1.4 నాట్లు. సురక్షిత క్లియరెన్స్'
    },
    bn: {
      name: 'গতিপথ নির্ণয় এজেন্ট (Trajectory Agent)',
      role: 'বাতাসের বিচ্যুতি ও সমুদ্রস্রোত সহ ভবিষ্যৎ সম্ভাব্য নৌ-গতিপথ গণনা',
      category: 'স্থানিক বিশ্লেষণ',
      provider: 'কাইনেম্যাটিক লিওয়ে ড্রিফট ইন্টিগ্রাল (৬০ মিনিটের পরিধি)',
      sampleOutput: 'প্রক্ষেপিত ৬০-মিনিটের ট্র্যাক: হেডিং ২৪০°, বিচ্যুতি ১.৪ নটিক্যাল মাইল। সীমানা নিরাপদ'
    }
  },
  risk: {
    en: {
      name: 'Risk Assessment Agent',
      role: 'Deterministic 7-Factor Hydro-Meteorological Physics Matrix',
      category: 'SAFETY',
      provider: 'Deterministic Physical Safety Engine (Zero LLM Hallucination)',
      sampleOutput: 'Safety Score: 85/100 (Risk: 15/100) -> Verdict: SAFE TO VENTURE'
    },
    hi: {
      name: 'जोखिम मूल्यांकन एजेंट (Risk Agent)',
      role: 'नियतात्मक 7-कारक हाइड्रो-मौसम विज्ञान भौतिकी मैट्रिक्स',
      category: 'सुरक्षा',
      provider: 'नियतात्मक भौतिक सुरक्षा इंजन (शून्य एलएलएम भ्रम)',
      sampleOutput: 'सुरक्षा स्कोर: 85/100 (जोखिम: 15/100) -> निर्णय: प्रस्थान हेतु सुरक्षित'
    },
    ml: {
      name: 'റിസ്ക് അസസ്സ്മെന്റ് ഏജന്റ് (Risk Agent)',
      role: '7 ഭൗതിക ഘടകങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള സുരക്ഷാ നിർണ്ണയം',
      category: 'സുരക്ഷ',
      provider: 'ഭൗതിക സുരക്ഷാ എഞ്ചിൻ (പൂർണ്ണ കൃത്യത, സീറോ ഹാലൂസിനേഷൻ)',
      sampleOutput: 'സുരക്ഷാ സ്കോർ: 85/100 (റിസ്ക്: 15/100) -> വിധി: യാത്രയ്ക്ക് സുരക്ഷിതം'
    },
    ta: {
      name: 'ஆபத்து மதிப்பீட்டு முகவர் (Risk Agent)',
      role: '7-காரணி நீரியல்-வானிலை இயற்பியல் பாதுகாப்பு மேட்ரிக்ஸ்',
      category: 'பாதுகாப்பு',
      provider: 'துல்லிய இயற்பியல் பாதுகாப்பு எஞ்சின் (பூஜ்ஜிய மாயை)',
      sampleOutput: 'பாதுகாப்பு மதிப்பீடு: 85/100 (ஆபத்து: 15/100) -> முடிவு: கடற்பயணம் பாதுகாப்பானது'
    },
    te: {
      name: 'ప్రమాద అంచనా ఏజెంట్ (Risk Agent)',
      role: '7-కారకాల హైడ్రో-వాతావరణ భౌతిక శాస్త్ర భద్రతా మాతృక',
      category: 'భద్రత',
      provider: 'భౌతిక భద్రతా ఇంజిన్ (సున్నా LLM భ్రమలు)',
      sampleOutput: 'భద్రతా స్కోరు: 85/100 (ప్రమాదం: 15/100) -> తీర్పు: ప్రయాణానికి సురక్షితం'
    },
    bn: {
      name: 'ঝুঁকি মূল্যায়ন এজেন্ট (Risk Agent)',
      role: 'নির্ধারিত ৭-উপাদান ভিত্তিক জল-আবহাওয়া পদার্থবিজ্ঞান ম্যাট্রিক্স',
      category: 'সুরক্ষা',
      provider: 'ভৌত নিরাপত্তা ইঞ্জিন (কোনো কৃত্রিম বুদ্ধিমত্তা বিভ্রান্তি নেই)',
      sampleOutput: 'নিরাপত্তা স্কোর: ৮৫/১০০ (ঝুঁকি: ১৫/১০০) -> সিদ্ধান্ত: যাত্রার জন্য নিরাপদ'
    }
  },
  route: {
    en: {
      name: 'Route Optimization Agent',
      role: 'A* Waypoint Safe Corridor & Hazard Detour Router',
      category: 'SPATIAL REASONING',
      provider: 'A* Coastal Waypoint Graph Router',
      sampleOutput: 'Safe Route: 22.4 km (Clear channel) vs Direct: 18.5 km (Nearshore reef proximity)'
    },
    hi: {
      name: 'मार्ग अनुकूलन एजेंट (Route Optimizer)',
      role: 'A* वेपॉइंट सुरक्षित गलियारा एवं खतरा परिहार राउटर',
      category: 'स्थानिक विश्लेषण',
      provider: 'A* तटीय वेपॉइंट ग्राफ नेविगेशन राउटर',
      sampleOutput: 'सुरक्षित मार्ग: 22.4 किमी (साफ चैनल) बनाम सीधा: 18.5 किमी (तटीय चट्टान निकटता)'
    },
    ml: {
      name: 'യാത്രാപാത ഒപ്റ്റിമൈസർ (Route Optimizer)',
      role: 'അപകടങ്ങൾ ഒഴിവാക്കിയുള്ള സുരക്ഷിത സമുദ്ര പാത നിർണ്ണയിക്കുന്നു',
      category: 'സ്ഥാനിക വിശകലനം',
      provider: 'A* കോസ്റ്റൽ വേപോയിന്റ് റൂട്ടർ',
      sampleOutput: 'സുരക്ഷിത പാത: 22.4 കി.മീ (ക്ലിയർ ചാനൽ) vs നേരിട്ടുള്ളത്: 18.5 കി.മീ (പവിഴപ്പുറ്റുകൾ)'
    },
    ta: {
      name: 'வழித்தட உகப்பாக்க முகவர் (Route Optimizer)',
      role: 'A* வழிப்புள்ளி பாதுகாப்பான பாதை & ஆபத்து தவிர்ப்பு வழிகாட்டி',
      category: 'இடஞ்சார்ந்த பகுப்பாய்வு',
      provider: 'A* கடலோர வரைபட வழிகாட்டி',
      sampleOutput: 'பாதுகாப்பான வழி: 22.4 கி.மீ (சுத்தமான தடம்) vs நேரடி: 18.5 கி.மீ (பவளப்பாறை ஆபத்து)'
    },
    te: {
      name: 'మార్గ ఆప్టిమైజేషన్ ఏజెంట్ (Route Optimizer)',
      role: 'A* వేపాయింట్ సురక్షిత కారిడార్ & ప్రమాద ప్రత్యామ్నాయ రౌటర్',
      category: 'ప్రాదేశిక విశ్లేషణ',
      provider: 'A* కోస్టల్ వేపాయింట్ గ్రాఫ్ రౌటర్',
      sampleOutput: 'సురక్షిత మార్గం: 22.4 కి.మీ (క్లియర్ ఛానల్) vs ప్రత్యక్షం: 18.5 కి.మీ (తీర రాళ్ళు)'
    },
    bn: {
      name: 'রুট অপ্টিমাইজেশন এজেন্ট (Route Optimizer)',
      role: 'A* ওয়েপয়েন্ট নিরাপদ জলপথ ও বিপদ এড়ানোর রুট নির্ধারক',
      category: 'স্থানিক বিশ্লেষণ',
      provider: 'A* উপকূলীয় ওয়েপয়েন্ট গ্রাফ রাউটার',
      sampleOutput: 'নিরাপদ রুট: ২২.৪ কিমি (মুক্ত চ্যানেল) বনাম সরাসরি: ১৮.৫ কিমি (উপকূলীয় প্রাচীর নিকটবর্তী)'
    }
  },
  verification: {
    en: {
      name: 'Verification Agent',
      role: 'Cross-Sensor Multi-Source Physical Consensus Audit',
      category: 'SAFETY',
      provider: 'Independent Physical Guardrail Auditor',
      sampleOutput: 'Audited 5 physics consistency rules: PASS (100% consensus across sensors)'
    },
    hi: {
      name: 'सत्यापन एजेंट (Verification Agent)',
      role: 'क्रॉस-सेंसर बहु-स्रोत भौतिक सर्वसम्मति ऑडिट',
      category: 'सुरक्षा',
      provider: 'स्वतंत्र भौतिक सुरक्षा गार्डरेल ऑडिटर',
      sampleOutput: '5 भौतिकी सुसंगतता नियमों का ऑडिट: सफल (सेंसरों में 100% सर्वसम्मति)'
    },
    ml: {
      name: 'സ്ഥിരീകരണ ഏജന്റ് (Verification Agent)',
      role: 'വിവിധ സെൻസറുകളിൽ നിന്നുള്ള വിവരങ്ങളുടെ ഭൗതിക സ്ഥിരീകരണം',
      category: 'സുരക്ഷ',
      provider: 'സ്വതന്ത്ര സുരക്ഷാ ഓഡിറ്റർ',
      sampleOutput: '5 ഭൗതിക നിയമങ്ങൾ പരിശോധിച്ചു: പാസ്സായി (100% കൃത്യത)'
    },
    ta: {
      name: 'சரிபார்ப்பு முகவர் (Verification Agent)',
      role: 'பல சென்சார் இயற்பியல் தரவு ஒருமித்த தணிக்கை',
      category: 'பாதுகாப்பு',
      provider: 'சுயாதீன இயற்பியல் பாதுகாப்பு தணிக்கையாளர்',
      sampleOutput: '5 இயற்பியல் விதிகள் தணிக்கை செய்யப்பட்டன: வெற்றி (100% சென்சார் உறுதி)'
    },
    te: {
      name: 'ధృవీకరణ ఏజెంట్ (Verification Agent)',
      role: 'క్రాస్-సెన్సార్ బహుళ-మూల భౌతిక ఏకాభిప్రాయ ఆడిట్',
      category: 'భద్రత',
      provider: 'స్వతంత్ర భౌతిక భద్రతా ఆడిటర్',
      sampleOutput: '5 భౌతిక స్థిరత్వ నియమాల ఆడిట్: ఉత్తీర్ణం (100% ఏకాభిప్రాయం)'
    },
    bn: {
      name: 'যাচাইকরণ এজেন্ট (Verification Agent)',
      role: 'মাল্টি-সেন্সর ভৌত তথ্য ঐকমত্য ও নির্ভরযোগ্যতা নিরীক্ষা',
      category: 'সুরক্ষা',
      provider: 'স্বাধীন ভৌত গার্ডরেল অডিটর',
      sampleOutput: '৫টি পদার্থবিজ্ঞান সামঞ্জস্য নিয়ম নিরীক্ষিত: সফল (সেন্সরসমূহের মধ্যে ১০০% ঐক্য)'
    }
  },
  visualization: {
    en: {
      name: 'Visualization Agent',
      role: 'Dynamic Vector Overlay Synthesizer & Cartographic Symbology',
      category: 'SYNTHESIS',
      provider: 'Leaflet Vector Pipeline & Marine Symbology Engine',
      sampleOutput: 'Activated overlays: [pfz_clusters, swell_vector_field, imbl_boundary, safe_corridor]'
    },
    hi: {
      name: 'दृश्यीकरण एजेंट (Visualization Agent)',
      role: 'गतिशील वेक्टर ओवरले सिंथेसाइज़र एवं कार्टोग्राफिक प्रतीक चिन्ह',
      category: 'संश्लेषण',
      provider: 'लीफ़लेट वेक्टर पाइपलाइन एवं समुद्री प्रतीक इंजन',
      sampleOutput: 'सक्रिय ओवरले: [पीएफजेड क्लस्टर, लहर वेक्टर फील्ड, आईएमबीएल सीमा, सुरक्षित गलियारा]'
    },
    ml: {
      name: 'വിഷ്വലൈസേഷൻ ഏജന്റ് (Visualization Agent)',
      role: 'മാപ്പിൽ വിവരങ്ങൾ കൃത്യമായി അടയാളപ്പെടുത്തുന്ന സംവിധാനം',
      category: 'സംയോജനം',
      provider: 'മാപ്പ് വെക്റ്റർ പൈപ്പ്‌ലൈൻ & മറൈൻ സിംബോളജി',
      sampleOutput: 'സജീവമാക്കിയ വിവരങ്ങൾ: [പിഎഫ്‌സെഡ്, തിരമാലകൾ, അതിർത്തി, സുരക്ഷിത പാത]'
    },
    ta: {
      name: 'காட்சிப்படுத்தல் முகவர் (Visualization Agent)',
      role: 'வரைபட அடுக்குகள் மற்றும் கடல்சார் குறியீடுகள் உருவாக்கம்',
      category: 'தொகுப்பு',
      provider: 'வரைபட வெக்டர் பைப்லைன் & கடல்சார் குறியீடு எஞ்சின்',
      sampleOutput: 'செயல்படுத்தப்பட்ட அடுக்குகள்: [PFZ மண்டலங்கள், அலை வேகம், எல்லை, பாதுகாப்பான வழி]'
    },
    te: {
      name: 'విజువలైజేషన్ ఏజెంట్ (Visualization Agent)',
      role: 'డైనమిక్ వెక్టర్ ఓవర్‌లే సింథసైజర్ & సముద్ర కార్టోగ్రఫీ చిహ్నాలు',
      category: 'సంశ్లేషణ',
      provider: 'లీఫ్‌లెట్ వెక్టర్ పైప్‌లైన్ & మెరైన్ చిహ్నాల ఇంజిన్',
      sampleOutput: 'యాక్టివేట్ చేయబడిన లేయర్లు: [PFZ క్లస్టర్లు, అలల వెక్టర్, సరిహద్దు, సురక్షిత మార్గం]'
    },
    bn: {
      name: 'ভিজ্যুয়ালাইজেশন এজেন্ট (Visualization Agent)',
      role: 'গতিশীল ভেক্টর মানচিত্র ওভারলে ও নটিক্যাল মানচিত্রায়ন',
      category: 'সংশ্লেষণ',
      provider: 'লিফলেট ভেক্টর পাইপলাইন ও সামুদ্রিক সিম্বল ইঞ্জিন',
      sampleOutput: 'সক্রিয় ওভারলে: [পিএফজেড ক্লাস্টার, ঢেউয়ের গতিধারা, আইএমবিএল সীমানা, নিরাপদ করিডোর]'
    }
  },
  explanation: {
    en: {
      name: 'Explanation & Evidence Agent',
      role: 'Multilingual Vernacular Generation with Exact Provenance Trace',
      category: 'SYNTHESIS',
      provider: '10-Language Maritime Translator & Provenance Engine',
      sampleOutput: 'Generated localized advice in selected language with SHA-256 provenance stamp'
    },
    hi: {
      name: 'व्याख्या एवं साक्ष्य एजेंट (Explanation Agent)',
      role: 'सटीक स्रोत ट्रेस के साथ बहुभाषी मातृभाषा सलाह निर्माण',
      category: 'संश्लेषण',
      provider: '10-भाषीय समुद्री अनुवादक एवं प्रमाणिकता इंजन',
      sampleOutput: 'SHA-256 डिजिटल मोहर के साथ चुनी गई भाषा में स्थानीय सलाह तैयार'
    },
    ml: {
      name: 'വിശദീകരണ ഏജന്റ് (Explanation Agent)',
      role: 'മാതൃഭാഷയിൽ ലളിതമായ നിർദ്ദേശങ്ങളും ഔദ്യോഗിക വിവരങ്ങളും നൽകുന്നു',
      category: 'സംയോജനം',
      provider: '10-ഭാഷാ മറൈൻ ട്രാൻസ്ലേറ്റർ & പ്രൊവെനൻസ് എഞ്ചിൻ',
      sampleOutput: 'SHA-256 തെളിവ് മുദ്രയോടെ മലയാളത്തിൽ സുരക്ഷാ നിർദ്ദേശം തയ്യാറാക്കി'
    },
    ta: {
      name: 'விளக்கம் & ஆதார முகவர் (Explanation Agent)',
      role: 'துல்லியமான வரலாற்று தடத்துடன் பன்மொழி ஆலோசனை உருவாக்கம்',
      category: 'தொகுப்பு',
      provider: '10-மொழி கடல்சார் மொழிபெயர்ப்பாளர் & ஆதார எஞ்சின்',
      sampleOutput: 'SHA-256 முத்திரையுடன் தேர்ந்தெடுக்கப்பட்ட மொழியில் பாதுகாப்பு ஆலோசனை தயார்'
    },
    te: {
      name: 'వివరణ & ఆధారాల ఏజెంట్ (Explanation Agent)',
      role: 'ఖచ్చితమైన మూల ఆధారాలతో బహుభాషా సలహాల రూపకల్పన',
      category: 'సంశ్లేషణ',
      provider: '10-భాషల సముద్ర అనువాదకుడు & ఆధారాల ఇంజిన్',
      sampleOutput: 'SHA-256 డిజిటల్ స్టాంప్‌తో ఎంచుకున్న భాషలో స్థానిక సలహా రూపొందించబడింది'
    },
    bn: {
      name: 'ব্যাখ্যা ও প্রমাণ এজেন্ট (Explanation Agent)',
      role: 'সঠিক উৎসসূত্র যাচাই সহ বহুভাষিক স্থানীয় পরামর্শ উৎপাদন',
      category: 'সংশ্লেষণ',
      provider: '১০-ভাষার সামুদ্রিক অনুবাদক ও প্রমাণ ইঞ্জিন',
      sampleOutput: 'SHA-256 ক্রিপ্টোগ্রাফিক সীল সহ নির্বাচিত ভাষায় স্থানীয় পরামর্শ প্রস্তুত'
    }
  }
};

export function getLocalizedDAGAgent(agentId: string, lang: string = 'en'): LocalizedDAGNode {
  const node = DAG_LOCALIZATIONS[agentId];
  if (!node) {
    return {
      name: agentId,
      role: 'Autonomous Marine Pipeline Agent',
      category: 'DATA',
      provider: 'NavikaAI Autonomous Pipeline',
      sampleOutput: 'Telemetry processed successfully.'
    };
  }

  return node[lang] || node['en'] || {
    name: agentId,
    role: 'Autonomous Marine Pipeline Agent',
    category: 'DATA',
    provider: 'NavikaAI Autonomous Pipeline',
    sampleOutput: 'Telemetry processed successfully.'
  };
}
