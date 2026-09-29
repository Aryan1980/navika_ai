// Comprehensive Maritime & Coastal Localization Engine for SamudraAI
// Supporting Hindi, Malayalam, Tamil, Telugu, Bengali, and English

export interface LocalizedPort {
  id: string;
  name: Record<string, string>;
  state: Record<string, string>;
  sea: Record<string, string>;
  species: Record<string, string>;
}

export const PORT_TRANSLATIONS: Record<string, Record<string, string>> = {
  'kochi': {
    en: 'Fort Kochi Coastal Harbor',
    hi: 'फोर्ट कोच्चि तटीय बंदरगाह',
    ml: 'ഫോർട്ട് കൊച്ചി തീരദേശ തുറമുഖം',
    ta: 'ஃபோர்ட் கொச்சி கடலோர துறைமுகம்',
    te: 'ఫోర్ట్ కొచ్చి తీర ఓడరేవు',
    bn: 'ফোর্ট কোচি উপকূলীয় বন্দর'
  },
  'mumbai': {
    en: 'Sassoon Dock, Mumbai',
    hi: 'ससून डॉक, मुंबई',
    ml: 'സസ്സൂൺ ഡോക്ക്, മുംബൈ',
    ta: 'சசூன் டாக், மும்பை',
    te: 'సాసూన్ డాక్, ముంబై',
    bn: 'সাসুন ডক, মুম্বাই'
  },
  'chennai': {
    en: 'Royapuram, Chennai',
    hi: 'रोयापुरम, चेन्नई',
    ml: 'റോയപുരം, ചെന്നൈ',
    ta: 'ராயபுரம், சென்னை',
    te: 'రాయపురం, చెన్నై',
    bn: 'রায়পুরম, চেন্নাই'
  },
  'visakhapatnam': {
    en: 'Visakhapatnam Fishing Harbor',
    hi: 'विशाखापट्टनम मत्स्य बंदरगाह',
    ml: 'വിശാഖപട്ടണം ഫിഷിംഗ് ഹാർബർ',
    ta: 'விசாகப்பட்டினம் மீன்பிடித் துறைமுகம்',
    te: 'విశాఖపట్నం ఫిషింగ్ హార్బర్',
    bn: 'বিশাখাপত্তনম ফিশিং হারবার'
  },
  'mangalore': {
    en: 'Old Port (Bunder), Mangalore',
    hi: 'पुराना बंदरगाह (बंदर), मंगलौर',
    ml: 'പഴയ തുറമുഖം (ബന്ദർ), മംഗലാപുരം',
    ta: 'பழைய துறைமுகம் (பந்தர்), மங்களூர்',
    te: 'పాత ఓడరేవు (బందర్), మంగళూరు',
    bn: 'ওল্ড পোর্ট (বন্দর), ম্যাঙ্গালোর'
  },
  'veraval': {
    en: 'Veraval Harbor, Saurashtra',
    hi: 'वेरावल बंदरगाह, सौराष्ट्र',
    ml: 'വെരാവൽ തുറമുഖം, സൗരാഷ്ട്ര',
    ta: 'வேராவல் துறைமுகம், சௌராஷ்டிரா',
    te: 'వెరావల్ హార్బర్, సౌరాష్ట్ర',
    bn: 'ভেরাবল হারবার, সৌরাষ্ট্র'
  },
  'panaji': {
    en: 'Malim Jetty, Panaji',
    hi: 'मलिम जेट्टी, पणजी',
    ml: 'മാലിം ജെട്ടി, പനജി',
    ta: 'மாலிம் ஜெட்டி, பனாஜி',
    te: 'మాలిమ్ జెట్టీ, పనాజీ',
    bn: 'মালিম জেটি, পানাজি'
  },
  'paradip': {
    en: 'Paradip Fishing Harbor',
    hi: 'पारादीप मत्स्य बंदरगाह',
    ml: 'പാരദ്വീപ് ഫിഷിംഗ് ഹാർബർ',
    ta: 'பாரதீப் மீன்பிடித் துறைமுகம்',
    te: 'పారదీప్ ఫిషింగ్ హార్బర్',
    bn: 'পারাদ্বীপ ফিশিং হারবার'
  },
  'kanyakumari': {
    en: 'Chinnamuttom, Kanyakumari',
    hi: 'चिन्नमुत्तम, कन्याकुमारी',
    ml: 'ചിന്നമുട്ടം, കന്യാകുമാരി',
    ta: 'சின்னமுட்டம், கன்னியாகுமரி',
    te: 'చిన్నముట్టం, కన్యాకుమారి',
    bn: 'চিন্নামুত্তম, কন্যাকুমারী'
  },
  'port_blair': {
    en: 'Junglighat, Port Blair',
    hi: 'जंगलीघाट, पोर्ट ब्लेयर',
    ml: 'ജംഗ്ലീഘട്ട്, പോർട്ട് ബ്ലെയർ',
    ta: 'ஜங்கிலிகாட், போர்ட் பிளேயர்',
    te: 'జంగ్లీఘాట్, పోర్ట్ బ్లెయిర్',
    bn: 'জংলিঘাট, পোর্ট ব্লেয়ার'
  }
};

export const STATE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Kerala': {
    en: 'Kerala',
    hi: 'केरल',
    ml: 'കേരളം',
    ta: 'கேரளா',
    te: 'కేరళ',
    bn: 'কেরালা'
  },
  'Maharashtra': {
    en: 'Maharashtra',
    hi: 'महाराष्ट्र',
    ml: 'മഹാരാഷ്ട്ര',
    ta: 'மகாராஷ்டிரா',
    te: 'మహారాష్ట్ర',
    bn: 'মহারাষ্ট্র'
  },
  'Tamil Nadu': {
    en: 'Tamil Nadu',
    hi: 'तमिलनाडु',
    ml: 'തമിഴ്‌നാട്',
    ta: 'தமிழ்நாடு',
    te: 'తమిళనాడు',
    bn: 'তামিলনাড়ু'
  },
  'Andhra Pradesh': {
    en: 'Andhra Pradesh',
    hi: 'आंध्र प्रदेश',
    ml: 'ആന്ധ്രാപ്രദേശ്',
    ta: 'ஆந்திரப் பிரதேசம்',
    te: 'ఆంధ్రప్రదేశ్',
    bn: 'অন্ধ্রপ্রদেশ'
  },
  'Karnataka': {
    en: 'Karnataka',
    hi: 'कर्नाटक',
    ml: 'കർണാടക',
    ta: 'கர்நாடகா',
    te: 'కర్ణాటక',
    bn: 'কর্ণাটক'
  },
  'Gujarat': {
    en: 'Gujarat',
    hi: 'गुजरात',
    ml: 'ഗുജറാത്ത്',
    ta: 'குஜராத்',
    te: 'గుజరాత్',
    bn: 'গুজরাট'
  },
  'Goa': {
    en: 'Goa',
    hi: 'गोवा',
    ml: 'ഗോവ',
    ta: 'கோவா',
    te: 'గోవా',
    bn: 'গোয়া'
  },
  'Odisha': {
    en: 'Odisha',
    hi: 'ओडिशा',
    ml: 'ഒഡീഷ',
    ta: 'ஒடிசா',
    te: 'ఒడిశా',
    bn: 'ওড়িশা'
  },
  'Andaman & Nicobar': {
    en: 'Andaman & Nicobar',
    hi: 'अंडमान और निकोबार',
    ml: 'ആൻഡമാൻ & നിക്കോബാർ',
    ta: 'அந்தமான் & நிக்கோபார்',
    te: 'అండమాన్ & నికోబార్',
    bn: 'আন্দামান ও নিকোবর'
  }
};

