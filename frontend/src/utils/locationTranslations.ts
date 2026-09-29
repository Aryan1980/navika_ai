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
  if (lang === 'en') return instruction;

  let text = instruction;

  if (lang === 'hi') {
    text = text
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, 'प्रस्थान बिंदु $1 से नौकायन शुरू करें।')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear Harbor Channel & Breakwater Exit\.?/i, 'चरण $1: बंदरगाह चैनल और ब्रेकवाटर निकास पार करने के लिए $2 ($3°) पर $4 NM ($5 मिनट) आगे बढ़ें।')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'चरण $1: गंतव्य मत्स्य क्षेत्र ($2) पर सुरक्षित पहुंचें।')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'आपातकालीन मार्ग: $4 पर आश्रय हेतु $1 ($2°) पर $3 NM आगे बढ़ें। (पारगमन समय: ~$5 मिनट)')
      .replace(/Kochi Harbor \/ Thoppumpady Fishery Port/i, 'कोच्चि हार्बर / थोप्पुमपडी मत्स्य बंदरगाह')
      .replace(/Nearshore Thermal Front/i, 'तटीय थर्मल फ्रंट (मत्स्य क्षेत्र)')
      .replace(/Offshore Chlorophyll Convergence/i, 'अपतटीय क्लोरोफिल अभिसरण')
      .replace(/Deep Shelf Upwelling/i, 'गहरे शेल्फ का समुद्री उत्प्रवाह');
  } else if (lang === 'ml') {
    text = text
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, '$1 ലെ പ്രാരംഭ പോയിന്റിൽ നിന്ന് പുറപ്പെടുക.')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear Harbor Channel & Breakwater Exit\.?/i, 'ഘട്ടം $1: ഹാർബർ ചാനലും ബ്രേക്ക്‌വാട്ടറും കടക്കാൻ $2 ($3°) ദിശയിൽ $4 NM ($5 മിനിറ്റ്) നീങ്ങുക.')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'ഘട്ടം $1: ലക്ഷ്യസ്ഥാനമായ മത്സ്യബന്ധന മേഖലയിൽ ($2) എത്തിച്ചേരുക.')
      .replace(/Emergency Course: Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM to shelter at (.+?)\. \(Transit: ~(\d+) mins\)/i, 'അടിയന്തര പാത: $4 ൽ അഭയം തേടാൻ $1 ($2°) ദിശയിൽ $3 NM സഞ്ചരിക്കുക (സമയം: ~$5 മിനിറ്റ്)');
  } else if (lang === 'ta') {
    text = text
      .replace(/Depart starting point at ([\d\.\-]+°N, [\d\.\-]+°E)\.?/i, '$1 இல் உள்ள புறப்படும் புள்ளியிலிருந்து பயணத்தைத் தொடங்கவும்.')
      .replace(/Leg (\d+): Steer ([A-Z]+) \(([\d\.\-]+)°\) for ([\d\.\-]+) NM \((\d+) mins\) to clear Harbor Channel & Breakwater Exit\.?/i, 'படி $1: துறைமுக சேனலை கடக்க $2 ($3°) திசையில் $4 NM ($5 நிமிடங்கள்) செல்லவும்.')
      .replace(/Leg (\d+): Arrive at destination fishing zone \(([\d\.\-]+°N, [\d\.\-]+°E)\)\.?/i, 'படி $1: இலக்கு மீன்பிடி மண்டலத்தை ($2) அடையுங்கள்.');
  }

  return text;
}

// Localizes target fishing ground name
export function localizeDestination(targetName: string, lang: string = 'en'): string {
  if (lang === 'en') return targetName;

  if (lang === 'hi') {
    return targetName
      .replace(/Nearshore Thermal Front/i, 'तटीय थर्मल फ्रंट')
      .replace(/Offshore Chlorophyll Convergence/i, 'अपतटीय क्लोरोफिल अभिसरण')
      .replace(/Deep Shelf Upwelling/i, 'गहरे शेल्फ का समुद्री उत्प्रवाह')
      .replace(/Coastal Upwelling Plume/i, 'तटीय उत्प्रवाह प्लूम')
      .replace(/Pelagic Convergence Zone/i, 'पेलाजिक अभिसरण क्षेत्र');
  }
  if (lang === 'ml') {
    return targetName
      .replace(/Nearshore Thermal Front/i, 'തീരദേശ തെർമൽ ഫ്രണ്ട്')
      .replace(/Offshore Chlorophyll Convergence/i, 'ആഴക്കടൽ ക്ലോറോഫിൽ സംഗമം')
      .replace(/Deep Shelf Upwelling/i, 'ആഴക്കടൽ തണുത്ത നീരൊഴുക്ക്');
  }
  if (lang === 'ta') {
    return targetName
      .replace(/Nearshore Thermal Front/i, 'கடலோர வெப்ப முன்னணி')
      .replace(/Offshore Chlorophyll Convergence/i, 'ஆழ்கடல் குளோரோபில் மண்டலம்');
  }

  return targetName;
}
