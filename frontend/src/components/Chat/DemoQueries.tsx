import React from 'react';
import { useApp } from '../../context/AppContext';

const LOCALIZED_DEMO_QUERIES: Record<string, string[]> = {
  hi: [
    'निकटतम मत्स्य क्षेत्र (PFZ) कहाँ है?',
    'क्या कल सुबह मछली पकड़ने जाना सुरक्षित है?',
    'समुद्र में लहरों और हवा की स्थिति क्या है?',
    'उच्च क्लोरोफिल और अनुकूल तापमान वाले क्षेत्र दिखाएं',
    'सबसे सुरक्षित मत्स्य क्षेत्र कौन सा है?',
    'निकटतम PFZ के लिए सुरक्षित मार्ग खोजें',
    'क्या कोई चक्रवात या बिजली गिरने की चेतावनी है?',
    'क्या मैं किसी प्रतिबंधित क्षेत्र के करीब पहुंच रहा हूँ?'
  ],
  ml: [
    'ഏറ്റവും അടുത്തുള്ള മത്സ്യബന്ധന മേഖല എവിടെയാണ്?',
    'നാളെ രാവിലെ കടലിൽ പോകുന്നത് സുരക്ഷിതമാണോ?',
    'തിരമാലകളുടെയും കാറ്റിന്റെയും അവസ്ഥ എന്താണ്?',
    'കൂടുതൽ മീൻ ലഭിക്കാൻ സാധ്യതയുള്ള മേഖലകൾ കാണിക്കുക',
    'ഏറ്റവും സുരക്ഷിതമായ മത്സ്യബന്ധന മേഖല ഏതാണ്?',
    'ഏറ്റവും അടുത്തുള്ള മേഖലയിലേക്ക് സുരക്ഷിതമായ പാത കണ്ടെത്തുക',
    'ചുഴലിക്കാറ്റ് അല്ലെങ്കിൽ ഇടിമിന്നൽ മുന്നറിയിപ്പുകൾ ഉണ്ടോ?',
    'ഞാൻ എന്തെങ്കിലും നിയന്ത്രിത മേഖലയ്ക്ക് സമീപമാണോ?'
  ],
  ta: [
    'அருகிலுள்ள மீன்பிடி மண்டலம் எங்குள்ளது?',
    'நாளை காலை மீன்பிடிக்க செல்வது பாதுகாப்பானதா?',
    'அலை மற்றும் காற்றின் நிலை என்ன?',
    'அதிக மீன்வளம் கொண்ட பகுதிகளைக் காட்டுங்கள்',
    'எந்த மீன்பிடி மண்டலம் மிகவும் பாதுகாப்பானது?',
    'அருகிலுள்ள மண்டலத்திற்கு பாதுகாப்பான வழியைக் கண்டறியவும்',
    'சூறாவளி அல்லது மின்னல் எச்சரிக்கைகள் உள்ளதா?',
    'நான் தடைசெய்யப்பட்ட பகுதிக்கு அருகில் செல்கிறேனா?'
  ],
  te: [
    'సమీప చేపల వేట ప్రాంతం ఎక్కడ ఉంది?',
    'రేపు ఉదయం వేటకు వెళ్లడం సురక్షితమేనా?',
    'అలలు మరియు గాలి పరిస్థితులు ఎలా ఉన్నాయి?',
    'చేపలు ఎక్కువగా దొరికే అనుకూల ప్రాంతాలను చూపించు',
    'ఏ చేపల వేట ప్రాంతం అత్యంత సురక్షితమైనది?',
    'సమీప ప్రాంతానికి సురక్షిత మార్గాన్ని కనుగొనండి',
    'తుఫాను లేదా మెరుపు హెచ్చరికలు ఉన్నాయా?',
    'నేను ఏదైనా నిషేధిత ప్రాంతానికి సమీపిస్తున్నానా?'
  ],
  bn: [
    'নিকটতম মাছ ধরার অঞ্চল (PFZ) কোথায়?',
    'কাল সকালে মাছ ধরতে যাওয়া কি নিরাপদ?',
    'ঢেউ এবং বাতাসের অবস্থা কেমন?',
    'উচ্চ ক্লোরোফিল এবং অনুকূল তাপমাত্রার অঞ্চল দেখান',
    'কোন মাছ ধরার অঞ্চলটি সবচেয়ে নিরাপদ?',
    'নিকটতম PFZ-এর নিরাপদ রুট খুঁজুন',
    'কোন ঘূর্ণিঝড় বা বজ্রপাতের সতর্কতা আছে কি?',
    'আমি কি কোনো নিষিদ্ধ এলাকার কাছাকাছি যাচ্ছি?'
  ],
  en: [
    'Where is the nearest PFZ?',
    'Is it safe to go fishing tomorrow morning?',
    'What are the wave and wind conditions?',
    'Show areas with high chlorophyll and favourable SST',
    'Which PFZ is safest?',
    'Find a safe route to the nearest PFZ',
    'Are there any cyclone or lightning alerts?',
    'Am I approaching a restricted area?'
  ]
};

export const DemoQueries: React.FC = () => {
  const { sendQuery, isAnalyzing, language } = useApp();
  const queries = LOCALIZED_DEMO_QUERIES[language] || LOCALIZED_DEMO_QUERIES.en;

  return (
    <div className="border-b border-white/[0.06] bg-[#070a12]/60 px-3 py-2">
      <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
        {queries.map((q) => (
          <button
            key={q}
            disabled={isAnalyzing}
            onClick={() => sendQuery(q)}
            className="flex-shrink-0 text-left text-xs sm:text-sm px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] hover:border-cyan-500/30 text-slate-200 hover:text-white transition-all duration-150 whitespace-nowrap disabled:opacity-40 cursor-pointer font-medium shadow-sm"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