export const SEA_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Arabian Sea': {
    en: 'Arabian Sea',
    hi: 'अरब सागर',
    ml: 'അറബിക്കടൽ',
    ta: 'அரபிக்கடல்',
    te: 'అరేబియా సముద్రం',
    bn: 'আরব সাগর'
  },
  'Bay of Bengal': {
    en: 'Bay of Bengal',
    hi: 'बंगाल की खाड़ी',
    ml: 'ബംഗാൾ ഉൾക്കടൽ',
    ta: 'வங்காள விரிகுடா',
    te: 'బంగాళాఖాతం',
    bn: 'বঙ্গোপসাগর'
  },
  'Indian Ocean Confluence': {
    en: 'Indian Ocean Confluence',
    hi: 'हिंद महासागर संगम',
    ml: 'ഇന്ത്യൻ മഹാസമുദ്ര സംഗമം',
    ta: 'இந்தியப் பெருங்கடல் சங்கமம்',
    te: 'హిందూ మహాసముద్ర సంగమం',
    bn: 'ভারত মহাসাগর সঙ্গম'
  },
  'Andaman Sea': {
    en: 'Andaman Sea',
    hi: 'अंडमान सागर',
    ml: 'ആൻഡമാൻ കടൽ',
    ta: 'அந்தமான் கடல்',
    te: 'అండమాన్ సముద్రం',
    bn: 'আন্দামান সাগর'
  }
};

export const SPECIES_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Oil Sardine': { en: 'Oil Sardine', hi: 'सार्डिन (तारली)', ml: 'ചാള (മത്തി)', ta: 'மத்தி', te: 'కవ్వళ్లు', bn: 'সার্ডিন' },
  'Indian Mackerel': { en: 'Indian Mackerel', hi: 'भारतीय मैकेरल (बांगड़ा)', ml: 'അയല', ta: 'அயலை', te: 'కాణగంతలు', bn: 'ভারতীয় ম্যাকেরেল' },
  'Yellowfin Tuna': { en: 'Yellowfin Tuna', hi: 'येलोफिन टूना (केदर)', ml: 'കേര (ചൂര)', ta: 'மஞ்சள் துடுப்பு சூரை', te: 'ట్యూనా', bn: 'ইয়েলোফিন টুনা' },
  'Bombay Duck': { en: 'Bombay Duck', hi: 'बम्बिल (बॉम्बे डक)', ml: 'ബോംബെ ഡക്ക്', ta: 'பம்பில்', te: 'బొంబాయి డక్', bn: 'লোটে মাছ' },
  'Silver Pomfret': { en: 'Silver Pomfret', hi: 'सिल्वर पापलेट', ml: 'വെള്ള ആവോലി', ta: 'வெள்ளை வாவல்', te: 'చందమామ', bn: 'পমফ্রেট' },
  'Penaeid Prawn': { en: 'Penaeid Prawn', hi: 'झींगा (कोलंबी)', ml: 'ചെമ്മീൻ', ta: 'இறால்', te: 'రొయ్యలు', bn: 'চিংড়ি' },
  'Skipjack Tuna': { en: 'Skipjack Tuna', hi: 'स्किपजैक टूना', ml: 'ചൂര', ta: 'சூர மீன்', te: 'స్కిప్‌జాక్ ట్యూనా', bn: 'স্কিপজ্যাক টুনা' },
  'Seer Fish': { en: 'Seer Fish', hi: 'सुरमई', ml: 'നെയ്മീൻ / അയക്കൂറ', ta: 'வஞ்சிரம்', te: 'వంజురం', bn: 'সুরমাই' },
  'Ribbon Fish': { en: 'Ribbon Fish', hi: 'रिबन फिश (बाला)', ml: 'വാള', ta: 'சாவாளை', te: 'సావాల', bn: 'ফিতা মাছ' },
  'Tiger Shrimp': { en: 'Tiger Shrimp', hi: 'टाइगर झींगा', ml: 'ടൈഗർ കൊഞ്ച്', ta: 'புலி இறால்', te: 'టైగర్ రొయ్య', bn: 'বাগদা চিংড়ি' },
  'Mackerel': { en: 'Mackerel', hi: 'मैकेरल (बांगड़ा)', ml: 'അയല', ta: 'அயலை', te: 'కాణగంతలు', bn: 'ম্যাকেরেল' },
  'Sardine': { en: 'Sardine', hi: 'तारली (सार्डिन)', ml: 'മത്തി', ta: 'மத்தி', te: 'కవ్వళ్లు', bn: 'সার্ডিন' },
  'Sardines': { en: 'Sardines', hi: 'तारली (सार्डिन)', ml: 'മത്തി', ta: 'மத்தி', te: 'కవ్వళ్లు', bn: 'সার্ডিন' },
  'Squid': { en: 'Squid', hi: 'स्क्विड (मंका)', ml: 'കൂന്തൽ', ta: 'கணவாய்', te: 'స్క్విడ్', bn: 'স্কুইড' },
  'Croaker': { en: 'Croaker', hi: 'क्रोकर (ढोमा)', ml: 'കോര', ta: 'கத்தாளை', te: 'క్రోకర్', bn: 'ভোল মাছ' },
  'Cuttlefish': { en: 'Cuttlefish', hi: 'कटलफिश', ml: 'കണവ', ta: 'கணவாய்', te: 'కటిల్‌ఫిష్', bn: 'কাটলফিশ' },
  'Kingfish': { en: 'Kingfish', hi: 'किंगफिश (सुरमई)', ml: 'നെയ്മീൻ', ta: 'வஞ்சிரம்', te: 'కింగ్‌ఫిష్', bn: 'কিংফিশ' },
  'Hilsa': { en: 'Hilsa', hi: 'हिलसा (इलिश)', ml: 'ഹിൽസ', ta: 'ஹில்சா', te: 'హిల్సా', bn: 'ইলিশ মাছ' },
  'Pomfret': { en: 'Pomfret', hi: 'पापलेट', ml: 'ആവോലി', ta: 'வாவல்', te: 'చందమామ', bn: 'পমফ্রেট' },
  'Sea Catfish': { en: 'Sea Catfish', hi: 'समुद्री शिंगाड़ा', ml: 'ഏട്ട', ta: 'கெளுத்தி', te: 'జల్లా', bn: 'ক্যাটফিশ' },
  'Tuna': { en: 'Tuna', hi: 'टूना (केदर)', ml: 'ചൂര', ta: 'சூரை', te: 'ట్యూనా', bn: 'টুনা' },
  'Reef Fish': { en: 'Reef Fish', hi: 'रीफ फिश', ml: 'പാറമീൻ', ta: 'பவளப்பாறை மீன்', te: 'రీఫ్ ఫిష్', bn: 'রিফ ফিশ' },
  'Anchovies': { en: 'Anchovies', hi: 'नेथली (एंकोवी)', ml: 'നത്തോലി (കൊഴുവ)', ta: 'நெத்திலி', te: 'నెత్తళ్ళు', bn: 'মৌরলা' },
  'Bigeye Tuna': { en: 'Bigeye Tuna', hi: 'बिगआई टूना', ml: 'വലിയ കണ്ണൻ ചൂര', ta: 'பெரியகண் சூரை', te: 'బిగ్ఐ ట్యూనా', bn: 'বিগআই টুনা' },
  'Snapper': { en: 'Snapper', hi: 'स्नैपर (तांब)', ml: 'ചെമ്പല്ലി', ta: 'சங்கரா', te: 'స్నాపర్', bn: 'স্নাপার' },
  'Mahi-Mahi': { en: 'Mahi-Mahi', hi: 'माही-माही', ml: 'മോദ', ta: 'கொப்பறை மீன்', te: 'మహి-మహి', bn: 'মাহি-মাহি' }
};

// Returns localized port name by port ID or full English name
export function getLocalizedPortName(portIdOrName: string, lang: string = 'en'): string {
  const norm = portIdOrName.toLowerCase().trim();
  
  // Check direct port id match
  for (const [id, dict] of Object.entries(PORT_TRANSLATIONS)) {
    if (id === norm || norm.includes(id)) {
      return dict[lang] || dict['en'] || portIdOrName;
    }
  }

  // Check English name match
  for (const dict of Object.values(PORT_TRANSLATIONS)) {
    if (norm.includes(dict.en.toLowerCase()) || dict.en.toLowerCase().includes(norm)) {
      return dict[lang] || dict['en'] || portIdOrName;
    }
  }

  return portIdOrName;
}

// Returns localized state name
export function getLocalizedState(stateName: string, lang: string = 'en'): string {
  const dict = STATE_TRANSLATIONS[stateName];
  if (dict && dict[lang]) return dict[lang];
  return stateName;
}

// Returns localized body of water name
export function getLocalizedSea(seaName: string, lang: string = 'en'): string {
  const dict = SEA_TRANSLATIONS[seaName];
  if (dict && dict[lang]) return dict[lang];
  return seaName;
}

// Returns localized fish species list
export function getLocalizedSpecies(speciesList: string[], lang: string = 'en'): string[] {
  return speciesList.map(s => {
    const dict = SPECIES_TRANSLATIONS[s.trim()];
    if (dict && dict[lang]) return dict[lang];
    return s;
  });
}

// Localizes turn-by-turn waypoint instructions based on language
export function localizeInstruction(instruction: string, lang: string = 'en'): string {
  if (lang === 'en' || !instruction) return instruction;

  let text = instruction;

  if (lang === 'hi') {
    text = text
      .replace(/Depart origin\. Set compass to ([A-Z]+) \(([\d\.\-]+)°\)\.?/i, 'प्रस्थान आरंभ। कम्पास को $1 ($2°) पर सेट करें।')
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, 'प्रस्थान बिंदु $1 से नौकायन शुरू करें।')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, 'चरण $1: $6 से सुरक्षित निकलने के लिए $2 ($3°) पर $4 NM ($5 मिनट) आगे बढ़ें।')
      .replace(/Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, '$5 से सुरक्षित निकलने के लिए $1 ($2°) पर $3 NM ($4 मिनट) आगे बढ़ें।')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'चरण $1: गंतव्य मत्स्य क्षेत्र ($2) पर सुरक्षित पहुंचें।')
      .replace(/Arrive at destination fishing zone \(([\d\.\-]+)°N, ([\d\.\-]+)°E\)\.?/i, 'गंतव्य मत्स्य क्षेत्र ($1°N, $2°E) पर सुरक्षित पहुंचें।')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'आपातकालीन मार्ग: $4 पर आश्रय हेतु $1 ($2°) पर $3 NM आगे बढ़ें। (पारगमन: ~$5 मिनट)')
      .replace(/Recommended safe passage bypassing (.+?)\. Navigates via coastal clear corridor\./i, '$1 को सुरक्षित दरकिनार करते हुए अनुशंसित मार्ग। तटीय स्पष्ट गलियारे से नौकायन करता है।')
      .replace(/Direct line passes through restricted boundaries or high wave hazard\./i, 'सीधा मार्ग प्रतिबंधित सीमाओं या उच्च तरंग खतरों से होकर गुजरता है।')
      .replace(/Kochi Harbor \/ Thoppumpady Fishery Port/i, 'कोच्चि हार्बर / थोप्पुमपडी मत्स्य बंदरगाह')
      .replace(/Nearshore Thermal Front/i, 'तटीय थर्मल फ्रंट')
      .replace(/Offshore Chlorophyll Convergence/i, 'अपतटीय क्लोरोफिल अभिसरण')
      .replace(/Deep Shelf Upwelling/i, 'गहरे शेल्फ का समुद्री उत्प्रवाह');
  } else if (lang === 'ml') {
    text = text
      .replace(/Depart origin\. Set compass to ([A-Z]+) \(([\d\.\-]+)°\)\.?/i, 'പുറപ്പെടൽ ആരംഭിക്കുക. കോമ്പസ് $1 ($2°) ലേക്ക് തിരിക്കുക.')
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, '$1 ലെ പ്രാരംഭ പോയിന്റിൽ നിന്ന് പുറപ്പെടുക.')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, 'ഘട്ടം $1: $6 ഒഴിവാക്കാൻ $2 ($3°) ദിശയിൽ $4 NM ($5 മിനിറ്റ്) നീങ്ങുക.')
      .replace(/Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, '$5 ഒഴിവാക്കാൻ $1 ($2°) ദിശയിൽ $3 NM ($4 മിനിറ്റ്) സഞ്ചരിക്കുക.')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'ഘട്ടം $1: ലക്ഷ്യസ്ഥാനമായ മത്സ്യബന്ധന മേഖലയിൽ ($2) എത്തിച്ചേരുക.')
      .replace(/Arrive at destination fishing zone \(([\d\.\-]+)°N, ([\d\.\-]+)°E\)\.?/i, 'ലക്ഷ്യസ്ഥാന മത്സ്യ മേഖലയിൽ ($1°N, $2°E) എത്തിച്ചേരുക.')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'അടിയന്തര പാത: $4 ൽ അഭയം തേടാൻ $1 ($2°) ദിശയിൽ $3 NM സഞ്ചരിക്കുക (സമയം: ~$5 മിനിറ്റ്)')
      .replace(/Recommended safe passage bypassing (.+?)\. Navigates via coastal clear corridor\./i, '$1 ഒഴിവാക്കുന്ന ശുപാർശിത സുരക്ഷിത പാത. തെളിഞ്ഞ തീരദേശ ചാനലിലൂടെ സഞ്ചരിക്കുന്നു.')
      .replace(/Direct line passes through restricted boundaries or high wave hazard\./i, 'നേരായ വഴി നിയന്ത്രിത അതിർത്തികളിലൂടെയോ ഉയർന്ന തിരമാല മേഖലയിലൂടെയോ കടന്നുപോകുന്നു.');
  } else if (lang === 'ta') {
    text = text
      .replace(/Depart origin\. Set compass to ([A-Z]+) \(([\d\.\-]+)°\)\.?/i, 'புறப்படுங்கள். திசைகாட்டியை $1 ($2°) இல் அமைக்கவும்.')
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, '$1 இல் உள்ள தொடக்கப் புள்ளியிலிருந்து பயணத்தைத் தொடங்கவும்.')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, 'படி $1: $6 ஐத் தவிர்க்க $2 ($3°) திசையில் $4 NM ($5 நிமிடங்கள்) செல்லவும்.')
      .replace(/Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, '$5 ஐத் தவிர்க்க $1 ($2°) திசையில் $3 NM ($4 நிமிடங்கள்) செல்லவும்.')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'படி $1: இலக்கு மீன்பிடி மண்டலத்தை ($2) அடையுங்கள்.')
      .replace(/Arrive at destination fishing zone \(([\d\.\-]+)°N, ([\d\.\-]+)°E\)\.?/i, 'இலக்கு மீன்பிடி மண்டலத்தை ($1°N, $2°E) அடையுங்கள்.')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'அவசரப் பாதை: $4 இல் புகலிடம் அடைய $1 ($2°) திசையில் $3 NM செல்லவும்.')
      .replace(/Recommended safe passage bypassing (.+?)\. Navigates via coastal clear corridor\./i, '$1 ஐத் தவிர்க்கும் பாதுகாப்பான பாதை.');
  } else if (lang === 'te') {
    text = text
      .replace(/Depart origin\. Set compass to ([A-Z]+) \(([\d\.\-]+)°\)\.?/i, 'ప్రయాణం ప్రారంభించండి. దిక్సూచిని $1 ($2°)కి సెట్ చేయండి.')
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, '$1 వద్ద ప్రారంభ బిందువు నుండి బయలుదేరండి.')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, 'దశ $1: $6 దాటడానికి $2 ($3°) దిశలో $4 NM ($5 నిమిషాలు) సాగండి.')
      .replace(/Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, '$5 నివారించడానికి $1 ($2°) దిశలో $3 NM ($4 నిమిషాలు) వెళ్లండి.')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'దశ $1: గమ్యస్థాన ఫిషింగ్ జోన్ ($2)కి చేరుకోండి.')
      .replace(/Arrive at destination fishing zone \(([\d\.\-]+)°N, ([\d\.\-]+)°E\)\.?/i, 'గమ్యస్థాన ఫిషింగ్ జోన్ ($1°N, $2°E)కి చేరుకోండి.')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'అత్యవసర మార్గం: $4 వద్ద ఆశ్రయం కోసం $1 ($2°) దిశలో $3 NM వెళ్లండి.');
  } else if (lang === 'bn') {
    text = text
      .replace(/Depart origin\. Set compass to ([A-Z]+) \(([\d\.\-]+)°\)\.?/i, 'যাত্রা শুরু করুন। কম্পাস $1 ($2°) তে সেট করুন।')
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, '$1 প্রস্থান বিন্দু থেকে যাত্রা শুরু করুন।')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, 'ধাপ $1: $6 অতিক্রম করতে $2 ($3°) দিকে $4 NM ($5 মিনিট) চলুন।')
      .replace(/Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear (.+?)\.?/i, '$5 এড়াতে $1 ($2°) দিকে $3 NM ($4 মিনিট) চলুন।')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'ধাপ $1: গন্তব্য মাছ ধরার অঞ্চলে ($2) নিরাপদে পৌঁছান।')
      .replace(/Arrive at destination fishing zone \(([\d\.\-]+)°N, ([\d\.\-]+)°E\)\.?/i, 'গন্তব্য মাছ ধরার এলাকায় ($1°N, $2°E) পৌঁছান।')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'জরুরি পথ: $4 এ আশ্রয়ের জন্য $1 ($2°) দিকে $3 NM এগোন।');
  }

  return text;
}

// Localizes target fishing ground name
export function localizeDestination(targetName: string, lang: string = 'en'): string {
  if (lang === 'en' || !targetName) return targetName;

  let name = targetName;

  // Handle generic waypoint names
  if (lang === 'hi') {
    name = name
      .replace(/Port Departure \(Origin\)/i, 'बंदरगाह प्रस्थान (आरंभ)')
      .replace(/Destination Fishing Zone/i, 'गंतव्य मत्स्य क्षेत्र')
      .replace(/Safe Detour: W of (.+)/i, 'सुरक्षित मोड़: $1 के पश्चिम')
      .replace(/Safe Detour: E of (.+)/i, 'सुरक्षित मोड़: $1 के पूर्व')
      .replace(/Spot (\d+):?/i, 'स्थान $1:')

      .replace(/Nearshore Thermal Front Alpha/i, 'तटीय थर्मल फ्रंट अल्फा')
      .replace(/Coastal Upwelling Convergence Beta/i, 'तटीय उत्प्रवाह अभिसरण बीटा')
      .replace(/SST Gradient Front Gamma/i, 'एसएसटी प्रवणता फ्रंट गामा')
      .replace(/Coastal Convergence Zone Delta/i, 'तटीय अभिसरण क्षेत्र डेल्टा')
      .replace(/Nearshore Upwelling Patch Epsilon/i, 'तटीय उत्प्रवाह पैच एप्सिलॉन')
      .replace(/Coastal Thermal Front Zeta/i, 'तटीय थर्मल फ्रंट ज़ेटा')
      .replace(/Pelagic Convergence Patch Eta/i, 'पेलाजिक अभिसरण पैच ईटा')
      .replace(/Outer Coastal Boundary Theta/i, 'बाहरी तटीय सीमा थीटा')
      .replace(/Nearshore Thermal Front/i, 'तटीय थर्मल फ्रंट')
      .replace(/Offshore Chlorophyll Convergence/i, 'अपतटीय क्लोरोफिल अभिसरण')
      .replace(/Deep Shelf Upwelling/i, 'गहरे शेल्फ का समुद्री उत्प्रवाह')
      .replace(/Coastal Upwelling Plume/i, 'तटीय उत्प्रवाह प्लूम')
      .replace(/Pelagic Convergence Zone/i, 'पेलाजिक अभिसरण क्षेत्र');
  } else if (lang === 'ml') {
    name = name
      .replace(/Port Departure \(Origin\)/i, 'തുറമുഖം പുറപ്പെടൽ (തുടക്കം)')
      .replace(/Destination Fishing Zone/i, 'ലക്ഷ്യസ്ഥാന മത്സ്യബന്ധന മേഖല')
      .replace(/Safe Detour: W of (.+)/i, 'സുരക്ഷിത വഴിതിരിവ്: $1 പടിഞ്ഞാറ്')
      .replace(/Safe Detour: E of (.+)/i, 'സുരക്ഷിത വഴിതിരിവ്: $1 കിഴക്ക്')
      .replace(/Spot (\d+):?/i, 'സ്പോട്ട് $1:')
      .replace(/Nearshore Thermal Front Alpha/i, 'തീരദേശ തെർമൽ ഫ്രണ്ട് ആൽഫ')
      .replace(/Coastal Upwelling Convergence Beta/i, 'തീരദേശ അപ്‌വെല്ലിംഗ് സംഗമം ബീറ്റ')
      .replace(/SST Gradient Front Gamma/i, 'എസ്.എസ്.ടി ഗ്രേഡിയന്റ് ഫ്രണ്ട് ഗാമ')
      .replace(/Coastal Convergence Zone Delta/i, 'തീരദേശ സംഗമ മേഖല ഡെൽറ്റ')
      .replace(/Nearshore Upwelling Patch Epsilon/i, 'തീരദേശ നീരൊഴുക്ക് പാച്ച് എപ്സിലോൺ')
      .replace(/Coastal Thermal Front Zeta/i, 'തീരദേശ തെർമൽ ഫ്രണ്ട് സീറ്റ')
      .replace(/Pelagic Convergence Patch Eta/i, 'പെലാജിക് സംഗമ പാച്ച് ഈറ്റ')
      .replace(/Outer Coastal Boundary Theta/i, 'പുറംതീര അതിർത്തി തീറ്റ')
      .replace(/Nearshore Thermal Front/i, 'തീരദേശ തെർമൽ ഫ്രണ്ട്')
      .replace(/Offshore Chlorophyll Convergence/i, 'ആഴക്കടൽ ക്ലോറോഫിൽ സംഗമം')
      .replace(/Deep Shelf Upwelling/i, 'ആഴക്കടൽ തണുത്ത നീരൊഴുക്ക്')
      .replace(/Coastal Upwelling Plume/i, 'തീരദേശ ഉറവ പ്ലൂം')
      .replace(/Pelagic Convergence Zone/i, 'പെലാജിക് സംഗമ മേഖല');
  } else if (lang === 'ta') {
    name = name
      .replace(/Port Departure \(Origin\)/i, 'துறைமுக புறப்பாடு (தொடக்க புள்ளி)')
      .replace(/Destination Fishing Zone/i, 'இலக்கு மீன்பிடி மண்டலம்')
      .replace(/Safe Detour: W of (.+)/i, 'பாதுகாப்பான மாற்றுப்பாதை: $1 மேற்கே')
      .replace(/Safe Detour: E of (.+)/i, 'பாதுகாப்பான மாற்றுப்பாதை: $1 கிழக்கே')
      .replace(/Spot (\d+):?/i, 'இடம் $1:')
      .replace(/Nearshore Thermal Front Alpha/i, 'கடலோர வெப்ப முன்னணி ஆல்ஃபா')
      .replace(/Coastal Upwelling Convergence Beta/i, 'கடலோர நீரோட்ட சங்கமம் பீட்டா')
      .replace(/SST Gradient Front Gamma/i, 'SST சரிவு முன்னணி காமா')
      .replace(/Coastal Convergence Zone Delta/i, 'கடலோர சங்கம மண்டலம் டெல்டா')
      .replace(/Nearshore Upwelling Patch Epsilon/i, 'கடலோர நீரோட்ட பகுதி எப்சிலான்')
      .replace(/Coastal Thermal Front Zeta/i, 'கடலோர வெப்ப முன்னணி ஜீட்டா')
      .replace(/Pelagic Convergence Patch Eta/i, 'ஆழ்கடல் சங்கம பகுதி ஈட்டா')
      .replace(/Outer Coastal Boundary Theta/i, 'வெளிப்புற கடலோர எல்லை தீட்டா')
      .replace(/Nearshore Thermal Front/i, 'கடலோர வெப்ப முன்னணி')
      .replace(/Offshore Chlorophyll Convergence/i, 'ஆழ்கடல் குளோரோபில் மண்டலம்')
      .replace(/Deep Shelf Upwelling/i, 'ஆழ்கடல் நீரோட்டம்')
      .replace(/Coastal Upwelling Plume/i, 'கடலோர நீரோட்ட ப்ளூம்')
      .replace(/Pelagic Convergence Zone/i, 'ஆழ்கடல் சங்கம மண்டலம்');
  } else if (lang === 'te') {
    name = name
      .replace(/Port Departure \(Origin\)/i, 'ఓడరేవు నిష్క్రమణ (ప్రారంభం)')
      .replace(/Destination Fishing Zone/i, 'గమ్యస్థాన ఫిషింగ్ జోన్')
      .replace(/Safe Detour: W of (.+)/i, 'సురక్షిత ప్రత్యామ్నాయం: $1 పశ్చిమాన')
      .replace(/Safe Detour: E of (.+)/i, 'సురక్షిత ప్రత్యామ్నాయం: $1 తూర్పున')
      .replace(/Spot (\d+):?/i, 'స్పాట్ $1:')
      .replace(/Nearshore Thermal Front Alpha/i, 'తీరప్రాంత థర్మల్ ఫ్రంట్ ఆల్ఫా')
      .replace(/Coastal Upwelling Convergence Beta/i, 'తీరప్రాంత అప్‌వెల్లింగ్ సంగమం బీటా')
      .replace(/SST Gradient Front Gamma/i, 'SST గ్రేడియంట్ ఫ్రంట్ గామా')
      .replace(/Coastal Convergence Zone Delta/i, 'తీరప్రాంత సంగమ జోన్ డెల్టా')
      .replace(/Nearshore Upwelling Patch Epsilon/i, 'తీరప్రాంత నీటి ఉప్పెన ఎప్సిలాన్')
      .replace(/Coastal Thermal Front Zeta/i, 'తీరప్రాంత థర్మల్ ఫ్రంట్ జీటా')
      .replace(/Pelagic Convergence Patch Eta/i, 'పెలాజిక్ కన్వర్జెన్స్ ప్యాచ్ ఈటా')
      .replace(/Outer Coastal Boundary Theta/i, 'బాహ్య తీరప్రాంత సరిహద్దు తీటా')
      .replace(/Nearshore Thermal Front/i, 'తీరప్రాంత థర్మల్ ఫ్రంట్')
      .replace(/Offshore Chlorophyll Convergence/i, 'ఆఫ్‌షోర్ క్లోరోఫిల్ సంగమం')
      .replace(/Deep Shelf Upwelling/i, 'డీప్ షెల్ఫ్ అప్‌వెల్లింగ్');
  } else if (lang === 'bn') {
    name = name
      .replace(/Port Departure \(Origin\)/i, 'বন্দর প্রস্থান (সূচনা)')
      .replace(/Destination Fishing Zone/i, 'গন্তব্য মাছ ধরার অঞ্চল')
      .replace(/Safe Detour: W of (.+)/i, 'নিরাপদ বিকল্প পথ: $1 পশ্চিমে')
      .replace(/Safe Detour: E of (.+)/i, 'নিরাপদ বিকল্প পথ: $1 পূর্বে')
      .replace(/Spot (\d+):?/i, 'স্পট $1:')
      .replace(/Nearshore Thermal Front Alpha/i, 'উপকূলীয় থার্মাল ফ্রন্ট আলফা')
      .replace(/Coastal Upwelling Convergence Beta/i, 'উপকূলীয় উদ্বেলন অভিসরণ বিটা')
      .replace(/SST Gradient Front Gamma/i, 'এসএসটি গ্রেডিয়েন্ট ফ্রন্ট গামা')
      .replace(/Coastal Convergence Zone Delta/i, 'উপকূলীয় অভিসরণ অঞ্চল ডেল্টা')
      .replace(/Nearshore Upwelling Patch Epsilon/i, 'উপকূলীয় উদ্বেলন প্যাচ এপসিলন')
      .replace(/Coastal Thermal Front Zeta/i, 'উপকূলীয় থার্মাল ফ্রন্ট জিটা')
      .replace(/Pelagic Convergence Patch Eta/i, 'পেলাজিক অভিসরণ প্যাচ ইটা')
      .replace(/Outer Coastal Boundary Theta/i, 'বহিঃ উপকূলীয় সীমানা থিটা')
      .replace(/Nearshore Thermal Front/i, 'উপকূলীয় থার্মাল ফ্রন্ট')
      .replace(/Offshore Chlorophyll Convergence/i, 'অপতীরবর্তী ক্লোরোফিল সঙ্গম')
      .replace(/Deep Shelf Upwelling/i, 'গভীর সমুদ্রের জলীয় উদ্বেলন');
  }

  return name;
}

// Localizes PFZ zone recommendations
export function getLocalizedRecommendation(rec: string, lang: string = 'en'): string {
  if (lang === 'en' || !rec) return rec;

  const RECOMMENDATIONS_MAP: Record<string, Record<string, string>> = {
    'High-density chlorophyll front. Ideal for sardine & mackerel near the thermal gradient.': {
      hi: 'उच्च घनत्व वाला क्लोरोफिल फ्रंट। थर्मल प्रवणता के पास सार्डिन और मैकेरल के लिए आदर्श।',
      ml: 'ഉയർന്ന സാന്ദ്രതയുള്ള ക്ലോറോഫിൽ ഫ്രണ്ട്. ചാള, അയല എന്നിവയ്ക്ക് ഉത്തമം.',
      ta: 'அதிக அடர்த்தி கொண்ட குளோரோபில் பகுதி. மத்தி மற்றும் கானாங்கெளுத்தி மீன்களுக்கு உகந்தது.',
      te: 'అధిక క్లోరోఫిల్ ప్రాంతం. సార్డిన్ మరియు మాకేరల్ చేపలకు అత్యంత అనుకూలం.',
      bn: 'উচ্চ ঘনত্বের ক্লোরোফিল ফ্রন্ট। সার্ডিন ও ম্যাকেরেল মাছের জন্য আদর্শ।'
    },
    'Active coastal upwelling. Rich nutrient surge supporting anchovy and scad aggregations.': {
      hi: 'सक्रिय तटीय उत्प्रवाह। एंकोवी और स्कैड के झुंड का समर्थन करने वाला पोषक प्रवाह।',
      ml: 'സജീവ തീരദേശ നീരൊഴുക്ക്. നെത്തോലി, വറ്റ എന്നിവയുടെ കൂട്ടങ്ങൾ ലഭ്യമാണ്.',
      ta: 'செயலில் உள்ள நீரோட்டம். நெத்திலி மற்றும் காரல் மீன்களின் செழிப்பு பகுதி.',
      te: 'చురుకైన తీరప్రాంత అప్‌వెల్లింగ్. నెత్తళ్ళు మరియు ఇతర చేపల లభ్యత ఎక్కువ.',
      bn: 'সক্রিয় উপকূলীয় উদ্বেলন। পুষ্টিসমৃদ্ধ অঞ্চলে ছোট মাছের ঝাঁক বিরাজমান।'
    },
    'Optimal SST gradient (ΔT=0.8°C). Pelagic tuna and kingfish likely present.': {
      hi: 'अनुकूल एसएसटी प्रवणता (ΔT=0.8°C)। टूना और सुरमई मछलियों की प्रबल संभावना।',
      ml: 'അനുകൂല താപനില വ്യതിയാനം (ΔT=0.8°C). ചൂര, നെയ്മീൻ എന്നിവ ലഭിക്കാൻ സാധ്യത.',
      ta: 'உகந்த வெப்பநிலை சரிவு (ΔT=0.8°C). சூரை மற்றும் வஞ்சிரம் மீன்கள் கிடைக்கும் வாய்ப்பு.',
      te: 'అనుకూల ఉష్ణోగ్రత మార్పు (ΔT=0.8°C). ట్యూనా మరియు వంజరం చేపలు లభించే అవకాశం.',
      bn: 'অনুকূল এসএসটি তারতম্য (ΔT=০.৮°C)। টুনা ও সুরমাই মাছের প্রাচুর্য।'
    },
    'Nearshore convergence. Mixed pelagic aggregation. Suitable for artisanal gill-netting.': {
      hi: 'तटीय अभिसरण। मिश्रित मछलियों का झुंड। गिल-नेटिंग के लिए पूरी तरह उपयुक्त।',
      ml: 'തീരദേശ സംഗമം. ചെറുവള്ളങ്ങൾക്കും ഗിൽ-നെറ്റ് വലകൾക്കും അനുയോജ്യം.',
      ta: 'கடலோர சங்கமம். பாரம்பரிய வலைகளுக்கு மிகவும் பொருத்தமானது.',
      te: 'తీరప్రాంత సంగమం. సంప్రదాయ వలలకు మరియు బోట్లకు అనుకూలం.',
      bn: 'উপকূলীয় অভিসরণ। সাধারণ গিল-নেট জালে মাছ ধরার উপযুক্ত ক্ষেত্র।'
    },
    'High productivity thermal boundary. Safe nearshore transit under 7 km.': {
      hi: 'उच्च उत्पादकता थर्मल सीमा। 7 किमी से कम सुरक्षित तटीय पारगमन।',
      ml: 'ഉയർന്ന ഉൽപാദനക്ഷമതയുള്ള മേഖല. 7 കി.മീ താഴെ സുരക്ഷിത യാത്ര.',
      ta: 'அதிக உற்பத்தி திறன் கொண்ட பகுதி. 7 கி.மீக்குள் பாதுகாப்பான பயணம்.',
      te: 'అధిక ఉత్పాదకత సరిహద్దు. 7 కి.మీ లోపు సురక్షిత ప్రయాణం.',
      bn: 'উচ্চ উৎপাদনশীল থার্মাল সীমানা। ৭ কিমির মধ্যে নিরাপদ স্বল্প দূরত্বের যাত্রা।'
    },
    'Clear coastal water. Short nautical transit (~4.5 NM); low fuel consumption.': {
      hi: 'स्वच्छ तटीय जल। छोटी समुद्री यात्रा (~4.5 NM); कम ईंधन खपत।',
      ml: 'തെളിഞ്ഞ തീരക്കടൽ. കുറഞ്ഞ യാത്രാദൂരം (~4.5 NM); കുറഞ്ഞ ഇന്ധനച്ചെലവ്.',
      ta: 'தெளிவான கடற்பகுதி. குறுகிய பயணம் (~4.5 NM); குறைந்த எரிபொருள் செலவு.',
      te: 'స్వచ్ఛమైన తీర జలాలు. తక్కువ ప్రయాణ దూరం (~4.5 NM); తక్కువ ఇంధనం ఖర్చు.',
      bn: 'স্বচ্ছ উপকূলীয় জল। স্বল্প দূরত্বের জলযাত্রা (~৪.৫ নটিক্যাল মাইল); কম জ্বালানী খরচ।'
    },
    'Healthy phytoplankton concentration. Verified clear of shipping lanes and borders.': {
      hi: 'स्वस्थ फाइटोप्लांकटन सांद्रता। शिपिंग लेन और सीमाओं से पूरी तरह मुक्त सत्यापित।',
      ml: 'ഫൈറ്റോപ്ലാങ്ക്ടൺ സാന്നിധ്യം. കപ്പൽ ചാലുകളിൽ നിന്നും അതിർത്തികളിൽ നിന്നും മുക്തം.',
      ta: 'சிறந்த நுண்ணுயிர் தாவரங்கள். கப்பல் போக்குவரத்து பாதை மற்றும் எல்லைகளில் இருந்து விலகியுள்ளது.',
      te: 'మంచి ఫైటోప్లాంక్టన్ సాంద్రత. షిప్పింగ్ లేన్లు మరియు సరిహద్దుల నుండి సురక్షితం.',
      bn: 'স্বাস্থ্যকর ফাইটোপ্ল্যাঙ্কটন ঘনত্ব। জাহাজ চলাচলের চ্যানেল ও আন্তর্জাতিক সীমান্ত মুক্ত।'
    },
    'Near 9.5 km boundary. Good pelagic yield; check evening swell before casting off.': {
      hi: '9.5 किमी सीमा के निकट। अच्छी मछली उपज; प्रस्थान से पहले शाम की लहरों की जांच करें।',
      ml: '9.5 കി.മീ അതിർത്തിക്കടുത്ത്. നല്ല വിളവ്; പുറപ്പെടുന്നതിന് മുൻപ് തിരമാലകൾ ശ്രദ്ധിക്കുക.',
      ta: '9.5 கி.மீ எல்லைக்கருகில். நல்ல மீன் வளம்; புறப்படும் முன் மாலை நேர அலைகளை கவனிக்கவும்.',
      te: '9.5 కి.మీ సరిహద్దు సమీపంలో. మంచి చేపల లభ్యత; బయలుదేరే ముందు సాయంత్రపు అలలను గమనించండి.',
      bn: '৯.৫ কিমি সীমানার কাছে। ভালো মাছের ফলন; রওনা হওয়ার পূর্বে সন্ধ্যার ঢেউ পর্যবেক্ষণ করুন।'
    }
  };

  for (const [key, trans] of Object.entries(RECOMMENDATIONS_MAP)) {
    if (rec.includes(key) || key.includes(rec)) {
      return trans[lang] || rec;
    }
  }

  // Dynamic regex matching for backend generated thermal front recommendations
  const sstMatch = rec.match(/([\d\.]+)\s*°?C/i);
  const chlMatch = rec.match(/Chl:\s*([\d\.]+)/i);
  const distMatch = rec.match(/([\d\.]+)\s*km/i);
  const nmMatch = rec.match(/~?([\d\.]+)\s*NM/i);

  if ((rec.toLowerCase().includes('thermal front') || rec.toLowerCase().includes('high-yield') || rec.toLowerCase().includes('minimizes transit')) && sstMatch && distMatch) {
    const sst = sstMatch[1];
    const chl = chlMatch ? chlMatch[1] : '2.85';
    const dist = distMatch[1];
    const nm = nmMatch ? nmMatch[1] : (parseFloat(dist) * 0.54).toFixed(1);

    if (lang === 'hi') {
      return `उच्च-उत्पादकता थर्मल फ्रंट (${sst}°C, क्लोरोफिल: ${chl} mg/m³)। निकट दूरी (${dist} किमी, ~${nm} NM) यात्रा समय व ईंधन की खपत कम करती है।`;
    }
    if (lang === 'ml') {
      return `ഉയർന്ന വിളവ് നൽകുന്ന തെർമൽ ഫ്രണ്ട് (${sst}°C, ക്ലോറോഫിൽ: ${chl} mg/m³). കുറഞ്ഞ ദൂരം (${dist} കി.മീ, ~${nm} NM) യാത്രാ സമയവും ഇന്ധനച്ചെലവും കുറയ്ക്കുന്നു.`;
    }
    if (lang === 'ta') {
      return `அதிக மீன்வளம் தரும் வெப்ப முகப்பு (${sst}°C, குளோரோபில்: ${chl} mg/m³). குறுகிய தூரம் (${dist} கி.மீ, ~${nm} NM) பயண நேரத்தையும் எரிபொருள் செலவையும் குறைக்கிறது.`;
    }
    if (lang === 'te') {
      return `అధిక ఉత్పాదకత కలిగిన థర్మల్ ఫ్రంట్ (${sst}°C, క్లోరోఫిల్: ${chl} mg/m³). దగ్గరి పరిధి (${dist} కి.మీ, ~${nm} NM) ప్రయాణ సమయాన్ని మరియు ఇంధన వినియోగాన్ని తగ్గిస్తుంది.`;
    }
    if (lang === 'bn') {
      return `উচ্চ ফলনশীল থার্মাল ফ্রন্ট (${sst}°C, ক্লোরোফিল: ${chl} mg/m³)। স্বল্প দূরত্ব (${dist} কিমি, ~${nm} নটিক্যাল মাইল) যাতায়াতের সময় ও জ্বালানি খরচ কমায়।`;
    }
  }

  if (rec.toLowerCase().includes('minimizes transit time') || rec.toLowerCase().includes('fuel consumption')) {
    if (lang === 'hi') return 'उच्च-उत्पादकता थर्मल फ्रंट। निकट दूरी यात्रा समय और ईंधन खपत को न्यूनतम करती है।';
    if (lang === 'ml') return 'ഉയർന്ന വിളവ് നൽകുന്ന തെർമൽ ഫ്രണ്ട്. കുറഞ്ഞ ദൂരം യാത്രാ സമയവും ഇന്ധനച്ചെലവും കുറയ്ക്കുന്നു.';
    if (lang === 'ta') return 'அதிக மீன்வளம் தரும் வெப்ப முகப்பு. குறுகிய தூரம் பயண நேரத்தையும் எரிபொருள் செலவையும் குறைக்கிறது.';
    if (lang === 'te') return 'అధిక ఉత్పాదకత కలిగిన థర్మల్ ఫ్రంట్. దగ్గరి పరిధి ప్రయాణ సమయాన్ని మరియు ఇంధన వినియోగాన్ని తగ్గిస్తుంది.';
    if (lang === 'bn') return 'উচ্চ ফলনশীল থার্মাল ফ্রন্ট। স্বল্প দূরত্ব যাতায়াতের সময় ও জ্বালানি খরচ কমায়।';
  }

  return rec;
}

// Localizes risk factor names
export function getLocalizedRiskFactor(factorName: string, lang: string = 'en'): string {
  if (lang === 'en' || !factorName) return factorName;

  const FACTORS_MAP: Record<string, Record<string, string>> = {
    'Wave Swell': { hi: 'तरंग एवं समुद्री लहरें', ml: 'തിരമാലകൾ', ta: 'அலைகள்', te: 'సముద్రపు అలలు', bn: 'ঢেউয়ের উচ্চতা' },
    'Wind Speed': { hi: 'हवा की गति', ml: 'കാറ്റിന്റെ വേഗത', ta: 'காற்றின் வேகம்', te: 'గాలి వేగం', bn: 'বাতাসের গতি' },
    'Distance to Shore': { hi: 'तट से दूरी', ml: 'തീരത്തുനിന്നുള്ള ദൂരം', ta: 'கரையிலிருந்து தூரம்', te: 'తీరం నుండి దూరం', bn: 'তীর থেকে দূরত্ব' },
    'Lightning Risk': { hi: 'आकाशीय बिजली का खतरा', ml: 'ഇടിമിന്നൽ സാധ്യത', ta: 'மின்னல் ஆபத்து', te: 'పిడుగుపాటు ముప్పు', bn: 'বজ্রপাতের ঝুঁকি' },
    'IMBL Proximity': { hi: 'अंतरराष्ट्रीय सीमा से निकटता', ml: 'അതിർത്തി സാമീപ്യം', ta: 'எல்லை அருகாமை', te: 'సరిహద్దు సమీపత', bn: 'সীমান্তের নিকটবর্তিতা' }
  };

  return FACTORS_MAP[factorName]?.[lang] || factorName;
}

// Localizes safety verdict
export function getLocalizedRiskVerdict(verdict: string, lang: string = 'en'): string {
  if (lang === 'en' || !verdict) return verdict;

  const VERDICTS_MAP: Record<string, Record<string, string>> = {
    'SAFE TO VENTURE': { hi: 'नौकायन हेतु सुरक्षित', ml: 'യാത്രയ്ക്ക് സുരക്ഷിതം', ta: 'பயணத்திற்கு பாதுகாப்பானது', te: 'ప్రయాణానికి సురక్షితం', bn: 'যাত্রার জন্য নিরাপদ' },
    'CAUTION ADVISED': { hi: 'सावधानी बरतने की सलाह', ml: 'ജാഗ്രത പാലിക്കുക', ta: 'எச்சரிக்கை தேவை', te: 'జాగ్రత్త అవసరం', bn: 'সতর্কতা অবলম্বনের পরামর্শ' },
    'UNSAFE / AVOID': { hi: 'असुरक्षित / प्रस्थान न करें', ml: 'അപകടകരം / ഒഴിവാക്കുക', ta: 'ஆபத்தானது / தவிர்க்கவும்', te: 'ప్రమాదకరం / నివారించండి', bn: 'বিপজ্জনক / যাত্রা পরিহার করুন' }
  };

  return VERDICTS_MAP[verdict]?.[lang] || verdict;
}

