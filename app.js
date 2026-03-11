/* ============================================================
   PASHU CARE - AI Cow Disease Diagnostic Engine
   Powered by TensorFlow.js + Google Teachable Machine
   ============================================================ */

// === Disease Knowledge Base ===
const DISEASES = [
  {
    id: "lumpy_skin", name: "Lumpy Skin Disease", latin: "Neethling virus",
    category: "skin", icon: "\uD83E\uDDA0", severity: "high",
    desc: "A viral disease causing firm, raised nodules on the skin, fever, and swollen lymph nodes. Spread by biting insects. Can cause significant economic losses.",
    visualSigns: ["Round raised nodules on skin", "Nodules on head, neck, limbs", "Swollen lymph nodes", "Skin lesions with scabs"],
    symptoms: ["skin_lumps", "fever", "swollen_lymph", "reduced_milk", "loss_appetite", "nasal_discharge"],
    treatment: ["No specific antiviral; supportive care", "Anti-inflammatory drugs (Flunixin)", "Antibiotics for secondary infections", "Wound care for skin lesions", "Vaccination of healthy animals"],
    prevention: ["Annual vaccination", "Vector control (insecticides)", "Quarantine new animals", "Biosecurity protocols"],
    urgency: "urgent", contagious: true
  },
  {
    id: "fmd", name: "Foot-and-Mouth Disease", latin: "Aphthovirus",
    category: "infectious", icon: "\uD83E\uDDB6", severity: "critical",
    desc: "Highly contagious viral disease causing blisters on mouth, feet, and teats. Results in drooling, lameness, and severe production losses. Notifiable disease.",
    visualSigns: ["Blisters on mouth and tongue", "Drooling/excessive salivation", "Blisters on hooves", "Lameness"],
    symptoms: ["mouth_blisters", "drooling", "lameness", "fever", "reduced_milk", "loss_appetite", "hoof_lesions"],
    treatment: ["No cure - supportive care only", "Soft feed and clean water", "Antiseptic mouth washes", "Hoof care and bandaging", "MUST report to authorities"],
    prevention: ["Strict vaccination schedule", "Quarantine and movement controls", "Disinfection of premises", "Report immediately to authorities"],
    urgency: "urgent", contagious: true
  },
  {
    id: "ringworm", name: "Ringworm", latin: "Trichophyton verrucosum",
    category: "skin", icon: "\u2B55", severity: "low",
    desc: "Fungal skin infection causing circular, crusty, grey-white patches. Common in young cattle during winter housing. Zoonotic - can spread to humans.",
    visualSigns: ["Circular grey-white patches", "Crusty raised lesions", "Hair loss in patches", "Usually on head and neck"],
    symptoms: ["skin_patches", "hair_loss", "crusty_skin", "itching"],
    treatment: ["Topical antifungal (Iodine solution)", "Systemic antifungal (Griseofulvin)", "Improve ventilation", "Usually self-limiting in 3-4 months"],
    prevention: ["Good ventilation in housing", "Avoid overcrowding", "Vaccination available", "Disinfect equipment"],
    urgency: "low", contagious: true
  },
  {
    id: "mange", name: "Mange (Scabies)", latin: "Sarcoptes / Psoroptes",
    category: "skin", icon: "\uD83E\uDEB3", severity: "medium",
    desc: "Parasitic skin disease caused by mites. Causes intense itching, thickened/wrinkled skin, hair loss, and scab formation. Can spread rapidly across cattle groups.",
    visualSigns: ["Thickened wrinkled skin", "Hair loss and scabs", "Scratching/rubbing marks", "Crusty lesions on tail, back"],
    symptoms: ["itching", "hair_loss", "crusty_skin", "skin_thickening", "restlessness", "weight_loss"],
    treatment: ["Ivermectin injection (2 doses, 10 days apart)", "Pour-on acaricides", "Treat all in-contact animals", "Environmental treatment"],
    prevention: ["Regular parasite control", "Quarantine new arrivals", "Avoid overcrowding", "Clean housing"],
    urgency: "moderate", contagious: true
  },
  {
    id: "pink_eye", name: "Pink Eye (IBK)", latin: "Moraxella bovis",
    category: "eye", icon: "\uD83D\uDC41\uFE0F", severity: "medium",
    desc: "Infectious bovine keratoconjunctivitis - bacterial eye infection causing tearing, cloudy cornea, and potential blindness. Spread by flies and close contact.",
    visualSigns: ["Watery/tearing eyes", "Cloudy white cornea", "Swollen eyelids", "Eye kept closed"],
    symptoms: ["eye_tearing", "cloudy_eye", "eye_swelling", "light_sensitivity", "reduced_milk"],
    treatment: ["Antibiotic eye ointment (Oxytetracycline)", "Subconjunctival antibiotic injection", "Eye patch for severe cases", "Fly control"],
    prevention: ["Fly control programs", "UV-protective shade", "Vaccination", "Reduce dust"],
    urgency: "moderate", contagious: true
  },
  {
    id: "mastitis", name: "Mastitis", latin: "Multiple pathogens",
    category: "general", icon: "\uD83E\uDD5B", severity: "high",
    desc: "Inflammation of the udder caused by bacterial infection. Most costly dairy disease worldwide. Causes swollen udder, abnormal milk, and pain.",
    visualSigns: ["Swollen, hot, hard udder", "Redness on udder", "Abnormal milk (clots, watery)", "Cow kicks during milking"],
    symptoms: ["swollen_udder", "abnormal_milk", "fever", "loss_appetite", "reduced_milk", "pain_response"],
    treatment: ["Intramammary antibiotics", "Systemic antibiotics for severe cases", "Anti-inflammatory drugs", "Frequent stripping of affected quarter"],
    prevention: ["Pre/post milking teat dipping", "Clean milking equipment", "Dry cow therapy", "Proper milking technique"],
    urgency: "urgent", contagious: false
  },
  {
    id: "bloat", name: "Bloat (Ruminal Tympany)", latin: "Ruminal Tympany",
    category: "digestive", icon: "\uD83E\uDEE7", severity: "high",
    desc: "Excessive gas accumulation in the rumen causing the left side to distend. Can be life-threatening within hours if not treated. Caused by lush pasture or grain overload.",
    visualSigns: ["Distended left abdomen", "Labored breathing", "Discomfort/kicking at belly", "Standing with legs apart"],
    symptoms: ["bloated_abdomen", "labored_breathing", "restlessness", "loss_appetite", "drooling", "pain_response"],
    treatment: ["Emergency: pass stomach tube", "Anti-foaming agent (Poloxalene)", "Trocarization in severe cases", "Walk the animal gently"],
    prevention: ["Gradual pasture introduction", "Anti-bloat supplements", "Ensure roughage access", "Avoid wet legume pasture"],
    urgency: "urgent", contagious: false
  },
  {
    id: "brd", name: "Bovine Respiratory Disease", latin: "Multiple agents",
    category: "respiratory", icon: "\uD83E\uDEC1", severity: "high",
    desc: "Complex respiratory illness involving viral and bacterial agents. Leading cause of death in feedlot cattle. Causes coughing, nasal discharge, and fever.",
    visualSigns: ["Nasal discharge (clear to purulent)", "Labored/rapid breathing", "Drooping ears", "Dull/depressed appearance"],
    symptoms: ["coughing", "nasal_discharge", "fever", "labored_breathing", "loss_appetite", "depression", "eye_tearing"],
    treatment: ["Long-acting antibiotics (Tulathromycin)", "NSAIDs for fever/inflammation", "Supportive care and isolation", "Fluid therapy if dehydrated"],
    prevention: ["Vaccination program", "Low-stress handling", "Good ventilation", "Quarantine new arrivals"],
    urgency: "urgent", contagious: true
  },
  {
    id: "blackleg", name: "Blackleg", latin: "Clostridium chauvoei",
    category: "infectious", icon: "\u26AB", severity: "critical",
    desc: "Acute, often fatal bacterial disease. Causes sudden death, swelling with gas under the skin (crepitus), and dark, dry muscle tissue. Affects young cattle.",
    visualSigns: ["Sudden swelling on limbs/body", "Skin crackles when pressed", "Dark discolored skin over swelling", "Sudden lameness"],
    symptoms: ["sudden_swelling", "lameness", "fever", "depression", "loss_appetite", "sudden_death"],
    treatment: ["High-dose Penicillin IV (if caught early)", "Often fatal before treatment possible", "Carcass must be burned/buried deeply", "Do NOT open carcass"],
    prevention: ["Vaccination at 3-6 months (essential)", "Annual boosters", "Avoid soil disturbance in endemic areas"],
    urgency: "urgent", contagious: false
  },
  {
    id: "papillomatosis", name: "Papillomatosis (Warts)", latin: "Bovine Papillomavirus",
    category: "skin", icon: "\uD83E\uDED8", severity: "low",
    desc: "Viral skin tumors (warts) commonly seen in young cattle. Appear as rough, cauliflower-like growths. Usually self-limiting but can interfere with function.",
    visualSigns: ["Rough cauliflower-like growths", "Warts on head, neck, shoulders", "Multiple growths clustered", "Pedunculated or flat warts"],
    symptoms: ["skin_lumps", "skin_growths"],
    treatment: ["Usually self-limiting (2-12 months)", "Surgical removal if obstructive", "Autogenous vaccine from wart tissue", "Cryotherapy for small warts"],
    prevention: ["Avoid sharing equipment", "Disinfect handling facilities", "Isolate affected animals"],
    urgency: "low", contagious: true
  },
  {
    id: "hoof_rot", name: "Foot Rot (Interdigital Necrobacillosis)", latin: "Fusobacterium necrophorum",
    category: "musculoskeletal", icon: "\uD83E\uDDBF", severity: "medium",
    desc: "Bacterial infection between the claws causing swelling, foul smell, and severe lameness. Common in wet/muddy conditions. Responds well to early treatment.",
    visualSigns: ["Swelling between hooves", "Lameness (one leg)", "Foul-smelling discharge from hoof", "Redness between claws"],
    symptoms: ["lameness", "hoof_lesions", "swelling", "foul_smell", "fever", "reduced_milk"],
    treatment: ["Systemic antibiotics (Oxytetracycline)", "Hoof trimming and cleaning", "Topical antiseptic spray", "Foot bath (Copper sulfate)"],
    prevention: ["Regular hoof trimming", "Foot baths", "Drain muddy areas", "Clean housing"],
    urgency: "moderate", contagious: true
  },
  {
    id: "tick_infestation", name: "Tick Infestation", latin: "Boophilus / Amblyomma spp.",
    category: "skin", icon: "\uD83D\uDD77\uFE0F", severity: "medium",
    desc: "External parasites causing blood loss, skin damage, and transmission of diseases (Babesiosis, Anaplasmosis, Theileriosis). Major problem in tropical regions.",
    visualSigns: ["Visible ticks on body", "Ticks concentrated on ears, udder, perineum", "Skin wounds from tick attachment", "Poor coat condition"],
    symptoms: ["visible_parasites", "weight_loss", "reduced_milk", "anemia_signs", "restlessness"],
    treatment: ["Acaricide application (pour-on/spray)", "Ivermectin injection", "Manual removal of engorged ticks", "Treat secondary infections"],
    prevention: ["Regular acaricide treatment", "Rotational grazing", "Breed selection (tick-resistant)", "Environmental tick control"],
    urgency: "moderate", contagious: false
  },
  {
    id: "dermatophilosis", name: "Dermatophilosis (Rain Scald)", latin: "Dermatophilus congolensis",
    category: "skin", icon: "\uD83C\uDF27\uFE0F", severity: "medium",
    desc: "Bacterial skin infection worsened by prolonged rain and wet conditions. Causes matted hair with crusty scabs that peel off leaving raw pink skin.",
    visualSigns: ["Paintbrush-like matted hair tufts", "Crusty scabs peeling off", "Raw pink skin underneath", "Lesions on back and sides"],
    symptoms: ["crusty_skin", "hair_loss", "skin_patches", "pain_response"],
    treatment: ["Keep animal dry and sheltered", "Systemic antibiotics (Penicillin/Strep)", "Gentle removal of scabs", "Antiseptic washes"],
    prevention: ["Provide shelter from rain", "Treat skin wounds promptly", "Control ectoparasites", "Avoid overcrowding"],
    urgency: "moderate", contagious: true
  },
  {
    id: "photosensitization", name: "Photosensitization", latin: "Hepatogenous / Primary",
    category: "skin", icon: "\u2600\uFE0F", severity: "medium",
    desc: "Severe sunburn-like reaction on unpigmented/white skin areas. Caused by liver damage or ingestion of photosensitizing plants. Skin becomes red, swollen, and peels.",
    visualSigns: ["Red/burned white skin areas", "Swollen ears and muzzle", "Skin peeling on white patches", "Drooping ears"],
    symptoms: ["skin_redness", "skin_peeling", "swelling", "pain_response", "loss_appetite"],
    treatment: ["Move to shade immediately", "Remove toxic plant from diet", "Anti-inflammatory drugs", "Treat liver disease if hepatogenous", "Skin wound care"],
    prevention: ["Provide shade access", "Remove toxic plants from pasture", "Monitor liver health", "Protect white-skinned animals"],
    urgency: "moderate", contagious: false
  },
  {
    id: "actinomycosis", name: "Actinomycosis (Lumpy Jaw)", latin: "Actinomyces bovis",
    category: "musculoskeletal", icon: "\uD83E\uDDB4", severity: "high",
    desc: "Chronic bacterial infection of the jaw bone causing hard, immovable bony swelling. Draining sinuses may develop. Can interfere with eating if severe.",
    visualSigns: ["Hard bony swelling on jaw", "Immovable lump on mandible", "Draining sinus tracts with granules", "Difficulty chewing"],
    symptoms: ["jaw_swelling", "difficulty_eating", "drooling", "weight_loss"],
    treatment: ["Sodium iodide IV (most effective)", "Long-term antibiotics", "Surgical drainage if abscessed", "Isoniazid in some cases"],
    prevention: ["Avoid rough/sharp feeds", "Good dental care", "Prompt wound treatment", "Cull severe chronic cases"],
    urgency: "moderate", contagious: false
  }
];

const DISEASE_I18N = {
  hi: {
    lumpy_skin: {
      name: "लम्पी स्किन रोग",
      latin: "नीथलिंग वायरस",
      desc: "त्वचा पर कठोर उभरी गांठें, बुखार और सूजे लिम्फ नोड्स वाला वायरल रोग। काटने वाले कीड़ों से फैलता है।",
      visualSigns: ["त्वचा पर गोल उभरी गांठें", "सिर, गर्दन और टांगों पर गांठें", "सूजे लिम्फ नोड्स", "पपड़ीदार त्वचा घाव"],
      treatment: ["विशिष्ट एंटीवायरल नहीं; सहायक देखभाल", "सूजनरोधी दवाएं (फ्लुनिक्सिन)", "द्वितीयक संक्रमण हेतु एंटीबायोटिक", "त्वचा घावों की देखभाल", "स्वस्थ पशुओं का टीकाकरण"],
      prevention: ["वार्षिक टीकाकरण", "कीट नियंत्रण (कीटनाशक)", "नए पशुओं को अलग रखें", "जैव-सुरक्षा प्रोटोकॉल"]
    },
    fmd: {
      name: "खुरपका-मुंहपका",
      latin: "एफ्थोवायरस",
      desc: "अत्यधिक संक्रामक वायरल रोग जिसमें मुंह, खुर और थन पर छाले बनते हैं। लार बहना, लंगड़ापन और उत्पादन में गिरावट होती है।",
      visualSigns: ["मुंह/जीभ पर छाले", "अत्यधिक लार", "खुरों पर छाले", "लंगड़ापन"],
      treatment: ["कोई इलाज नहीं; केवल सहायक देखभाल", "नरम चारा और साफ पानी", "मुंह के लिए एंटीसेप्टिक धुलाई", "खुर की सफाई/बैंडेज", "अनिवार्य रिपोर्टिंग करें"],
      prevention: ["कड़ा टीकाकरण कार्यक्रम", "क्वारंटीन और आवागमन नियंत्रण", "परिसर कीटाणुशोधन", "तुरंत प्राधिकरण को रिपोर्ट करें"]
    },
    ringworm: {
      name: "दाद (रिंगवर्म)",
      latin: "ट्राइकोफाइटन वेरुकोसम",
      desc: "फंगल त्वचा संक्रमण जिसमें गोल, पपड़ीदार धब्बे बनते हैं। मनुष्यों में भी फैल सकता है।",
      visualSigns: ["गोल धूसर-सफेद धब्बे", "पपड़ीदार उठे घाव", "बाल झड़ना", "अक्सर सिर/गर्दन पर"],
      treatment: ["स्थानीय एंटीफंगल (आयोडीन)", "सिस्टमिक एंटीफंगल (ग्रिसियोफुलविन)", "हवादारी बढ़ाएं", "अक्सर 3-4 माह में ठीक"],
      prevention: ["अच्छी हवादारी", "भीड़ से बचें", "टीका उपलब्ध", "उपकरण कीटाणुरहित करें"]
    },
    mange: {
      name: "मैन्ज (खुजली रोग)",
      latin: "सार्कॉप्ट्स / सॉरोप्ट्स",
      desc: "माइट्स से होने वाला परजीवी त्वचा रोग। तीव्र खुजली, त्वचा मोटी होना और पपड़ी बनना।",
      visualSigns: ["मोटी/झुर्रीदार त्वचा", "बाल झड़ना और पपड़ी", "खुजलाने के निशान", "पूंछ/पीठ पर पपड़ीदार घाव"],
      treatment: ["इवर्मेक्टिन इंजेक्शन (10 दिन बाद दूसरी खुराक)", "पोर-ऑन अकारिसाइड", "संपर्क में आए सभी पशुओं का उपचार", "पर्यावरण उपचार"],
      prevention: ["नियमित परजीवी नियंत्रण", "नए पशुओं का क्वारंटीन", "भीड़ से बचें", "आवास साफ रखें"]
    },
    pink_eye: {
      name: "पिंक आई (आईबीके)",
      latin: "मोरैक्सेला बोविस",
      desc: "आंख का बैक्टीरियल संक्रमण; पानी आना, कॉर्निया धुंधला और अंधत्व हो सकता है।",
      visualSigns: ["आंखों से पानी आना", "सफेद/धुंधला कॉर्निया", "पलकों की सूजन", "आंख बंद रखना"],
      treatment: ["एंटीबायोटिक आई ऑइंटमेंट (ऑक्सिटेट्रासाइक्लिन)", "सबकंजक्टिवल इंजेक्शन", "गंभीर में आई पैच", "मक्खी नियंत्रण"],
      prevention: ["मक्खी नियंत्रण कार्यक्रम", "धूप से बचाव", "टीकाकरण", "धूल कम करें"]
    },
    mastitis: {
      name: "मैस्टाइटिस",
      latin: "विविध रोगजनक",
      desc: "थन की बैक्टीरियल सूजन। थन गर्म/दर्दयुक्त और दूध असामान्य हो जाता है।",
      visualSigns: ["थन सूजा/गर्म/कठोर", "थन पर लालिमा", "दूध में थक्के/पानी जैसा", "दूध निकालते समय दर्द"],
      treatment: ["इंट्रामैम्मरी एंटीबायोटिक", "गंभीर मामलों में सिस्टमिक एंटीबायोटिक", "सूजनरोधी दवाएं", "बार-बार दूध निकालना"],
      prevention: ["दूध निकालने से पहले/बाद टीट डिपिंग", "उपकरण साफ रखें", "ड्राई-काउ थैरेपी", "सही मिल्किंग तकनीक"]
    },
    bloat: {
      name: "गैस भरना (ब्लोट)",
      latin: "रूमिनल टिम्पनी",
      desc: "रूमेन में गैस जमा होकर बाईं तरफ पेट फूलता है। समय पर इलाज न हो तो खतरनाक।",
      visualSigns: ["बाईं ओर पेट फूलना", "सांस लेने में कठिनाई", "पेट पर लात मारना", "पैर फैलाकर खड़ा होना"],
      treatment: ["आपात: स्टमक ट्यूब डालें", "एंटी-फोमिंग एजेंट (पॉलोक्सालेन)", "गंभीर में ट्रोकार", "हल्का चलाएं"],
      prevention: ["धीरे-धीरे चराई", "एंटी-ब्लोट सप्लीमेंट", "पर्याप्त रूखे चारे की उपलब्धता", "गीली दलहनी चराई से बचें"]
    },
    brd: {
      name: "गौ-श्वसन रोग (बीआरडी)",
      latin: "विविध एजेंट",
      desc: "वायरल/बैक्टीरियल मिश्रित श्वसन रोग; खांसी, नाक स्राव और बुखार।",
      visualSigns: ["नाक से स्राव (साफ से गाढ़ा)", "तेज/कठिन सांस", "लटकते कान", "सुस्ती"],
      treatment: ["लंबे असर वाले एंटीबायोटिक", "बुखार/सूजन हेतु एनएसएआईडी", "सहायक देखभाल और अलगाव", "निर्जलीकरण में तरल चिकित्सा"],
      prevention: ["टीकाकरण कार्यक्रम", "कम तनाव वाला हैंडलिंग", "अच्छी वेंटिलेशन", "नए पशुओं का क्वारंटीन"]
    },
    blackleg: {
      name: "ब्लैकलेग",
      latin: "क्लोस्ट्रीडियम शौवोई",
      desc: "तीव्र और अक्सर घातक बैक्टीरियल रोग। शरीर में गैस वाली सूजन और अचानक मौत।",
      visualSigns: ["टांग/शरीर पर अचानक सूजन", "दबाने पर चरचराहट", "सूजन पर काली त्वचा", "अचानक लंगड़ापन"],
      treatment: ["उच्च डोज पेनिसिलिन (प्रारंभिक में)", "अक्सर इलाज से पहले मृत्यु", "शव को गहराई में दफन/जलाएं", "शव न खोलें"],
      prevention: ["3-6 माह पर टीकाकरण", "वार्षिक बूस्टर", "एंडेमिक क्षेत्र में मिट्टी छेड़छाड़ से बचें"]
    },
    papillomatosis: {
      name: "पैपिलोमेटोसिस (मस्से)",
      latin: "बोवाइन पैपिलोमावायरस",
      desc: "युवाओं में मस्से जैसे त्वचा ट्यूमर। अक्सर स्वयं ठीक हो जाते हैं।",
      visualSigns: ["फूलगोभी जैसे मस्से", "सिर/गर्दन पर मस्से", "कई मस्सों का समूह", "लटकते/समतल मस्से"],
      treatment: ["अक्सर 2-12 माह में स्वयं ठीक", "आवश्यकता पर शल्य चिकित्सा", "ऑटोजेनस वैक्सीन", "छोटे मस्सों में क्रायोथेरेपी"],
      prevention: ["उपकरण साझा न करें", "हैंडलिंग स्थान कीटाणुरहित करें", "प्रभावित को अलग रखें"]
    },
    hoof_rot: {
      name: "खुर सड़न",
      latin: "फ्यूसोबैक्टेरियम नेक्रोफोरम",
      desc: "खुरों के बीच बैक्टीरियल संक्रमण; बदबू और तेज लंगड़ापन।",
      visualSigns: ["खुरों के बीच सूजन", "एक पैर में लंगड़ापन", "खुर से दुर्गंधयुक्त स्राव", "खुरों के बीच लालिमा"],
      treatment: ["सिस्टमिक एंटीबायोटिक (ऑक्सिटेट्रासाइक्लिन)", "खुर की सफाई/छंटाई", "टोपिकल एंटीसेप्टिक", "फुट बाथ (कॉपर सल्फेट)"],
      prevention: ["नियमित खुर छंटाई", "फुट बाथ", "गीले क्षेत्रों का निकास", "आवास साफ रखें"]
    },
    tick_infestation: {
      name: "किलनी संक्रमण",
      latin: "बूफिलस / एम्ब्ल्योमा spp.",
      desc: "बाहरी परजीवी जो रक्त हानि और रोग फैलाते हैं।",
      visualSigns: ["शरीर पर किलनी दिखना", "कान/थन/पेरिनियम पर अधिक किलनी", "किलनी के घाव", "खराब कोट"],
      treatment: ["अकारिसाइड (स्प्रे/पोर-ऑन)", "इवर्मेक्टिन इंजेक्शन", "किलनी हाथ से हटाना", "द्वितीयक संक्रमण उपचार"],
      prevention: ["नियमित अकारिसाइड", "रोटेशनल चराई", "किलनी-प्रतिरोधी नस्ल", "पर्यावरण नियंत्रण"]
    },
    dermatophilosis: {
      name: "डर्माटोफिलोसिस (रेन स्काल्ड)",
      latin: "डर्माटोफिलस कोंगोलेन्सिस",
      desc: "लंबे समय बारिश/नमी से बढ़ने वाला बैक्टीरियल त्वचा रोग।",
      visualSigns: ["ब्रश जैसे बाल गुच्छे", "पपड़ीदार स्कैब", "नीचे गुलाबी कच्ची त्वचा", "पीठ/बगल पर घाव"],
      treatment: ["पशु को सूखा/आश्रय दें", "सिस्टमिक एंटीबायोटिक (पेनिसिलिन/स्ट्रेप)", "पपड़ी धीरे हटाएं", "एंटीसेप्टिक धुलाई"],
      prevention: ["बारिश से बचाव", "त्वचा घावों का शीघ्र उपचार", "एक्टोपैरासाइट नियंत्रण", "भीड़ से बचें"]
    },
    photosensitization: {
      name: "प्रकाश-संवेदनशीलता",
      latin: "हेपैटोजेनस / प्राइमरी",
      desc: "सफेद/निर्वर्ण त्वचा पर धूप से जलन जैसा रिएक्शन।",
      visualSigns: ["सफेद त्वचा पर लाल/जली त्वचा", "कान/थूथन सूजना", "त्वचा छिलना", "लटकते कान"],
      treatment: ["तुरंत छाया में रखें", "फोटोसेंसिटाइजिंग पौधे/चारा हटाएं", "सूजनरोधी दवाएं", "यदि लिवर कारण हो तो उपचार", "त्वचा घाव देखभाल"],
      prevention: ["छाया उपलब्ध कराएं", "विषैले पौधे हटाएं", "लिवर स्वास्थ्य देखें", "सफेद त्वचा वाले पशु बचाएं"]
    },
    actinomycosis: {
      name: "एक्टिनोमाइकोसिस (लम्पी जॉ)",
      latin: "एक्टिनोमाइसेस बोविस",
      desc: "जबड़े की हड्डी का क्रोनिक बैक्टीरियल संक्रमण; कठोर गांठ बनती है।",
      visualSigns: ["जबड़े पर कठोर सूजन", "जबड़े की स्थिर गांठ", "द्रव निकलने वाले साइनस", "चबाने में कठिनाई"],
      treatment: ["सोडियम आयोडाइड IV", "लंबे समय की एंटीबायोटिक", "एब्सेस में सर्जिकल ड्रेनेज", "कभी-कभी आइसोनियाज़िड"],
      prevention: ["कठोर/नुकीले चारे से बचें", "दंत देखभाल", "घाव का शीघ्र उपचार", "गंभीर मामलों में हटाना"]
    }
  },
  mr: {
    lumpy_skin: {
      name: "लम्पी स्किन रोग",
      latin: "नीथलिंग विषाणु",
      desc: "त्वचेवर कडक उंच गाठी, ताप आणि लिम्फ नोड्स सुजणे असणारा विषाणूजन्य रोग. चावणाऱ्या किड्यांमुळे पसरतो.",
      visualSigns: ["त्वचेवर गोल उंच गाठी", "डोके, मान, पायांवर गाठी", "सुजलेले लिम्फ नोड्स", "खपल्या असलेले त्वचा घाव"],
      treatment: ["विशिष्ट अँटीव्हायरल नाही; सहाय्यक काळजी", "दाहशामक औषधे (फ्लुनिक्सिन)", "द्वितीयक संसर्गासाठी अँटिबायोटिक्स", "त्वचा घावांची देखभाल", "निरोगी जनावरांचे लसीकरण"],
      prevention: ["वार्षिक लसीकरण", "किटक नियंत्रण (कीटकनाशके)", "नव्या जनावरांचे क्वारंटीन", "जैव-सुरक्षा पद्धती"]
    },
    fmd: {
      name: "खुरपका-तोंडपका",
      latin: "अॅफ्थोव्हायरस",
      desc: "अतिसंसर्गजन्य विषाणूजन्य रोग. तोंड, खुर व थनावर फोड; लाळ गळणे, लंगडणे आणि उत्पादनात मोठी घट.",
      visualSigns: ["तोंड/जीभेवर फोड", "अधिक लाळ", "खुरांवर फोड", "लंगडणे"],
      treatment: ["उपचार नाही; सहाय्यक काळजी", "मऊ चारा व स्वच्छ पाणी", "तोंडासाठी अँटिसेप्टिक धुलाई", "खुरांची स्वच्छता/बँडेज", "अधिकाऱ्यांना कळवणे आवश्यक"],
      prevention: ["कडक लसीकरण वेळापत्रक", "क्वारंटीन व हालचाल नियंत्रण", "परिसर निर्जंतुकीकरण", "त्वरित अहवाल द्या"]
    },
    ringworm: {
      name: "दाद (रिंगवर्म)",
      latin: "ट्रायकोफायटन वेरुकॉसम",
      desc: "बुरशीजन्य त्वचा संसर्ग ज्यात गोल, खपल्या असलेले करडे-पांढरे डाग होतात. माणसांमध्येही पसरू शकतो.",
      visualSigns: ["गोल करडे-पांढरे डाग", "खपल्या उठलेल्या घाव", "ठिकठिकाणी केस गळणे", "बहुतेक डोके/मान"],
      treatment: ["स्थानिक अँटिफंगल (आयोडीन द्रावण)", "सिस्टमिक अँटिफंगल (ग्रिसिओफुल्विन)", "हवादारपणा वाढवा", "बहुतेक 3-4 महिन्यांत बरा"],
      prevention: ["चांगली वेंटिलेशन", "अति दाटी टाळा", "लसीकरण उपलब्ध", "उपकरण निर्जंतुकीकरण"]
    },
    mange: {
      name: "खुजली (मैन्ज)",
      latin: "सार्कॉप्ट्स / सॉरोप्ट्स",
      desc: "माइट्समुळे होणारा परजीवी त्वचा रोग. तीव्र खाज, त्वचा जाड होणे आणि केस गळणे.",
      visualSigns: ["जाड/कुंचलेली त्वचा", "केस गळणे आणि खपल्या", "खाजवण्याच्या खुणा", "शेपूट/पाठीवर खपल्या"],
      treatment: ["इव्हर्मेक्टिन इंजेक्शन (10 दिवसांनी दुसरी मात्रा)", "पोर-ऑन अकारिसाइड", "संपर्कातील सर्व जनावरांचे उपचार", "पर्यावरण उपचार"],
      prevention: ["नियमित परजीवी नियंत्रण", "नव्या जनावरांचे क्वारंटीन", "अति दाटी टाळा", "स्वच्छ निवास"]
    },
    pink_eye: {
      name: "पिंक आय (आयबीके)",
      latin: "मोरॅक्सेला बोव्हिस",
      desc: "डोळ्याचा बॅक्टेरियल संसर्ग; पाणी येणे, कॉर्निया धुसर आणि अंधत्वाचा धोका. माशांमुळे पसरतो.",
      visualSigns: ["डोळ्यांतून पाणी", "पांढरा/धुसर कॉर्निया", "पापण्यांची सूज", "डोळा बंद ठेवणे"],
      treatment: ["अँटिबायोटिक आय ऑइंटमेंट (ऑक्सिटेट्रासायक्लिन)", "सबकॉन्जक्टिव्हल इंजेक्शन", "गंभीर प्रकरणात आय पॅच", "माशी नियंत्रण"],
      prevention: ["माशी नियंत्रण कार्यक्रम", "यूव्ही सावली", "लसीकरण", "धूळ कमी करा"]
    },
    mastitis: {
      name: "मॅस्टायटिस",
      latin: "विविध रोगकारक",
      desc: "थनाचा बॅक्टेरियल दाह. थन गरम/दुखरा व दूध असामान्य होते.",
      visualSigns: ["थन सूजलेला/गरम/कठीण", "थनावर लालसरपणा", "दुधात गोळे/पाणीसर", "दूध काढताना लाथ मारणे"],
      treatment: ["इंट्रामॅमरी अँटिबायोटिक्स", "गंभीर प्रकरणात सिस्टमिक अँटिबायोटिक्स", "दाहशामक औषधे", "वारंवार दूध काढणे"],
      prevention: ["दूध काढण्यापूर्वी/नंतर टीट डिपिंग", "उपकरण स्वच्छता", "ड्राय-काऊ थेरपी", "योग्य मिल्किंग तंत्र"]
    },
    bloat: {
      name: "गॅस फुगणे (ब्लोट)",
      latin: "रूमिनल टिंपनी",
      desc: "रूमेनमध्ये गॅस साचून डावीकडील पोट फुगते. वेळेत उपचार न झाल्यास धोकादायक.",
      visualSigns: ["डाव्या बाजूला पोट फुगणे", "श्वास घेणे कठीण", "पोटाला लाथ मारणे", "पाय पसरून उभे राहणे"],
      treatment: ["आपत्कालीन: स्टमक ट्यूब घालणे", "अँटी-फोमिंग एजंट (पॉलॉक्सालेन)", "गंभीर प्रकरणात ट्रोकार", "हळू चालवणे"],
      prevention: ["चराई हळूहळू वाढवा", "अँटी-ब्लोट सप्लिमेंट", "पुरेसा रूक्ष चारा", "ओलसर डाळवर्गीय चराई टाळा"]
    },
    brd: {
      name: "गोवंशीय श्वसन रोग",
      latin: "विविध घटक",
      desc: "व्हायरल/बॅक्टेरियल मिश्रित श्वसन रोग. खोकला, नाकातून स्राव आणि ताप.",
      visualSigns: ["नाकातून स्राव (स्वच्छ ते दाट)", "वेगवान/कठीण श्वास", "कान लोंबणे", "सुस्तपणा"],
      treatment: ["दीर्घ-अवधी अँटिबायोटिक्स (ट्युलाथ्रोमायसिन)", "ताप/दाहासाठी एनएसएआयडी", "सहाय्यक काळजी व अलग ठेवणे", "निर्जलीकरणात द्रव उपचार"],
      prevention: ["लसीकरण कार्यक्रम", "कमी ताणाचे हँडलिंग", "चांगली वेंटिलेशन", "नव्या जनावरांचे क्वारंटीन"]
    },
    blackleg: {
      name: "ब्लॅकलेग",
      latin: "क्लोस्ट्रीडियम शॉव्होई",
      desc: "अकस्मात व अनेकदा प्राणघातक बॅक्टेरियल रोग. त्वचेखाली गॅसयुक्त सूज होऊ शकते.",
      visualSigns: ["पाय/शरीरावर अचानक सूज", "दाबल्यास कडकड आवाज", "सूजेवर काळसर त्वचा", "अचानक लंगडणे"],
      treatment: ["उच्च डोस पेनिसिलिन (लवकर मिळाल्यास)", "बहुतेक वेळा उपचारापूर्वी मृत्यू", "कॅरकस जाळा/खोल पुरा", "शव उघडू नका"],
      prevention: ["3-6 महिन्यांना लसीकरण", "वार्षिक बूस्टर", "एन्डेमिक भागात माती खणणे टाळा"]
    },
    papillomatosis: {
      name: "पॅपिलोमॅटोसिस (मस्से)",
      latin: "बोवाइन पॅपिलोमाव्हायरस",
      desc: "तरुण जनावरांत मस्से; बहुधा आपोआप कमी होतात.",
      visualSigns: ["फुलकोबीसारखे मस्से", "डोके/मान/खांद्यावर मस्से", "एकत्रित मस्से", "लटकते किंवा सपाट मस्से"],
      treatment: ["बहुधा 2-12 महिन्यात बरे", "अडथळा असल्यास शस्त्रक्रिया", "ऑटोजेनस लस", "लहान मस्स्यांसाठी क्रायोथेरपी"],
      prevention: ["उपकरण शेअर करू नका", "हँडलिंग परिसर निर्जंतुक करा", "प्रभावितांना वेगळे ठेवा"]
    },
    hoof_rot: {
      name: "खुर कुज (फूट रॉट)",
      latin: "फ्युसोबॅक्टेरियम नेक्रोफोरम",
      desc: "खुरांच्या मध्ये बॅक्टेरियल संसर्ग; सूज, दुर्गंधी आणि लंगडणे. ओलसर चिखलात जास्त आढळतो.",
      visualSigns: ["खुरांच्या मध्ये सूज", "एका पायावर लंगडणे", "खुरातून दुर्गंधीयुक्त स्राव", "खुरांच्या मध्ये लालसरपणा"],
      treatment: ["सिस्टमिक अँटिबायोटिक्स (ऑक्सिटेट्रासायक्लिन)", "खुर ट्रिमिंग व स्वच्छता", "टॉपिकल अँटिसेप्टिक स्प्रे", "फूट बाथ (कॉपर सल्फेट)"],
      prevention: ["नियमित खुर ट्रिमिंग", "फूट बाथ", "चिखल निचरा", "स्वच्छ निवास"]
    },
    tick_infestation: {
      name: "किलनी (टिक) प्रादुर्भाव",
      latin: "बूफिलस / अॅम्ब्लायोम्मा spp.",
      desc: "बाह्य परजीवी; रक्तक्षय, त्वचा नुकसान आणि रोग प्रसार घडवतात.",
      visualSigns: ["शरीरावर किलनी दिसणे", "कान/थन/पेरिनियमवर जास्त", "टिक चाव्याच्या जखमा", "खराब कोट"],
      treatment: ["अकारिसाइड फवारणी/पोर-ऑन", "इव्हर्मेक्टिन इंजेक्शन", "फुगलेल्या टिकचे हाताने काढणे", "द्वितीयक संसर्ग उपचार"],
      prevention: ["नियमित अकारिसाइड", "रोटेशनल चराई", "टिक-प्रतिरोधक जात", "पर्यावरण नियंत्रण"]
    },
    dermatophilosis: {
      name: "डर्मॅटोफिलोसिस (रेन स्कॉल्ड)",
      latin: "डर्मॅटोफिलस कोंगोलेन्सिस",
      desc: "लांब पावसाने वाढणारा बॅक्टेरियल त्वचा रोग. केस चिकट खपल्या बनतात.",
      visualSigns: ["ब्रशसारखे केस गुच्छ", "खपल्या सोलणे", "खाली गुलाबी कच्ची त्वचा", "पाठी/बाजूस घाव"],
      treatment: ["जनावर कोरडे/आश्रयात ठेवा", "सिस्टमिक अँटिबायोटिक्स (पेनिसिलिन/स्ट्रेप)", "खपल्या सौम्यपणे काढा", "अँटिसेप्टिक धुलाई"],
      prevention: ["पावसापासून संरक्षण", "त्वचा जखमांचे लवकर उपचार", "एक्टोपॅरासाइट नियंत्रण", "अति दाटी टाळा"]
    },
    photosensitization: {
      name: "प्रकाश-संवेदनशीलता",
      latin: "हेपॅटोजेनस / प्रायमरी",
      desc: "निर्वर्ण त्वचेवर सूर्यप्रकाशामुळे दाह. यकृत नुकसान किंवा फोटोसेन्सिटायझिंग वनस्पतींमुळे.",
      visualSigns: ["सफेद त्वचेवर लाल/जळलेली त्वचा", "कान/थूथन सूजणे", "त्वचा सोलणे", "कान लटकणे"],
      treatment: ["तुरंत सावलीत ठेवा", "विषारी वनस्पती/चारा काढा", "दाहशामक औषधे", "यकृत कारण असल्यास उपचार", "त्वचा घाव काळजी"],
      prevention: ["सावली उपलब्ध", "विषारी वनस्पती काढा", "यकृत आरोग्य तपासा", "सफेद त्वचेची काळजी"]
    },
    actinomycosis: {
      name: "ऍक्टिनोमायकोसिस (लम्पी जॉ)",
      latin: "ऍक्टिनोमायसेस बोव्हिस",
      desc: "जबड्याच्या हाडाचा दीर्घकालीन बॅक्टेरियल संसर्ग; कडक स्थिर सूज होते.",
      visualSigns: ["जबड्यावर कठीण सूज", "जबड्यावर स्थिर गाठ", "पुंसरस मार्गातून स्त्राव", "चावण्यात अडचण"],
      treatment: ["सोडियम आयोडाइड IV (सर्वात परिणामकारक)", "दीर्घकालीन अँटिबायोटिक्स", "अॅब्सेस असल्यास शस्त्रक्रिया", "कधी कधी आयसोनीयाझिड"],
      prevention: ["खडबडीत/टोकदार चारा टाळा", "दंत काळजी", "जखमांचे लवकर उपचार", "तीव्र प्रकरणांत काढणे"]
    }
  },
  ta: {
    lumpy_skin: {
      name: "லம்பி ஸ்கின் நோய்",
      latin: "நீத்லிங் வைரஸ்",
      desc: "தோலில் கடினமான கட்டிகள், காய்ச்சல் மற்றும் லிம்ப் முடிச்சுகள் வீக்கம் ஏற்படுத்தும் வைரஸ் நோய். கடிக்கும் பூச்சிகளால் பரவும்.",
      visualSigns: ["தோலில் சுற்று கட்டிகள்", "தலை, கழுத்து, கால்களில் கட்டிகள்", "வீங்கிய லிம்ப் முடிச்சுகள்", "படலமடைந்த தோல் காயங்கள்"],
      treatment: ["குறிப்பிட்ட வைரஸ் மருந்து இல்லை; ஆதரவுச் சிகிச்சை", "அழற்சி தணிக்கும் மருந்துகள் (ஃப்லூனிக்சின்)", "இரண்டாம் நிலை தொற்றுக்கு ஆன்டிபயாட்டிக்", "தோல் காய பராமரிப்பு", "ஆரோக்கிய மாடுகளுக்கு தடுப்பூசி"],
      prevention: ["வருடாந்திர தடுப்பூசி", "பூச்சி கட்டுப்பாடு", "புதிய மாடுகளை தனிமைப்படுத்தல்", "உயிர்க் பாதுகாப்பு நடைமுறைகள்"]
    },
    fmd: {
      name: "வாய்-கால் நோய்",
      latin: "அஃப்தோவைரஸ்",
      desc: "மிகவும் தொற்றூட்டும் வைரஸ் நோய். வாயில், கால்களில் மற்றும் மடியில் புண்கள்; உமிழ்நீர் அதிகரிப்பு, நொண்டுதல் மற்றும் உற்பத்தி குறைவு.",
      visualSigns: ["வாய்/நாக்கில் புண்கள்", "அதிக உமிழ்நீர்", "கால்களில் புண்கள்", "நொண்டுதல்"],
      treatment: ["மருந்து இல்லை; ஆதரவுச் சிகிச்சை בלבד", "மென்மையான தீனி மற்றும் சுத்தமான நீர்", "வாய் சுத்தம் செய்ய அண்டிசெப்டிக் துவைப்பு", "கால் பராமரிப்பு/கட்டுப்பாடு", "அதிகாரிகளுக்கு கட்டாய அறிக்கை"],
      prevention: ["கடுமையான தடுப்பூசி திட்டம்", "தனிமைப்படுத்தல் மற்றும் இயக்கக் கட்டுப்பாடு", "பண்ணை சுத்திகரிப்பு", "உடனடி அறிக்கை"]
    },
    ringworm: {
      name: "ரிங்க்வோர்ம் (வட்டப்புழு)",
      latin: "ட்ரைகோஃபைட்டன் வெருகோசம்",
      desc: "பூஞ்சை தோல் தொற்று; வட்டமான கரடுமுரடான சாம்பல்-வெள்ளை தழும்புகள். மனிதருக்கும் பரவலாம்.",
      visualSigns: ["வட்டமான சாம்பல்-வெள்ளை தழும்புகள்", "உயர்ந்த படல புண்கள்", "முடி உதிர்வு", "முதுகு/கழுத்தில் அதிகம்"],
      treatment: ["மேற்பரப்பு பூஞ்சை மருந்து (அயோடின்)", "உள்ளுறுப்பு பூஞ்சை மருந்து (கிரிசியோஃபுல்வின்)", "காற்றோட்டம் மேம்படுத்து", "பொதுவாக 3-4 மாதங்களில் தானே குணமடையும்"],
      prevention: ["நல்ல காற்றோட்டம்", "அதிக கூட்டம் தவிர்க்கவும்", "தடுப்பூசி உள்ளது", "கருவிகளை கிருமி நீக்கம் செய்யவும்"]
    },
    mange: {
      name: "சிரங்கு (மேன்ஜ்)",
      latin: "சார்கோப்டீஸ் / சோரோப்டீஸ்",
      desc: "மைட்களால் ஏற்படும் பராசிட் தோல் நோய். கடும் அரிப்பு, தோல் தடிமன் மற்றும் முடி உதிர்வு.",
      visualSigns: ["தடிமனான/சுருண்ட தோல்", "முடி உதிர்வு மற்றும் படலம்", "கீறல்/உராய்வு தடங்கள்", "வால்/முதுகில் படலக் காயங்கள்"],
      treatment: ["இவெர்மெக்டின் ஊசி (10 நாட்கள் இடைவெளியில் 2 டோஸ்)", "போர்-ஆன் அகாரிசைடு", "தொடர்புள்ள எல்லா மாடுகளுக்கும் சிகிச்சை", "சுற்றுப்புற சிகிச்சை"],
      prevention: ["தொடர்ந்த பராசிட் கட்டுப்பாடு", "புதிய வரவுகளை தனிமைப்படுத்தல்", "அதிக கூட்டம் தவிர்க்கவும்", "சுத்தமான தங்குமிடம்"]
    },
    pink_eye: {
      name: "பிங்க் ஐ (ஐபிகே)",
      latin: "மோரக்செல்லா போவிஸ்",
      desc: "கண் பாக்டீரியா தொற்று; கண்ணீர், கார்னியா மங்குதல், பார்வை இழப்பின் அபாயம். ஈக்களால் பரவும்.",
      visualSigns: ["கண்ணீர் வடிதல்", "மங்கிய வெள்ளை கார்னியா", "கண் இமை வீக்கம்", "கண் மூடுதல்"],
      treatment: ["ஆன்டிபயாட்டிக் கண் மருந்து (ஆக்ஸிடெட்ராசைக்கிளின்)", "சப்-கான்ஜங்க்டைவல் ஊசி", "கடுமையான நிலையில் கண் பாச்", "ஈ கட்டுப்பாடு"],
      prevention: ["ஈ கட்டுப்பாட்டு திட்டம்", "யூவி நிழல்", "தடுப்பூசி", "தூசியை குறைக்கவும்"]
    },
    mastitis: {
      name: "மடியழற்சி",
      latin: "பல நோய்க்கிருமிகள்",
      desc: "மடியின் பாக்டீரியா அழற்சி. மடி வெப்பம்/வலி மற்றும் பால் அசாதாரணம்.",
      visualSigns: ["மடி வீக்கம்/வெப்பம்/கடினம்", "மடியில் சிவப்பு", "பாலில் கட்டிகள்/நீர்த்தன்மை", "பால் கறக்கும் போது காலால் தள்ளுதல்"],
      treatment: ["மடி உள்ளே ஆன்டிபயாட்டிக்", "கடுமையான நிலையில் உடல் ஆன்டிபயாட்டிக்", "அழற்சி தணிக்கும் மருந்துகள்", "அடிக்கடி பால் கறத்தல்"],
      prevention: ["பால் கறக்கும் முன்/பின் டீட் டிப்பிங்", "கருவிகள் சுத்தம்", "டிரை-கோ தெரபி", "சரியான பால் கறக்கும் முறை"]
    },
    bloat: {
      name: "வயிறு வாயு பெருக்கு (ப்ளோட்)",
      latin: "ரூமினல் டிம்பனி",
      desc: "ரூமனில் வாயு சேர்ந்து இடது வயிறு பெரிதாகிறது. நேரத்தில் சிகிச்சை இல்லை என்றால் ஆபத்து.",
      visualSigns: ["இடது வயிறு பெரிதாகுதல்", "கடினமான சுவாசம்", "வயிற்றை உதைத்தல்", "கால்களை பிரித்து நிற்கல்"],
      treatment: ["அவசரம்: ஸ்டமக் ட்யூப் செலுத்துதல்", "ஆன்டி-ஃபோமிங் மருந்து (பாலாக்சலீன்)", "கடுமையில் ட்ரோக்கர்", "மெல்ல நடக்கச் செய்க"],
      prevention: ["மெல்லச் சாகுபடி/மேய்ச்சி அறிமுகம்", "ஆன்டி-ப்ளோட் சப்ப்ளிமென்ட்", "போதிய உலர் தீனி", "ஈரமான பீன்ஸ் மேய்ச்சியை தவிர்க்கவும்"]
    },
    brd: {
      name: "மாட்டு சுவாச நோய்",
      latin: "பல காரணிகள்",
      desc: "வைரஸ்/பாக்டீரியா கலப்பு சுவாச நோய்; இருமல், மூக்குச் சுரப்பு, காய்ச்சல்.",
      visualSigns: ["மூக்குச் சுரப்பு (தெளிவு முதல் தடிமன் வரை)", "வேகமான/கடின சுவாசம்", "காது தாழ்வு", "சோர்வு"],
      treatment: ["நீண்டகால ஆன்டிபயாட்டிக் (டூலாத்ரோமைசின்)", "காய்ச்சல்/அழற்சிக்கான NSAID", "ஆதரவுச் சிகிச்சை மற்றும் தனிமைப்படுத்தல்", "நீரிழப்பில் திரவ சிகிச்சை"],
      prevention: ["தடுப்பூசி திட்டம்", "குறைந்த அழுத்த கையாளுதல்", "நல்ல காற்றோட்டம்", "புதிய வரவுகளை தனிமைப்படுத்தல்"]
    },
    blackleg: {
      name: "ப்ளாக்லெக்",
      latin: "க்ளோஸ்ட்ரிடியம் சாவோவை",
      desc: "திடீர், பெரும்பாலும் உயிருக்கு ஆபத்தான பாக்டீரியா நோய். தோலுக்குள் வாயு வீக்கம்.",
      visualSigns: ["கால்/உடலில் திடீர் வீக்கம்", "அழுத்தும் போது சிருட்டல் உணர்வு", "வீக்கத்தின் மேல் கருப்பு தோல்", "திடீர் நொண்டுதல்"],
      treatment: ["உயர் அளவு பெனிசிலின் (ஆரம்பத்தில்)", "பல நேரம் சிகிச்சைக்கு முன் மரணம்", "சடலத்தை எரிக்க/ஆழமாக புதைக்க", "சடலை திறக்க வேண்டாம்"],
      prevention: ["3-6 மாதத்தில் தடுப்பூசி", "வருடாந்திர பூஸ்டர்", "என்டெமிக் பகுதியில் மண் அகழ்வை தவிர்க்கவும்"]
    },
    papillomatosis: {
      name: "பேப்பிலோமட்டோசிஸ் (முட்டைகள்)",
      latin: "போவின் பேப்பிலோமா வைரஸ்",
      desc: "இளம் மாடுகளில் தோன்றும் முட்டை போன்ற தோல் வளர்ச்சிகள். பெரும்பாலும் தானே குறையும்.",
      visualSigns: ["கோசு மலர் போல் வளர்ச்சி", "தலை/கழுத்தில் முட்டைகள்", "குழுமமாக முட்டைகள்", "தூக்கி நிற்கும்/தட்டையான முட்டைகள்"],
      treatment: ["பொதுவாக 2-12 மாதங்களில் தானே குறையும்", "தடையளித்தால் அறுவை சிகிச்சை", "ஆட்டோஜெனஸ் தடுப்பூசி", "சிறு முட்டைகளுக்கு கிரையோதெரபி"],
      prevention: ["கருவிகளை பகிர வேண்டாம்", "கையாளும் இடத்தை கிருமி நீக்கம்", "பாதிக்கப்பட்டவை தனிமைப்படுத்தல்"]
    },
    hoof_rot: {
      name: "கால் அழுகல் (Foot Rot)",
      latin: "ஃப்யூசோபாக்டீரியம் நெக்ரோபோரம்",
      desc: "கால் இடைவெளியில் பாக்டீரியா தொற்று; வீக்கம், துர்நாற்றம், நொண்டுதல். ஈரமான சேற்றில் அதிகம்.",
      visualSigns: ["கால் இடைவெளி வீக்கம்", "ஒரு காலில் நொண்டுதல்", "காலில் துர்நாற்றம் கலந்த சுரப்பு", "கால் இடைவெளியில் சிவப்பு"],
      treatment: ["உடல் ஆன்டிபயாட்டிக் (ஆக்ஸிடெட்ராசைக்கிளின்)", "கால் சுத்தம் மற்றும் ட்ரிம்மிங்", "மேற்பரப்பு அண்டிசெப்டிக் ஸ்ப்ரே", "கால் குளியல் (காப்பர் சல்பேட்)"],
      prevention: ["இடையிடையே கால் ட்ரிம்மிங்", "கால் குளியல்", "சேற்றுநீர் வடிகால்", "சுத்தமான தங்குமிடம்"]
    },
    tick_infestation: {
      name: "டிக் பராசிட் தொற்று",
      latin: "பூஃபிலஸ் / அம்ப்லியோம்மா spp.",
      desc: "வெளிப்புற பராசிட்கள்; இரத்த இழப்பு, தோல் சேதம் மற்றும் நோய் பரவல்.",
      visualSigns: ["உடலில் தெரியும் டிக்", "காது/மடி/பீரினியம் பகுதியில் அதிகம்", "டிக் கடியால் காயங்கள்", "மேகமடைந்த முடி"],
      treatment: ["அகாரிசைடு ஸ்ப்ரே/போர்-ஆன்", "இவெர்மெக்டின் ஊசி", "பெரிதாக உறைந்த டிக் களை கைமுறையில் நீக்கம்", "இரண்டாம் நிலை தொற்று சிகிச்சை"],
      prevention: ["தொடர்ந்த அகாரிசைடு திட்டம்", "மாறும் மேய்ச்சி", "டிக் எதிர்ப்புத் தன்மை கொண்ட இனங்கள்", "சுற்றுப்புற டிக் கட்டுப்பாடு"]
    },
    dermatophilosis: {
      name: "டெர்மடோபிலோசிஸ் (மழை ஸ்கால்டு)",
      latin: "டெர்மடோபிலஸ் காங்கோலென்சிஸ்",
      desc: "நீண்ட மழை/ஈரத்தால் மோசமாகும் பாக்டீரியா தோல் நோய். முடி படலம் போல் ஒட்டும்.",
      visualSigns: ["பிரஷ் போல் ஒட்டிய முடி", "படலங்கள் சிதறல்", "கீழே இளஞ்சிவப்பு தோல்", "முதுகு/பக்கங்களில் காயங்கள்"],
      treatment: ["மாடுகளை உலர்ந்த இடத்தில் வைத்திருங்கள்", "உடல் ஆன்டிபயாட்டிக் (பெனிசிலின்/ஸ்ட்ரெப்)", "மெல்ல படலத்தை அகற்றுதல்", "அண்டிசெப்டிக் துவைப்பு"],
      prevention: ["மழையிலிருந்து பாதுகாப்பு", "தோல் காயங்களை விரைவில் சிகிச்சை", "எக்டோபராசிட் கட்டுப்பாடு", "அதிக கூட்டம் தவிர்க்கவும்"]
    },
    photosensitization: {
      name: "ஒளி உணர்திறன்",
      latin: "ஹெபாடோஜெனஸ் / ப்ரைமரி",
      desc: "நிறமற்ற தோலில் சூரிய ஒளியால் எரிச்சல். கருப்பை சேதம் அல்லது ஒளியைத் தூண்டும் தாவரங்களால்.",
      visualSigns: ["வெள்ளை தோலில் சிவப்பு/எரிந்த பகுதி", "காது/மூக்குத் துப்பல் வீக்கம்", "தோல் உதிர்வு", "காது தாழ்வு"],
      treatment: ["உடனே நிழலில் வையுங்கள்", "ஒளியைத் தூண்டும் தீனி/தாவரங்களை நீக்கவும்", "அழற்சி தணிக்கும் மருந்துகள்", "கருப்பை காரணம் இருந்தால் சிகிச்சை", "தோல் காய பராமரிப்பு"],
      prevention: ["நிழல் வசதி", "விஷ தாவரங்களை அகற்றுங்கள்", "கருப்பை ஆரோக்கியம் கண்காணிக்கவும்", "வெள்ளை தோல் பாதுகாப்பு"]
    },
    actinomycosis: {
      name: "ஆக்டினோமைகோசிஸ் (லம்பி ஜா)",
      latin: "ஆக்டினோமைசஸ் போவிஸ்",
      desc: "தாடை எலும்பில் நீண்டகால பாக்டீரியா தொற்று; கடினமான நிலையான வீக்கம்.",
      visualSigns: ["தாடையில் கடின வீக்கம்", "தாடையில் அசையாத கட்டி", "சுரங்க வழியாக சுரப்பு", "மெல்ல சாப்பிடும் சிரமம்"],
      treatment: ["சோடியம் ஐோடைடு IV (சிறந்த பயன்)", "நீண்டகால ஆன்டிபயாட்டிக்", "அப்ஸஸ் இருந்தால் அறுவை வடிகால்", "சில நேரங்களில் ஐசோனியாசிட்"],
      prevention: ["கரடுமுரடான/கூர்மையான தீனி தவிர்க்கவும்", "பல் பராமரிப்பு", "காயம் விரைவில் சிகிச்சை", "கடுமையான நிலையை நீக்குதல்"]
    }
  },
  sa: {
    lumpy_skin: {
      name: "लम्पी स्किन व्याधिः",
      latin: "नीथलिंग विषाणुः",
      desc: "त्वचायां कठोराः उन्नताः ग्रन्थयः, ज्वरः तथा लिम्फ-ग्रन्थि-शोथः भवति। दंशक-कीटैः प्रसारः।",
      visualSigns: ["त्वचायां गोलाकाराः उन्नताः ग्रन्थयः", "शिरः, कण्ठ, पादेषु ग्रन्थयः", "लिम्फ-ग्रन्थि-शोथः", "खपटीयुक्ताः त्वचाघाताः"],
      treatment: ["विशिष्टः प्रतिविषाणु-उपचारः नास्ति; सहाय्य-चिकित्सा", "शोथहर औषधयः (फ्लुनिक्सिन)", "द्वितीयक संक्रमणे प्रतिजैविकाः", "त्वचाघात-परिचर्या", "स्वस्थ पशूनां टीकाकरणम्"],
      prevention: ["वार्षिकं टीकाकरणम्", "कीट-नियन्त्रणम्", "नवानाम् पशूनां पृथक्करणम्", "जैव-सुरक्षा-प्रोटोकॉलः"]
    },
    fmd: {
      name: "खुरपाक-मुखपाक व्याधिः",
      latin: "अफ्थोवायरसः",
      desc: "अतिसंसर्गजन्यः विषाणु-रोगः। मुखे, खुरेषु, स्तने च फोका; अतिलालास्रवः, लङ्घनम्, उत्पादन-ह्रासः।",
      visualSigns: ["मुख/जिह्वायां फोका", "अतिलालास्रवः", "खुरेषु फोका", "लङ्घनम्"],
      treatment: ["उपचारः नास्ति; केवलं सहाय्य-चिकित्सा", "मृदु आहारः तथा स्वच्छ जलम्", "मुखस्य अण्टीसेप्टिक धावनम्", "खुर-परिचर्या/बंधनम्", "अधिकारिणः सूचनीयम्"],
      prevention: ["कठोरं टीकाकरण-कार्यक्रमम्", "पृथक्करणं तथा गमन-नियन्त्रणम्", "परिसर-शुद्धीकरणम्", "शीघ्रं सूचयतु"]
    },
    ringworm: {
      name: "दद्रु (रिंगवर्म)",
      latin: "ट्राइकोफायटन वेरुकोसम",
      desc: "फफून्द-जन्यः त्वचा-रोगः; गोलाकाराः खपटीयुक्ताः धब्बाः। मनुष्येषु अपि संक्रामकः।",
      visualSigns: ["गोलाकाराः श्वेत-धूसर-धब्बाः", "उन्नताः खपटीयुक्त घाताः", "केश-क्षयः", "अधिकं शिरः/कण्ठे"],
      treatment: ["स्थानीयः अण्टीफंगल उपचारः (आयोडीन)", "सिस्टमिकः अण्टीफंगल (ग्रिसियोफुल्विन)", "वातायनं वर्धयतु", "सामान्यतः 3-4 मासेषु स्वयमेव शमनम्"],
      prevention: ["सु-वन्टिलेशनम्", "अतिसंहति-निवृत्तिः", "टीका उपलब्धा", "उपकरण-शुद्धीकरणम्"]
    },
    mange: {
      name: "कण्डू (मैन्ज)",
      latin: "सार्कॉप्ट्स / सॉरोप्ट्स",
      desc: "माइट्-जन्यः परजीवी त्वचा-रोगः। तीव्र कण्डू, त्वचा स्थूलता, केश-क्षयः।",
      visualSigns: ["स्थूल/कुंचिता त्वचा", "केश-क्षयः व खपटी", "खर्जन-चिह्नानि", "पूच्छ/पृष्ठे खपटीयुक्त घाताः"],
      treatment: ["इवर्मेक्टिन इंजेक्शन (10 दिनानन्तरं द्वितीयं)", "पोर-ऑन अकारिसाइड", "संपर्कित सर्व पशूनां उपचारः", "पर्यावरण-उपचारः"],
      prevention: ["नियमित परजीवी-नियन्त्रणम्", "नवानाम् पशूनां पृथक्करणम्", "अतिसंहति-निवृत्तिः", "स्वच्छ आवासः"]
    },
    pink_eye: {
      name: "पिङ्क् आइ (IBK)",
      latin: "मोरैक्सेला बोविस",
      desc: "नेत्रे जीवाणु-जन्यः संक्रमणः; अश्रु-स्रावः, कॉर्निया धूमिलः, अन्धत्व-भयः। मक्षिकाभिः प्रसारः।",
      visualSigns: ["नेत्रात् अश्रु-स्रावः", "धूमिलः कॉर्निया", "पक्ष्म-शोथः", "नेत्र-निमीलनम्"],
      treatment: ["अण्टीबायोटिक नेत्र-लेपः (ऑक्सिटेट्रासायक्लिन)", "सब-कॉन्जंक्टिवल इंजेक्शन", "गंभीर-प्रकरणे नेत्र-पट्टिका", "मक्षिका-नियन्त्रणम्"],
      prevention: ["मक्षिका-नियन्त्रण-कार्यक्रमः", "यूवी-छाया", "टीकाकरणम्", "धूलि-निवारणम्"]
    },
    mastitis: {
      name: "स्तनशोथः",
      latin: "विविध रोगकारकाः",
      desc: "स्तनस्य जीवाणु-जन्यः शोथः। स्तनः उष्णः/वेदनायुक्तः, दुग्धं च असामान्यम्।",
      visualSigns: ["स्तन-शोथः/उष्णता/कठोरता", "स्तने रक्तिमा", "दुग्धे कणिकाः/जलीयता", "दुग्ध-दोहे लातः"],
      treatment: ["इंट्रामॅमरी प्रतिजैविकाः", "गंभीर-प्रकरणे सिस्टमिक प्रतिजैविकाः", "शोथहर औषधयः", "वारंवारं दोहनम्"],
      prevention: ["दोहन-पूर्व/पश्चात् टीट-डिपिंग", "उपकरण-शुद्धता", "ड्राई-काउ थेरपी", "सम्यक् दोहन-प्रणाली"]
    },
    bloat: {
      name: "वायुगर्भता (ब्लोट)",
      latin: "रूमिनल टिम्पनी",
      desc: "रूमेन मध्ये गैस-संचयः; वाम उदरः फुल्लः। उपचार-ाभावे घातकः।",
      visualSigns: ["वाम उदर-विकासः", "कठिन-श्वासः", "उदरं लातयति", "पाद-विस्तारः"],
      treatment: ["आपत्कालीनः: स्टमक ट्यूब प्रवेशनम्", "अण्टी-फोमिंग औषधि (पॉलॉक्सालेन)", "गंभीर-प्रकरणे ट्रोकार", "मन्दं चलनम्"],
      prevention: ["चर्यायाः क्रमिक परिचयः", "अण्टी-ब्लोट पूरकः", "पर्याप्त रूक्ष-आहारः", "आर्द्र शिंबि-चर्या त्यज्यताम्"]
    },
    brd: {
      name: "गो-श्वसन रोगः",
      latin: "विविध कारकाः",
      desc: "विषाणु/जीवाणु-समूह-जन्यः श्वसन रोगः; कासः, नासास्रवः, ज्वरः।",
      visualSigns: ["नासास्रवः (स्वच्छात् गाढं पर्यन्तम्)", "तीव्र/कठिन श्वासः", "लोल-कर्णौ", "निस्तेजता"],
      treatment: ["दीर्घकालिक प्रतिजैविकाः (ट्युलाथ्रोमायसिन)", "ज्वर/शोथस्य NSAIDs", "सहाय्य-चिकित्सा एवं पृथक्करणम्", "निर्जलीकरणे द्रव-चिकित्सा"],
      prevention: ["टीकाकरण-कार्यक्रमः", "अल्प-तनाव-हँडलिंग", "उत्तम वेंटिलेशनम्", "नवानाम् पशूनां पृथक्करणम्"]
    },
    blackleg: {
      name: "ब्लैकलेग",
      latin: "क्लोस्ट्रीडियम शौवोई",
      desc: "आकस्मिकः, प्रायः प्राणघातकः जीवाणु-रोगः। त्वचायामधः वायुगर्भ शोथः।",
      visualSigns: ["पाद/शरीरे आकस्मिक शोथः", "दाबने कर्कशध्वनिः", "शोथे कृष्णा त्वचा", "आकस्मिक लङ्घनम्"],
      treatment: ["उच्च डोस पेनिसिलिन (आरम्भे)", "अनेकदा उपचारात् पूर्वं मृत्यु", "शव-दाहः/गभीर-निक्षेपः", "शवम् न उद्घाटयेत्"],
      prevention: ["3-6 मासेषु टीकाकरणम्", "वार्षिक बूस्टर", "एन्डेमिक क्षेत्रे मृदा-खोदनं त्यज्यताम्"]
    },
    papillomatosis: {
      name: "पपिलोमेटोसिस (मस्सकाः)",
      latin: "बोवाइन पपिलोमा-विषाणुः",
      desc: "युवा पशुषु मस्सकाः। सामान्यतः स्वयमेव शम्यन्ते।",
      visualSigns: ["फूलकोबी-सदृशाः मस्सकाः", "शिरः/कण्ठे मस्सकाः", "समूहिताः मस्सकाः", "लम्बित/समतल मस्सकाः"],
      treatment: ["सामान्यतः 2-12 मासेषु स्वयमेव शमनम्", "अवरोधकः चेत् शल्य-अपसारणम्", "ऑटोजेनस टीका", "लघु मस्सकानां क्रायोथेरपी"],
      prevention: ["उपकरण-भागीदारीं मा कुर्यात्", "हँडलिंग-स्थानं शुद्धीकरोतु", "प्रभावितान् पृथक्करोतु"]
    },
    hoof_rot: {
      name: "खुर-सडन (Foot Rot)",
      latin: "फ्युसोबॅक्टेरियम नेक्रोफोरम",
      desc: "खुर-मध्यभागे जीवाणु-जन्यः संक्रमणः; शोथः, दुर्गन्धः, लङ्घनम्। आर्द्र-मृत्तिकायां अधिकम्।",
      visualSigns: ["खुर-मध्य-शोथः", "एक-पाद लङ्घनम्", "खुरात् दुर्गन्ध-युक्तः स्रावः", "खुर-मध्य रक्तिमा"],
      treatment: ["सिस्टमिक प्रतिजैविकाः (ऑक्सिटेट्रासायक्लिन)", "खुर-छेदनं व शुद्धीकरणम्", "स्थानीय अण्टीसेप्टिक स्प्रे", "फूट-बाथ (कॉपर सल्फेट)"],
      prevention: ["नियमितं खुर-छेदनम्", "फूट-बाथ", "दलदल-निकासः", "स्वच्छ आवासः"]
    },
    tick_infestation: {
      name: "किलनी-संक्रमणम्",
      latin: "बूफिलस / अॅम्ब्लायोम्मा spp.",
      desc: "बाह्य परजीविनः; रक्त-ह्रासः, त्वचा-हानिः, रोग-प्रसारः।",
      visualSigns: ["शरीरे दृश्याः किलन्यः", "कर्ण/स्तन/पेरिनियम् मध्ये अधिकाः", "किलनी-क्षतचिह्नानि", "दुर्बल कोट"],
      treatment: ["अकारिसाइड लेपन/स्प्रे", "इवर्मेक्टिन इंजेक्शन", "स्थूल-किलन्यः हस्तेन अपसारयेत्", "द्वितीयक संक्रमण-उपचारः"],
      prevention: ["नियमित अकारिसाइड कार्यक्रमः", "परिवर्तित चर्या", "किलनी-प्रतिरोधी जाति", "पर्यावरणीय नियन्त्रणम्"]
    },
    dermatophilosis: {
      name: "डर्माटोफिलोसिस (वर्षा-स्कॉल्ड)",
      latin: "डर्माटोफिलस कोंगोलेन्सिस",
      desc: "दीर्घ-वर्षा/आर्द्रतया वर्धमानः त्वचा-जीवाणु-रोगः। केशाः खपटीयुक्ताः भवन्ति।",
      visualSigns: ["ब्रश-सदृश केश-गुच्छाः", "खपटी-छेदनम्", "अधः गुलाबी कच्च-त्वचा", "पृष्ठ/पार्श्वे घाताः"],
      treatment: ["पशुं शुष्के/आश्रये स्थापयेत्", "सिस्टमिक प्रतिजैविकाः (पेनिसिलिन/स्ट्रेप)", "खपटी सौम्यतया अपसारयेत्", "अण्टीसेप्टिक धावनम्"],
      prevention: ["वर्षा-रक्षणम्", "त्वचा-क्षतस्य शीघ्र उपचारः", "एक्टोपैरासाइट-नियन्त्रणम्", "अतिसंहति-निवृत्तिः"]
    },
    photosensitization: {
      name: "प्रकाश-संवेदनशीलता",
      latin: "हेपैटोजेनस / प्राइमरी",
      desc: "निर्वर्ण त्वचायां सूर्यप्रकाश-जन्यः दाहः। यकृत-हानिः वा प्रकाश-प्रेरक पौधाः कारणम्।",
      visualSigns: ["श्वेत त्वचायां रक्तिमा/दाह", "कर्ण/थूथन-शोथः", "त्वचा छेदनम्", "लोल-कर्णौ"],
      treatment: ["तत्क्षणं छायायां स्थापयेत्", "प्रकाश-प्रेरक आहार/पौधाः दूरयेत्", "शोथहर औषधयः", "यकृत-कारणं चेत् उपचारः", "त्वचाघात-परिचर्या"],
      prevention: ["छाया-व्यवस्था", "विषाक्त पौधाः दूरयेत्", "यकृत-स्वास्थ्य निरीक्षणम्", "श्वेत त्वचायाः रक्षणम्"]
    },
    actinomycosis: {
      name: "एक्टिनोमाइकोसिस (लम्पी जॉ)",
      latin: "एक्टिनोमाइसेस बोविस",
      desc: "हनु-अस्थे दीर्घकालिकः जीवाणु-रोगः; कठोरः स्थिरः शोथः।",
      visualSigns: ["हनौ कठोर-शोथः", "हनौ स्थिरः ग्रन्थिः", "साइनस्-मार्गेण स्रावः", "चर्वणे कठिनता"],
      treatment: ["सोडियम आयोडाइड IV (अत्युत्तमम्)", "दीर्घकालिक प्रतिजैविकाः", "अॅब्सेस् चेत् शल्य-निष्कासनम्", "क्वचित् आयसोनीयाजिड्"],
      prevention: ["कठोर/तीक्ष्ण आहारः त्यज्यताम्", "दन्त-परिचर्या", "क्षतस्य शीघ्र उपचारः", "गंभीर-प्रकरणे निष्कासनम्"]
    }
  }
};
const SPECIAL_DIAGNOSIS_I18N = {
  en: {
    healthy_cow: {
      name: "Healthy Cow (No Visible Disease)",
      latin: "Clinical Screen: Normal",
      desc: "No clear visual disease pattern was detected in the uploaded image.",
      visualSigns: ["Body condition appears normal", "No major external lesion pattern detected"],
      treatment: ["No immediate treatment required based on this image"],
      prevention: ["Continue regular vaccination, hygiene, and routine vet checks"]
    },
    not_cow: {
      name: "Image Not Suitable for Cattle Diagnosis",
      latin: "Input Verification",
      desc: "The uploaded photo does not appear to contain a cow or a clinically useful cattle region.",
      visualSigns: ["Non-cattle image pattern detected"],
      treatment: ["Upload a clear image of the cow or affected body area"],
      prevention: ["Use close focus, good lighting, and avoid unrelated objects in frame"]
    },
    unclear_input: {
      name: "Image Not Suitable for Cattle Diagnosis",
      latin: "Input Quality Check",
      desc: "The uploaded image is too unclear or may not contain a cow. Please retake and upload a clinically relevant cattle image.",
      visualSigns: ["Insufficient visual match for cattle diagnosis"],
      treatment: ["Re-upload with clearer focus on the cow or affected region"],
      prevention: ["Keep good lighting and frame only the cow/affected area"]
    },
    low_confidence: {
      name: "Image Needs Re-scan",
      latin: "Insufficient Pattern Match",
      desc: "The model could not confidently match this image to known cattle disease classes.",
      visualSigns: ["No high-confidence class match"],
      treatment: ["Retake image with closer focus on the affected cattle area"],
      prevention: ["Use a sharp image with adequate lighting and a visible cow region"]
    }
  },
  hi: {
    healthy_cow: {
      name: "स्वस्थ गाय (कोई स्पष्ट रोग नहीं)",
      latin: "क्लिनिकल स्क्रीन: सामान्य",
      desc: "अपलोड की गई छवि में कोई स्पष्ट रोग पैटर्न नहीं मिला।",
      visualSigns: ["शरीर की स्थिति सामान्य दिखती है", "कोई प्रमुख बाहरी घाव नहीं दिखे"],
      treatment: ["इस छवि के आधार पर तत्काल उपचार की आवश्यकता नहीं"],
      prevention: ["नियमित टीकाकरण, स्वच्छता और नियमित जांच जारी रखें"]
    },
    not_cow: {
      name: "छवि गाय के निदान के लिए उपयुक्त नहीं",
      latin: "इनपुट सत्यापन",
      desc: "अपलोड की गई फोटो में गाय या उपयोगी क्षेत्र नहीं दिख रहा।",
      visualSigns: ["गाय से असंबंधित पैटर्न मिला"],
      treatment: ["गाय/प्रभावित हिस्से की स्पष्ट फोटो अपलोड करें"],
      prevention: ["उचित रोशनी और सही फ्रेमिंग रखें"]
    },
    unclear_input: {
      name: "छवि गाय के निदान के लिए उपयुक्त नहीं",
      latin: "इनपुट गुणवत्ता जांच",
      desc: "छवि अस्पष्ट है या गाय नहीं दिख रही। कृपया स्पष्ट फोटो पुनः लें।",
      visualSigns: ["निदान हेतु पर्याप्त दृश्य प्रमाण नहीं"],
      treatment: ["गाय/प्रभावित हिस्से पर फोकस करके पुनः अपलोड करें"],
      prevention: ["अच्छी रोशनी और स्थिर फ्रेम रखें"]
    },
    low_confidence: {
      name: "छवि को पुनः स्कैन करें",
      latin: "पर्याप्त पैटर्न नहीं मिला",
      desc: "मॉडल किसी ज्ञात रोग वर्ग से मेल नहीं कर सका।",
      visualSigns: ["उच्च-विश्वास वाला वर्ग नहीं मिला"],
      treatment: ["प्रभावित हिस्से का पास से स्पष्ट फोटो लें"],
      prevention: ["तेज़ और स्पष्ट फोटो लें, उचित रोशनी रखें"]
    }
  },
  mr: {
    healthy_cow: {
      name: "निरोगी गाय (स्पष्ट रोग नाही)",
      latin: "क्लिनिकल स्क्रीन: सामान्य",
      desc: "अपलोड केलेल्या प्रतिमेत कोणताही स्पष्ट रोग नमुना आढळला नाही.",
      visualSigns: ["शरीराची स्थिती सामान्य दिसते", "मोठे बाह्य घाव आढळले नाहीत"],
      treatment: ["या प्रतिमेच्या आधारे तातडीच्या उपचारांची गरज नाही"],
      prevention: ["नियमित लसीकरण, स्वच्छता आणि तपासणी सुरू ठेवा"]
    },
    not_cow: {
      name: "प्रतिमा गाय निदानासाठी योग्य नाही",
      latin: "इनपुट पडताळणी",
      desc: "अपलोड केलेल्या फोटोमध्ये गाय किंवा आवश्यक क्षेत्र दिसत नाही.",
      visualSigns: ["गायेशी संबंधित नसलेला नमुना आढळला"],
      treatment: ["गाय/प्रभावित भागाची स्पष्ट प्रतिमा अपलोड करा"],
      prevention: ["योग्य प्रकाश आणि योग्य फ्रेमिंग ठेवा"]
    },
    unclear_input: {
      name: "प्रतिमा गाय निदानासाठी योग्य नाही",
      latin: "इनपुट गुणवत्ता तपासणी",
      desc: "प्रतिमा अस्पष्ट आहे किंवा गाय दिसत नाही. कृपया स्पष्ट फोटो पुन्हा घ्या.",
      visualSigns: ["निदानासाठी पुरेशी दृश्य माहिती नाही"],
      treatment: ["गाय/प्रभावित भागावर फोकस करून पुन्हा अपलोड करा"],
      prevention: ["चांगला प्रकाश आणि स्थिर फ्रेम ठेवा"]
    },
    low_confidence: {
      name: "प्रतिमा पुन्हा स्कॅन करा",
      latin: "पुरेसा नमुना जुळला नाही",
      desc: "मॉडेलला कोणताही ज्ञात रोग वर्ग ठोसपणे जुळवता आला नाही.",
      visualSigns: ["उच्च-विश्वास वर्ग आढळला नाही"],
      treatment: ["प्रभावित भागाचा जवळून स्पष्ट फोटो घ्या"],
      prevention: ["तीक्ष्ण प्रतिमा आणि योग्य प्रकाश ठेवा"]
    }
  },
  ta: {
    healthy_cow: {
      name: "ஆரோக்கியமான மாடு (தெளிவான நோய் இல்லை)",
      latin: "கிளினிக்கல் ஸ்க்ரீன்: சாதாரணம்",
      desc: "அப்லோடு செய்யப்பட்ட படத்தில் தெளிவான நோய் அடையாளம் கண்டுபிடிக்கப்படவில்லை.",
      visualSigns: ["உடல் நிலை சாதாரணமாக உள்ளது", "முக்கிய வெளிப்புற காயங்கள் இல்லை"],
      treatment: ["இந்த படத்தின் அடிப்படையில் உடனடி சிகிச்சை தேவையில்லை"],
      prevention: ["தொடர்ந்த தடுப்பூசி, சுத்தம், வழக்கமான பரிசோதனை தொடரவும்"]
    },
    not_cow: {
      name: "இந்த படம் மாட்டு நோயறிதலுக்கு பொருத்தமில்லை",
      latin: "உள்ளீட்டு சரிபார்ப்பு",
      desc: "படத்தில் மாடு அல்லது பயனுள்ள பகுதி இல்லை.",
      visualSigns: ["மாட்டிற்கு தொடர்பில்லாத பட வடிவம் கண்டறியப்பட்டது"],
      treatment: ["மாடு/பாதிக்கப்பட்ட பகுதியின் தெளிவான படத்தை அப்லோடு செய்யவும்"],
      prevention: ["சரியான ஒளி மற்றும் சரியான பிரேமிங் பயன்படுத்தவும்"]
    },
    unclear_input: {
      name: "இந்த படம் மாட்டு நோயறிதலுக்கு பொருத்தமில்லை",
      latin: "உள்ளீட்டு தரச் சோதனை",
      desc: "படம் தெளிவாக இல்லை அல்லது மாடு இல்லை. தெளிவான படத்தை மீண்டும் எடுக்கவும்.",
      visualSigns: ["நோயறிதலுக்கு போதுமான காட்சி ஆதாரம் இல்லை"],
      treatment: ["மாடு/பாதிக்கப்பட்ட பகுதியை கவனம் செலுத்தி மீண்டும் அப்லோடு செய்யவும்"],
      prevention: ["நல்ல ஒளி மற்றும் நிலையான பிரேமிங் வைத்திருக்கவும்"]
    },
    low_confidence: {
      name: "படத்தை மீண்டும் ஸ்கேன் செய்யவும்",
      latin: "போதிய மாதிரி பொருத்தம் இல்லை",
      desc: "மாடல் எந்த நோய் வகையையும் நம்பிக்கையுடன் பொருத்தவில்லை.",
      visualSigns: ["உயர் நம்பிக்கை வகை இல்லை"],
      treatment: ["பாதிக்கப்பட்ட பகுதியின் அருகிலிருந்து தெளிவான படத்தை எடுக்கவும்"],
      prevention: ["தெளிவான படமும் சரியான ஒளியும் பயன்படுத்தவும்"]
    }
  },
  sa: {
    healthy_cow: {
      name: "स्वस्थ गौः (स्पष्टः रोगः नास्ति)",
      latin: "क्लिनिकल स्क्रीन: सामान्य",
      desc: "अपलोडित प्रतिमायां स्पष्टः रोग-नमूनः न दृश्यते।",
      visualSigns: ["शरीर-स्थितिः सामान्यं दृश्यते", "प्रमुखः बाह्यः घातः न दृश्यते"],
      treatment: ["एतस्य चित्रस्य आधारे तात्कालिक उपचारः न आवश्यकः"],
      prevention: ["नियमितं टीकाकरणं, स्वच्छता, तथा नियमित परीक्षाः चाल्यताम्"]
    },
    not_cow: {
      name: "प्रतिमा गौ-निदानाय अनुपयुक्ता",
      latin: "इनपुट सत्यापनम्",
      desc: "अपलोडित चित्रे गौः वा उपयुक्तः भागः न दृश्यते।",
      visualSigns: ["गौ-असम्बद्धः नमूनः दृश्यते"],
      treatment: ["गौ/प्रभावित भागस्य स्पष्टं चित्रं अपलोडयेत्"],
      prevention: ["सम्यक् प्रकाशः तथा उचितं फ्रेमिंग् प्रयुज्यताम्"]
    },
    unclear_input: {
      name: "प्रतिमा गौ-निदानाय अनुपयुक्ता",
      latin: "इनपुट गुणवत्ता परीक्षणम्",
      desc: "प्रतिमा अस्पष्टा वा गौः न दृश्यते। कृपया स्पष्टं चित्रं पुनर्गृह्णातु।",
      visualSigns: ["निदानाय पर्याप्तं दृश्य-प्रमाणं नास्ति"],
      treatment: ["गौ/प्रभावित भागे फोकस कृत्वा पुनः अपलोडयेत्"],
      prevention: ["उत्तमः प्रकाशः तथा स्थिरं फ्रेमिंग्"]
    },
    low_confidence: {
      name: "प्रतिमा पुनः स्कैन करणीया",
      latin: "पर्याप्तं नमूनं न मिलितम्",
      desc: "मॉडेलः ज्ञात-रोग-वर्गेण सम्यक् न मिलितवान्।",
      visualSigns: ["उच्च-विश्वास-वर्गः न दृश्यते"],
      treatment: ["प्रभावित भागस्य समीपात् स्पष्टं चित्रं गृह्णातु"],
      prevention: ["तीक्ष्णा प्रतिमा तथा सम्यक् प्रकाशः प्रयुज्यताम्"]
    }
  }
};

// === Symptom Categories ===
const SYMPTOM_CATEGORIES = [
  { id: "skin", name: "Skin & Coat", icon: "\uD83E\uDDEC", symptoms: [
    { id: "skin_lumps", label: "Lumps / Nodules" }, { id: "skin_patches", label: "Patches / Discoloration" },
    { id: "hair_loss", label: "Hair Loss" }, { id: "crusty_skin", label: "Crusty / Scabby Skin" },
    { id: "itching", label: "Itching / Scratching" }, { id: "skin_thickening", label: "Thickened Skin" },
    { id: "skin_redness", label: "Red / Inflamed Skin" }, { id: "skin_peeling", label: "Peeling Skin" },
    { id: "skin_growths", label: "Warts / Growths" }, { id: "visible_parasites", label: "Visible Ticks / Parasites" }
  ]},
  { id: "mouth_head", name: "Mouth & Head", icon: "\uD83D\uDC44", symptoms: [
    { id: "mouth_blisters", label: "Mouth Blisters" }, { id: "drooling", label: "Excessive Drooling" },
    { id: "jaw_swelling", label: "Jaw Swelling" }, { id: "nasal_discharge", label: "Nasal Discharge" },
    { id: "difficulty_eating", label: "Difficulty Eating" }
  ]},
  { id: "eyes", name: "Eyes", icon: "\uD83D\uDC41\uFE0F", symptoms: [
    { id: "eye_tearing", label: "Watery / Tearing Eyes" }, { id: "cloudy_eye", label: "Cloudy Eye" },
    { id: "eye_swelling", label: "Swollen Eyelids" }, { id: "light_sensitivity", label: "Light Sensitivity" }
  ]},
  { id: "limbs", name: "Limbs & Movement", icon: "\uD83E\uDDB5", symptoms: [
    { id: "lameness", label: "Lameness / Limping" }, { id: "hoof_lesions", label: "Hoof Lesions" },
    { id: "swelling", label: "Leg / Joint Swelling" }, { id: "sudden_swelling", label: "Sudden Gas Swelling" },
    { id: "foul_smell", label: "Foul Smell from Hoof" }
  ]},
  { id: "body", name: "Body & Digestion", icon: "\uD83D\uDC04", symptoms: [
    { id: "bloated_abdomen", label: "Bloated Abdomen" }, { id: "swollen_udder", label: "Swollen / Hard Udder" },
    { id: "abnormal_milk", label: "Abnormal Milk" }, { id: "reduced_milk", label: "Reduced Milk Yield" }
  ]},
  { id: "general", name: "General / Behavioral", icon: "\uD83D\uDCCB", symptoms: [
    { id: "fever", label: "Fever / High Temperature" }, { id: "loss_appetite", label: "Loss of Appetite" },
    { id: "weight_loss", label: "Weight Loss" }, { id: "depression", label: "Dullness / Depression" },
    { id: "restlessness", label: "Restlessness" }, { id: "labored_breathing", label: "Labored Breathing" },
    { id: "coughing", label: "Coughing" }, { id: "pain_response", label: "Pain Response" },
    { id: "anemia_signs", label: "Pale Gums / Anemia" }, { id: "swollen_lymph", label: "Swollen Lymph Nodes" },
    { id: "sudden_death", label: "Sudden Death" }
  ]}
];

const SYMPTOM_CATEGORY_I18N = {
  en: {
    skin: "Skin & Coat",
    mouth_head: "Mouth & Head",
    eyes: "Eyes",
    limbs: "Limbs & Movement",
    body: "Body & Digestion",
    general: "General / Behavioral"
  },
  hi: {
    skin: "त्वचा और कोट",
    mouth_head: "मुंह और सिर",
    eyes: "आंखें",
    limbs: "पैर और चलना",
    body: "शरीर और पाचन",
    general: "सामान्य / व्यवहार"
  },
  mr: {
    skin: "त्वचा आणि केस",
    mouth_head: "तोंड आणि डोके",
    eyes: "डोळे",
    limbs: "पाय आणि चाल",
    body: "शरीर आणि पचन",
    general: "सामान्य / वर्तन"
  },
  ta: {
    skin: "தோல் மற்றும் முடி",
    mouth_head: "வாய் மற்றும் தலை",
    eyes: "கண்கள்",
    limbs: "கால் மற்றும் இயக்கம்",
    body: "உடல் மற்றும் ஜீரணம்",
    general: "பொது / நடத்தை"
  },
  sa: {
    skin: "त्वचा एवं केश",
    mouth_head: "मुखम् एवं शिरः",
    eyes: "नेत्राणि",
    limbs: "पादाः एवं गमनम्",
    body: "शरीरम् एवं पाचनम्",
    general: "सामान्य / आचरण"
  }
};

const SYMPTOM_LABELS_I18N = {
  en: {
    skin_lumps: "Lumps / Nodules",
    skin_patches: "Patches / Discoloration",
    hair_loss: "Hair Loss",
    crusty_skin: "Crusty / Scabby Skin",
    itching: "Itching / Scratching",
    skin_thickening: "Thickened Skin",
    skin_redness: "Red / Inflamed Skin",
    skin_peeling: "Peeling Skin",
    skin_growths: "Warts / Growths",
    visible_parasites: "Visible Ticks / Parasites",
    mouth_blisters: "Mouth Blisters",
    drooling: "Excessive Drooling",
    jaw_swelling: "Jaw Swelling",
    nasal_discharge: "Nasal Discharge",
    difficulty_eating: "Difficulty Eating",
    eye_tearing: "Watery / Tearing Eyes",
    cloudy_eye: "Cloudy Eye",
    eye_swelling: "Swollen Eyelids",
    light_sensitivity: "Light Sensitivity",
    lameness: "Lameness / Limping",
    hoof_lesions: "Hoof Lesions",
    swelling: "Leg / Joint Swelling",
    sudden_swelling: "Sudden Gas Swelling",
    foul_smell: "Foul Smell from Hoof",
    bloated_abdomen: "Bloated Abdomen",
    swollen_udder: "Swollen / Hard Udder",
    abnormal_milk: "Abnormal Milk",
    reduced_milk: "Reduced Milk Yield",
    fever: "Fever / High Temperature",
    loss_appetite: "Loss of Appetite",
    weight_loss: "Weight Loss",
    depression: "Dullness / Depression",
    restlessness: "Restlessness",
    labored_breathing: "Labored Breathing",
    coughing: "Coughing",
    pain_response: "Pain Response",
    anemia_signs: "Pale Gums / Anemia",
    swollen_lymph: "Swollen Lymph Nodes",
    sudden_death: "Sudden Death"
  },
  hi: {
    skin_lumps: "गांठें / नोड्यूल",
    skin_patches: "धब्बे / रंग परिवर्तन",
    hair_loss: "बाल झड़ना",
    crusty_skin: "पपड़ीदार त्वचा",
    itching: "खुजली",
    skin_thickening: "त्वचा मोटी होना",
    skin_redness: "लाल / सूजी त्वचा",
    skin_peeling: "त्वचा छिलना",
    skin_growths: "मस्से / वृद्धि",
    visible_parasites: "दिखने वाली किलनी/परजीवी",
    mouth_blisters: "मुंह के छाले",
    drooling: "अधिक लार",
    jaw_swelling: "जबड़े की सूजन",
    nasal_discharge: "नाक से स्राव",
    difficulty_eating: "खाने में कठिनाई",
    eye_tearing: "आंखों से पानी",
    cloudy_eye: "धुंधली आंख",
    eye_swelling: "पलकों की सूजन",
    light_sensitivity: "प्रकाश से संवेदनशीलता",
    lameness: "लंगड़ापन",
    hoof_lesions: "खुरों के घाव",
    swelling: "पैर/जोड़ की सूजन",
    sudden_swelling: "अचानक गैस वाली सूजन",
    foul_smell: "खुर से दुर्गंध",
    bloated_abdomen: "पेट फूलना",
    swollen_udder: "थन सूजा/कठोर",
    abnormal_milk: "दूध असामान्य",
    reduced_milk: "दूध कम होना",
    fever: "बुखार",
    loss_appetite: "भूख कम होना",
    weight_loss: "वजन घटना",
    depression: "सुस्ती",
    restlessness: "बेचैनी",
    labored_breathing: "कठिन सांस",
    coughing: "खांसी",
    pain_response: "दर्द प्रतिक्रिया",
    anemia_signs: "पीले मसूड़े / एनीमिया",
    swollen_lymph: "लिम्फ नोड सूजे",
    sudden_death: "अचानक मृत्यु"
  },
  mr: {
    skin_lumps: "गाठी / नोड्यूल",
    skin_patches: "डाग / रंग बदल",
    hair_loss: "केस गळणे",
    crusty_skin: "खपल्या/खवलेदार त्वचा",
    itching: "खाज",
    skin_thickening: "त्वचा जाड होणे",
    skin_redness: "लाल/दाहयुक्त त्वचा",
    skin_peeling: "त्वचा सोलणे",
    skin_growths: "मस्से / वाढ",
    visible_parasites: "दिसणारी किलनी/परजीवी",
    mouth_blisters: "तोंडातील फोड",
    drooling: "अधिक लाळ",
    jaw_swelling: "जबड्याची सूज",
    nasal_discharge: "नाकातून स्त्राव",
    difficulty_eating: "खाण्यात अडचण",
    eye_tearing: "डोळ्यातून पाणी",
    cloudy_eye: "धूसर डोळा",
    eye_swelling: "पापण्यांची सूज",
    light_sensitivity: "प्रकाश संवेदनशीलता",
    lameness: "लंगडणे",
    hoof_lesions: "खुरांचे घाव",
    swelling: "पाय/सांधा सूज",
    sudden_swelling: "अचानक गॅसयुक्त सूज",
    foul_smell: "खुरातून दुर्गंधी",
    bloated_abdomen: "पोट फुगणे",
    swollen_udder: "थन सूज/कठीण",
    abnormal_milk: "दूध असामान्य",
    reduced_milk: "दूध कमी",
    fever: "ताप",
    loss_appetite: "भूक कमी",
    weight_loss: "वजन घट",
    depression: "सुस्ती",
    restlessness: "बेचैनी",
    labored_breathing: "कठीण श्वास",
    coughing: "खोकला",
    pain_response: "वेदना प्रतिक्रिया",
    anemia_signs: "फिकट हिरड्या / अॅनिमिया",
    swollen_lymph: "लिम्फ नोड्स सूज",
    sudden_death: "अचानक मृत्यू"
  },
  ta: {
    skin_lumps: "கட்டிகள் / முட்டைகள்",
    skin_patches: "தழும்புகள் / நிறமாற்றம்",
    hair_loss: "முடி உதிர்வு",
    crusty_skin: "கரடுமுரடான / படல தோல்",
    itching: "அரிப்பு",
    skin_thickening: "தோல் தடிமன்",
    skin_redness: "சிவப்பு / அழற்சி தோல்",
    skin_peeling: "தோல் உதிர்வு",
    skin_growths: "முளைகள் / வளர்ச்சிகள்",
    visible_parasites: "தெரியும் டிக்/பராசிட்கள்",
    mouth_blisters: "வாய்ப்புண்கள்",
    drooling: "அதிக உமிழ்நீர்",
    jaw_swelling: "தாடை வீக்கம்",
    nasal_discharge: "மூக்குச் சுரப்பு",
    difficulty_eating: "உண்ண சிரமம்",
    eye_tearing: "கண் நீர்வீழ்ச்சி",
    cloudy_eye: "மங்கிய கண்",
    eye_swelling: "கண் இமை வீக்கம்",
    light_sensitivity: "ஒளி உணர்திறன்",
    lameness: "நொண்டுதல்",
    hoof_lesions: "கால்த்தடி காயங்கள்",
    swelling: "கால்/மூட்டு வீக்கம்",
    sudden_swelling: "திடீர் வாயு வீக்கம்",
    foul_smell: "கால்த்தடியில் துர்நாற்றம்",
    bloated_abdomen: "வயிறு பெருக்கு",
    swollen_udder: "மடி வீக்கம்/கடினம்",
    abnormal_milk: "அசாதாரண பால்",
    reduced_milk: "பால் குறைவு",
    fever: "காய்ச்சல்",
    loss_appetite: "பசியிழப்பு",
    weight_loss: "எடை குறைவு",
    depression: "சோர்வு",
    restlessness: "அமைதியின்மை",
    labored_breathing: "கடின சுவாசம்",
    coughing: "இருமல்",
    pain_response: "வலி எதிர்வினை",
    anemia_signs: "வெளிறிய ஈறு / இரத்தசோகை",
    swollen_lymph: "லிம்ப் முடிச்சு வீக்கம்",
    sudden_death: "திடீர் மரணம்"
  },
  sa: {
    skin_lumps: "ग्रन्थयः / नोड्यूलः",
    skin_patches: "धब्बाः / वर्ण-परिवर्तनम्",
    hair_loss: "केश-क्षयः",
    crusty_skin: "खर्पर-युक्त त्वचा",
    itching: "कण्डू",
    skin_thickening: "त्वचा स्थूलत्वम्",
    skin_redness: "रक्तिमा / शोथयुक्त त्वचा",
    skin_peeling: "त्वचा छेदनम्",
    skin_growths: "मस्सकाः / वृद्धि",
    visible_parasites: "दृश्यमानाः किलन्यः / परजीविनः",
    mouth_blisters: "मुख-फोका",
    drooling: "अतिलालास्रवः",
    jaw_swelling: "हनु-शोथः",
    nasal_discharge: "नासास्रवः",
    difficulty_eating: "भोजन-ग्रहणे कठिनता",
    eye_tearing: "अश्रु-स्रावः",
    cloudy_eye: "धूमिल-नेत्रम्",
    eye_swelling: "पक्ष्म-शोथः",
    light_sensitivity: "प्रकाश-संवेदनशीलता",
    lameness: "लङ्घनम्",
    hoof_lesions: "खुर-घाताः",
    swelling: "पाद/सन्धि-शोथः",
    sudden_swelling: "अचिर-गैस-शोथः",
    foul_smell: "खुरात् दुर्गन्धः",
    bloated_abdomen: "उदर-विकासः",
    swollen_udder: "स्तन-शोथः / कठोरः",
    abnormal_milk: "दुग्ध-वैचित्र्यम्",
    reduced_milk: "दुग्ध-कमी",
    fever: "ज्वरः",
    loss_appetite: "अन्नेच्छा-ह्रासः",
    weight_loss: "भार-ह्रासः",
    depression: "निस्तेजता",
    restlessness: "अस्थैर्यम्",
    labored_breathing: "कठिन-श्वासः",
    coughing: "कासः",
    pain_response: "वेदना-प्रतिसादः",
    anemia_signs: "पाण्डु-गण्डू / रक्ताल्पता",
    swollen_lymph: "लिम्फ-ग्रन्थि-शोथः",
    sudden_death: "अकस्मात् मृत्यु"
  }
};

function getSymptomCategoryName(id, lang = getSelectedLanguageCode()) {
  const table = SYMPTOM_CATEGORY_I18N[lang] || {};
  return table[id] || SYMPTOM_CATEGORY_I18N.en?.[id] || id;
}

function getSymptomLabel(id, lang = getSelectedLanguageCode()) {
  const table = SYMPTOM_LABELS_I18N[lang] || {};
  return table[id] || SYMPTOM_LABELS_I18N.en?.[id] || id.replace(/_/g, ' ');
}

function getLocalizedSymptomCategories() {
  return SYMPTOM_CATEGORIES.map(cat => ({
    ...cat,
    name: getSymptomCategoryName(cat.id),
    symptoms: cat.symptoms.map(s => ({ ...s, label: getSymptomLabel(s.id) }))
  }));
}

// === State ===
let uploadedImage = null;
let activeCameraStream = null;
let selectedSymptoms = new Set();
let tmModel = null;
let isModelLoaded = false;
let tmModelSource = 'symptom-only';
let modelPreloadStarted = false;
let selectedHistoryIndex = null;
let selectedReportIndex = null;

const HISTORY_KEY = 'pashucare_history';
const SYNC_QUEUE_KEY = 'pashucare_sync_queue';
const DEVICE_ID_KEY = 'pashucare_device_id';
const API_BASE_URL = (window.PASHUCARE_API_BASE || 'http://localhost:3000').replace(/\/$/, '');
const IS_LOCAL_DEV = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
const DEV_WATCH_FILES = ['./index.html', './index.css', './app.js', './i18n.js', './sw.js'];

const TM_LIB_CANDIDATES = [
  './libs/tf.min.js',
  './libs/teachablemachine-image.min.js'
];

const TM_MODEL_CANDIDATES = [
  {
    name: 'local',
    modelURL: './cow/model.json',
    metadataURL: './cow/metadata.json'
  },
  {
    name: 'online',
    modelURL: 'https://teachablemachine.withgoogle.com/models/furgUkcW7/model.json',
    metadataURL: 'https://teachablemachine.withgoogle.com/models/furgUkcW7/metadata.json'
  }
];

const ONLINE_MODEL_TIMEOUT_MS = 2500;

function getI18nText(key, fallback = '') {
  const lang = document.documentElement.lang || localStorage.getItem('pashucare_lang') || 'en';
  if (typeof TRANSLATIONS === 'undefined') return fallback || key;
  const langTable = TRANSLATIONS[lang] || {};
  const enTable = TRANSLATIONS.en || {};
  if (lang === 'en') return langTable[key] || enTable[key] || fallback || key;
  if (Object.prototype.hasOwnProperty.call(langTable, key)) {
    return langTable[key] || '';
  }
  return '';
}

function getSelectedLanguageCode() {
  return document.documentElement.lang || localStorage.getItem('pashucare_lang') || 'en';
}

const LANGUAGE_META = {
  en: { name: 'English' },
  hi: { name: 'Hindi' },
  mr: { name: 'Marathi' },
  bn: { name: 'Bengali' },
  or: { name: 'Odia' },
  ml: { name: 'Malayalam' },
  ta: { name: 'Tamil' },
  kn: { name: 'Kannada' },
  pa: { name: 'Punjabi' },
  as: { name: 'Assamese' },
  sa: { name: 'Sanskrit' }
};

function getSelectedLanguageName() {
  const meta = LANGUAGE_META[getSelectedLanguageCode()] || LANGUAGE_META.en;
  return meta.name || 'English';
}

function getLocalizedDisease(disease, lang = getSelectedLanguageCode()) {
  if (!disease) return disease;
  const table = DISEASE_I18N[lang] || null;
  if (!table || !table[disease.id]) return disease;
  return { ...disease, ...table[disease.id] };
}

function getSpecialDiagnosis(id, lang = getSelectedLanguageCode()) {
  const table = SPECIAL_DIAGNOSIS_I18N[lang] || SPECIAL_DIAGNOSIS_I18N.en || {};
  return table[id] || null;
}

function getDiagnosisLabelById(id, fallbackName) {
  if (!id) return fallbackName || '';
  const special = getSpecialDiagnosis(id);
  if (special?.name) return special.name;
  const disease = DISEASES.find(d => d.id === id);
  if (disease) return getLocalizedDisease(disease).name;
  return fallbackName || '';
}

function mapLegacySpecialDiagnosisName(name) {
  const value = String(name || '').toLowerCase();
  if (!value) return null;
  if (value.includes('healthy cow')) return 'healthy_cow';
  if (value.includes('image not suitable')) return 'not_cow';
  if (value.includes('needs re-scan') || value.includes('re-scan')) return 'low_confidence';
  if (value.includes('input quality') || value.includes('not suitable')) return 'unclear_input';
  return null;
}

function getSeverityLabel(severity) {
  if (!severity) return '';
  const key = `severity_${String(severity).toLowerCase()}`;
  return getI18nText(key, String(severity));
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function simpleHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

async function buildDevWatchSignature() {
  const signatures = await Promise.all(DEV_WATCH_FILES.map(async file => {
    try {
      const response = await fetch(`${file}?dev_watch=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return `${file}:missing`;

      const etag = response.headers.get('etag');
      const lastModified = response.headers.get('last-modified');
      const contentLength = response.headers.get('content-length');

      if (etag || lastModified || contentLength) {
        return `${file}:${etag || ''}:${lastModified || ''}:${contentLength || ''}`;
      }

      const text = await response.text();
      return `${file}:hash:${simpleHash(text)}`;
    } catch (err) {
      return `${file}:error`;
    }
  }));

  return signatures.join('|');
}

function startDevInstantReload() {
  if (!IS_LOCAL_DEV) return;
  if (window.__pashucareDevWatcherStarted) return;
  window.__pashucareDevWatcherStarted = true;

  let baseline = '';

  const check = async () => {
    try {
      const signature = await buildDevWatchSignature();
      if (!baseline) {
        baseline = signature;
        return;
      }

      if (signature !== baseline) {
        window.location.reload();
      }
    } catch (err) {
      console.warn('Dev watcher check failed:', err);
    }
  };

  check();
  setInterval(check, 1500);
}

async function disableServiceWorkerForLocalDev() {
  if (!('serviceWorker' in navigator)) return false;

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map(reg => reg.unregister()));
  } catch (err) {
    console.warn('Failed to unregister service workers in local dev:', err);
  }

  try {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key.startsWith('pashucare-'))
        .map(key => caches.delete(key))
    );
  } catch (err) {
    console.warn('Failed to clear PASHU CARE caches in local dev:', err);
  }

  if (navigator.serviceWorker.controller && sessionStorage.getItem('pc_dev_sw_reset') !== '1') {
    sessionStorage.setItem('pc_dev_sw_reset', '1');
    window.location.reload();
    return true;
  }

  return false;
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-dynamic-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === '1') return resolve();
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Script failed: ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.dynamicSrc = src;
    script.addEventListener('load', () => {
      script.dataset.loaded = '1';
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error(`Script failed: ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

async function ensureTmLibraryLoaded() {
  if (window.tmImage && typeof window.tmImage.load === 'function') return true;

  for (const src of TM_LIB_CANDIDATES) {
    try {
      await loadScriptOnce(src);
      if (window.tmImage && typeof window.tmImage.load === 'function') return true;
    } catch (err) {
      console.warn('TM library candidate failed:', src, err);
    }
  }

  return false;
}

function getModelCandidates() {
  return TM_MODEL_CANDIDATES;
}

async function loadTeachableModel(updateBadge = true) {
  if (tmModel && isModelLoaded) return true;

  const libReady = await ensureTmLibraryLoaded();
  if (!libReady) {
    if (updateBadge) setModelSourceBadge('symptom-only');
    return false;
  }

  for (const candidate of getModelCandidates()) {
    if (candidate.name === 'online' && typeof navigator !== 'undefined' && navigator.onLine === false) {
      continue;
    }

    try {
      const loadPromise = window.tmImage.load(candidate.modelURL, candidate.metadataURL);
      // Keep UX snappy on poor/no network by timing out online source quickly.
      tmModel = candidate.name === 'online'
        ? await Promise.race([
            loadPromise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Online model load timeout')), ONLINE_MODEL_TIMEOUT_MS)
            )
          ])
        : await loadPromise;
      isModelLoaded = true;
      tmModelSource = candidate.name;
      if (updateBadge) setModelSourceBadge(candidate.name);
      if (document.readyState !== 'loading') updateDashboardMetrics();
      return true;
    } catch (err) {
      console.warn(`TM model load failed (${candidate.name})`, err);
    }
  }

  if (updateBadge) setModelSourceBadge('symptom-only');
  if (document.readyState !== 'loading') updateDashboardMetrics();
  return false;
}

function scheduleModelPreload() {
  if (modelPreloadStarted || isModelLoaded) return;
  modelPreloadStarted = true;

  const runPreload = async () => {
    try {
      await loadTeachableModel(false);
    } catch (err) {
      console.warn('Background model preload failed:', err);
    }
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => { runPreload(); }, { timeout: 800 });
    return;
  }

  setTimeout(() => { runPreload(); }, 0);
}

const DB_NAME = 'PashuCareImageDB';
const STORE_NAME = 'images';

function openImageDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = () => reject('DB Error');
  });
}

function saveImageToDB(id, dataUrl) {
  openImageDB().then(db => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(dataUrl, id);
  }).catch(console.warn);
}

function loadImageFromDB(id, callback) {
  openImageDB().then(db => {
    const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(id);
    req.onsuccess = () => callback(req.result);
  }).catch(console.warn);
}

function getHistoryRecords() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch (err) {
    console.warn('History parse error, resetting history:', err);
    return [];
  }
}

function setHistoryRecords(records) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

function getSyncQueue() {
  try {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]');
  } catch (err) {
    console.warn('Sync queue parse error, resetting queue:', err);
    return [];
  }
}

function setSyncQueue(queue) {
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  if (document.readyState !== 'loading') {
    updateDashboardMetrics();
  }
}

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (id) return id;

  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    id = window.crypto.randomUUID();
  } else {
    id = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

function enqueueHistoryForSync(entry) {
  const queue = getSyncQueue();
  const exists = queue.some(item => item.id === entry.id);
  if (exists) return;
  queue.push({
    ...entry,
    deviceId: getOrCreateDeviceId(),
    queuedAt: new Date().toISOString()
  });
  setSyncQueue(queue);
}

async function syncHistoryToServer() {
  if (!navigator.onLine) return;

  const queue = getSyncQueue();
  if (!queue.length) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/sync/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: getOrCreateDeviceId(),
        records: queue
      })
    });

    if (!response.ok) return;

    const data = await response.json().catch(() => ({}));
    const ackIds = Array.isArray(data.syncedIds) ? new Set(data.syncedIds) : null;

    if (ackIds) {
      const remaining = getSyncQueue().filter(item => !ackIds.has(item.id));
      setSyncQueue(remaining);
    } else {
      setSyncQueue([]);
    }
  } catch (err) {
    console.warn('History sync failed:', err);
  }
}

function updateAnalyzeButtonState() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const hasEvidence = Boolean(uploadedImage) || selectedSymptoms.size > 0;

  if (analyzeBtn) {
    analyzeBtn.disabled = !hasEvidence;
  }

  const selectedCount = document.getElementById('diagSelectedCount');
  if (selectedCount) {
    selectedCount.textContent = String(selectedSymptoms.size);
  }

  if (hasEvidence) {
    setDiagnosisReadiness(getI18nText('diag_ready_to_run', 'Ready to run diagnosis'), 'ready');
  } else {
    setDiagnosisReadiness(getI18nText('diag_awaiting_input', 'Awaiting image or symptom input'), 'pending');
  }
}

function setDiagnosisReadiness(message, status) {
  const readiness = document.getElementById('diagReadiness');
  if (!readiness) return;

  readiness.textContent = message;
  readiness.classList.remove('pending', 'ready', 'processing');
  readiness.classList.add(status || 'pending');
}

function setModelSourceBadge(mode) {
  const badge = document.getElementById('diagModelSource');
  if (!badge) return;

  badge.classList.remove('auto', 'checking', 'online', 'offline', 'fallback');

  if (mode === 'online') {
    badge.textContent = getI18nText('model_online', 'Online Model');
    badge.classList.add('online');
    return;
  }

  if (mode === 'local') {
    badge.textContent = getI18nText('model_offline', 'Offline Model');
    badge.classList.add('offline');
    return;
  }

  if (mode === 'checking') {
    badge.textContent = getI18nText('model_checking', 'Checking Online...');
    badge.classList.add('checking');
    return;
  }

  if (mode === 'symptom-only') {
    badge.textContent = getI18nText('model_symptom_fallback', 'Symptom Engine Fallback');
    badge.classList.add('fallback');
    return;
  }

  badge.textContent = 'Auto (Online)';
  badge.classList.add('auto');
}

function removeLegacyRegistryUI() {
  // Remove old legacy "Disease Database Registry" card if a stale HTML build is loaded.
  const legacyGrid = document.getElementById('diseaseGrid');
  if (legacyGrid) {
    const legacyCard = legacyGrid.closest('.bento-card');
    if (legacyCard) {
      legacyCard.remove();
    } else {
      legacyGrid.remove();
    }
  }

  // Remove stale modal node from previous versions.
  const legacyModal = document.getElementById('diseaseModal');
  if (legacyModal) {
    legacyModal.remove();
  }

  document.querySelectorAll('h3').forEach(h3 => {
    if (String(h3.textContent || '').trim().toLowerCase() === 'disease database registry') {
      const card = h3.closest('.bento-card');
      if (card) card.remove();
    }
  });
}

async function initOfflineSupport() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      await navigator.storage.persist();
    }
  } catch (err) {
    console.warn('Persistent storage request failed:', err);
  }

  if ('serviceWorker' in navigator) {
    let reloadingForSwUpdate = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloadingForSwUpdate) return;
      reloadingForSwUpdate = true;
      window.location.reload();
    });

    navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
      .then(reg => {
        reg.update();

        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

        const triggerUpdateCheck = () => {
          reg.update().catch(err => console.warn('SW update check failed:', err));
        };

        setInterval(triggerUpdateCheck, 10 * 60 * 1000);
        window.addEventListener('focus', triggerUpdateCheck);
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') triggerUpdateCheck();
        });
      })
      .catch(err => {
        console.warn('Service worker registration failed:', err);
      });
  }
}

// === Initialization ===
document.addEventListener('DOMContentLoaded', () => {
  removeLegacyRegistryUI();
  startDevInstantReload();
  setupNavigation();
  setupDragDrop();
  setupFileInput();
  setupCameraCapture();
  renderSymptomCategories();
  loadHistory();
  renderReportTab();
  updatePillPosition();
  updateDashboardMetrics();
  setModelSourceBadge('auto');
  scheduleModelPreload();
  initOfflineSupport();
  syncHistoryToServer();
  restoreAuthState();
  openReportFromLink();

  window.addEventListener('online', () => {
    syncHistoryToServer();
    updateDashboardMetrics();
  });

  window.addEventListener('offline', () => {
    updateDashboardMetrics();
  });

  setInterval(() => {
    syncHistoryToServer();
  }, 45 * 1000);
});

// =========================================================
// SPA NAVIGATION - Top Nav Tabs
// =========================================================
function setupNavigation() {
  document.querySelectorAll('.nav-tab[data-target]').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      if (target) switchTab(target);
    });
  });
  document.querySelectorAll('.mobile-tab[data-target]').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');
      if (target) switchTab(target);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(tabId) || document.getElementById('tab-dashboard');
  if (!target) return;
  const resolvedTabId = target.id;
  target.classList.add('active');

  document.querySelectorAll('.nav-tab[data-target]').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-target') === resolvedTabId);
  });
  document.querySelectorAll('.mobile-tab[data-target]').forEach(t => {
    t.classList.toggle('active', t.getAttribute('data-target') === resolvedTabId);
  });

  updatePillPosition();

  const scroll = document.querySelector('.content-scroll');
  if (scroll) scroll.scrollTop = 0;

  if (resolvedTabId === 'tab-report') {
    selectedReportIndex = null;
    renderReportTab();
  }
}

function updatePillPosition() {
  const activeTab = document.querySelector('.nav-tab.active');
  const pill = document.getElementById('navPill');
  if (!activeTab || !pill) return;
  const parentRect = activeTab.parentElement.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();
  pill.style.left = (tabRect.left - parentRect.left) + 'px';
  pill.style.width = tabRect.width + 'px';
}

window.addEventListener('resize', updatePillPosition);

// =========================================================
// PROFILE PANEL
// =========================================================
function toggleProfilePanel() {
  document.getElementById('profilePanel').classList.toggle('open');
  document.getElementById('profileOverlay').classList.toggle('open');
}

function closeProfilePanel() {
  document.getElementById('profilePanel').classList.remove('open');
  document.getElementById('profileOverlay').classList.remove('open');
}

// =========================================================
// AUTH MODAL & LOGIN/SIGNUP
// =========================================================
function openAuthModal(tab) {
  closeProfilePanel();
  document.getElementById('authOverlay').classList.add('open');
  document.getElementById('authModal').classList.add('open');
  switchAuthTab(tab || 'login');
}

function closeAuthModal() {
  document.getElementById('authOverlay').classList.remove('open');
  document.getElementById('authModal').classList.remove('open');
  document.getElementById('loginError').textContent = '';
  document.getElementById('signupError').textContent = '';
}

function switchAuthTab(tab) {
  document.getElementById('authTabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('authTabSignup').classList.toggle('active', tab === 'signup');
  document.getElementById('loginForm').style.display = tab === 'login' ? 'flex' : 'none';
  document.getElementById('signupForm').style.display = tab === 'signup' ? 'flex' : 'none';
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error || getI18nText('auth_login_failed', 'Login failed.'); return; }
    localStorage.setItem('pashucare_user', JSON.stringify(data.user));
    localStorage.setItem('pashucare_token', data.token);
    updateAuthUI(data.user);
    closeAuthModal();
  } catch (err) {
    errEl.textContent = getI18nText('auth_conn_failed', 'Connection failed. Is the server running?');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const role = document.getElementById('signupRole').value;
  const errEl = document.getElementById('signupError');
  errEl.textContent = '';
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error || getI18nText('auth_signup_failed', 'Signup failed.'); return; }
    localStorage.setItem('pashucare_user', JSON.stringify(data.user));
    localStorage.setItem('pashucare_token', data.token);
    updateAuthUI(data.user);
    closeAuthModal();
  } catch (err) {
    errEl.textContent = getI18nText('auth_conn_failed', 'Connection failed. Is the server running?');
  }
}

function updateAuthUI(user) {
  const nameEls = [document.getElementById('navUserName'), document.getElementById('profileName')];
  const emailEl = document.getElementById('profileEmail');
  const authBtn = document.getElementById('authBtn');
  if (user) {
    nameEls.forEach(el => { if (el) el.textContent = user.name; });
    if (emailEl) emailEl.textContent = user.email;
    if (authBtn) {
      authBtn.innerHTML = '<span>&#128275;</span> <span data-i18n="set_logout_btn">Logout</span>';
      authBtn.onclick = handleLogout;
    }
  } else {
    nameEls.forEach(el => { if (el) el.textContent = getI18nText('guest', 'Guest'); });
    if (emailEl) emailEl.textContent = '';
    if (authBtn) {
      authBtn.innerHTML = '<span>&#128274;</span> <span data-i18n="set_login_btn">Login / Register</span>';
      authBtn.onclick = () => openAuthModal('login');
    }
  }
}

function handleLogout() {
  localStorage.removeItem('pashucare_user');
  localStorage.removeItem('pashucare_token');
  updateAuthUI(null);
  closeProfilePanel();
}

function restoreAuthState() {
  try {
    const user = JSON.parse(localStorage.getItem('pashucare_user'));
    if (user && user.name) updateAuthUI(user);
  } catch {}
}


// =========================================================
// FILE UPLOAD & DRAG-DROP
// =========================================================
function setupDragDrop() {
  const zone = document.getElementById('dropZone');
  if (!zone) return;
  ['dragenter','dragover'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(e => zone.addEventListener(e, ev => { ev.preventDefault(); zone.classList.remove('drag-over'); }));
  zone.addEventListener('drop', ev => { if (ev.dataTransfer.files.length) handleFile(ev.dataTransfer.files[0]); });
}

function setupFileInput() {
  const fi = document.getElementById('fileInput');
  if (fi) fi.addEventListener('change', e => { if (e.target.files.length) handleFile(e.target.files[0]); });
}

function setupCameraCapture() {
  const btn = document.getElementById('cameraBtn');
  if (btn) btn.addEventListener('click', openCameraModal);
}

function setCameraStatus(message = '') {
  const status = document.getElementById('cameraStatus');
  if (!status) return;
  status.textContent = message;
  status.style.display = message ? 'block' : 'none';
}

function stopCameraStream() {
  if (activeCameraStream) {
    activeCameraStream.getTracks().forEach(track => track.stop());
    activeCameraStream = null;
  }
  const video = document.getElementById('cameraVideo');
  if (video) video.srcObject = null;
}

async function openCameraModal() {
  const panel = document.getElementById('cameraInline');
  const placeholderContent = document.getElementById('placeholderContent');
  const placeholder = document.getElementById('uploadPlaceholder');
  const captureBtn = document.getElementById('cameraCaptureBtn');
  if (!panel) return;

  setCameraStatus('');
  if (captureBtn) captureBtn.disabled = true;
  panel.classList.add('visible');
  if (placeholderContent) placeholderContent.style.display = 'none';
  if (placeholder) placeholder.classList.add('camera-active');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setCameraStatus(getI18nText('diag_camera_unsupported', 'Camera is not available on this device.'));
    return;
  }

  try {
    stopCameraStream();
    activeCameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });
    const video = document.getElementById('cameraVideo');
    if (video) {
      video.srcObject = activeCameraStream;
      await video.play().catch(() => {});
    }
    if (captureBtn) captureBtn.disabled = false;
  } catch (err) {
    console.warn('Camera access failed:', err);
    setCameraStatus(getI18nText('diag_camera_error', 'Camera access is blocked. Please use Select Image.'));
  }
}

function closeCameraModal() {
  const panel = document.getElementById('cameraInline');
  const placeholderContent = document.getElementById('placeholderContent');
  const placeholder = document.getElementById('uploadPlaceholder');
  if (panel) panel.classList.remove('visible');
  if (placeholderContent) placeholderContent.style.display = '';
  if (placeholder) placeholder.classList.remove('camera-active');
  stopCameraStream();
  setCameraStatus('');
}

function captureCameraImage() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  if (!video || !canvas) return;

  const width = video.videoWidth || 0;
  const height = video.videoHeight || 0;
  if (!width || !height) {
    setCameraStatus(getI18nText('diag_camera_not_ready', 'Camera is not ready yet. Please try again.'));
    return;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  closeCameraModal();
  applyUploadedImage(dataUrl);
}

function applyUploadedImage(dataUrl) {
  closeCameraModal();
  uploadedImage = dataUrl;
  const preview = document.getElementById('uploadPreview');
  const placeholder = document.getElementById('uploadPlaceholder');
  const previewImg = document.getElementById('previewImage');

  if (previewImg) previewImg.src = uploadedImage;
  if (placeholder) placeholder.style.display = 'none';
  if (preview) {
    preview.style.display = 'block';
    updateAnalyzeButtonState();

    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.classList.add('scanning');

    setTimeout(() => {
      if (dropZone) dropZone.classList.remove('scanning');
      updateAnalyzeButtonState();
    }, 200);
  }

  const fi = document.getElementById('fileInput');
  if (fi) fi.value = '';
}

function handleFile(file) {
  if (!file.type.startsWith('image/')) return alert(getI18nText('alert_upload_image', 'Please upload an image file.'));
  if (file.size > 10 * 1024 * 1024) return alert(getI18nText('alert_file_too_large', 'File too large. Maximum 10MB.'));
  const reader = new FileReader();
  reader.onload = e => {
    applyUploadedImage(e.target.result);
  };
  reader.readAsDataURL(file);
}
function removeUploadedImage() {
  uploadedImage = null;
  const previewImg = document.getElementById('previewImage');
  const preview = document.getElementById('uploadPreview');
  const placeholder = document.getElementById('uploadPlaceholder');
  if (previewImg) previewImg.src = '';
  if (preview) preview.style.display = 'none';
  if (placeholder) placeholder.style.display = '';
  updateAnalyzeButtonState();
  const fi = document.getElementById('fileInput');
  if (fi) fi.value = '';
}

// === Symptom Selector ===
function renderSymptomCategories() {
  const container = document.getElementById('symptomCategories');
  if (!container) return;
  container.innerHTML = getLocalizedSymptomCategories().map(cat => `
    <div class="symptom-category" id="cat-${cat.id}">
      <div class="symptom-category-header" onclick="toggleCategory('${cat.id}')">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count" id="count-${cat.id}">0</span>
        <span class="cat-chevron">&#9662;</span>
      </div>
      <div class="symptom-options">
        ${cat.symptoms.map(s => `
          <button class="symptom-chip" data-symptom="${s.id}" onclick="toggleSymptom('${s.id}','${cat.id}')">
            <span class="chip-check">&#10003;</span> ${s.label}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleCategory(catId) {
  document.getElementById(`cat-${catId}`).classList.toggle('open');
}

function toggleSymptom(symptomId, catId) {
  const chip = document.querySelector(`[data-symptom="${symptomId}"]`);
  if (selectedSymptoms.has(symptomId)) { selectedSymptoms.delete(symptomId); chip.classList.remove('selected'); }
  else { selectedSymptoms.add(symptomId); chip.classList.add('selected'); }
  // Update category count
  const cat = SYMPTOM_CATEGORIES.find(c => c.id === catId);
  const count = cat.symptoms.filter(s => selectedSymptoms.has(s.id)).length;
  const countEl = document.getElementById(`count-${catId}`);
  countEl.textContent = count;
  countEl.classList.toggle('visible', count > 0);
  // Update summary
  const summary = document.getElementById('selectedSummary');
  const total = selectedSymptoms.size;
  summary.style.display = total > 0 ? 'block' : 'none';
  document.getElementById('selectedCount').textContent = total;
  updateAnalyzeButtonState();
}

function clearSelectedSymptoms() {
  selectedSymptoms.clear();
  renderSymptomCategories();
  const summary = document.getElementById('selectedSummary');
  if (summary) summary.style.display = 'none';
  const selectedCount = document.getElementById('selectedCount');
  if (selectedCount) selectedCount.textContent = '0';
  updateAnalyzeButtonState();
}

// === Analysis Engine ===
async function startAnalysis() {
  if (!uploadedImage && selectedSymptoms.size === 0) {
    return alert(getI18nText('alert_upload_or_symptoms', 'Please upload an image or select symptoms first.'));
  }
  setDiagnosisReadiness(getI18nText('diag_processing', 'Analysis in progress...'), 'processing');
  if (uploadedImage) {
    setModelSourceBadge(isModelLoaded ? tmModelSource : 'checking');
  } else {
    setModelSourceBadge('symptom-only');
  }
  // Show loader
  const loader = document.getElementById('analysisLoader');
  const resultsSec = document.getElementById('resultsSection');
  if (loader) loader.classList.add('visible');
  if (resultsSec) resultsSec.classList.remove('visible');
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (analyzeBtn) analyzeBtn.disabled = true;

  let mlResults = [];
  try {
    activateStep('step-load', 'Loading ML Model...');
    try {
      if (uploadedImage && !isModelLoaded) {
        const loaded = await loadTeachableModel();
        if (!loaded) {
          tmModelSource = 'symptom-only';
        } else {
          setModelSourceBadge(tmModelSource);
        }
      }
    } catch (e) {
      console.warn('Teachable Machine model not available, using symptom-based analysis:', e);
    }
    completeStep('step-load');

    activateStep('step-preprocess', 'Preprocessing image...');
    await Promise.resolve();
    completeStep('step-preprocess');

    activateStep('step-inference', 'Running inference...');
    if (tmModel && uploadedImage) {
      const imgEl = document.getElementById('previewImage');
      mlResults = await tmModel.predict(imgEl);
    }
    completeStep('step-inference');

    activateStep('step-cross', 'Cross-referencing symptoms...');
    completeStep('step-cross');

    activateStep('step-report', 'Generating report...');
    completeStep('step-report');
  } catch (e) {
    console.warn('Analysis pipeline fallback:', e);
  }

  // Generate results
  try {
    const results = generateDiagnosis(mlResults);
    if (!results.length) {
      if (loader) loader.classList.remove('visible');
      if (resultsSec) resultsSec.classList.remove('visible');
      updateAnalyzeButtonState();
      alert(getI18nText('alert_not_enough_evidence', 'Not enough evidence to generate a reliable report. Add clearer image or select symptoms.'));
      return;
    }

    renderResults(results);
    saveToHistory(results);

    if (resultsSec) resultsSec.classList.add('visible');
  } catch (err) {
    console.error('Analysis render/save failed:', err);
    alert(getI18nText('alert_report_failed', 'Scan completed but report rendering failed. Please retry once.'));
    if (resultsSec) resultsSec.classList.remove('visible');
  } finally {
    if (loader) loader.classList.remove('visible');
    updateAnalyzeButtonState();
  }
}

function activateStep(id, label) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add('active');
  const icon = el.querySelector('.step-icon');
  if (icon) icon.textContent = '...';
  const sub = document.getElementById('loaderSub');
  if (sub) {
    if (id === 'step-load' && isModelLoaded) {
      sub.textContent = `${label} (${tmModelSource})`;
    } else {
      sub.textContent = label;
    }
  }
}

function completeStep(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('active');
  el.classList.add('done');
  const icon = el.querySelector('.step-icon');
  if (icon) icon.textContent = getI18nText('label_ok', 'OK');
}

function normalizeLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function buildSpecialDiagnosisResult(id, base) {
  const localized = getSpecialDiagnosis(id) || (SPECIAL_DIAGNOSIS_I18N.en && SPECIAL_DIAGNOSIS_I18N.en[id]) || {};
  return { ...base, ...localized };
}

function generateDiagnosis(mlResults) {
  const hasSymptoms = selectedSymptoms.size > 0;
  const hasMl = Array.isArray(mlResults) && mlResults.length > 0;
  if (!hasSymptoms && !hasMl) {
    if (uploadedImage) {
      return [buildSpecialDiagnosisResult('unclear_input', {
        id: 'unclear_input',
        category: 'general',
        icon: '⚠️',
        severity: 'low',
        visualSigns: ['Insufficient model evidence for classification'],
        symptoms: [],
        treatment: ['Retake image with proper lighting and clear cattle focus'],
        prevention: ['Keep camera steady and frame only the cow/affected region'],
        urgency: 'low',
        contagious: false,
        score: 0,
        matchedSymptoms: [],
        isPrimary: true
      })];
    }
    return [];
  }

  const sortedMl = hasMl
    ? [...mlResults].sort((a, b) => Number(b.probability || 0) - Number(a.probability || 0))
    : [];
  const topPrediction = sortedMl[0] || null;

  if (topPrediction && !hasSymptoms) {
    const topClass = normalizeLabel(topPrediction.className);
    const topProb = Number(topPrediction.probability || 0);

    if (topProb >= 0.6 && (topClass.includes('healthy cow') || topClass === 'healthy')) {
      return [buildSpecialDiagnosisResult('healthy_cow', {
        id: 'healthy_cow',
        category: 'general',
        icon: '✅',
        severity: 'low',
        visualSigns: ['Body condition appears normal', 'No major external lesion pattern detected'],
        symptoms: [],
        treatment: ['No immediate treatment required based on this image'],
        prevention: ['Continue regular vaccination, hygiene, and routine vet checks'],
        urgency: 'low',
        contagious: false,
        score: Math.round(topProb * 100),
        matchedSymptoms: [],
        isPrimary: true
      })];
    }

    if (topProb >= 0.6 && (topClass.includes('not a cow') || topClass.includes('not cow'))) {
      return [buildSpecialDiagnosisResult('not_cow', {
        id: 'not_cow',
        category: 'general',
        icon: '⚠️',
        severity: 'low',
        visualSigns: ['Non-cattle image pattern detected'],
        symptoms: [],
        treatment: ['Upload a clear image of the cow or affected body area'],
        prevention: ['Use close focus, good lighting, and avoid unrelated objects in frame'],
        urgency: 'low',
        contagious: false,
        score: Math.round(topProb * 100),
        matchedSymptoms: [],
        isPrimary: true
      })];
    }

    if (topProb < 0.4) {
      return [buildSpecialDiagnosisResult('unclear_input', {
        id: 'unclear_input',
        category: 'general',
        icon: '⚠️',
        severity: 'low',
        visualSigns: ['Insufficient visual match for cattle diagnosis'],
        symptoms: [],
        treatment: ['Re-upload with clearer focus on the cow or affected region'],
        prevention: ['Keep good lighting and frame only the cow/affected area'],
        urgency: 'low',
        contagious: false,
        score: Math.round(topProb * 100),
        matchedSymptoms: [],
        isPrimary: true
      })];
    }
  }

  const DISEASE_ALIASES = {
    fmd: ['foot and mouth disease', 'foot and mouth', 'fmd', 'mouth and foot disease', 'mouth and foot diseases', 'foot mouth disease'],
    lumpy_skin: ['lumpy skin disease', 'lumpy skin diseases', 'lumpy skin'],
    ringworm: ['ringworm disease', 'ringworm diseases', 'ringworm'],
    photosensitization: ['photosensitization disease', 'photosensitization', 'photosinsatization disease', 'photosinsatization diseases', 'photosinsatization'],
    actinomycosis: ['lumpy jaw', 'actinomycosis']
  };

  const scored = DISEASES.map(d => {
    const matchedSymptoms = d.symptoms.filter(s => selectedSymptoms.has(s));
    const symptomCoverage = d.symptoms.length ? matchedSymptoms.length / d.symptoms.length : 0;
    const symptomScore = hasSymptoms ? symptomCoverage * 100 : 0;

    let mlProbability = 0;
    if (hasMl) {
      const aliases = DISEASE_ALIASES[d.id] || [];
      const tokens = [
        normalizeLabel(d.id.replace(/_/g, ' ')),
        normalizeLabel(d.name),
        ...aliases.map(alias => normalizeLabel(alias))
      ].filter(Boolean);

      const mlMatch = sortedMl.find(r => {
        const cls = normalizeLabel(r.className);
        return tokens.some(token => cls.includes(token) || token.includes(cls));
      });
      mlProbability = mlMatch ? Number(mlMatch.probability || 0) : 0;
    }
    const mlScore = mlProbability * 100;

    let score = 0;
    if (hasMl && hasSymptoms) score = (mlScore * 0.65) + (symptomScore * 0.35);
    else if (hasMl) score = mlScore;
    else score = symptomScore;

    return { ...d, score: Number(score.toFixed(2)), matchedSymptoms };
  })
    .filter(d => d.score >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((d, idx) => ({ ...d, isPrimary: idx === 0 }));

  if (!scored.length && topPrediction) {
    return [buildSpecialDiagnosisResult('low_confidence', {
      id: 'low_confidence',
      category: 'general',
      icon: 'ℹ️',
      severity: 'low',
      visualSigns: ['No high-confidence class match'],
      symptoms: [],
      treatment: ['Retake image with closer focus on the affected cattle area'],
      prevention: ['Use a sharp image with adequate lighting and a visible cow region'],
      urgency: 'low',
      contagious: false,
      score: Math.round(Number(topPrediction.probability || 0) * 100),
      matchedSymptoms: [],
      isPrimary: true
    })];
  }

  return scored;
}

// === Render Results ===
function renderResults(results) {
  const resultTime = document.getElementById('resultTime');
  const resultCount = document.getElementById('resultCount');
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
  if (resultTime) resultTime.textContent = new Date().toLocaleString();
  if (resultCount) {
    const altCount = Math.max(results.length - 1, 0);
    const primaryLabel = getI18nText('label_primary_count', 'Primary');
    const altLabel = getI18nText('label_alternatives_count', 'Alternatives');
    resultCount.textContent = altCount ? `1 ${primaryLabel} | ${altCount} ${altLabel}` : `1 ${primaryLabel}`;
  }

  const primary = results[0];
  const localizedPrimary = getLocalizedDisease(primary);
  const alternatives = results.slice(1).map(result => getLocalizedDisease(result));
  const sevClass = primary.severity;
  const urgencyClass = primary.urgency === 'urgent' ? 'urgent' : primary.urgency === 'moderate' ? 'moderate' : 'low';
  const urgencyLabel = primary.urgency === 'urgent'
    ? getI18nText('urgency_immediate', 'Seek veterinary care immediately')
    : primary.urgency === 'moderate'
    ? getI18nText('urgency_48h', 'Schedule vet visit within 48 hours')
    : getI18nText('urgency_monitor', 'Monitor and treat at home initially');
  const confPercent = Math.round(primary.score);
  const showLatin = getSelectedLanguageCode() === 'en';

  grid.innerHTML = `
    <!-- PRIMARY DIAGNOSIS - Big Hero Card -->
    <div class="primary-result animate-in" id="result-0">
      <div class="primary-result-badge">${getI18nText('diag_primary_badge', 'PRIMARY DIAGNOSIS')}</div>

      <div class="primary-result-top">
        <div class="primary-conf-ring">
          <svg viewBox="0 0 120 120" class="conf-ring-svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(148,163,184,0.08)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#confGrad)" stroke-width="8" 
              stroke-dasharray="${(confPercent / 100) * 327} 327" stroke-dashoffset="0"
              stroke-linecap="round" transform="rotate(-90 60 60)" class="conf-ring-progress"/>
            <defs><linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10b981"/><stop offset="100%" stop-color="#06b6d4"/>
            </linearGradient></defs>
          </svg>
          <div class="conf-ring-text">
            <span class="conf-ring-value">${confPercent}%</span>
            <span class="conf-ring-label">${getI18nText('label_confidence', 'Confidence')}</span>
          </div>
        </div>
        <div class="primary-result-info">
          <div class="primary-disease-icon">${primary.icon}</div>
          <h2 class="primary-disease-name">${localizedPrimary.name}</h2>
          <p class="primary-disease-latin">${showLatin ? localizedPrimary.latin : ''}</p>
          <div class="result-badges">
            <span class="severity-badge ${sevClass}">${getSeverityLabel(sevClass) || sevClass.toUpperCase()}</span>
            ${primary.contagious ? `<span class="severity-badge medium">${getI18nText('label_contagious', 'Contagious')}</span>` : `<span class="severity-badge low">${getI18nText('label_non_contagious', 'Non-Contagious')}</span>`}
            ${primary.matchedSymptoms.length ? `<span class="severity-badge low">${primary.matchedSymptoms.length} ${getI18nText('label_symptoms_matched', 'symptoms matched')}</span>` : ''}
          </div>
        </div>
      </div>

      <p class="primary-result-desc">${localizedPrimary.desc}</p>

      <div class="urgency-banner ${urgencyClass}">${urgencyLabel}</div>

      <div class="primary-details-grid">
        <div class="detail-block"><div class="detail-block-title">${getI18nText('label_visual_signs', 'Visual Signs')}</div><ul>${localizedPrimary.visualSigns.map(v=>`<li>${v}</li>`).join('')}</ul></div>
        <div class="detail-block"><div class="detail-block-title">${getI18nText('label_treatment', 'Treatment')}</div><ul>${localizedPrimary.treatment.map(t=>`<li>${t}</li>`).join('')}</ul></div>
        <div class="detail-block"><div class="detail-block-title">${getI18nText('label_prevention', 'Prevention')}</div><ul>${localizedPrimary.prevention.map(p=>`<li>${p}</li>`).join('')}</ul></div>
        <div class="detail-block"><div class="detail-block-title">${getI18nText('label_symptoms', 'Symptoms')}</div><ul>${primary.symptoms.map(s=>`<li>${findSymptomLabel(s)}</li>`).join('')}</ul></div>
      </div>
    </div>
    <!-- OTHER POSSIBILITIES (Collapsed) -->
    ${alternatives.length ? `
    <div class="alternatives-section animate-in animate-in-delay-2">
      <button class="alternatives-toggle" onclick="toggleAlternatives()" id="altToggleBtn">
        <span>${getI18nText('label_other_possibilities', 'Other Possibilities')} (${alternatives.length})</span>
        <span class="alt-chevron" id="altChevron">&#9662;</span>
      </button>
      <div class="alternatives-list" id="alternativesList">
        ${alternatives.map((r, i) => `
          <div class="alt-card glass-card">
            <div class="alt-card-left">
              <span class="alt-icon">${r.icon}</span>
              <div>
                <div class="alt-name">${r.name}</div>
                <div class="alt-latin">${showLatin ? r.latin : ''}</div>
              </div>
            </div>
            <div class="alt-card-right">
              <span class="alt-conf">${Math.round(r.score)}%</span>
              <span class="severity-badge ${r.severity}" style="font-size:10px;padding:2px 8px;">${getSeverityLabel(r.severity) || r.severity}</span>
            </div>
          </div>
        `).join('')}
        <p class="alt-disclaimer">${getI18nText('label_alt_disclaimer', 'These are low-probability alternatives. The primary diagnosis above is the most likely condition.')}</p>
      </div>
    </div>` : ''}
  `;
}

function findSymptomLabel(id) {
  return getSymptomLabel(id);
}

function toggleAlternatives() {
  const list = document.getElementById('alternativesList');
  const chevron = document.getElementById('altChevron');
  if (!list || !chevron) return;
  const isOpen = list.style.display === 'block';
  list.style.display = isOpen ? 'none' : 'block';
  chevron.textContent = isOpen ? '▼' : '▲';
}

function resetDiagnosis() {
  removeUploadedImage();
  selectedSymptoms.clear();
  document.querySelectorAll('.symptom-chip').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.cat-count').forEach(c => {
    c.textContent = '0';
    c.classList.remove('visible');
  });

  const summary = document.getElementById('selectedSummary');
  if (summary) summary.style.display = 'none';

  const resultsSection = document.getElementById('resultsSection');
  if (resultsSection) resultsSection.classList.remove('visible');

  ['step-load', 'step-preprocess', 'step-inference', 'step-cross', 'step-report'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('active', 'done');
    const icon = el.querySelector('.step-icon');
    if (icon) icon.textContent = 'O';
  });

  updateAnalyzeButtonState();
  setModelSourceBadge('auto');
  switchTab('tab-diagnosis');
}

function saveToHistory(results) {
  const history = getHistoryRecords();
  const entryId = `${getOrCreateDeviceId()}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  
  if (uploadedImage) {
    saveImageToDB(entryId, uploadedImage);
  }

  const primaryDisease = DISEASES.find(d => d.id === results[0]?.id);
  const localizedPrimary = primaryDisease ? getLocalizedDisease(primaryDisease) : results[0];
  const entry = {
    id: entryId,
    synced: false,
    date: new Date().toISOString(),
    primaryId: results[0].id,
    topDiagnosis: localizedPrimary?.name || results[0].name,
    confidence: Math.round(results[0].score),
    hasImage: !!uploadedImage,
    thumbnail: uploadedImage ? uploadedImage.substring(0, 200) + '...' : null,
    results: results.map(r => ({ id: r.id, name: r.name, score: Math.round(r.score), severity: r.severity }))
  };

  history.unshift(entry);
  if (history.length > 200) history.pop();
  selectedHistoryIndex = null;
  selectedReportIndex = null;
  setHistoryRecords(history);

  enqueueHistoryForSync(entry);
  syncHistoryToServer();

  loadHistory();
  updateDashboardMetrics();
}

function getHistoryPrimaryDisease(entry) {
  return DISEASES.find(d => d.id === entry.primaryId) ||
    DISEASES.find(d => d.name === entry.topDiagnosis) ||
    null;
}

function getHistoryDisplayName(entry) {
  if (!entry) return getI18nText('report_unknown_case', 'Unknown case');
  let id = entry.primaryId;
  if (!id) {
    id = mapLegacySpecialDiagnosisName(entry.topDiagnosis);
  }
  const name = getDiagnosisLabelById(id, entry.topDiagnosis);
  return name || getI18nText('report_unknown_case', 'Unknown case');
}

const OFFLINE_REPORT_SOURCES = [
  "WOAH FMD: https://www.woah.org/en/disease/foot-and-mouth-disease/",
  "WOAH LSD: https://www.woah.org/en/disease/lumpy-skin-disease/",
  "Merck FMD: https://www.merckvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals",
  "Merck Ringworm Cattle: https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-cattle",
  "Merck Photosensitization: https://www.merckvetmanual.com/integumentary-system/photosensitization/overview-of-photosensitization-in-animals",
  "FAO FMD PCP tools: https://www.fao.org/3/cb9465en/cb9465en.pdf"
];

const OFFLINE_REPORT_SOURCES_HI = [
  "WOAH एफएमडी: https://www.woah.org/en/disease/foot-and-mouth-disease/",
  "WOAH एलएसडी: https://www.woah.org/en/disease/lumpy-skin-disease/",
  "Merck एफएमडी: https://www.merckvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals",
  "Merck दाद (गाय): https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-cattle",
  "Merck प्रकाश-संवेदनशीलता: https://www.merckvetmanual.com/integumentary-system/photosensitization/overview-of-photosensitization-in-animals",
  "FAO एफएमडी पीसीपी टूल्स: https://www.fao.org/3/cb9465en/cb9465en.pdf"
];

const OFFLINE_REPORT_SOURCES_MR = [
  "WOAH एफएमडी: https://www.woah.org/en/disease/foot-and-mouth-disease/",
  "WOAH एलएसडी: https://www.woah.org/en/disease/lumpy-skin-disease/",
  "Merck एफएमडी: https://www.merckvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals",
  "Merck दाद (गाय): https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-cattle",
  "Merck प्रकाश-संवेदनशीलता: https://www.merckvetmanual.com/integumentary-system/photosensitization/overview-of-photosensitization-in-animals",
  "FAO एफएमडी पीसीपी टूल्स: https://www.fao.org/3/cb9465en/cb9465en.pdf"
];

const OFFLINE_REPORT_SOURCES_TA = [
  "WOAH FMD: https://www.woah.org/en/disease/foot-and-mouth-disease/",
  "WOAH LSD: https://www.woah.org/en/disease/lumpy-skin-disease/",
  "Merck FMD: https://www.merckvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals",
  "Merck ரிங்க்வோர்ம் (மாடு): https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-cattle",
  "Merck ஒளி உணர்திறன்: https://www.merckvetmanual.com/integumentary-system/photosensitization/overview-of-photosensitization-in-animals",
  "FAO FMD PCP Tools: https://www.fao.org/3/cb9465en/cb9465en.pdf"
];

const OFFLINE_REPORT_SOURCES_SA = [
  "WOAH एफएमडी: https://www.woah.org/en/disease/foot-and-mouth-disease/",
  "WOAH एलएसडी: https://www.woah.org/en/disease/lumpy-skin-disease/",
  "Merck एफएमडी: https://www.merckvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals",
  "Merck दद्रु (गौ): https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-cattle",
  "Merck प्रकाश-संवेदनशीलता: https://www.merckvetmanual.com/integumentary-system/photosensitization/overview-of-photosensitization-in-animals",
  "FAO एफएमडी पीसीपी टूल्स: https://www.fao.org/3/cb9465en/cb9465en.pdf"
];

const OFFLINE_REPORT_PROFILES = {
  healthy_cow: {
    statusTitle: "Overall Health Assessment",
    statusSummary: "Animal is in excellent health condition with no abnormalities detected.",
    riskTitle: "Potential Diseases",
    riskFindings: ["No diseases detected."],
    protocolTitle: "Protocol & Recommendations",
    protocol: [
      "Daily visual inspection for new skin changes",
      "Keep housing clean, dry, and well ventilated",
      "Quarantine new or returning animals before mixing",
      "Use separate grooming tools for different groups",
      "Record skin lesions and responses to treatment"
    ],
    observationTitle: "Key Visual Signs",
    observation: ["No key visual signs available."],
    carePlanTitle: "Treatment & Medication",
    carePlan: ["No treatment required for healthy animals. Maintain regular health checks."],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Diet Type", "Balanced maintenance ration"],
      ["Protein", "Adjust by age/lactation stage"],
      ["Minerals", "Follow local dairy mineral mix program"],
      ["Water Access", "24/7 clean water"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: [
      "Provide clean water and balanced nutrition",
      "Replace bedding regularly to keep skin dry",
      "Reduce overcrowding and stress",
      "Provide shade and protection from heavy rain",
      "Regular grooming to detect early lesions"
    ]
  },
  fmd: {
    statusTitle: "Overall Health Assessment",
    statusSummary: "Alert case: vesicular disease pattern is consistent with Foot-and-Mouth Disease risk and requires urgent veterinary and regulatory action.",
    riskTitle: "Potential Diseases",
    riskFindings: [
      "Primary risk: Foot-and-Mouth Disease pattern (mouth/foot vesicular lesions).",
      "High transmission risk in susceptible cloven-hoofed animals.",
      "Secondary bacterial infection risk in ruptured foot lesions."
    ],
    protocolTitle: "Protocol & Recommendations",
    protocol: [
      "Immediately isolate the affected animal and stop animal movement.",
      "Notify local veterinary authority because FMD is a notifiable transboundary disease.",
      "Disinfect housing, equipment, footwear, and handling routes.",
      "Use strict entry control for people, vehicles, and shared tools.",
      "Follow veterinarian-guided sampling and outbreak response protocol."
    ],
    observationTitle: "Key Visual Signs",
    observation: [
      "Vesicles/erosions in mouth and around tongue/lips",
      "Foot lesions with lameness and reluctance to move",
      "Hypersalivation and reduced feed intake"
    ],
    carePlanTitle: "Treatment & Medication",
    carePlan: [
      "No specific antiviral treatment is available for FMD.",
      "Offer soft palatable feed and easy water access.",
      "Provide lesion hygiene to reduce secondary bacterial infection.",
      "Use veterinarian-directed supportive/anti-inflammatory care where permitted."
    ],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Feed Texture", "Soft, non-abrasive ration"],
      ["Hydration", "Continuous clean water access"],
      ["Energy", "Maintain intake with palatable feed"],
      ["Electrolytes", "Use veterinary oral support if dehydrated"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: [
      "Separate sick and healthy groups immediately.",
      "Use dedicated equipment and clothing for infected zone.",
      "Avoid transport, sale, or herd mixing until cleared.",
      "Monitor temperature, appetite, and lameness twice daily."
    ]
  },
  lumpy_skin: {
    statusTitle: "Overall Health Assessment",
    statusSummary: "Alert case: skin nodule pattern is compatible with Lumpy Skin Disease risk and needs urgent containment and veterinary confirmation.",
    riskTitle: "Potential Diseases",
    riskFindings: [
      "Primary risk: Lumpy Skin Disease with cutaneous nodules.",
      "Production risk: milk drop, skin damage, and chronic scarring.",
      "Vector-driven spread risk (biting insects)."
    ],
    protocolTitle: "Protocol & Recommendations",
    protocol: [
      "Isolate affected animal and reduce herd movement.",
      "Report suspected LSD according to local notifiable disease rules.",
      "Start vector control (flies/mosquitoes) around housing and waste areas.",
      "Disinfect shared handling points and equipment.",
      "Coordinate herd vaccination strategy with official veterinary guidance."
    ],
    observationTitle: "Key Visual Signs",
    observation: [
      "Firm skin nodules (often 0.5-5 cm)",
      "Nodules on head, neck, udder, genital/perineal regions",
      "Possible edema, scabs, and reduced milk yield"
    ],
    carePlanTitle: "Treatment & Medication",
    carePlan: [
      "No specific antiviral cure; manage with supportive care.",
      "Treat secondary bacterial complications as prescribed by veterinarian.",
      "Provide anti-inflammatory support and wound hygiene where needed.",
      "Monitor lesions for necrotic 'sit-fast' progression and healing."
    ],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Protein Focus", "Maintain moderate-high quality protein"],
      ["Energy", "Support intake during fever/stress phase"],
      ["Water Access", "Unrestricted cool clean water"],
      ["Micronutrients", "Use balanced mineral-vitamin support"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: [
      "Keep animal shaded and stress-free.",
      "Control insects aggressively in and around shed.",
      "Track lesion count, appetite, temperature, and milk drop daily.",
      "Do not mix new or returning cattle without quarantine."
    ]
  },
  ringworm: {
    statusTitle: "Overall Health Assessment",
    statusSummary: "Controlled alert: findings are compatible with bovine dermatophytosis (ringworm), a superficial fungal skin disease with zoonotic risk.",
    riskTitle: "Potential Diseases",
    riskFindings: [
      "Primary risk: Ringworm (dermatophytosis) skin infection.",
      "Zoonotic risk to handlers and farm workers.",
      "Group spread risk in crowded or poorly ventilated housing."
    ],
    protocolTitle: "Protocol & Recommendations",
    protocol: [
      "Use gloves and hand hygiene during handling.",
      "Isolate clinically affected animals when possible.",
      "Improve ventilation and reduce stocking density.",
      "Disinfect grooming tools, ropes, and shared surfaces.",
      "Confirm via veterinary fungal diagnostics when required."
    ],
    observationTitle: "Key Visual Signs",
    observation: [
      "Circular crusting/scaling skin patches",
      "Focal hair loss lesions (often head/neck)",
      "Variable itching with superficial skin changes"
    ],
    carePlanTitle: "Treatment & Medication",
    carePlan: [
      "Topical antifungal therapy is standard first-line approach.",
      "Topical treatment is generally the most cost-effective approach.",
      "Twice-weekly topical schedules may be used under veterinary guidance.",
      "Cases can be self-limiting but still require hygiene control.",
      "Avoid irritant chemicals on lesions."
    ],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Protein", "Maintain balanced growth/repair diet"],
      ["Skin Support", "Adequate zinc and vitamin A status"],
      ["Hydration", "Continuous clean water"],
      ["Stress Load", "Minimize stress and overcrowding"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: [
      "Clip/clean around lesions only as advised by veterinarian.",
      "Avoid sharing brushes/blankets between groups.",
      "Separate young calves from active lesions if feasible.",
      "Monitor lesion spread weekly until no new lesions appear."
    ]
  },
  photosensitization: {
    statusTitle: "Overall Health Assessment",
    statusSummary: "Alert case: signs are compatible with photosensitization and require immediate light protection plus cause investigation.",
    riskTitle: "Potential Diseases",
    riskFindings: [
      "Primary risk: photosensitization (often non-pigmented skin first).",
      "Risk of severe skin necrosis with continued sunlight exposure.",
      "Possible underlying hepatogenous cause requiring veterinary workup."
    ],
    protocolTitle: "Protocol & Recommendations",
    protocol: [
      "Move affected animals to full shade/housing immediately.",
      "Stop exposure to suspected photosensitizing feed/plants.",
      "Assess liver-associated causes under veterinary supervision.",
      "Provide wound care and prevent fly strike on damaged skin.",
      "Resume grazing only with controlled light exposure plan."
    ],
    observationTitle: "Key Visual Signs",
    observation: [
      "Erythema and edema on white/non-pigmented skin",
      "Pain, agitation, and light avoidance behavior",
      "Progression to crusting, ulceration, or sloughing if prolonged"
    ],
    carePlanTitle: "Treatment & Medication",
    carePlan: [
      "Primary management is palliative/supportive care.",
      "Early anti-inflammatory therapy may be used by veterinarian.",
      "Treat secondary infection with appropriate wound protocols.",
      "Protect healing skin from UV exposure until recovery."
    ],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Feed Safety", "Remove suspected photodynamic plants/feed"],
      ["Liver Support", "Use veterinarian-guided hepatic diet strategy"],
      ["Water Access", "Continuous clean water"],
      ["Recovery", "Maintain palatable balanced ration"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: [
      "Prefer night-time grazing while condition persists.",
      "Inspect ears, muzzle, udder, and eyelids daily.",
      "Record lesion progression with dated photos.",
      "Escalate care if necrosis, blindness, or systemic signs occur."
    ]
  }
};

const OFFLINE_REPORT_PROFILES_HI = {
  healthy_cow: {
    statusTitle: "समग्र स्वास्थ्य आकलन",
    statusSummary: "पशु की स्थिति उत्कृष्ट है और कोई असामान्यता नहीं मिली।",
    riskTitle: "संभावित रोग",
    riskFindings: ["कोई रोग नहीं मिला।"],
    protocolTitle: "प्रोटोकॉल और सुझाव",
    protocol: [
      "त्वचा में बदलाव के लिए रोज़ दृश्य निरीक्षण करें",
      "आवास साफ, सूखा और हवादार रखें",
      "नए या लौटे पशुओं को मिलाने से पहले क्वारंटीन करें",
      "अलग समूहों के लिए अलग ग्रूमिंग उपकरण रखें",
      "त्वचा घाव और उपचार प्रतिक्रिया दर्ज करें"
    ],
    observationTitle: "मुख्य दृश्य संकेत",
    observation: ["कोई प्रमुख दृश्य संकेत उपलब्ध नहीं।"],
    carePlanTitle: "उपचार और दवा",
    carePlan: ["स्वस्थ पशु के लिए उपचार आवश्यक नहीं। नियमित जांच जारी रखें।"],
    nutritionTitle: "पोषण आवश्यकताएं",
    nutrition: [
      ["आहार प्रकार", "संतुलित रखरखाव राशन"],
      ["प्रोटीन", "उम्र/दुग्धावस्था के अनुसार समायोजित करें"],
      ["खनिज", "स्थानीय डेयरी मिनरल मिक्स का पालन करें"],
      ["पानी", "24/7 साफ पानी"]
    ],
    careInstructionsTitle: "देखभाल निर्देश",
    careInstructions: [
      "साफ पानी और संतुलित पोषण दें",
      "बिस्तर नियमित बदलें ताकि त्वचा सूखी रहे",
      "भीड़ और तनाव कम करें",
      "छाया और भारी बारिश से सुरक्षा दें",
      "घावों की जल्दी पहचान के लिए नियमित ग्रूमिंग करें"
    ]
  },
  fmd: {
    statusTitle: "समग्र स्वास्थ्य आकलन",
    statusSummary: "अलर्ट केस: मुंह/खुर के फफोले खुरपका-मुंहपका जोखिम से मेल खाते हैं और तुरंत पशु-चिकित्सा व नियामक कार्रवाई आवश्यक है।",
    riskTitle: "संभावित रोग",
    riskFindings: [
      "मुख्य जोखिम: खुरपका-मुंहपका पैटर्न (मुंह/खुर के फफोले)।",
      "संवेदनशील द्विखुरी पशुओं में उच्च प्रसार जोखिम।",
      "फटे खुर घावों में द्वितीयक बैक्टीरियल संक्रमण का जोखिम।"
    ],
    protocolTitle: "प्रोटोकॉल और सुझाव",
    protocol: [
      "प्रभावित पशु को तुरंत अलग करें और पशु आवागमन रोकें।",
      "एफएमडी एक अधिसूचित सीमा-पार रोग है; स्थानीय प्राधिकरण को सूचित करें।",
      "आवास, उपकरण, जूते और मार्गों को कीटाणुरहित करें।",
      "लोगों, वाहनों और साझा उपकरणों के प्रवेश पर सख्त नियंत्रण रखें।",
      "पशु-चिकित्सक निर्देशित सैंपलिंग और आउटब्रेक प्रोटोकॉल अपनाएं।"
    ],
    observationTitle: "मुख्य दृश्य संकेत",
    observation: [
      "मुंह और जीभ के आसपास फफोले/क्षरण",
      "खुरों में घाव और चलने में हिचक",
      "अधिक लार और कम चारा सेवन"
    ],
    carePlanTitle: "उपचार और दवा",
    carePlan: [
      "एफएमडी का कोई विशिष्ट एंटीवायरल उपचार उपलब्ध नहीं।",
      "नरम स्वादिष्ट चारा और आसानी से पानी उपलब्ध कराएं।",
      "घाव स्वच्छ रखें ताकि द्वितीयक संक्रमण कम हो।",
      "जहां अनुमति हो, पशु-चिकित्सक निर्देशित सहायक/सूजनरोधी देखभाल दें।"
    ],
    nutritionTitle: "पोषण आवश्यकताएं",
    nutrition: [
      ["आहार बनावट", "नरम और बिना खुरदुरापन वाला आहार"],
      ["हाइड्रेशन", "लगातार साफ पानी उपलब्ध"],
      ["ऊर्जा", "स्वादिष्ट चारा देकर सेवन बनाए रखें"],
      ["इलेक्ट्रोलाइट", "निर्जलीकरण में पशु-चिकित्सक सलाह अनुसार"]
    ],
    careInstructionsTitle: "देखभाल निर्देश",
    careInstructions: [
      "बीमार और स्वस्थ समूह तुरंत अलग करें।",
      "संक्रमित क्षेत्र के लिए अलग उपकरण और कपड़े रखें।",
      "क्लियरेंस तक परिवहन, बिक्री या झुंड मिलाना रोकें।",
      "दिन में दो बार तापमान, भूख और लंगड़ापन देखें।"
    ]
  },
  lumpy_skin: {
    statusTitle: "समग्र स्वास्थ्य आकलन",
    statusSummary: "अलर्ट केस: त्वचा पर गांठों का पैटर्न लम्पी स्किन रोग के जोखिम से मेल खाता है और त्वरित नियंत्रण व पुष्टि की जरूरत है।",
    riskTitle: "संभावित रोग",
    riskFindings: [
      "मुख्य जोखिम: लम्पी स्किन रोग (चर्मीय गांठें)।",
      "उत्पादन जोखिम: दूध कम होना, त्वचा क्षति और दाग।",
      "कीट-जनित प्रसार का जोखिम।"
    ],
    protocolTitle: "प्रोटोकॉल और सुझाव",
    protocol: [
      "प्रभावित पशु को अलग करें और झुंड की आवाजाही कम करें।",
      "स्थानीय अधिसूचित रोग नियमों के अनुसार संदिग्ध एलएसडी रिपोर्ट करें।",
      "आवास और आसपास की जगहों में कीट नियंत्रण शुरू करें।",
      "साझा हैंडलिंग बिंदु और उपकरण कीटाणुरहित करें।",
      "आधिकारिक पशु-चिकित्सक मार्गदर्शन के साथ झुंड टीकाकरण योजना बनाएं।"
    ],
    observationTitle: "मुख्य दृश्य संकेत",
    observation: [
      "कठोर त्वचा गांठें (आमतौर पर 0.5-5 सेमी)",
      "सिर, गर्दन, थन, जननांग/पेरिनियल हिस्सों पर गांठें",
      "सूजन, पपड़ी और दूध में कमी"
    ],
    carePlanTitle: "उपचार और दवा",
    carePlan: [
      "कोई विशेष एंटीवायरल इलाज नहीं; सहायक देखभाल दें।",
      "द्वितीयक बैक्टीरियल जटिलताओं का पशु-चिकित्सक निर्देशित उपचार करें।",
      "जहां आवश्यक हो सूजनरोधी सहायता और घाव स्वच्छता रखें।",
      "घावों की नेक्रोटिक प्रगति और भराव की निगरानी करें।"
    ],
    nutritionTitle: "पोषण आवश्यकताएं",
    nutrition: [
      ["प्रोटीन", "मध्यम-उच्च गुणवत्ता प्रोटीन बनाए रखें"],
      ["ऊर्जा", "बुखार/तनाव में सेवन बनाए रखें"],
      ["पानी", "निर्बाध ठंडा साफ पानी"],
      ["सूक्ष्म पोषक", "संतुलित खनिज-विटामिन समर्थन"]
    ],
    careInstructionsTitle: "देखभाल निर्देश",
    careInstructions: [
      "पशु को छाया में और तनाव-मुक्त रखें।",
      "शेड के आसपास कीट नियंत्रण आक्रामक रूप से करें।",
      "दैनिक गांठ संख्या, भूख, तापमान और दूध कमी ट्रैक करें।",
      "नए या लौटे पशुओं को क्वारंटीन के बिना न मिलाएं।"
    ]
  },
  ringworm: {
    statusTitle: "समग्र स्वास्थ्य आकलन",
    statusSummary: "नियंत्रित अलर्ट: निष्कर्ष दाद (रिंगवर्म) के अनुरूप हैं और इसमें ज़ूनोटिक जोखिम है।",
    riskTitle: "संभावित रोग",
    riskFindings: [
      "मुख्य जोखिम: दाद (डर्मेटोफाइटोसिस) त्वचा संक्रमण।",
      "हैंडलर और खेत कर्मियों के लिए ज़ूनोटिक जोखिम।",
      "भीड़ या कम वेंटिलेशन वाले आवास में समूह प्रसार का जोखिम।"
    ],
    protocolTitle: "प्रोटोकॉल और सुझाव",
    protocol: [
      "हैंडलिंग के दौरान दस्ताने और हाथ स्वच्छता रखें।",
      "संभव हो तो प्रभावित पशुओं को अलग करें।",
      "वेंटिलेशन सुधारें और स्टॉकिंग घनत्व कम करें।",
      "ग्रूमिंग उपकरण और साझा सतहों को कीटाणुरहित करें।",
      "आवश्यक हो तो पशु-चिकित्सक से फंगल जांच कराएं।"
    ],
    observationTitle: "मुख्य दृश्य संकेत",
    observation: [
      "गोल पपड़ीदार त्वचा पैच",
      "स्थानीय बाल झड़ना (अक्सर सिर/गर्दन)",
      "हल्की से मध्यम खुजली"
    ],
    carePlanTitle: "उपचार और दवा",
    carePlan: [
      "स्थानीय एंटीफंगल उपचार प्रथम विकल्प है।",
      "स्थानीय उपचार आमतौर पर किफायती होता है।",
      "पशु-चिकित्सक मार्गदर्शन में सप्ताह में दो बार उपचार हो सकता है।",
      "केस स्वयं ठीक हो सकते हैं, फिर भी स्वच्छता नियंत्रण जरूरी है।",
      "घावों पर तेज रसायन न लगाएं।"
    ],
    nutritionTitle: "पोषण आवश्यकताएं",
    nutrition: [
      ["प्रोटीन", "संतुलित आहार बनाए रखें"],
      ["त्वचा समर्थन", "जिंक और विटामिन A पर्याप्त रखें"],
      ["हाइड्रेशन", "लगातार साफ पानी"],
      ["तनाव", "तनाव और भीड़ कम रखें"]
    ],
    careInstructionsTitle: "देखभाल निर्देश",
    careInstructions: [
      "पशु-चिकित्सक की सलाह अनुसार ही घाव के आसपास ट्रिमिंग करें।",
      "ब्रश/कंबल समूहों में साझा न करें।",
      "यदि संभव हो तो बछड़ों को अलग रखें।",
      "नई घावों के बंद होने तक साप्ताहिक निगरानी रखें।"
    ]
  },
  photosensitization: {
    statusTitle: "समग्र स्वास्थ्य आकलन",
    statusSummary: "अलर्ट केस: लक्षण प्रकाश-संवेदनशीलता से मेल खाते हैं; तुरंत प्रकाश सुरक्षा और कारण जांच आवश्यक है।",
    riskTitle: "संभावित रोग",
    riskFindings: [
      "मुख्य जोखिम: प्रकाश-संवेदनशीलता (अक्सर सफेद त्वचा पहले प्रभावित)।",
      "धूप जारी रहने पर त्वचा नेक्रोसिस का जोखिम।",
      "संभावित हेपैटोजेनस कारण जिसकी पशु-चिकित्सा जांच आवश्यक है।"
    ],
    protocolTitle: "प्रोटोकॉल और सुझाव",
    protocol: [
      "प्रभावित पशु को तुरंत पूरी छाया/आवास में रखें।",
      "संदिग्ध फोटोसेंसिटाइजिंग चारा/पौधे हटाएं।",
      "पशु-चिकित्सक पर्यवेक्षण में लिवर कारण जांचें।",
      "घावों की देखभाल करें और मक्खी से सुरक्षा दें।",
      "नियंत्रित प्रकाश योजना के साथ ही चराई पुनः शुरू करें।"
    ],
    observationTitle: "मुख्य दृश्य संकेत",
    observation: [
      "सफेद/निर्वर्ण त्वचा पर लालिमा और सूजन",
      "दर्द, बेचैनी और रोशनी से बचने की प्रवृत्ति",
      "लंबे समय में त्वचा का छिलना/घाव"
    ],
    carePlanTitle: "उपचार और दवा",
    carePlan: [
      "प्राथमिक उपचार सहायक/पैलियेटिव देखभाल है।",
      "प्रारंभिक सूजनरोधी उपचार पशु-चिकित्सक द्वारा किया जा सकता है।",
      "द्वितीयक संक्रमण का उचित घाव प्रोटोकॉल से इलाज करें।",
      "ठीक होने तक त्वचा को यूवी से बचाएं।"
    ],
    nutritionTitle: "पोषण आवश्यकताएं",
    nutrition: [
      ["चारा सुरक्षा", "फोटोसेंसिटाइजिंग पौधे/चारा हटाएं"],
      ["लिवर समर्थन", "पशु-चिकित्सक निर्देशित हेपेटिक आहार"],
      ["पानी", "लगातार साफ पानी"],
      ["रिकवरी", "स्वादिष्ट संतुलित राशन बनाए रखें"]
    ],
    careInstructionsTitle: "देखभाल निर्देश",
    careInstructions: [
      "स्थिति रहने तक रात में चराई को प्राथमिकता दें।",
      "कान, थूथन, थन और पलकें रोज़ जांचें।",
      "घावों की प्रगति दिनांकित फोटो से दर्ज करें।",
      "नेक्रोसिस, अंधापन या सिस्टम लक्षण बढ़ें तो तुरंत संपर्क करें।"
    ]
  }
};

const OFFLINE_REPORT_PROFILES_MR = {
  healthy_cow: {
    statusTitle: "एकूण आरोग्य मूल्यांकन",
    statusSummary: "प्राण्याची स्थिती उत्कृष्ट आहे आणि कोणतीही असामान्यता आढळली नाही.",
    riskTitle: "संभाव्य रोग",
    riskFindings: ["कोणताही रोग आढळला नाही."],
    protocolTitle: "प्रोटोकॉल आणि शिफारसी",
    protocol: [
      "नवीन त्वचा बदलांसाठी दररोज दृश्य निरीक्षण",
      "आवास स्वच्छ, कोरडा आणि हवेशीर ठेवा",
      "नवीन/परत आलेली जनावरे मिसळण्यापूर्वी क्वारंटीन करा",
      "वेगवेगळ्या गटांसाठी स्वतंत्र ग्रूमिंग साधने वापरा",
      "त्वचा घाव आणि उपचार प्रतिसाद नोंदवा"
    ],
    observationTitle: "मुख्य दृश्य चिन्हे",
    observation: ["महत्वाची दृश्य चिन्हे उपलब्ध नाहीत."],
    carePlanTitle: "उपचार आणि औषधे",
    carePlan: ["निरोगी जनावरांसाठी उपचार आवश्यक नाहीत. नियमित तपासणी चालू ठेवा."],
    nutritionTitle: "पोषण गरजा",
    nutrition: [
      ["आहार प्रकार", "संतुलित देखभाल राशन"],
      ["प्रोटीन", "वय/दूध देण्याच्या टप्प्यानुसार समायोजन"],
      ["खनिज", "स्थानिक डेअरी मिनरल मिक्स वापरा"],
      ["पाणी", "24/7 स्वच्छ पाणी"]
    ],
    careInstructionsTitle: "देखभाल सूचना",
    careInstructions: [
      "स्वच्छ पाणी आणि संतुलित आहार द्या",
      "बिछाना नियमितपणे बदला जेणेकरून त्वचा कोरडी राहील",
      "अति दाटी आणि ताण कमी करा",
      "सावली व पावसापासून संरक्षण द्या",
      "लवकर घाव ओळखण्यासाठी नियमित ग्रूमिंग करा"
    ]
  },
  fmd: {
    statusTitle: "एकूण आरोग्य मूल्यांकन",
    statusSummary: "अलर्ट केस: तोंड/खुरावरील फोडांचा नमुना खुरपका-तोंडपका जोखमीशी जुळतो आणि तातडीची कारवाई आवश्यक आहे.",
    riskTitle: "संभाव्य रोग",
    riskFindings: [
      "मुख्य धोका: खुरपका-तोंडपका (तोंड/खुर फोड).",
      "द्विखुरी जनावरांमध्ये उच्च प्रसार धोका.",
      "फुटलेल्या खुर घावांत द्वितीयक संसर्गाचा धोका."
    ],
    protocolTitle: "प्रोटोकॉल आणि शिफारसी",
    protocol: [
      "प्रभावित जनावर त्वरित वेगळे करा आणि हालचाल थांबवा.",
      "एफएमडी अधिसूचित रोग आहे; स्थानिक प्राधिकरणाला कळवा.",
      "आवास, उपकरणे, पादत्राणे व मार्ग निर्जंतुक करा.",
      "लोक, वाहने आणि साधनांसाठी प्रवेश नियंत्रण ठेवा.",
      "पशुवैद्यक मार्गदर्शित नमुना व आउटब्रेक प्रोटोकॉल पाळा."
    ],
    observationTitle: "मुख्य दृश्य चिन्हे",
    observation: [
      "तोंड/जीभेभोवती फोड/खपल्या",
      "खुरांवर घाव व चालण्यात अडचण",
      "अधिक लाळ व कमी आहार सेवन"
    ],
    carePlanTitle: "उपचार आणि औषधे",
    carePlan: [
      "एफएमडीसाठी विशिष्ट अँटीव्हायरल उपचार नाही.",
      "मऊ चारा व सहज पाणी उपलब्ध करा.",
      "घावांची स्वच्छता ठेवा.",
      "पशुवैद्यकाच्या सल्ल्याने सहाय्यक/दाहशामक उपचार द्या."
    ],
    nutritionTitle: "पोषण गरजा",
    nutrition: [
      ["आहार बनावट", "मऊ व नॉन-अॅब्रसिव्ह आहार"],
      ["हायड्रेशन", "सतत स्वच्छ पाणी"],
      ["ऊर्जा", "स्वादिष्ट चारा देऊन सेवन टिकवा"],
      ["इलेक्ट्रोलाइट", "निर्जलीकरणात पशुवैद्यक सल्ला"]
    ],
    careInstructionsTitle: "देखभाल सूचना",
    careInstructions: [
      "आजारी व निरोगी गट त्वरित वेगळे करा.",
      "संक्रमित भागासाठी स्वतंत्र उपकरणे व कपडे वापरा.",
      "क्लिअरन्सपर्यंत वाहतूक/विक्री टाळा.",
      "दररोज ताप, भूक व लंगडणे तपासा."
    ]
  },
  lumpy_skin: {
    statusTitle: "एकूण आरोग्य मूल्यांकन",
    statusSummary: "अलर्ट केस: त्वचेवरील गाठी लम्पी स्किन रोगाशी सुसंगत आहेत आणि तातडीचे नियंत्रण आवश्यक आहे.",
    riskTitle: "संभाव्य रोग",
    riskFindings: [
      "मुख्य धोका: लम्पी स्किन रोग.",
      "उत्पादन धोका: दूध कमी, त्वचा नुकसान व कायमस्वरूपी खुणा.",
      "किटक-जन्य प्रसार धोका."
    ],
    protocolTitle: "प्रोटोकॉल आणि शिफारसी",
    protocol: [
      "प्रभावित जनावर वेगळे करा व झुंडीची हालचाल कमी करा.",
      "स्थानिक नियमांनुसार संशयित एलएसडीची नोंद करा.",
      "माशी/मच्छर नियंत्रण सुरू करा.",
      "सामायिक उपकरणे व हाताळणी बिंदू निर्जंतुक करा.",
      "झुंडीचे लसीकरण पशुवैद्यक मार्गदर्शनाने करा."
    ],
    observationTitle: "मुख्य दृश्य चिन्हे",
    observation: [
      "कडक त्वचा गाठी (0.5-5 सेमी)",
      "डोके, मान, थन, जननांग/पेरिनियल भागात गाठी",
      "सूज, खपल्या आणि दूधात घट"
    ],
    carePlanTitle: "उपचार आणि औषधे",
    carePlan: [
      "विशिष्ट अँटीव्हायरल नाही; सहाय्यक काळजी द्या.",
      "द्वितीयक संसर्गासाठी पशुवैद्यक उपचार.",
      "दाहशामक सहाय्य व घाव स्वच्छता ठेवा.",
      "घावांची प्रगती व भरून येणे निरीक्षण करा."
    ],
    nutritionTitle: "पोषण गरजा",
    nutrition: [
      ["प्रोटीन", "मध्यम-उच्च दर्जाचे प्रोटीन"],
      ["ऊर्जा", "ताप/ताणात सेवन टिकवा"],
      ["पाणी", "स्वच्छ थंड पाणी"],
      ["सूक्ष्म पोषक", "संतुलित खनिज-व्हिटॅमिन"]
    ],
    careInstructionsTitle: "देखभाल सूचना",
    careInstructions: [
      "जनावर सावलीत व ताणमुक्त ठेवा.",
      "शेडमध्ये किटक नियंत्रण कठोर करा.",
      "दररोज गाठी संख्या, भूक, ताप व दूध घट नोंदवा.",
      "क्वारंटीनशिवाय नवीन/परत आलेली जनावरे मिसळू नका."
    ]
  },
  ringworm: {
    statusTitle: "एकूण आरोग्य मूल्यांकन",
    statusSummary: "नियंत्रित अलर्ट: दाद (रिंगवर्म) चे संकेत आहेत; मानवी संसर्गाचा धोका आहे.",
    riskTitle: "संभाव्य रोग",
    riskFindings: [
      "मुख्य धोका: दाद (डर्माटोफाइटोसिस).",
      "हँडलर व कर्मचाऱ्यांसाठी झूनॉटिक धोका.",
      "अति दाटी/कमी वेंटिलेशनमध्ये प्रसार धोका."
    ],
    protocolTitle: "प्रोटोकॉल आणि शिफारसी",
    protocol: [
      "हँडलिंग करताना हातमोजे आणि स्वच्छता वापरा.",
      "शक्य असल्यास प्रभावित जनावरे वेगळी ठेवा.",
      "वेंटिलेशन वाढवा व घनता कमी करा.",
      "ग्रूमिंग साधने व पृष्ठभाग निर्जंतुक करा.",
      "गरज असल्यास फंगल तपासणी करा."
    ],
    observationTitle: "मुख्य दृश्य चिन्हे",
    observation: [
      "गोल खपल्या/स्केलिंग त्वचा डाग",
      "स्थानिक केस गळणे (बहुतेक डोके/मान)",
      "हलकी ते मध्यम खाज"
    ],
    carePlanTitle: "उपचार आणि औषधे",
    carePlan: [
      "स्थानिक अँटिफंगल उपचार प्रथम पर्याय आहे.",
      "स्थानिक उपचार सामान्यतः किफायतशीर असतो.",
      "पशुवैद्यक मार्गदर्शनाने आठवड्यातून दोनदा उपचार शक्य.",
      "स्वयंपूर्ण बरे होऊ शकते; स्वच्छता नियंत्रण आवश्यक.",
      "घावांवर तीव्र रसायने वापरू नका."
    ],
    nutritionTitle: "पोषण गरजा",
    nutrition: [
      ["प्रोटीन", "संतुलित वाढ/दुरुस्ती आहार"],
      ["त्वचा समर्थन", "पुरेसे झिंक व व्हिटॅमिन A"],
      ["हायड्रेशन", "सतत स्वच्छ पाणी"],
      ["ताण", "ताण व भीड कमी करा"]
    ],
    careInstructionsTitle: "देखभाल सूचना",
    careInstructions: [
      "पशुवैद्यकाच्या सल्ल्यानेच घावाजवळ ट्रिमिंग करा.",
      "ब्रश/चादर गटांमध्ये शेअर करू नका.",
      "शक्य असल्यास वासरांना वेगळे ठेवा.",
      "नवीन घाव थांबेपर्यंत साप्ताहिक निरीक्षण करा."
    ]
  },
  photosensitization: {
    statusTitle: "एकूण आरोग्य मूल्यांकन",
    statusSummary: "अलर्ट केस: प्रकाश-संवेदनशीलतेची चिन्हे आहेत; त्वरित प्रकाश संरक्षण व कारण तपास आवश्यक.",
    riskTitle: "संभाव्य रोग",
    riskFindings: [
      "मुख्य धोका: प्रकाश-संवेदनशीलता (पांढऱ्या त्वचेवर आधी).",
      "सूर्यप्रकाश सुरू राहिल्यास गंभीर त्वचा नेक्रोसिसचा धोका.",
      "संभाव्य यकृताशी संबंधित कारणासाठी पशुवैद्यकीय तपासणी आवश्यक."
    ],
    protocolTitle: "प्रोटोकॉल आणि शिफारसी",
    protocol: [
      "प्रभावित जनावर त्वरित पूर्ण सावलीत/आवासात ठेवा.",
      "फोटोसेन्सिटायझिंग चारा/वनस्पती थांबवा.",
      "पशुवैद्यक देखरेखीखाली यकृत कारण तपासा.",
      "घावांची काळजी घ्या व माशांपासून संरक्षण करा.",
      "नियंत्रित प्रकाश योजनेनुसारच चराई सुरू करा."
    ],
    observationTitle: "मुख्य दृश्य चिन्हे",
    observation: [
      "पांढऱ्या त्वचेवर लालसरपणा व सूज",
      "दुखणे, अस्वस्थता व प्रकाश टाळणे",
      "खपल्या/घाव वाढणे"
    ],
    carePlanTitle: "उपचार आणि औषधे",
    carePlan: [
      "मुख्य उपचार सहाय्यक/पॅलियेटिव्ह देखभाल आहे.",
      "लवकर दाहशामक उपचार पशुवैद्यक देऊ शकतात.",
      "द्वितीयक संसर्गासाठी जखम प्रोटोकॉल वापरा.",
      "बरे होईपर्यंत यूव्हीपासून संरक्षण ठेवा."
    ],
    nutritionTitle: "पोषण गरजा",
    nutrition: [
      ["चारा सुरक्षा", "संशयित फोटोसेंसिटायझिंग चारा काढा"],
      ["यकृत समर्थन", "पशुवैद्यक निर्देशित यकृत आहार"],
      ["पाणी", "सतत स्वच्छ पाणी"],
      ["रिकव्हरी", "स्वादिष्ट संतुलित राशन"]
    ],
    careInstructionsTitle: "देखभाल सूचना",
    careInstructions: [
      "स्थिती टिकेपर्यंत रात्री चराईला प्राधान्य द्या.",
      "कान, थूथन, थन व पापण्या रोज तपासा.",
      "घावांची प्रगती दिनांकित फोटोने नोंदवा.",
      "नेक्रोसिस/अंधत्व/गंभीर लक्षणे वाढल्यास त्वरित संपर्क करा."
    ]
  }
};

const OFFLINE_REPORT_PROFILES_TA = {
  healthy_cow: {
    statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
    statusSummary: "மாடு சிறந்த உடல்நிலையில் உள்ளது; எந்தப் பெரும் அசாதாரணமும் இல்லை.",
    riskTitle: "சாத்தியமான நோய்கள்",
    riskFindings: ["எந்த நோயும் கண்டறியப்படவில்லை."],
    protocolTitle: "நடைமுறை & பரிந்துரைகள்",
    protocol: [
      "தினசரி தோல் மாற்றங்களை பார்வை ஆய்வு செய்யவும்",
      "தங்குமிடத்தை சுத்தமாக, உலராக, காற்றோட்டமாக வைத்திருங்கள்",
      "புதிய/மீண்டும் வந்த மாடுகளை சேர்க்கும் முன் தனிமைப்படுத்தவும்",
      "குழுக்களுக்கு தனித்தனி கிரூமிங் கருவிகளை பயன்படுத்தவும்",
      "தோல் காயங்களையும் சிகிச்சை பதிலையும் பதிவு செய்யவும்"
    ],
    observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
    observation: ["முக்கிய காட்சி அறிகுறிகள் இல்லை."],
    carePlanTitle: "சிகிச்சை & மருந்துகள்",
    carePlan: ["ஆரோக்கிய மாடுகளுக்கு சிகிச்சை தேவையில்லை. வழக்கமான பரிசோதனைகளை தொடரவும்."],
    nutritionTitle: "போஷண தேவை",
    nutrition: [
      ["ஆஹார வகை", "சமநிலை பராமரிப்பு ரேஷன்"],
      ["புரதம்", "வயது/பால் நிலைமைக்கு ஏற்ப மாற்றவும்"],
      ["தாதுக்கள்", "உள்ளூர் மினரல் மிக்ஸ் பயன்படுத்தவும்"],
      ["நீர்", "24/7 சுத்தமான நீர்"]
    ],
    careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
    careInstructions: [
      "சுத்தமான நீரும் சமநிலை போஷணமும் வழங்கவும்",
      "படுக்கையை அடிக்கடி மாற்றி தோலை உலராக வைத்திருங்கள்",
      "கூட்டத்தை மற்றும் அழுத்தத்தை குறைக்கவும்",
      "நிழல் மற்றும் கனமழையிலிருந்து பாதுகாப்பு வழங்கவும்",
      "முன்கூட்டியே காயங்களை கண்டறிய கிரூமிங் செய்யவும்"
    ]
  },
  fmd: {
    statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
    statusSummary: "அலர்ட்: வாய்ப்புண்கள்/கால்ப்புண்கள் வாய்-கால் நோய் அபாயத்துடன் ஒத்தவை; உடனடி நடவடிக்கை தேவை.",
    riskTitle: "சாத்தியமான நோய்கள்",
    riskFindings: [
      "முக்கிய அபாயம்: வாய்-கால் நோய் (வாய்/கால் புண்கள்).",
      "இரட்டை கால் உயிரினங்களில் அதிக பரவல் அபாயம்.",
      "கால்புண்களில் இரண்டாம் நிலை தொற்று அபாயம்."
    ],
    protocolTitle: "நடைமுறை & பரிந்துரைகள்",
    protocol: [
      "பாதிக்கப்பட்ட மாடுகளை உடனே தனிமைப்படுத்தி இயக்கத்தை நிறுத்தவும்.",
      "FMD ஒரு அறிவிக்க வேண்டிய நோய்; உள்ளூர் அதிகாரிகளை அறிவிக்கவும்.",
      "தங்குமிடம், கருவிகள், காலணிகள், பாதைகளை கிருமி நீக்கம் செய்யவும்.",
      "மக்கள்/வாகனங்கள்/கருவிகளுக்கான நுழைவு கட்டுப்பாடு.",
      "வெட்டரினரி வழிகாட்டிய மாதிரி சேகரிப்பு/பதிலளிப்பு நடைமுறை."
    ],
    observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
    observation: [
      "வாய்/நாக்கில் புண்கள்/சிதைவு",
      "கால்புண்களால் நடையக்குறைவு",
      "அதிக உமிழ்நீர் மற்றும் தீனி குறைவு"
    ],
    carePlanTitle: "சிகிச்சை & மருந்துகள்",
    carePlan: [
      "FMDக்கு குறிப்பிட்ட வைரஸ் மருந்து இல்லை.",
      "மென்மையான தீனி மற்றும் எளிதான நீர் வழங்கவும்.",
      "காயங்களை சுத்தமாக வைத்திருங்கள்.",
      "வெட்டரினரி வழிகாட்டிய ஆதரவுச் சிகிச்சை வழங்கவும்."
    ],
    nutritionTitle: "போஷண தேவை",
    nutrition: [
      ["தீனி அமைப்பு", "மென்மையான, உராய்வில்லாத தீனி"],
      ["ஈர்ப்பு", "தொடர்ந்த சுத்தமான நீர்"],
      ["ஆற்றல்", "சுவைமிக்க தீனியால் உள்வாங்கலைப் பேணவும்"],
      ["எலெக்ட்ரோலைட்", "நீரிழப்பில் வெட்டரினரி ஆலோசனை"]
    ],
    careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
    careInstructions: [
      "நோயுற்றதும் ஆரோக்கியமானதும் உடனே பிரிக்கவும்.",
      "தொற்றுப் பகுதிக்கு தனித்தனி கருவி/உடையகம்.",
      "அனுமதி வரும் வரை போக்குவரத்து/விற்பனை தவிர்க்கவும்.",
      "தினமும் வெப்பம், பசி, நொண்டுதல் கண்காணிக்கவும்."
    ]
  },
  lumpy_skin: {
    statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
    statusSummary: "அலர்ட்: தோல் கட்டிகள் லம்பி ஸ்கின் நோய்க்கு ஒத்தவை; உடனடி கட்டுப்பாடு தேவை.",
    riskTitle: "சாத்தியமான நோய்கள்",
    riskFindings: [
      "முக்கிய அபாயம்: லம்பி ஸ்கின் நோய்.",
      "உற்பத்தி அபாயம்: பால் குறைவு, தோல் சேதம், தழும்புகள்.",
      "பூச்சி வழி பரவல் அபாயம்."
    ],
    protocolTitle: "நடைமுறை & பரிந்துரைகள்",
    protocol: [
      "பாதிக்கப்பட்ட மாடுகளை தனிமைப்படுத்தி இயக்கத்தை குறைக்கவும்.",
      "உள்ளூர் விதிகளின்படி சந்தேகமான LSDஐ அறிவிக்கவும்.",
      "ஈ/கொசு கட்டுப்பாட்டை தொடங்கவும்.",
      "பகிரப்பட்ட கருவிகளை கிருமி நீக்கம் செய்யவும்.",
      "வெட்டரினரி ஆலோசனையுடன் கூட்டுத் தடுப்பூசி திட்டம் அமைக்கவும்."
    ],
    observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
    observation: [
      "கடின தோல் கட்டிகள் (0.5-5 செ.மீ.)",
      "தலை, கழுத்து, மடி, பாலுறுப்பு பகுதிகளில் கட்டிகள்",
      "வீக்கம், படலம், பால் குறைவு"
    ],
    carePlanTitle: "சிகிச்சை & மருந்துகள்",
    carePlan: [
      "குறிப்பிட்ட வைரஸ் மருந்து இல்லை; ஆதரவுச் சிகிச்சை.",
      "இரண்டாம் நிலை தொற்று வெட்டரினரி வழிகாட்டலுடன் சிகிச்சை.",
      "அழற்சி குறைக்கும் உதவி மற்றும் காய சுத்தம்.",
      "காயங்கள் மோசமாதல்/முடிவை கண்காணிக்கவும்."
    ],
    nutritionTitle: "போஷண தேவை",
    nutrition: [
      ["புரதம்", "மிதமான-உயர் தர புரதம்"],
      ["ஆற்றல்", "காய்ச்சல்/அழுத்தத்தில் உள்வாங்கலை பேணவும்"],
      ["நீர்", "தடையற்ற சுத்த நீர்"],
      ["மைக்ரோபோஷகம்", "சமநிலை மினரல்-விட்டமின்"]
    ],
    careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
    careInstructions: [
      "மாடுகளை நிழலில் வைத்து அழுத்தம் குறைக்கவும்.",
      "தங்குமிடத்தில் பூச்சி கட்டுப்பாடு அதிகரிக்கவும்.",
      "தினசரி கட்டிகள் எண்ணிக்கை, பசி, வெப்பம், பால் குறைவு பதிவிடவும்.",
      "குவாரண்டைன் இன்றி புதிய மாடுகளை சேர்க்க வேண்டாம்."
    ]
  },
  ringworm: {
    statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
    statusSummary: "கட்டுப்படுத்தப்பட்ட அலர்ட்: ரிங்க்வோர்ம் தோல் நோய்; மனிதருக்கும் பரவலாம்.",
    riskTitle: "சாத்தியமான நோய்கள்",
    riskFindings: [
      "முக்கிய அபாயம்: ரிங்க்வோர்ம் (டெர்மடோஃபைட்டோசிஸ்).",
      "கையாளுநர்/பணியாளர்களுக்கு பூஞ்சை பரவல் அபாயம்.",
      "காற்றோட்டமில்லா இடங்களில் பரவல் அதிகம்."
    ],
    protocolTitle: "நடைமுறை & பரிந்துரைகள்",
    protocol: [
      "கையாளும்போது கையுறை மற்றும் சுத்தம் பேணவும்.",
      "சாத்தியமெனில் பாதிக்கப்பட்டவற்றை தனிமைப்படுத்தவும்.",
      "காற்றோட்டம் மேம்படுத்தி நெரிசலை குறைக்கவும்.",
      "கருவிகள் மற்றும் மேடைகளை கிருமி நீக்கம் செய்யவும்.",
      "தேவையெனில் வெட்டரினரி பூஞ்சை பரிசோதனை செய்யவும்."
    ],
    observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
    observation: [
      "வட்டமான படல/படிக தோல் தழும்புகள்",
      "சார்ந்த பகுதிகளில் முடி உதிர்வு (தலை/கழுத்து)",
      "மிதமான அரிப்பு"
    ],
    carePlanTitle: "சிகிச்சை & மருந்துகள்",
    carePlan: [
      "மேற்பரப்பு பூஞ்சை மருந்து முதல் தேர்வு.",
      "மேற்பரப்பு சிகிச்சை செலவுக்குறைவானது.",
      "வெட்டரினரி ஆலோசனையுடன் வாரத்திற்கு இருமுறை பயன்படுத்தலாம்.",
      "தானாக குணமாகலாம்; ஆனால் சுத்தம் அவசியம்.",
      "எரிச்சல் தரும் இரசாயனங்களைத் தவிர்க்கவும்."
    ],
    nutritionTitle: "போஷண தேவை",
    nutrition: [
      ["புரதம்", "சமநிலை வளர்ச்சி/மருத்தல் உணவு"],
      ["தோல் ஆதரவு", "சிங்க் மற்றும் விட்டமின் A போதுமான அளவு"],
      ["நீர்", "தொடர்ந்த சுத்த நீர்"],
      ["அழுத்தம்", "அழுத்தம் மற்றும் கூட்டத்தை குறைக்கவும்"]
    ],
    careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
    careInstructions: [
      "வெட்டரினரி ஆலோசனையுடன் மட்டுமே காயம் அருகில் டிரிம்மிங் செய்யவும்.",
      "குழுக்களுக்குள் பிரஷ்/போர்வை பகிர வேண்டாம்.",
      "சாத்தியமெனில் கன்றுகளை பிரிக்கவும்.",
      "புதிய காயங்கள் வராமல் வாரந்தோறும் கண்காணிக்கவும்."
    ]
  },
  photosensitization: {
    statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
    statusSummary: "அலர்ட்: ஒளி உணர்திறன் அறிகுறிகள்; உடனடி நிழல் பாதுகாப்பு மற்றும் காரண ஆராய்ச்சி தேவை.",
    riskTitle: "சாத்தியமான நோய்கள்",
    riskFindings: [
      "முக்கிய அபாயம்: ஒளி உணர்திறன் (நிறமற்ற தோலில் முதலில்).",
      "தொடர்ந்த சூரிய வெளிச்சத்தில் தோல் நாசம் அபாயம்.",
      "கருப்பை தொடர்பான காரணம் இருக்கலாம்; பரிசோதனை தேவை."
    ],
    protocolTitle: "நடைமுறை & பரிந்துரைகள்",
    protocol: [
      "பாதிக்கப்பட்ட மாடுகளை உடனே முழு நிழலில் வைத்திருங்கள்.",
      "ஒளியைத் தூண்டும் தீனி/தாவரங்களை நிறுத்தவும்.",
      "கருப்பை காரணங்களை வெட்டரினரியின் மேற்பார்வையில் சோதிக்கவும்.",
      "காய பராமரிப்பு செய்து ஈ பறவையைத் தடுக்கவும்.",
      "கட்டுப்படுத்தப்பட்ட ஒளியுடன் மீண்டும் மேய்ச்சியைத் தொடங்கவும்."
    ],
    observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
    observation: [
      "வெள்ளை தோலில் சிவப்பு மற்றும் வீக்கம்",
      "வலி, பதற்றம் மற்றும் ஒளியைத் தவிர்ப்பது",
      "நீண்டகாலத்தில் படலம்/புண்கள்"
    ],
    carePlanTitle: "சிகிச்சை & மருந்துகள்",
    carePlan: [
      "முக்கிய சிகிச்சை ஆதரவான பராமரிப்பு.",
      "ஆரம்பத்தில் அழற்சி தணிக்கும் மருந்துகள் வழங்கலாம்.",
      "இரண்டாம் நிலை தொற்றை சரியான காய பராமரிப்பால் கையாளவும்.",
      "குணமடும் வரை UV-யைத் தவிர்க்கவும்."
    ],
    nutritionTitle: "போஷண தேவை",
    nutrition: [
      ["தீனி பாதுகாப்பு", "ஒளியைத் தூண்டும் தீனி/தாவரங்களை நீக்கவும்"],
      ["கருப்பை ஆதரவு", "வெட்டரினரி வழிகாட்டிய கருப்பை டயட்"],
      ["நீர்", "தொடர்ந்த சுத்த நீர்"],
      ["மீட்பு", "சுவைமிக்க சமநிலை ரேஷன்"]
    ],
    careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
    careInstructions: [
      "நிலை இருக்கும் வரை இரவுப்பொழுதில் மேய்ச்சியை முன்னுரிமை செய்யவும்.",
      "காது, மூக்கு, மடி, இமை ஆகியவற்றை தினமும் பரிசோதிக்கவும்.",
      "காய முன்னேற்றத்தை தேதி குறியிட்ட படங்களுடன் பதிவு செய்யவும்.",
      "நாசம்/குருட்டுத்தனம்/முக்கிய அறிகுறிகள் இருந்தால் உடனே தொடர்பு கொள்ளவும்."
    ]
  }
};

const OFFLINE_REPORT_PROFILES_SA = {
  healthy_cow: {
    statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
    statusSummary: "पशोः स्थिति उत्कृष्टा; किमपि असामान्यं न दृश्यते।",
    riskTitle: "संभाव्य रोगाः",
    riskFindings: ["कोऽपि रोगः न दृश्यते।"],
    protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
    protocol: [
      "प्रतिदिनं त्वचा-परिवर्तनस्य दृश्य निरीक्षणम्",
      "आवासं स्वच्छं, शुष्कं, वातायनयुक्तं च करोतु",
      "नवान्/पुनरागतान् पशून् मिलितुं पूर्वं पृथक्करोतु",
      "विभिन्न समूहानां पृथक् ग्रूमिंग उपकरणानि",
      "त्वचाघातान् तथा उपचार-प्रतिसादं लेखयेत्"
    ],
    observationTitle: "मुख्य दृश्य संकेताः",
    observation: ["मुख्य दृश्य संकेताः न उपलब्धाः।"],
    carePlanTitle: "उपचारः एवं औषधम्",
    carePlan: ["स्वस्थ पशूनां कृते उपचारः न आवश्यकः। नियमित परीक्षाः चाल्यताम्।"],
    nutritionTitle: "पोषण आवश्यकताः",
    nutrition: [
      ["आहार प्रकारः", "संतुलितः देखभाल-राशनः"],
      ["प्रोटीन", "वयः/दुग्धावस्था अनुसारम्"],
      ["खनिज", "स्थानीय डेयरी खनिज मिश्रणम्"],
      ["जलम्", "24/7 स्वच्छ जलम्"]
    ],
    careInstructionsTitle: "परिचर्या निर्देशाः",
    careInstructions: [
      "स्वच्छ जलं तथा संतुलित आहारं ददातु",
      "शय्या नियमितं परिवर्तयेत् यथा त्वचा शुष्का भवेत्",
      "अतिसंहति तथा तनावं न्यूनं करोतु",
      "छाया एवं वर्षा-रक्षणं ददातु",
      "शीघ्र घात-परिचयानाय नियमित ग्रूमिंग्"
    ]
  },
  fmd: {
    statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
    statusSummary: "अलर्टः: मुख/खुर फोका खुरपाक-मुखपाक जोखिमेन सह सुसंगताः; त्वरित कार्यवाही अपेक्षिता।",
    riskTitle: "संभाव्य रोगाः",
    riskFindings: [
      "मुख्य जोखिमः: खुरपाक-मुखपाक (मुख/खुर फोका)।",
      "संवेदनशील द्विखुरी पशुषु उच्च प्रसार-जोखिमः।",
      "फुटित खुर-घातेषु द्वितीयक संक्रमण-जोखिमः।"
    ],
    protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
    protocol: [
      "प्रभावित पशुं तत्क्षणं पृथक्करोतु एवं गमनं निरोधयतु।",
      "FMD अधिसूचितः रोगः; स्थानीय प्राधिकरणं सूचयेत्।",
      "आवासं, उपकरणानि, पादत्राणानि, मार्गान् शुद्धीकुर्यात्।",
      "जन/वाहन/उपकरण-प्रवेशे नियंत्रणं स्थापयेत्।",
      "पशुचिकित्सक-निर्दिष्ट सैंपलिंग् एवं प्रतिक्रिया प्रोटोकॉलं पालयेत्।"
    ],
    observationTitle: "मुख्य दृश्य संकेताः",
    observation: [
      "मुखे/जिह्वायां फोका/क्षरणम्",
      "खुर-घातैः लङ्घनम्",
      "अतिलालास्रवः एवं आहार-ह्रासः"
    ],
    carePlanTitle: "उपचारः एवं औषधम्",
    carePlan: [
      "FMD हेतु विशिष्टः प्रतिविषाणु उपचारः नास्ति।",
      "मृदु, स्वादु आहारं तथा जलं ददातु।",
      "घाव-स्वच्छता रखताम्।",
      "पशुचिकित्सक-निर्दिष्ट सहाय्यक उपचारः दातव्यः।"
    ],
    nutritionTitle: "पोषण आवश्यकताः",
    nutrition: [
      ["आहार-गुणः", "मृदु एवं अल्प-घर्षणीय आहारः"],
      ["जलम्", "निरंतर स्वच्छ जलम्"],
      ["ऊर्जा", "स्वादु आहारैः सेवनं धार्यताम्"],
      ["इलेक्ट्रोलाइट", "निर्जलीकरणे पशुचिकित्सक-सलाह"]
    ],
    careInstructionsTitle: "परिचर्या निर्देशाः",
    careInstructions: [
      "बीमार व स्वस्थ समूह तत्क्षणं पृथक् करोतु।",
      "संक्रमित क्षेत्रे पृथक् उपकरण/वस्त्रं प्रयुज्यताम्।",
      "क्लियरन्स् पर्यन्तं परिवहन/विक्रय वर्जयेत्।",
      "द्विवारं तापः, अन्नेच्छा, लङ्घनम् निरीक्ष्यताम्।"
    ]
  },
  lumpy_skin: {
    statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
    statusSummary: "अलर्टः: त्वचा-ग्रन्थयः लम्पी स्किन रोग-जोखिमेन सह सुसंगताः; त्वरित नियन्त्रणं आवश्यकम्।",
    riskTitle: "संभाव्य रोगाः",
    riskFindings: [
      "मुख्य जोखिमः: लम्पी स्किन रोगः।",
      "उत्पादन-जोखिमः: दुग्ध-ह्रासः, त्वचा-हानिः, चिर-चिह्नानि।",
      "कीट-जन्य प्रसार-जोखिमः।"
    ],
    protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
    protocol: [
      "प्रभावित पशुं पृथक्करोतु एवं गमनं न्यूनं करोतु।",
      "स्थानीय नियमांनुसार LSD संदिग्धता रिपोर्टयेत्।",
      "मक्षिका/मशक-नियन्त्रणं आरभ्यताम्।",
      "साझा उपकरणानि शुद्धीकुर्यात्।",
      "टीकाकरण-योजना पशुचिकित्सक-मार्गदर्शनेन।"
    ],
    observationTitle: "मुख्य दृश्य संकेताः",
    observation: [
      "कठोर त्वचा-ग्रन्थयः (0.5-5 सेमी)",
      "शिरः, कण्ठ, स्तन, जनन/पेरिनियल भागेषु ग्रन्थयः",
      "शोथः, खपटी, दुग्ध-ह्रासः"
    ],
    carePlanTitle: "उपचारः एवं औषधम्",
    carePlan: [
      "विशिष्टः प्रतिविषाणु उपचारः नास्ति; सहाय्य-चिकित्सा।",
      "द्वितीयक संक्रमणं पशुचिकित्सक-निर्देशेन उपचारयेत्।",
      "शोथहर सहायता एवं घाव-स्वच्छता।",
      "घाव-प्रगति एवं परिशमनं निरीक्ष्यताम्।"
    ],
    nutritionTitle: "पोषण आवश्यकताः",
    nutrition: [
      ["प्रोटीन", "मध्यम-उच्च गुणवत्तायुक्त प्रोटीन"],
      ["ऊर्जा", "ज्वर/तनावकाले सेवनं धार्यताम्"],
      ["जलम्", "निरंतर स्वच्छ शीतल जलम्"],
      ["सूक्ष्म पोषक", "संतुलित खनिज-वि‍टामिन समर्थनम्"]
    ],
    careInstructionsTitle: "परिचर्या निर्देशाः",
    careInstructions: [
      "पशुं छायायां स्थापयेत् एवं तनावं न्यूनं करोतु।",
      "शेड् मध्ये कीट-नियन्त्रणं दृढं करोतु।",
      "प्रतिदिनं ग्रन्थि-संख्या, अन्नेच्छा, तापः, दुग्ध-ह्रासः लेख्यताम्।",
      "क्वारंटीन् विना नवान् पशून् न मिलयेत्।"
    ]
  },
  ringworm: {
    statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
    statusSummary: "नियंत्रित अलर्टः: दद्रु (रिंगवर्म) संकेताः; मनुष्येभ्यः संक्रमण-जोखिमः।",
    riskTitle: "संभाव्य रोगाः",
    riskFindings: [
      "मुख्य जोखिमः: दद्रु (डर्माटोफाइटोसिस)।",
      "हैंडलर्/कर्मकारेषु संक्रमण-जोखिमः।",
      "अल्प-वेंटिलेशनयुक्ते स्थले समूह-प्रसारः।"
    ],
    protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
    protocol: [
      "हस्त-स्वच्छता एवं दस्ताने प्रयुज्यताम्।",
      "सम्भवे प्रभावित पशून् पृथक्करोतु।",
      "वेंटिलेशनं वर्धयेत्, घनत्वं न्यूनं करोतु।",
      "ग्रूमिंग उपकरणानि एवं सतहाः शुद्धीकुर्यात्।",
      "आवश्यकं चेत् फंगल निदानं करोतु।"
    ],
    observationTitle: "मुख्य दृश्य संकेताः",
    observation: [
      "गोलाकाराः खपटीयुक्त त्वचा-धब्बाः",
      "स्थानीय केश-क्षयः (शिरः/कण्ठे)",
      "मृदु ते मध्यम कण्डू"
    ],
    carePlanTitle: "उपचारः एवं औषधम्",
    carePlan: [
      "स्थानीय अण्टीफंगल उपचारः प्रथमः विकल्पः।",
      "स्थानीय उपचारः सामान्यतः किफायती।",
      "पशुचिकित्सक-निर्देशेन सप्ताहे द्विवारं उपयोगः।",
      "स्वयमेव शमनं सम्भवम्; तथापि स्वच्छता आवश्यकम्।",
      "उग्र रसायनानि परिहार्याणि।"
    ],
    nutritionTitle: "पोषण आवश्यकताः",
    nutrition: [
      ["प्रोटीन", "संतुलित विकास/मर्मण आहारः"],
      ["त्वचा समर्थन", "पर्याप्तं जिङ्क् एवं विटामिन् A"],
      ["जलम्", "निरंतर स्वच्छ जलम्"],
      ["तनाव", "तनावं एवं भीडं न्यूनं करोतु"]
    ],
    careInstructionsTitle: "परिचर्या निर्देशाः",
    careInstructions: [
      "पशुचिकित्सक-सलाहेन एव घाव-परिसरे ट्रिमिङ्।",
      "ब्रश/कंबल समूहान्तरेषु न साझीकुर्यात्।",
      "सम्भवे वत्सान् पृथक्करोतु।",
      "नव घावानाम् अभावपर्यन्तं साप्ताहिक निरीक्षणम्।"
    ]
  },
  photosensitization: {
    statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
    statusSummary: "अलर्टः: प्रकाश-संवेदनशीलता संकेताः; तत्क्षणं छाया-रक्षणं तथा कारण-अन्वेषणम् आवश्यकम्।",
    riskTitle: "संभाव्य रोगाः",
    riskFindings: [
      "मुख्य जोखिमः: प्रकाश-संवेदनशीलता (निर्वर्ण त्वचायां प्रथमं)।",
      "दीर्घ प्रकाश-संपर्के त्वचा-नेक्रोसिस-जोखिमः।",
      "सम्भाव्यः हेपैटोजेनस कारणः; चिकित्सकीय परीक्षणम् आवश्यकम्।"
    ],
    protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
    protocol: [
      "प्रभावित पशून् तत्क्षणं पूर्ण-छायायां स्थापयेत्।",
      "प्रकाश-प्रेरक आहार/पौधाः त्यज्यन्ताम्।",
      "यकृत-कारणं पशुचिकित्सक-नियन्त्रणेन परीक्ष्यताम्।",
      "घाव-परिचर्या करोतु एवं मक्षिका-रक्षणम्।",
      "नियन्त्रित प्रकाश-योजनया एव चर्या पुनः आरभ्यताम्।"
    ],
    observationTitle: "मुख्य दृश्य संकेताः",
    observation: [
      "श्वेत त्वचायां रक्तिमा एवं शोथः",
      "वेदना, अशान्तिः, प्रकाश-त्यागः",
      "दीर्घकाले खपटी/घाताः"
    ],
    carePlanTitle: "उपचारः एवं औषधम्",
    carePlan: [
      "प्राथमिकः उपचारः सहाय्य-परिचर्या।",
      "आरम्भे शोथहर औषधयः दातुं शक्यन्ते।",
      "द्वितीयक संक्रमणं उचित घाव-प्रोटोकॉलैः उपचारयेत्।",
      "उपशमनपर्यन्तं UV-प्रकाशं वर्जयेत्।"
    ],
    nutritionTitle: "पोषण आवश्यकताः",
    nutrition: [
      ["आहार-सुरक्षा", "प्रकाश-प्रेरक आहार/पौधाः दूरयेत्"],
      ["यकृत समर्थन", "पशुचिकित्सक-निर्दिष्ट यकृत आहारः"],
      ["जलम्", "निरंतर स्वच्छ जलम्"],
      ["पुनर्प्राप्तिः", "स्वादु संतुलित राशनः"]
    ],
    careInstructionsTitle: "परिचर्या निर्देशाः",
    careInstructions: [
      "स्थितौ सति रात्रि-चर्यायै प्राधान्यम्।",
      "कर्ण, थूथन, स्तन, पलकाः प्रतिदिनं परीक्ष्यन्ताम्।",
      "घाव-प्रगति दिनांकित-छायाचित्रैः लेख्यताम्।",
      "नेक्रोसिस/अन्धत्व/गम्भीर लक्षणे त्वरितं सम्पर्कः।"
    ]
  }
};

function getReportStatus(entry, disease) {
  if (isInvalidHistoryEntry(entry)) {
    return {
      label: getI18nText('report_status_input_invalid', 'Input Not Suitable'),
      confidenceLabel: `${entry.confidence}% ${getI18nText('label_confidence', 'Confidence')}`,
      summary: getI18nText('report_status_invalid_summary', 'Uploaded image does not contain clear cattle diagnostic evidence. Re-scan with a focused clinical image.')
    };
  }
  if (isHealthyHistoryEntry(entry)) {
    return {
      label: getI18nText('report_status_healthy', 'Healthy'),
      confidenceLabel: `${entry.confidence}% ${getI18nText('label_confidence', 'Confidence')}`,
      summary: getI18nText('report_status_healthy_summary', 'Animal is in excellent health condition with no abnormalities detected.')
    };
  }
  const localized = disease ? getLocalizedDisease(disease) : null;
  return {
    label: localized ? localized.name : getI18nText('report_status_alert', 'Alert'),
    confidenceLabel: `${entry.confidence}% ${getI18nText('label_confidence', 'Confidence')}`,
    summary: localized ? localized.desc : getI18nText('report_status_alert_summary', 'Model detected an alert condition. Veterinary review is recommended.')
  };
}

function getOfflineProfile(entry, disease) {
  if (isInvalidHistoryEntry(entry)) {
    const lang = getSelectedLanguageCode();
    if (lang === 'hi') {
      return {
        statusTitle: "समग्र स्वास्थ्य आकलन",
        statusSummary: "इनपुट को निदान के लिए सत्यापित नहीं किया जा सका।",
        riskTitle: "संभावित रोग",
        riskFindings: ["इस इनपुट से कोई रोग प्रोफ़ाइल नहीं बनी।"],
        protocolTitle: "प्रोटोकॉल और सुझाव",
        protocol: [
          "केवल गाय और प्रभावित हिस्से की स्पष्ट छवि अपलोड करें।",
          "अच्छी रोशनी रखें और धुंधली फोटो से बचें।",
          "पूरी संरचित रिपोर्ट के लिए स्कैन दोहराएं।"
        ],
        observationTitle: "मुख्य दृश्य संकेत",
        observation: ["वैध मैपिंग के लिए पर्याप्त दृश्य साक्ष्य नहीं।"],
        carePlanTitle: "उपचार और दवा",
        carePlan: ["अमान्य इनपुट से चिकित्सा सिफारिश नहीं दी जा सकती।"],
        nutritionTitle: "पोषण आवश्यकताएं",
        nutrition: [
          ["स्थिति", "निर्मित नहीं"],
          ["कारण", "इनपुट उपयुक्त नहीं"],
          ["कार्रवाई", "पुनः छवि लें"],
          ["पानी", "सामान्य देखभाल बनाए रखें"]
        ],
        careInstructionsTitle: "देखभाल निर्देश",
        careInstructions: [
          "पूरे पशु क्षेत्र को स्थिर फ्रेम में कैप्चर करें।",
          "कम रोशनी और मूशन ब्लर से बचें।",
          "क्लिनिकल रूप से प्रासंगिक क्षेत्र के साथ पुनः स्कैन करें।"
        ]
      };
    }
    if (lang === 'mr') {
      return {
        statusTitle: "एकूण आरोग्य मूल्यांकन",
        statusSummary: "इनपुट निदानासाठी पडताळता आला नाही.",
        riskTitle: "संभाव्य रोग",
        riskFindings: ["या इनपुटमधून कोणताही रोग प्रोफाइल तयार झाला नाही."],
        protocolTitle: "प्रोटोकॉल आणि शिफारसी",
        protocol: [
          "फक्त गाय आणि प्रभावित भागाची स्पष्ट प्रतिमा अपलोड करा.",
          "चांगला प्रकाश ठेवा आणि धूसर फोटो टाळा.",
          "पूर्ण अहवालासाठी स्कॅन पुन्हा करा."
        ],
        observationTitle: "मुख्य दृश्य चिन्हे",
        observation: ["वैध मॅपिंगसाठी पुरेशी दृश्य माहिती नाही."],
        carePlanTitle: "उपचार आणि औषधे",
        carePlan: ["अवैध इनपुटमुळे वैद्यकीय शिफारस देता येत नाही."],
        nutritionTitle: "पोषण गरजा",
        nutrition: [
          ["स्थिती", "निर्मित नाही"],
          ["कारण", "इनपुट योग्य नाही"],
          ["कृती", "प्रतिमा पुन्हा घ्या"],
          ["पाणी", "सामान्य काळजी राखा"]
        ],
        careInstructionsTitle: "देखभाल सूचना",
        careInstructions: [
          "पूर्ण जनावर क्षेत्र स्थिर फ्रेममध्ये घ्या.",
          "कमी प्रकाश आणि मोशन ब्लर टाळा.",
          "क्लिनिकलदृष्ट्या संबंधित भाग दिसेल असे पुन्हा स्कॅन करा."
        ]
      };
    }
    if (lang === 'ta') {
      return {
        statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
        statusSummary: "இந்த உள்ளீடு நோயறிதலுக்குப் பொருத்தமானதாக உறுதிப்படுத்த முடியவில்லை.",
        riskTitle: "சாத்தியமான நோய்கள்",
        riskFindings: ["இந்த உள்ளீட்டில் இருந்து எந்த நோய் சுயவிவரமும் உருவாக்கப்படவில்லை."],
        protocolTitle: "நடைமுறை & பரிந்துரைகள்",
        protocol: [
          "மாடு மற்றும் பாதிக்கப்பட்ட பகுதி மட்டும் தெளிவாக இருக்கும் படத்தை அப்லோடு செய்யவும்.",
          "நல்ல ஒளியை பயன்படுத்தி தெளிவில்லாத படங்களை தவிர்க்கவும்.",
          "முழுமையான அறிக்கைக்காக மீண்டும் ஸ்கேன் செய்யவும்."
        ],
        observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
        observation: ["செல்லுபடியாகும் நோய்முறையாக்கத்திற்கு போதுமான காட்சி ஆதாரம் இல்லை."],
        carePlanTitle: "சிகிச்சை & மருந்துகள்",
        carePlan: ["தவறான உள்ளீட்டில் இருந்து மருத்துவ பரிந்துரை அளிக்க முடியாது."],
        nutritionTitle: "போஷண தேவை",
        nutrition: [
          ["நிலை", "உருவாக்கப்படவில்லை"],
          ["காரணம்", "உள்ளீடு பொருத்தமில்லை"],
          ["செயல்", "படத்தை மீண்டும் எடுக்கவும்"],
          ["நீர்", "இயல்பான பராமரிப்பு தொடரவும்"]
        ],
        careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
        careInstructions: [
          "முழு மாடும் தெளிவாக காணப்படும் வகையில் படத்தை எடுக்கவும்.",
          "குறைந்த ஒளி மற்றும் அசைவால் ஏற்பட்ட மங்கல்படத்தைத் தவிர்க்கவும்.",
          "கிளினிக்கல் பகுதி தெளிவாக இருக்கும் வகையில் மீண்டும் ஸ்கேன் செய்யவும்."
        ]
      };
    }
    if (lang === 'sa') {
      return {
        statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
        statusSummary: "इनपुटः निदानार्थं सत्यापितुं न शक्यः।",
        riskTitle: "संभाव्य रोगाः",
        riskFindings: ["अनेन इनपुटेन रोग-प्रोफाइलः न निर्मितः।"],
        protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
        protocol: [
          "केवलं गौः एवं प्रभावित भागः स्पष्टः भवेत् इति प्रतिमां अपलोडयेत्।",
          "सम्यक् प्रकाशं धारयतु, धूमिल-प्रतिमां त्यज्यताम्।",
          "पूर्ण प्रतिवेदनार्थं पुनः स्कैन करोतु।"
        ],
        observationTitle: "मुख्य दृश्य संकेताः",
        observation: ["मान्य-निदानाय पर्याप्तं दृश्य-प्रमाणं नास्ति।"],
        carePlanTitle: "उपचारः एवं औषधम्",
        carePlan: ["अवैध इनपुटेन चिकित्सा-शिफारसः न दातुं शक्यते।"],
        nutritionTitle: "पोषण आवश्यकताः",
        nutrition: [
          ["स्थितिः", "न निर्मितम्"],
          ["कारणम्", "इनपुटः अनुपयुक्तः"],
          ["कार्यः", "प्रतिमा पुनर्गृह्यताम्"],
          ["जलम्", "सामान्य परिचर्या धार्यताम्"]
        ],
        careInstructionsTitle: "परिचर्या निर्देशाः",
        careInstructions: [
          "सम्पूर्ण पशु-भागः स्थिर-फ्रेमे दृश्यताम्।",
          "अल्प-प्रकाशं तथा मोशन-ब्लरं त्यज्यताम्।",
          "क्लिनिकल रूपेण प्रासङ्गिकः भागः दृश्यतामिति पुनः स्कैनम्।"
        ]
      };
    }
    return {
      statusTitle: "Overall Health Assessment",
      statusSummary: "Input could not be validated for disease interpretation.",
      riskTitle: "Potential Diseases",
      riskFindings: ["No disease profile generated from this input."],
      protocolTitle: "Protocol & Recommendations",
      protocol: [
        "Upload a clear image containing only the cow and visible affected area.",
        "Use good lighting, avoid blur, and avoid unrelated objects.",
        "Re-run scan to generate complete structured report."
      ],
      observationTitle: "Key Visual Signs",
      observation: ["Insufficient image evidence for valid disease mapping."],
      carePlanTitle: "Treatment & Medication",
      carePlan: ["No medical recommendation can be generated from invalid input."],
      nutritionTitle: "Nutrient Needs",
      nutrition: [
        ["Status", "Not generated"],
        ["Reason", "Input not suitable"],
        ["Action", "Re-capture image"],
        ["Water Access", "Maintain normal care"]
      ],
      careInstructionsTitle: "Care Instructions",
      careInstructions: [
        "Capture full animal region with stable framing.",
        "Avoid low-light and motion blur.",
        "Repeat scan with clinically relevant area visible."
      ]
    };
  }

  const profileKey = disease ? disease.id : (entry.primaryId || "").toLowerCase();
  const lang = getSelectedLanguageCode();
  const profiles = lang === 'hi'
    ? OFFLINE_REPORT_PROFILES_HI
    : lang === 'mr'
      ? OFFLINE_REPORT_PROFILES_MR
      : lang === 'ta'
        ? OFFLINE_REPORT_PROFILES_TA
        : lang === 'sa'
          ? OFFLINE_REPORT_PROFILES_SA
          : OFFLINE_REPORT_PROFILES;
  if (profiles[profileKey]) return profiles[profileKey];
  if (isHealthyHistoryEntry(entry)) return profiles.healthy_cow;

  const localized = disease ? getLocalizedDisease(disease) : null;
  if (lang === 'hi') {
    return {
      statusTitle: "समग्र स्वास्थ्य आकलन",
      statusSummary: localized ? localized.desc : "मॉडल ने अलर्ट स्थिति बताई है।",
      riskTitle: "संभावित रोग",
      riskFindings: [
        `मुख्य निष्कर्ष: ${localized ? localized.name : getHistoryDisplayName(entry) || "अज्ञात स्थिति"}`,
        "निदान की पुष्टि और स्टेजिंग के लिए पशु-चिकित्सक जांच करें।"
      ],
      protocolTitle: "प्रोटोकॉल और सुझाव",
      protocol: localized ? localized.prevention : ["प्रभावित पशु को अलग करें और प्रगति की निगरानी करें।"],
      observationTitle: "मुख्य दृश्य संकेत",
      observation: localized ? localized.visualSigns : ["इस वर्ग के लिए संरचित संकेत उपलब्ध नहीं।"],
      carePlanTitle: "उपचार और दवा",
      carePlan: localized ? localized.treatment : ["पशु-चिकित्सक निर्देशित सहायक देखभाल करें।"],
      nutritionTitle: "पोषण आवश्यकताएं",
      nutrition: [
        ["आहार गुणवत्ता", "उच्च गुणवत्ता स्वादिष्ट राशन"],
        ["हाइड्रेशन", "लगातार साफ पानी"],
        ["ऊर्जा", "शरीर की स्थिति बनाए रखें"],
        ["खनिज", "संतुलित खनिज-विटामिन पूरक"]
      ],
      careInstructionsTitle: "देखभाल निर्देश",
      careInstructions: localized ? localized.prevention : ["स्वच्छता बनाए रखें और तनाव से बचें।"]
    };
  }
  if (lang === 'mr') {
    return {
      statusTitle: "एकूण आरोग्य मूल्यांकन",
      statusSummary: localized ? localized.desc : "मॉडेलने अलर्ट स्थिती दर्शवली आहे.",
      riskTitle: "संभाव्य रोग",
      riskFindings: [
        `मुख्य निष्कर्ष: ${localized ? localized.name : getHistoryDisplayName(entry) || "अज्ञात स्थिती"}`,
        "निदानाची पुष्टी व स्टेजिंगसाठी पशुवैद्यकीय तपासणी करा."
      ],
      protocolTitle: "प्रोटोकॉल आणि शिफारसी",
      protocol: localized ? localized.prevention : ["प्रभावित जनावर वेगळे करा आणि प्रगतीवर लक्ष ठेवा."],
      observationTitle: "मुख्य दृश्य चिन्हे",
      observation: localized ? localized.visualSigns : ["या वर्गासाठी संरचित चिन्हे उपलब्ध नाहीत."],
      carePlanTitle: "उपचार आणि औषधे",
      carePlan: localized ? localized.treatment : ["पशुवैद्यकाच्या सल्ल्याने सहाय्यक उपचार करा."],
      nutritionTitle: "पोषण गरजा",
      nutrition: [
        ["आहार गुणवत्ता", "उच्च दर्जाचा स्वादिष्ट राशन"],
        ["हायड्रेशन", "सतत स्वच्छ पाणी"],
        ["ऊर्जा", "शरीर स्थिती टिकवा"],
        ["खनिज", "संतुलित खनिज-व्हिटॅमिन"]
      ],
      careInstructionsTitle: "देखभाल सूचना",
      careInstructions: localized ? localized.prevention : ["स्वच्छता राखा आणि ताण टाळा."]
    };
  }
  if (lang === 'ta') {
    return {
      statusTitle: "மொத்த உடல்நிலை மதிப்பீடு",
      statusSummary: localized ? localized.desc : "மாடல் அலர்ட் நிலையை காட்டுகிறது.",
      riskTitle: "சாத்தியமான நோய்கள்",
      riskFindings: [
        `முக்கிய கண்டறிதல்: ${localized ? localized.name : getHistoryDisplayName(entry) || "தெரியாத நிலை"}`,
        "நோயறிதலை உறுதிப்படுத்த வெட்டரினரி பரிசோதனை அவசியம்."
      ],
      protocolTitle: "நடைமுறை & பரிந்துரைகள்",
      protocol: localized ? localized.prevention : ["பாதிக்கப்பட்ட மாடை தனிமைப்படுத்தி முன்னேற்றத்தை கண்காணிக்கவும்."],
      observationTitle: "முக்கிய காட்சி அறிகுறிகள்",
      observation: localized ? localized.visualSigns : ["இந்த வகைக்கான கட்டமைக்கப்பட்ட அறிகுறிகள் இல்லை."],
      carePlanTitle: "சிகிச்சை & மருந்துகள்",
      carePlan: localized ? localized.treatment : ["வெட்டரினரி வழிகாட்டிய ஆதரவுச் சிகிச்சை வழங்கவும்."],
      nutritionTitle: "போஷண தேவை",
      nutrition: [
        ["தீனி தரம்", "உயர்தர சுவைமிக்க ரேஷன்"],
        ["ஈர்ப்பு", "தொடர்ந்த சுத்த நீர்"],
        ["ஆற்றல்", "உடல் நிலை பேணவும்"],
        ["தாதுக்கள்", "சமநிலை மினரல்-விட்டமின்"]
      ],
      careInstructionsTitle: "பராமரிப்பு வழிகாட்டுதல்",
      careInstructions: localized ? localized.prevention : ["சுத்தம் பேணவும் மற்றும் அழுத்தத்தைத் தவிர்க்கவும்."]
    };
  }
  if (lang === 'sa') {
    return {
      statusTitle: "समग्र स्वास्थ्य मूल्यांकनम्",
      statusSummary: localized ? localized.desc : "मॉडेलः अलर्ट-स्थितिं दर्शयति।",
      riskTitle: "संभाव्य रोगाः",
      riskFindings: [
        `मुख्य निष्कर्षः: ${localized ? localized.name : getHistoryDisplayName(entry) || "अज्ञात स्थिति"}`,
        "निदान-निश्चित्यै पशुचिकित्सीय परीक्षा आवश्यकम्।"
      ],
      protocolTitle: "प्रोटोकॉल एवं अनुशंसाः",
      protocol: localized ? localized.prevention : ["प्रभावित पशुं पृथक्करोतु तथा प्रगति निरीक्ष्यताम्।"],
      observationTitle: "मुख्य दृश्य संकेताः",
      observation: localized ? localized.visualSigns : ["अस्य वर्गस्य संरचित संकेताः न उपलब्धाः।"],
      carePlanTitle: "उपचारः एवं औषधम्",
      carePlan: localized ? localized.treatment : ["पशुचिकित्सक-निर्दिष्ट सहाय्य-चिकित्सा।"],
      nutritionTitle: "पोषण आवश्यकताः",
      nutrition: [
        ["आहार-गुणः", "उच्च-गुणवत्तायुक्त स्वादु राशनः"],
        ["हायड्रेशन", "निरंतर स्वच्छ जलम्"],
        ["ऊर्जा", "शरीर-स्थिति धार्यताम्"],
        ["खनिज", "संतुलित खनिज-वि‍टामिन पूरकः"]
      ],
      careInstructionsTitle: "परिचर्या निर्देशाः",
      careInstructions: localized ? localized.prevention : ["स्वच्छता धार्यताम् तथा तनावः परिहार्यः।"]
    };
  }
  return {
    statusTitle: "Overall Health Assessment",
    statusSummary: localized ? localized.desc : "Alert condition detected by model.",
    riskTitle: "Potential Diseases",
    riskFindings: [
      `Primary finding: ${localized ? localized.name : getHistoryDisplayName(entry) || "Unspecified condition"}`,
      "Use veterinary examination to confirm diagnosis and stage."
    ],
    protocolTitle: "Protocol & Recommendations",
    protocol: localized ? localized.prevention : ["Isolate clinically affected animal and monitor progression."],
    observationTitle: "Key Visual Signs",
    observation: localized ? localized.visualSigns : ["No structured signs available for this class."],
    carePlanTitle: "Treatment & Medication",
    carePlan: localized ? localized.treatment : ["Follow veterinarian-guided supportive management."],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Feed Quality", "High-quality palatable ration"],
      ["Hydration", "Continuous clean water"],
      ["Energy", "Maintain body condition"],
      ["Minerals", "Balanced mineral-vitamin supplementation"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: localized ? localized.prevention : ["Maintain hygiene and avoid stressors during recovery."]
  };
}

function getOfflineNutritionTable(profile) {
  const rows = Array.isArray(profile.nutrition) ? profile.nutrition : [];
  return rows.map(([k, v]) => `
    <div class="history-alt-item">
      <div class="history-alt-name">${escapeHtml(String(k))}</div>
      <div class="history-alt-score">${escapeHtml(String(v))}</div>
    </div>
  `).join("");
}

function getReportRedFlags(entry, disease) {
  const lang = getSelectedLanguageCode();
  if (lang === 'hi') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "यह छवि क्लिनिकल व्याख्या के लिए उपयुक्त नहीं है।",
        "केवल इस स्कैन के आधार पर उपचार निर्णय न लें।",
        "स्पष्ट और अच्छी रोशनी वाली छवि लेकर तुरंत पुनः स्कैन करें।"
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "अचानक बुखार, लार या लंगड़ापन होने पर तुरंत पुनः स्कैन करें।",
        "तेजी से फैलते त्वचा घावों का शीघ्र मूल्यांकन करें।",
        "दूध में कमी और व्यवहार बदलने पर पशु-चिकित्सक से जांच कराएं।"
      ];
    }
    const urgentDisease = disease && (disease.urgency === "urgent" || disease.severity === "critical");
    if (urgentDisease) {
      return [
        "24-48 घंटे में झुंड में तेज़ प्रसार या नए केस।",
        "गंभीर निर्जलीकरण, खड़ा न हो पाना या सांस में तकलीफ।",
        "मुंह/खुर के व्यापक घाव जिनसे खाना या चलना मुश्किल हो।"
      ];
    }
    return [
      "प्रारंभिक देखभाल के 48-72 घंटे बाद भी त्वचा घाव बढ़ें।",
      "लगातार भूख कम, दर्द प्रतिक्रिया या कमजोरी बढ़े।",
      "किसी भी प्रणालीगत बिगड़ाव पर तुरंत पशु-चिकित्सक से संपर्क करें।"
    ];
  }
  if (lang === 'mr') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "ही प्रतिमा क्लिनिकल विश्लेषणासाठी योग्य नाही.",
        "या स्कॅनवरूनच उपचार निर्णय घेऊ नका.",
        "स्पष्ट आणि चांगल्या प्रकाशातील प्रतिमा घेऊन त्वरित पुनः स्कॅन करा."
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "अचानक ताप, लाळ किंवा लंगडणे आल्यास त्वरित पुनः स्कॅन करा.",
        "वेगाने पसरत असलेल्या त्वचा घावांचे लवकर मूल्यांकन करा.",
        "दूध कमी होणे व वर्तन बदलल्यास पशुवैद्यकीय तपासणी करा."
      ];
    }
    const urgentDisease = disease && (disease.urgency === "urgent" || disease.severity === "critical");
    if (urgentDisease) {
      return [
        "24-48 तासांत झुंडात जलद प्रसार किंवा नवीन केस.",
        "तीव्र निर्जलीकरण, उभे राहू न शकणे किंवा श्वसन त्रास.",
        "मोठे तोंड/खुर घाव ज्यामुळे खाणे किंवा चालणे कठीण."
      ];
    }
    return [
      "प्रारंभिक काळजीनंतर 48-72 तासातही घाव वाढत राहणे.",
      "सतत भूक कमी, वेदना प्रतिक्रिया किंवा कमजोरी वाढणे.",
      "कोणत्याही सिस्टीमिक बिघाडात त्वरित पशुवैद्यक संपर्क."
    ];
  }
  if (lang === 'ta') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "இந்த படம் மருத்துவ விளக்கத்திற்கு பொருத்தமில்லை.",
        "இந்த ஸ்கேன் மட்டும் வைத்து சிகிச்சை முடிவு எடுக்க வேண்டாம்.",
        "தெளிவான, நல்ல ஒளியுள்ள படத்தை எடுத்து உடனே மீண்டும் ஸ்கேன் செய்யவும்."
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "திடீர் காய்ச்சல், உமிழ்நீர் அதிகரிப்பு அல்லது நொண்டுதல் வந்தால் உடனே மீண்டும் ஸ்கேன் செய்யவும்.",
        "வேகமாக பரவும் தோல் காயங்களை ஆரம்பத்திலேயே மதிப்பீடு செய்யவும்.",
        "பால் குறைவு மற்றும் நடத்தை மாற்றம் இருந்தால் வெட்டரினரி பரிசோதனை தேவை."
      ];
    }
    const urgentDisease = disease && (disease.urgency === "urgent" || disease.severity === "critical");
    if (urgentDisease) {
      return [
        "24-48 மணிநேரத்தில் கூட்டத்தில் விரைவான பரவல் அல்லது புதிய வழக்குகள்.",
        "கடுமையான நீரிழப்பு, எழ முடியாமை அல்லது சுவாசக் குறைவு.",
        "வாய்/கால்களில் பரவலான காயங்கள் காரணமாக உணவு/நடை பாதிப்பு."
      ];
    }
    return [
      "48-72 மணிநேரத்திற்குப் பிறகும் தோல் காயங்கள் மோசமாதல்.",
      "தொடர்ந்த பசியிழப்பு, வலி எதிர்வினை அல்லது மெதுவான பலவீனம்.",
      "எந்தவிதமான உடல் நிலை மோசமாதலும் உடனடி வெட்டரினரி ஆலோசனை."
    ];
  }
  if (lang === 'sa') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "एषा प्रतिमा चिकित्सकीय व्याख्यायै अनुपयुक्ता।",
        "केवलं अस्य स्कैनस्य आधारे उपचार-निर्णयः मा क्रियताम्।",
        "स्पष्टां, सु-प्रकाशितां प्रतिमां गृहित्वा तत्क्षणं पुनः स्कैनम्।"
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "अकस्मात् ज्वरः, लाला वा लङ्घनम् भवेत् चेत् तत्क्षणं पुनः स्कैनम्।",
        "शीघ्रं प्रसारयन्ति त्वचा-घाताः शीघ्रं मूल्याङ्कयन्ताम्।",
        "दुग्ध-ह्रासः तथा आचरण-परिवर्तनं चेत् पशुचिकित्सक-परीक्षा।"
      ];
    }
    const urgentDisease = disease && (disease.urgency === "urgent" || disease.severity === "critical");
    if (urgentDisease) {
      return [
        "24-48 घण्टेषु झुंडे शीघ्र प्रसारः वा नवानि केसाः।",
        "तीव्र निर्जलीकरणम्, स्थातुं अशक्यता वा श्वसन-क्लेशः।",
        "मुख/खुरे विस्तीर्ण घाताः येन भोजनं गमनं वा कष्टम्।"
      ];
    }
    return [
      "प्रारम्भिक परिचर्यानन्तरं 48-72 घण्टेषु अपि घात-वृद्धिः।",
      "सतत अन्नेच्छा-ह्रासः, वेदना-प्रतिक्रिया वा दुर्बलता।",
      "कस्यचित् प्रणालीय-अवरोहणे त्वरित पशुचिकित्सक-संपर्कः।"
    ];
  }
  if (isInvalidHistoryEntry(entry)) {
    return [
      "Image not suitable for clinical interpretation.",
      "Do not make treatment decisions from this scan alone.",
      "Capture a focused, well-lit image and re-run immediately."
    ];
  }
  if (isHealthyHistoryEntry(entry)) {
    return [
      "Any sudden fever, drooling, or lameness should trigger immediate re-scan.",
      "New rapidly spreading skin lesions should be evaluated early.",
      "Milk drop with behavioral change warrants veterinary check."
    ];
  }
  const urgentDisease = disease && (disease.urgency === "urgent" || disease.severity === "critical");
  if (urgentDisease) {
    return [
      "Rapid spread within herd or new cases in 24-48 hours.",
      "Severe dehydration, refusal to stand, or respiratory distress.",
      "Extensive oral/foot lesions causing inability to eat or walk."
    ];
  }
  return [
    "Worsening skin lesions despite initial care within 48-72 hours.",
    "Persistent appetite loss, pain response, or progressive weakness.",
    "Any systemic deterioration should prompt urgent veterinary review."
  ];
}

function getMonitoringPlan(entry, disease) {
  const lang = getSelectedLanguageCode();
  if (lang === 'hi') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "उसी सत्र में सही छवि के साथ स्कैन दोहराएं।",
        "कैमरा फोकस और पर्याप्त रोशनी जांचें।",
        "प्रभावित हिस्सा फ्रेम में पूरा दिखे।"
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "रोज़ की सामान्य झुंड निगरानी जारी रखें।",
        "साप्ताहिक बॉडी कंडीशन और त्वचा निरीक्षण करें।",
        "कोई असामान्य संकेत दिखे तो पुनः स्कैन करें।"
      ];
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      return [
        "संपर्क समूह को हर 12 घंटे में नए घाव/ज्वर के लिए देखें।",
        "आवागमन, अलगाव और डिसइन्फेक्शन लॉग दैनिक अपडेट करें।",
        "आधिकारिक फॉलो-अप के लिए केस टाइमलाइन रखें।"
      ];
    }
    return [
      "दिन में दो बार तापमान, भूख और पानी सेवन दर्ज करें।",
      "घाव की दैनिक फोटो (तारीख/समय सहित) लें।",
      "चलना, दूध उत्पादन और व्यवहार परिवर्तन ट्रैक करें।"
    ];
  }
  if (lang === 'mr') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "त्याच सत्रात योग्य प्रतिमेसह स्कॅन पुन्हा करा.",
        "कॅमेरा फोकस आणि पुरेशी रोशनी तपासा.",
        "प्रभावित भाग पूर्ण फ्रेममध्ये दिसत आहे याची खात्री करा."
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "दररोजची नियमित झुंड निगराणी सुरू ठेवा.",
        "साप्ताहिक बॉडी कंडीशन आणि त्वचा तपासणी करा.",
        "काही असामान्य चिन्ह दिसल्यास पुनः स्कॅन करा."
      ];
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      return [
        "संपर्कातील गटाला दर 12 तासांनी नवीन घाव/तापासाठी तपासा.",
        "आवागमन, अलगाव आणि निर्जंतुकीकरण लॉग दररोज अपडेट करा.",
        "अधिकृत फॉलो-अपसाठी केस टाइमलाइन ठेवा."
      ];
    }
    return [
      "दिनातून दोनदा ताप, भूक आणि पाणी सेवन नोंदवा.",
      "घावांचे दैनिक फोटो तारीख/वेळेसह घ्या.",
      "चालणे, दूध उत्पादन आणि वर्तन बदल ट्रॅक करा."
    ];
  }
  if (lang === 'ta') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "அதே அமர்வில் சரியான படத்துடன் மீண்டும் ஸ்கேன் செய்யவும்.",
        "கேமரா ஃபோக்கஸ் மற்றும் போதிய ஒளியை சரிபார்க்கவும்.",
        "பாதிக்கப்பட்ட பகுதி முழுவதும் படத்தில் இருக்கிறதா என்பதை உறுதி செய்யவும்."
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "தினசரி கூட்ட கண்காணிப்பை தொடரவும்.",
        "வாராந்திர உடல் நிலை மற்றும் தோல் பரிசோதனை செய்யவும்.",
        "எந்த அசாதாரண அறிகுறியும் தோன்றினால் மீண்டும் ஸ்கேன் செய்யவும்."
      ];
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      return [
        "தொடர்புடைய குழுவை ஒவ்வொரு 12 மணிநேரத்திற்கும் புதிய காயம்/காய்ச்சலுக்கு கண்காணிக்கவும்.",
        "இயக்கம், தனிமைப்படுத்தல், கிருமி நீக்க பதிவுகளை தினமும் புதுப்பிக்கவும்.",
        "அதிகாரப்பூர்வ பின்தொடர்வுக்காக வழக்கு காலவரிசையை பராமரிக்கவும்."
      ];
    }
    return [
      "தினமும் இரண்டு முறை வெப்பம், பசி மற்றும் நீர் உட்கொள்ளலை பதிவு செய்யவும்.",
      "காயங்களின் தினசரி படங்களை தேதி/நேரத்துடன் எடுக்கவும்.",
      "நடை, பால் உற்பத்தி மற்றும் நடத்தை மாற்றங்களை கண்காணிக்கவும்."
    ];
  }
  if (lang === 'sa') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "तस्मिन्नेव सत्रे उचितप्रतिमया पुनः स्कैनम्।",
        "कॅमरा-फोकस् तथा पर्याप्त प्रकाशः परीक्ष्यताम्।",
        "प्रभावित भागः पूर्णतया फ्रेमे दृश्यतामिति सुनिश्चितं करोतु।"
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "प्रतिदिनं सामान्य झुंड-निरीक्षणं चाल्यताम्।",
        "साप्ताहिकं शरीर-स्थिति एवं त्वचा-परीक्षणं करोतु।",
        "असामान्य संकेतः दृश्यते चेत् पुनः स्कैनम्।"
      ];
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      return [
        "संपर्क-समूहं प्रत्येकं 12 घण्टे नूतन घाव/ज्वराय निरीक्ष्यताम्।",
        "गमन, पृथक्करण, शुद्धीकरण-लेखं प्रतिदिनं अद्यतनम्।",
        "आधिकारिक अनुवर्तनाय केस-टाइमलाइनं धार्यताम्।"
      ];
    }
    return [
      "द्विवारं तापः, अन्नेच्छा, जलसेवनं लेख्यताम्।",
      "घावानां दैनिक छायाचित्राणि दिनाङ्क/समय सहितं गृह्णातु।",
      "गमनं, दुग्धोत्पादनं, आचरण-परिवर्तनं निरीक्ष्यताम्।"
    ];
  }
  const base = [
    "Record temperature, appetite, and water intake twice daily.",
    "Capture daily lesion photos with date/time for progression tracking.",
    "Track mobility, milk yield, and behavioral changes per shift."
  ];
  if (isInvalidHistoryEntry(entry)) {
    return [
      "Repeat scan with a corrected image within the same session.",
      "Verify camera focus and adequate natural/white light.",
      "Confirm affected region is fully visible in the frame."
    ];
  }
  if (isHealthyHistoryEntry(entry)) {
    return [
      "Continue routine daily herd observation logs.",
      "Perform weekly body condition and skin inspection.",
      "Re-scan if any abnormal sign appears."
    ];
  }
  if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
    return [
      "Monitor whole-contact group every 12 hours for new lesions/fever.",
      "Update movement, isolation, and disinfection log daily.",
      "Maintain case timeline for official veterinary follow-up."
    ];
  }
  return base;
}

function getBiosecurityChecklist(entry, disease) {
  const lang = getSelectedLanguageCode();
  if (lang === 'hi') {
    if (isHealthyHistoryEntry(entry)) {
      return [
        "नए पशुओं के लिए क्वारंटीन प्रोटोकॉल बनाए रखें।",
        "नियमित डिसइन्फेक्शन और वेक्टर नियंत्रण जारी रखें।",
        "साझा उपकरण स्वच्छता का साप्ताहिक ऑडिट करें।"
      ];
    }
    if (isInvalidHistoryEntry(entry)) {
      return [
        "क्लिनिकल व्याख्या से पहले इनपुट गुणवत्ता जांचें।",
        "स्पष्ट विषय के साथ नई छवि लें।",
        "मिश्रित दृश्य (गैर-गाय/लोग) से बचें।"
      ];
    }
    const list = [
      "प्रभावित पेन के लिए अलग जूते/दस्ताने रखें।",
      "हर उपयोग के बाद हैंडलिंग टूल कीटाणुरहित करें।",
      "जानवर समूहों के बीच गैर-जरूरी आवागमन सीमित करें।",
      "चारा/पानी के बर्तन और बिस्तर साफ रखें।"
    ];
    if (disease?.contagious) {
      list.unshift("संदिग्ध और पुष्टि किए गए मामलों को स्वस्थ झुंड से अलग करें।");
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      list.unshift("स्थानीय पशु-चिकित्सा प्राधिकरण को सूचित करें।");
    }
    return list;
  }
  if (lang === 'mr') {
    if (isHealthyHistoryEntry(entry)) {
      return [
        "नव्या जनावरांसाठी क्वारंटीन प्रोटोकॉल राखा.",
        "नियमित निर्जंतुकीकरण आणि वेक्टर नियंत्रण सुरू ठेवा.",
        "सामायिक उपकरण स्वच्छतेचा साप्ताहिक आढावा घ्या."
      ];
    }
    if (isInvalidHistoryEntry(entry)) {
      return [
        "क्लिनिकल विश्लेषणापूर्वी इनपुट गुणवत्ता तपासा.",
        "स्पष्ट विषयासह नवीन प्रतिमा घ्या.",
        "मिश्र दृश्य (गैर-गाय/लोक) टाळा."
      ];
    }
    const list = [
      "प्रभावित पेनसाठी स्वतंत्र बूट/हातमोजे वापरा.",
      "प्रत्येक वापरानंतर हँडलिंग टूल्स निर्जंतुक करा.",
      "जनावर गटांमध्ये अनावश्यक हालचाल कमी करा.",
      "चारा/पाण्याचे भांडे आणि बिछाना स्वच्छ ठेवा."
    ];
    if (disease?.contagious) {
      list.unshift("संशयित व निश्चित प्रकरणे निरोगी झुंडीपासून वेगळी ठेवा.");
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      list.unshift("स्थानिक पशुवैद्यकीय प्राधिकरणाला कळवा.");
    }
    return list;
  }
  if (lang === 'ta') {
    if (isHealthyHistoryEntry(entry)) {
      return [
        "புதிய வரவுகளுக்கான தனிமைப்படுத்தல் நடைமுறையை தொடரவும்.",
        "தொடர்ந்த கிருமி நீக்கம் மற்றும் பூச்சி கட்டுப்பாடு செய்யவும்.",
        "பகிரப்பட்ட கருவிகள் சுத்தத்தை வாராந்திரமாக ஆய்வு செய்யவும்."
      ];
    }
    if (isInvalidHistoryEntry(entry)) {
      return [
        "கிளினிக்கல் விளக்கத்திற்கு முன் உள்ளீட்டு தரத்தை சரிபார்க்கவும்.",
        "தெளிவான பொருளுடன் புதிய படம் எடுக்கவும்.",
        "கலப்பு காட்சிகளை (மாடு அல்லாதது/மனிதர்) தவிர்க்கவும்."
      ];
    }
    const list = [
      "பாதிக்கப்பட்ட பகுதியுக்கு தனித்தனி காலணி/கையுறை பயன்படுத்தவும்.",
      "ஒவ்வொரு பயன்பாட்டிற்குப் பிறகும் கையாளும் கருவிகளை கிருமி நீக்கம் செய்யவும்.",
      "மாடுக் குழுக்களுக்குள் தேவையற்ற இயக்கத்தை கட்டுப்படுத்தவும்.",
      "தீனி/நீர் தொட்டிகள் மற்றும் படுக்கைகளை சுத்தமாக வைத்திருங்கள்."
    ];
    if (disease?.contagious) {
      list.unshift("சந்தேக/உறுதி செய்யப்பட்ட வழக்குகளை ஆரோக்கியக் கூட்டத்திலிருந்து பிரிக்கவும்.");
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      list.unshift("உள்ளூர் வெட்டரினரி அதிகாரிகளுக்கு அறிவிக்கவும்.");
    }
    return list;
  }
  if (lang === 'sa') {
    if (isHealthyHistoryEntry(entry)) {
      return [
        "नवागतानां पशूनां क्वारंटीन प्रोटोकॉलं धार्यताम्।",
        "नियमित शुद्धीकरणं तथा वेक्टर-नियन्त्रणं चाल्यताम्।",
        "साझा उपकरण-स्वच्छतायाः साप्ताहिकः अवलोकनः।"
      ];
    }
    if (isInvalidHistoryEntry(entry)) {
      return [
        "क्लिनिकल व्याख्यापूर्वं इनपुट-गुणवत्ता परीक्ष्यताम्।",
        "स्पष्ट विषयेन नूतन प्रतिमा गृह्यताम्।",
        "मिश्र-दृश्यानि (गौ-अन्य/मानवाः) त्यज्यन्ताम्।"
      ];
    }
    const list = [
      "प्रभावित पेन हेतु पृथक् पादत्राण/दस्ताने प्रयुज्यताम्।",
      "प्रत्येक उपयोगानन्तरं हँडलिंग साधनानि शुद्धीकुर्यात्।",
      "पशु-समूहानां मध्ये अनावश्यक गमनं न्यूनं करोतु।",
      "चारा/जल पात्राणि तथा शय्यां स्वच्छां धारयेत्।"
    ];
    if (disease?.contagious) {
      list.unshift("संशयित/सिद्ध प्रकरणानि स्वस्थ झुंडात् पृथक्करोतु।");
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      list.unshift("स्थानीय पशुचिकित्सा प्राधिकरणं सूचयेत्।");
    }
    return list;
  }
  const list = [
    "Dedicated boots/gloves for affected pen.",
    "Disinfect handling tools after every use.",
    "Restrict non-essential movement between animal groups.",
    "Keep feed/water troughs and bedding clean and dry."
  ];
  if (disease?.contagious) {
    list.unshift("Isolate suspected and confirmed cases from healthy herd.");
  }
  if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
    list.unshift("Notify local veterinary authority as per notifiable disease policy.");
  }
  if (isHealthyHistoryEntry(entry)) {
    return [
      "Maintain quarantine protocol for new arrivals.",
      "Continue routine disinfection and vector control.",
      "Audit shared equipment hygiene weekly."
    ];
  }
  if (isInvalidHistoryEntry(entry)) {
    return [
      "Validate input quality before clinical interpretation.",
      "Re-capture image with clear subject isolation.",
      "Avoid mixed-scene images (non-cattle objects/people)."
    ];
  }
  return list;
}

function getDifferentialContext(entry, disease, alternatives) {
  const lang = getSelectedLanguageCode();
  if (lang === 'hi') {
    const altLine = alternatives.length
      ? `कम-विश्वास वाले वैकल्पिक वर्ग: ${alternatives.map(a => `${getDiagnosisLabelById(a.id, a.name)} (${a.score}%)`).join(", ")}.`
      : "कोई वैकल्पिक उच्च-विश्वास वर्ग नहीं मिला।";
    const diseaseLine = disease
      ? `मुख्य वर्ग: ${getLocalizedDisease(disease).name}। गंभीरता: ${getSeverityLabel(disease.severity)}। तात्कालिकता: ${disease.urgency === 'urgent' ? 'आपात' : disease.urgency === 'moderate' ? 'मध्यम' : 'कम'}।`
      : `मुख्य वर्ग: ${getHistoryDisplayName(entry) || "अज्ञात"}।`;
    return [diseaseLine, altLine];
  }
  if (lang === 'mr') {
    const altLine = alternatives.length
      ? `कमी-विश्वास पर्यायी वर्ग: ${alternatives.map(a => `${getDiagnosisLabelById(a.id, a.name)} (${a.score}%)`).join(", ")}.`
      : "कोणताही पर्यायी उच्च-विश्वास वर्ग नाही.";
    const diseaseLine = disease
      ? `मुख्य वर्ग: ${getLocalizedDisease(disease).name}. तीव्रता: ${getSeverityLabel(disease.severity)}. तातडी: ${disease.urgency === 'urgent' ? 'आपात' : disease.urgency === 'moderate' ? 'मध्यम' : 'कमी'}.`
      : `मुख्य वर्ग: ${getHistoryDisplayName(entry) || "अज्ञात"}.`;
    return [diseaseLine, altLine];
  }
  if (lang === 'ta') {
    const altLine = alternatives.length
      ? `குறைந்த நம்பிக்கையுள்ள மாற்று வகைகள்: ${alternatives.map(a => `${getDiagnosisLabelById(a.id, a.name)} (${a.score}%)`).join(", ")}.`
      : "மாற்று உயர் நம்பிக்கை வகை இல்லை.";
    const diseaseLine = disease
      ? `முக்கிய வகை: ${getLocalizedDisease(disease).name}. தீவிரம்: ${getSeverityLabel(disease.severity)}. அவசரம்: ${disease.urgency === 'urgent' ? 'அவசரம்' : disease.urgency === 'moderate' ? 'மிதம்' : 'குறைவு'}.`
      : `முக்கிய வகை: ${getHistoryDisplayName(entry) || "தெரியாதது"}.`;
    return [diseaseLine, altLine];
  }
  if (lang === 'sa') {
    const altLine = alternatives.length
      ? `न्यून-विश्वास वैकल्पिक-वर्गाः: ${alternatives.map(a => `${getDiagnosisLabelById(a.id, a.name)} (${a.score}%)`).join(", ")}.`
      : "कश्चित् वैकल्पिकः उच्च-विश्वास वर्गः नास्ति।";
    const diseaseLine = disease
      ? `मुख्य वर्गः: ${getLocalizedDisease(disease).name}। तीव्रता: ${getSeverityLabel(disease.severity)}। तात्कालिकता: ${disease.urgency === 'urgent' ? 'आपात' : disease.urgency === 'moderate' ? 'मध्यम' : 'न्यून'}.`
      : `मुख्य वर्गः: ${getHistoryDisplayName(entry) || "अज्ञात"}.`;
    return [diseaseLine, altLine];
  }
  const altLine = alternatives.length
    ? `Alternative low-confidence classes: ${alternatives.map(a => `${a.name} (${a.score}%)`).join(", ")}.`
    : "No alternative high-probability class identified.";
  const diseaseLine = disease
    ? `Primary mapped class: ${disease.name}. Severity: ${disease.severity}. Urgency: ${disease.urgency}.`
    : `Primary mapped class: ${getHistoryDisplayName(entry) || "Unknown"}.`;
  return [diseaseLine, altLine];
}

function getFollowUpPlan(entry, disease) {
  if (getSelectedLanguageCode() === 'hi') {
    if (isInvalidHistoryEntry(entry)) {
      return [
        "तुरंत: स्पष्ट तस्वीर लेकर पुनः स्कैन करें।",
        "उसी दिन: चिंता बनी रहे तो क्लिनिकल जांच करवाएं।",
        "दस्तावेज़: सही साक्ष्य फोटो और नोट्स सहेजें।"
      ];
    }
    if (isHealthyHistoryEntry(entry)) {
      return [
        "24 घंटे: सामान्य निगरानी और स्वच्छता जारी रखें।",
        "7 दिन: नए दृश्य संकेतों की जांच करें।",
        "कोई लक्षण: तुरंत पुनः स्कैन करें।"
      ];
    }
    if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
      return [
        "0-6 घंटे: अलगाव और आउटब्रेक नियंत्रण शुरू करें।",
        "24 घंटे: पशु-चिकित्सक पुष्टि और झुंड समीक्षा।",
        "48-72 घंटे: फैलाव जोखिम और उपचार प्रतिक्रिया पुनर्मूल्यांकन।"
      ];
    }
    return [
      "0-24 घंटे: सुझाई गई देखभाल शुरू करें, आवश्यक हो तो अलग रखें।",
      "48 घंटे: घाव/लक्षण प्रगति पुनः देखें।",
      "72 घंटे+: सुधार न हो तो पशु-चिकित्सक को दिखाएं।"
    ];
  }
  if (isInvalidHistoryEntry(entry)) {
    return [
      "Immediate: Re-capture and re-run diagnostic scan.",
      "Same day: If concern persists, request clinical exam.",
      "Documentation: Save corrected evidence image and notes."
    ];
  }
  if (isHealthyHistoryEntry(entry)) {
    return [
      "24h: Continue normal observation and routine hygiene.",
      "7 days: Re-check for any emerging visual signs.",
      "Any symptom onset: Perform immediate re-scan."
    ];
  }
  if (disease?.id === "fmd" || disease?.id === "lumpy_skin") {
    return [
      "0-6h: Isolate and initiate outbreak-control actions.",
      "24h: Veterinary confirmation and herd-level review.",
      "48-72h: Re-assess spread risk and treatment response."
    ];
  }
  return [
    "0-24h: Start recommended care and isolate if required.",
    "48h: Re-evaluate lesion/clinical progression.",
    "72h+: Escalate to vet if no improvement."
  ];
}

function handleReportBack() {
  const reportTab = document.getElementById("tab-report");
  if (reportTab && reportTab.classList.contains("active")) {
    closeReportDetail();
    return;
  }
  switchTab("tab-history");
}

function exportReportPdf(reportId) {
  const history = getHistoryRecords();
  const entry = history.find(item => String(item.id) === String(reportId));
  if (!entry) {
    alert(getI18nText('report_not_found', 'Report not found on this device.'));
    return;
  }

  // Ensure the report is visible before printing
  selectedReportIndex = history.findIndex(item => String(item.id) === String(reportId));
  switchTab('tab-report');
  renderReportTab();
  const printContainer = ensurePrintContainer();
  printContainer.innerHTML = '';
  renderHistoryDetail(entry, 'printReportContainer');

  document.body.classList.add('print-report-mode');
  const cleanup = () => {
    document.body.classList.remove('print-report-mode');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  setTimeout(() => window.print(), 120);
}

async function shareReportQR(reportId) {
  const shareUrl = getReportShareUrl(reportId);
  const shareText = `${getI18nText('report_code_text', 'PASHU CARE Report Link')}: ${shareUrl}`;

  try {
    if (navigator.share) {
      await navigator.share({ title: getI18nText('report_code_title', 'PASHU CARE Detailed Report'), text: shareText, url: shareUrl });
      return;
    }
  } catch (_) {}

  showReportShareModal(reportId, shareUrl);
}

function getReportShareUrl(reportId) {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?report=${encodeURIComponent(reportId)}`;
}

function showReportShareModal(reportId, shareUrl) {
  let modal = document.getElementById('reportShareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reportShareModal';
    modal.className = 'report-share-modal';
    modal.innerHTML = `
      <div class="report-share-backdrop" onclick="closeReportShareModal()"></div>
      <div class="report-share-card">
        <div class="report-share-header">
          <div>
            <div class="report-share-title">${getI18nText('report_share_title', 'Share Detailed Report')}</div>
            <div class="report-share-sub">${getI18nText('report_share_sub', 'Scan the QR code or copy the link to open the report.')}</div>
          </div>
          <button class="btn btn-secondary btn-sm" type="button" onclick="closeReportShareModal()">${getI18nText('report_close', 'Close')}</button>
        </div>
        <div class="report-share-body">
          <div class="report-share-qr">
            <img id="reportShareQrImg" alt="Report QR" />
          </div>
          <div class="report-share-meta">
            <label>${getI18nText('report_share_link', 'Shareable link')}</label>
            <div class="report-share-link">
              <input id="reportShareUrlInput" type="text" readonly />
              <button class="btn btn-primary btn-sm" type="button" onclick="copyReportShareUrl()">${getI18nText('report_copy', 'Copy')}</button>
            </div>
            <div class="report-share-actions">
              <button class="btn btn-secondary btn-sm" type="button" onclick="exportReportPdf('${reportId}')">${getI18nText('report_export_pdf', 'Export PDF')}</button>
              <button class="btn btn-secondary btn-sm" type="button" onclick="openReportFromShare('${reportId}')">${getI18nText('report_open_report', 'Open Report')}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const qrImg = document.getElementById('reportShareQrImg');
  const input = document.getElementById('reportShareUrlInput');
  if (input) input.value = shareUrl;
  if (qrImg) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(shareUrl)}`;
    qrImg.src = qrUrl;
  }
  modal.classList.add('show');
}

function closeReportShareModal() {
  const modal = document.getElementById('reportShareModal');
  if (modal) modal.classList.remove('show');
}

function copyReportShareUrl() {
  const input = document.getElementById('reportShareUrlInput');
  if (!input) return;
  const value = input.value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).catch(() => {});
    return;
  }
  input.select();
  input.setSelectionRange(0, input.value.length);
  try {
    document.execCommand('copy');
  } catch (_) {}
}

function openReportFromShare(reportId) {
  closeReportShareModal();
  openReportById(reportId);
}

function openReportById(reportId) {
  const history = getHistoryRecords();
  const index = history.findIndex(item => String(item.id) === String(reportId));
  if (index === -1) {
    alert(getI18nText('report_not_found', 'Report not found on this device.'));
    return;
  }
  selectedReportIndex = index;
  switchTab('tab-report');
  renderReportTab();
  renderHistoryDetail(history[index], 'reportDetailContent');
}

function openReportFromLink() {
  const url = new URL(window.location.href);
  const reportId = url.searchParams.get('report');
  if (!reportId) return;
  openReportById(reportId);
}

function showAppQr() {
  const shareUrl = `${window.location.origin}${window.location.pathname}`;
  let modal = document.getElementById('appShareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'appShareModal';
    modal.className = 'report-share-modal';
    modal.innerHTML = `
      <div class="report-share-backdrop" onclick="closeAppShareModal()"></div>
      <div class="report-share-card">
        <div class="report-share-header">
          <div>
            <div class="report-share-title">${getI18nText('set_offline_title', 'Offline Access & QR')}</div>
            <div class="report-share-sub">${getI18nText('set_offline_desc', 'Generate a QR code for judges. Open once online, then it works in airplane mode.')}</div>
          </div>
          <button class="btn btn-secondary btn-sm" type="button" onclick="closeAppShareModal()">${getI18nText('report_close', 'Close')}</button>
        </div>
        <div class="report-share-body">
          <div class="report-share-qr">
            <img id="appShareQrImg" alt="App QR" />
          </div>
          <div class="report-share-meta">
            <label>${getI18nText('report_share_link', 'Shareable link')}</label>
            <div class="report-share-link">
              <input id="appShareUrlInput" type="text" readonly />
              <button class="btn btn-primary btn-sm" type="button" onclick="copyAppShareUrl()">${getI18nText('report_copy', 'Copy')}</button>
            </div>
            <div class="report-share-actions">
              <button class="btn btn-secondary btn-sm" type="button" onclick="openAppFromShare()">${getI18nText('report_open_report', 'Open Report')}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const qrImg = document.getElementById('appShareQrImg');
  const input = document.getElementById('appShareUrlInput');
  if (input) input.value = shareUrl;
  if (qrImg) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(shareUrl)}`;
    qrImg.src = qrUrl;
  }
  modal.classList.add('show');
}

function closeAppShareModal() {
  const modal = document.getElementById('appShareModal');
  if (modal) modal.classList.remove('show');
}

function copyAppShareUrl() {
  const input = document.getElementById('appShareUrlInput');
  if (!input) return;
  const value = input.value;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value).catch(() => {});
    return;
  }
  input.select();
  input.setSelectionRange(0, input.value.length);
  try {
    document.execCommand('copy');
  } catch (_) {}
}

function openAppFromShare() {
  closeAppShareModal();
  window.location.href = `${window.location.origin}${window.location.pathname}`;
}

function ensurePrintContainer() {
  let container = document.getElementById('printReportContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'printReportContainer';
    container.className = 'print-report-container';
    document.body.appendChild(container);
  }
  return container;
}

function renderHistoryDetail(entry, targetId = 'reportDetailContent') {
  const detail = document.getElementById(targetId);
  if (!detail) return;
  const isPrint = targetId === 'printReportContainer';

  const disease = getHistoryPrimaryDisease(entry);
  const localizedDisease = disease ? getLocalizedDisease(disease) : null;
  const status = getReportStatus(entry, disease);
  const profile = getOfflineProfile(entry, disease);
  const resultList = Array.isArray(entry.results) ? entry.results : [];
  const alternatives = resultList.slice(1);
  const generatedAt = new Date(entry.date);
  const generatedText = `${generatedAt.toLocaleDateString()}, ${generatedAt.toLocaleTimeString()}`;
  const protocolList = Array.isArray(profile.protocol) ? profile.protocol : [];
  const riskList = Array.isArray(profile.riskFindings) ? profile.riskFindings : [];
  const carePlanList = Array.isArray(profile.carePlan) ? profile.carePlan : [];
  const careInstructionList = Array.isArray(profile.careInstructions) ? profile.careInstructions : [];
  const profileObservationList = Array.isArray(profile.observation) ? profile.observation : [];
  const diseaseObservationList = localizedDisease && Array.isArray(localizedDisease.visualSigns) ? localizedDisease.visualSigns : [];
  const observationList = Array.from(new Set([...profileObservationList, ...diseaseObservationList]));

  const safeDiagnosis = escapeHtml(getHistoryDisplayName(entry));
  const confidenceText = `${entry.confidence}%`;
  const summaryStatus = escapeHtml(status.label);
  const summaryGenerated = escapeHtml(generatedText);
  const lang = getSelectedLanguageCode();
  const sources = lang === 'hi'
    ? OFFLINE_REPORT_SOURCES_HI
    : lang === 'mr'
      ? OFFLINE_REPORT_SOURCES_MR
      : lang === 'ta'
        ? OFFLINE_REPORT_SOURCES_TA
        : lang === 'sa'
          ? OFFLINE_REPORT_SOURCES_SA
          : OFFLINE_REPORT_SOURCES;
  const summarySource = sources.map(s => `<li>${escapeHtml(s)}</li>`).join("");
  const redFlags = getReportRedFlags(entry, disease);
  const monitoringPlan = getMonitoringPlan(entry, disease);
  const biosecurityChecklist = getBiosecurityChecklist(entry, disease);
  const differentialContext = getDifferentialContext(entry, disease, alternatives);
  const followUpPlan = getFollowUpPlan(entry, disease);
  const compactDate = generatedAt.toLocaleDateString();
  const compactTime = generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const cleanList = (value, fallback) => {
    const list = Array.isArray(value)
      ? value.map(item => String(item || '').trim()).filter(Boolean)
      : [];
    if (list.length) return list;
    return fallback ? [fallback] : [];
  };

  const renderList = (value, fallback) => {
    const list = cleanList(value, fallback);
    if (!list.length) return `<p class="report-v3-desc">${getI18nText('report_no_items', 'No items available.')}</p>`;
    return `<ul>${list.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  };

  const riskItems = cleanList(riskList, "No disease indicators detected in current scan.");
  const protocolItems = cleanList(protocolList, "Maintain routine observation and farm hygiene.");
  const observationItems = cleanList(observationList, "No visible abnormal signs in this scan.");
  const carePlanItems = cleanList(carePlanList, "No treatment needed. Continue routine health checks.");
  const monitoringItems = cleanList(monitoringPlan, "Recheck animal if appetite, gait, or skin status changes.");
  const differentialItems = cleanList(differentialContext, "No major differential concerns in current model output.");
  const careInstructionItems = cleanList(careInstructionList, "Follow standard daily care protocol.");
  const redFlagItems = cleanList(redFlags, "No urgent escalation triggers at this time.");
  const biosecurityItems = cleanList(biosecurityChecklist, "Use regular sanitation and isolation protocol.");
  const followUpItems = cleanList(followUpPlan, "Repeat visual check in 24-48 hours.");

  detail.innerHTML = `
    <section class="report-v3-shell ${isPrint ? 'report-print-shell' : ''}">
      ${isPrint ? `
      <div class="report-print-header">
        <div class="report-print-brand">
          <div class="report-print-name">PASHU CARE</div>
          <div class="report-print-sub">${getI18nText('report_title_full', 'Veterinary Report')}</div>
        </div>
        <div class="report-print-meta">
          <div><strong>${getI18nText('report_metric_case_id', 'Case ID')}:</strong> #${escapeHtml(String(entry.id).slice(-6).toUpperCase())}</div>
          <div><strong>${getI18nText('report_generated', 'Generated')}:</strong> ${summaryGenerated}</div>
          <div><strong>${getI18nText('report_metric_primary_class', 'Primary Class')}:</strong> ${summaryStatus}</div>
        </div>
      </div>
      ` : ''}
      <header class="report-v3-hero">
        <div>
          <p class="report-v3-eyebrow">${getI18nText('report_eyebrow', 'Clinical Diagnostic Report')}</p>
          <h2 class="report-v3-title">${summaryStatus} - ${getI18nText('report_title_full', 'Veterinary Report')}</h2>
          <p class="report-v3-subtitle">${getI18nText('report_generated', 'Generated')}: ${summaryGenerated}</p>
        </div>
        <div class="report-v3-actions">
          <button class="btn btn-secondary btn-sm" type="button" onclick="exportReportPdf('${entry.id}')">${getI18nText('report_export_pdf', 'Export PDF')}</button>
          <button class="btn btn-secondary btn-sm" type="button" onclick="shareReportQR('${entry.id}')">${getI18nText('report_share_qr', 'Share QR')}</button>
          <button class="btn btn-secondary btn-sm" type="button" onclick="handleReportBack()">${getI18nText('report_back', 'Back')}</button>
        </div>
      </header>

      ${isPrint ? `
      <section class="report-v3-card report-print-evidence">
        <p class="report-v3-kicker">${getI18nText('report_evidence', 'Evidence')}</p>
        <h3>${getI18nText('report_evidence_title', 'Photo Evidence')}</h3>
        <div class="report-evidence-image report-v3-evidence" id="print-evidence-${entry.id}">
          <span>${getI18nText('report_evidence', 'Report photo evidence')}</span>
        </div>
      </section>
      ` : ''}

      <div class="report-v3-metrics">
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">${getI18nText('report_metric_confidence', 'Confidence')}</span>
          <span class="report-v3-metric-value">${confidenceText}</span>
        </div>
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">${getI18nText('report_metric_primary_class', 'Primary Class')}</span>
          <span class="report-v3-metric-value">${summaryStatus}</span>
        </div>
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">${getI18nText('report_metric_case_id', 'Case ID')}</span>
          <span class="report-v3-metric-value">#${escapeHtml(String(entry.id).slice(-6).toUpperCase())}</span>
        </div>
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">${getI18nText('report_metric_review_time', 'Review Time')}</span>
          <span class="report-v3-metric-value">${escapeHtml(compactTime)}</span>
        </div>
      </div>

      <section class="report-v3-grid">
        <div class="report-v3-col-main">
          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_status_overview', 'Status Overview')}</p>
            <h3>${getI18nText('report_status_title', 'Diagnosis Status')}</h3>
            <p class="report-v3-meta">${escapeHtml(profile.statusTitle)}</p>
            <div class="result-badges report-v3-badges">
              <span class="severity-badge low">${summaryStatus}</span>
              <span class="severity-badge low">${escapeHtml(status.confidenceLabel)}</span>
            </div>
            <p class="report-v3-desc">${escapeHtml(status.summary)}</p>
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_risk', 'Risk')}</p>
            <h3>${escapeHtml(profile.riskTitle)}</h3>
            <p class="report-v3-meta">${getI18nText('report_ai_findings', 'AI Findings')}</p>
            ${renderList(riskItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_protocol', 'Protocol')}</p>
            <h3>${escapeHtml(profile.protocolTitle)}</h3>
            <p class="report-v3-meta">${getI18nText('report_guidance', 'Guidance')}</p>
            ${renderList(protocolItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_observation', 'Observation')}</p>
            <h3>${escapeHtml(profile.observationTitle)}</h3>
            <p class="report-v3-meta">${getI18nText('report_visual', 'Visual')}</p>
            ${renderList(observationItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_care_plan', 'Care Plan')}</p>
            <h3>${escapeHtml(profile.carePlanTitle)}</h3>
            <p class="report-v3-meta">${getI18nText('report_suggested', 'Suggested')}</p>
            ${renderList(carePlanItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_monitoring', 'Monitoring')}</p>
            <h3>${getI18nText('report_monitoring_title', 'Clinical Monitoring Plan')}</h3>
            <p class="report-v3-meta">${getI18nText('report_followup', 'Follow-up')}</p>
            ${renderList(monitoringItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">${getI18nText('report_differential', 'Differential')}</p>
            <h3>${getI18nText('report_differential_title', 'Differential Context')}</h3>
            <p class="report-v3-meta">${getI18nText('report_model_interpretation', 'Model interpretation')}</p>
            ${renderList(differentialItems)}
          </article>
        </div>

        <aside class="report-v3-col-side">
          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_quick_summary', 'Quick Summary')}</p>
            <div class="history-alt-list">
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_metric_confidence', 'Confidence')}</div><div class="history-alt-score">${confidenceText}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_metric_primary_class', 'Category')}</div><div class="history-alt-score">${summaryStatus}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_generated', 'Generated')}</div><div class="history-alt-score">${summaryGenerated}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('history_date', 'Date')}</div><div class="history-alt-score">${escapeHtml(compactDate)}</div></div>
            </div>
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_nutrition', 'Nutrition')}</p>
            <h3>${escapeHtml(profile.nutritionTitle)}</h3>
            <p class="report-v3-meta">${getI18nText('report_daily', 'Daily')}</p>
            <div class="history-alt-list">${getOfflineNutritionTable(profile)}</div>
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_care', 'Care')}</p>
            <h3>${escapeHtml(profile.careInstructionsTitle)}</h3>
            <p class="report-v3-meta">${getI18nText('report_guidance', 'Guidance')}</p>
            ${renderList(careInstructionItems)}
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_red_flags', 'Red Flags')}</p>
            <h3>${getI18nText('report_red_flags_title', 'Escalation Alerts')}</h3>
            <p class="report-v3-meta">${getI18nText('report_urgent_triggers', 'Urgent triggers')}</p>
            ${renderList(redFlagItems)}
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_biosecurity', 'Biosecurity')}</p>
            <h3>${getI18nText('report_biosecurity_title', 'Infection Control Checklist')}</h3>
            <p class="report-v3-meta">${getI18nText('report_farm_protocol', 'Farm protocol')}</p>
            ${renderList(biosecurityItems)}
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_evidence', 'Evidence')}</p>
            <h3>${getI18nText('report_evidence_title', 'Photo Evidence')}</h3>
            <p class="report-v3-meta">${getI18nText('report_captured', 'Captured')}</p>
            <div class="report-evidence-image report-v3-evidence" id="detail-evidence-${entry.id}">
              <span>${getI18nText('report_evidence', 'Report photo evidence')}</span>
            </div>
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">${getI18nText('report_metadata', 'Metadata')}</p>
            <h3>${getI18nText('report_metadata_title', 'Additional Info')}</h3>
            <p class="report-v3-meta">${getI18nText('report_record', 'Record')}</p>
            <div class="history-alt-list">
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_type', 'Report Type')}</div><div class="history-alt-score">${getI18nText('report_type_automated', 'Automated Scan')}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_user', 'User')}</div><div class="history-alt-score">${getI18nText('report_user_guest', 'Guest')}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_scan_date', 'Scan Date')}</div><div class="history-alt-score">${summaryGenerated}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_diagnosis_class', 'Diagnosis Class')}</div><div class="history-alt-score">${safeDiagnosis}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_kb_mode', 'Knowledge Base Mode')}</div><div class="history-alt-score">${getI18nText('report_kb_offline', 'Offline Clinical Profiles')}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">${getI18nText('report_clinical_use', 'Clinical Use')}</div><div class="history-alt-score">${getI18nText('report_clinical_disclaimer', 'Decision support only; vet confirmation required')}</div></div>
            </div>
          </article>
        </aside>
      </section>

      <section class="report-v3-card report-v3-compact">
        <p class="report-v3-kicker">${getI18nText('report_followup_timeline', 'Follow-up Timeline')}</p>
        <h3>${getI18nText('report_action_schedule', 'Action Schedule')}</h3>
        ${renderList(followUpItems)}
      </section>

      <section class="report-v3-footnote report-v3-card report-v3-compact">
        <p class="report-v3-kicker">${getI18nText('report_clinical_basis', 'Clinical Basis')}</p>
        <ul>${summarySource}</ul>
      </section>

      ${alternatives.length ? `
        <section class="report-v3-card report-v3-compact">
          <p class="report-v3-kicker">${getI18nText('report_other_possibilities', 'Other Possibilities')}</p>
          <div class="history-alt-list">
            ${alternatives.map(item => `
              <div class="history-alt-item">
                <div class="history-alt-name">${escapeHtml(getDiagnosisLabelById(item.id, item.name))}</div>
                <div class="history-alt-score">${item.score}%</div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
    </section>
  `;

  if (entry.hasImage !== false) {
    loadImageFromDB(entry.id, imgData => {
      if (imgData) {
        const evidence = document.getElementById(`detail-evidence-${entry.id}`);
        const printEvidence = document.getElementById(`print-evidence-${entry.id}`);
        if (evidence) evidence.innerHTML = `<img src="${imgData}" alt="Evidence Image" style="width:100%;height:100%;object-fit:cover;">`;
        if (printEvidence) printEvidence.innerHTML = `<img src="${imgData}" alt="Evidence Image" style="width:100%;height:100%;object-fit:cover;">`;
      }
    });
  }
}

function selectHistoryCard(index) {
  selectedHistoryIndex = index;
  selectedReportIndex = null;
  loadHistory();
}

function renderReportTab() {
  const detail = document.getElementById('reportDetailContent');
  if (!detail) return;

  const history = getHistoryRecords();
  if (!history.length) {
    detail.innerHTML = `
      <div class="history-detail-empty">
        <div class="empty-icon">&#128203;</div>
        <p>${getI18nText('report_empty', 'Run a diagnosis first, then open this tab for complete report details.')}</p>
      </div>
    `;
    return;
  }

  if (selectedReportIndex !== null && selectedReportIndex >= history.length) {
    selectedReportIndex = null;
  }

  if (selectedReportIndex === null) {
    detail.innerHTML = `
      <div class="history-detail-empty">
        <div class="empty-icon">&#128203;</div>
        <p>${getI18nText('report_select_prompt', 'Click to open latest detailed report.')}</p>
        <button class="btn btn-primary" type="button" onclick="openLatestReport()">${getI18nText('dash_open_report', 'Open Report')}</button>
      </div>
    `;
    return;
  }

  renderHistoryDetail(history[selectedReportIndex], 'reportDetailContent');
}

function selectReportItem(index) {
  selectedReportIndex = index;
  renderReportTab();
}

function openLatestReport() {
  const history = getHistoryRecords();
  if (!history.length) return;
  selectedReportIndex = 0;
  renderReportTab();
}

function openReportFromHistory(index) {
  selectedReportIndex = index;
  selectedHistoryIndex = index;
  switchTab('tab-report');
}

function removeHistoryItem(index, ev) {
  if (ev) ev.stopPropagation();
  const history = getHistoryRecords();
  if (index < 0 || index >= history.length) return;
  const target = history[index];
  if (!confirm(getI18nText('history_confirm_remove', 'Remove this report from history?'))) return;

  history.splice(index, 1);
  setHistoryRecords(history);

  if (target?.id) {
    openImageDB().then(db => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(target.id);
    }).catch(console.warn);
  }

  if (selectedHistoryIndex === index) selectedHistoryIndex = null;
  if (selectedReportIndex === index) selectedReportIndex = null;
  if (selectedHistoryIndex !== null && selectedHistoryIndex > index) selectedHistoryIndex -= 1;
  if (selectedReportIndex !== null && selectedReportIndex > index) selectedReportIndex -= 1;

  loadHistory();
  renderReportTab();
  updateDashboardMetrics();
}

function loadHistory() {
  const history = getHistoryRecords();
  const grid = document.getElementById('historyGrid');
  const empty = document.getElementById('historyEmptyState');
  
  if (!grid || !empty) return;

  if (!history.length) { 
    empty.style.display = 'block';
    grid.innerHTML = '';
    renderReportTab();
    return; 
  }
  
  empty.style.display = 'none';
  if (selectedHistoryIndex !== null && selectedHistoryIndex >= history.length) {
    selectedHistoryIndex = null;
  }
  grid.innerHTML = history.map((h, i) => {
    const confClass = h.confidence >= 60 ? 'high' : h.confidence >= 35 ? 'medium' : 'low';
    const color = confClass === 'high' ? 'var(--severity-high)' : confClass === 'medium' ? 'var(--severity-medium)' : 'var(--severity-low)';
    return `
    <div class="history-card glow-border animate-in animate-in-delay-2 ${i === selectedHistoryIndex ? 'active' : ''}" onclick="selectHistoryCard(${i})" style="animation-delay: ${i * 0.05}s">
      <div class="bento-inner">
        <div id="hist-img-${h.id}" style="width:44px;height:44px;border-radius:var(--radius-md);background:rgba(148,163,184,0.1);display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:12px;overflow:hidden;">&#128209;</div>
        <div class="history-item-diagnosis" style="font-weight:700; font-size:16px; margin-bottom:4px; color:var(--neutral-100);">${getHistoryDisplayName(h)}</div>
        <div class="history-item-date" style="font-size:12px; color:var(--neutral-500); margin-bottom:12px;">${new Date(h.date).toLocaleDateString()}  -  ${new Date(h.date).toLocaleTimeString()}</div>
        <div class="history-item-confidence" style="color:${color}; font-weight:700; font-size:20px;">${h.confidence}% ${getI18nText('history_confidence_short', 'conf.')}</div>
      </div>
    </div>`;
  }).join('');
  
  history.forEach(h => {
    if (h.hasImage !== false) {
      loadImageFromDB(h.id, imgData => {
        if (imgData) {
          const el = document.getElementById(`hist-img-${h.id}`);
          if (el) el.innerHTML = `<img src="${imgData}" style="width:100%;height:100%;object-fit:cover;">`;
        }
      });
    }
  });

  renderReportTab();
}

function clearHistory() {
  if (confirm(getI18nText('confirm_clear_history', 'Are you sure you want to clear all diagnostic history?'))) {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(SYNC_QUEUE_KEY);
    openImageDB().then(db => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
    }).catch(console.warn);
    selectedHistoryIndex = null;
    selectedReportIndex = null;
    loadHistory();
    updateDashboardMetrics();
  }
}

// === AI Chat Engine ===
const CHAT_KNOWLEDGE = {
  vaccination: `**Recommended Vaccination Schedule for Cattle:**\n\n- **FMD (Foot-and-Mouth):** First at 4 months, booster at 6 months, then every 6 months\n- **HS (Hemorrhagic Septicemia):** Before monsoon season annually\n- **BQ (Black Quarter/Blackleg):** At 6 months, annual booster\n- **Brucellosis:** Female calves at 4-8 months (once)\n- **Theileriosis:** As per regional veterinary advice\n- **Anthrax:** Annual, in endemic areas\n- **Rabies:** If exposure risk exists\n\nAlways consult your local veterinarian for region-specific protocols.`,
  
  feeding: `**General Cattle Feeding Guidelines:**\n\n- **Roughage:** 2-3% of body weight daily (hay, straw, silage)\n- **Concentrate:** 1-2 kg per 2.5 liters of milk produced\n- **Clean water:** 50-80 liters/day for adults\n- **Mineral supplements:** Calcium, phosphorus, salt lick\n- **Pregnant cows:** Increase feed by 20-30% in last trimester\n- **Avoid:** Moldy feed, sudden diet changes, excess grain\n\nProper nutrition is the foundation of disease prevention.`,
  
  first_aid: `**Basic First Aid for Cattle:**\n\n- **Wounds:** Clean with antiseptic, apply wound spray, keep flies away\n- **Fever:** Isolate animal, provide shade and water, call vet\n- **Bloat:** Walk the animal, pass stomach tube if trained, anti-foaming agents\n- **Diarrhea:** Oral rehydration salts, keep hydrated, isolate\n- **Fractures:** Immobilize if possible, call vet immediately\n- **Snake bite:** Keep animal calm, call vet urgently\n\nNote: Always call a veterinarian for serious cases.`,
  
  milk: `**Improving Milk Production:**\n\n- Ensure balanced nutrition with adequate protein and energy\n- Provide clean, fresh water at all times (minimum 50L/day)\n- Maintain clean, comfortable housing\n- Follow proper milking technique and schedule (2-3 times/day)\n- Prevent and treat mastitis promptly\n- Deworm regularly and control parasites\n- Reduce stress - avoid sudden changes in routine\n- Ensure proper dry period (60 days before calving)`,
  
  pregnancy: `**Cow Pregnancy Care:**\n\n- **Gestation period:** ~283 days (9 months, 10 days)\n- **Dry off:** 60 days before expected calving\n- **Nutrition:** Increase 20-30% in last trimester\n- **Vaccinations:** Complete before breeding, not during pregnancy\n- **Signs of calving:** Restlessness, swollen vulva, mucus discharge, udder enlargement\n- **Post-calving:** Ensure calf nurses within 1 hour, watch for retained placenta\n- **Call vet if:** Labor exceeds 2 hours, abnormal presentation, excessive bleeding`
};
function normalizeForMatch(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreDiseaseRelevance(question, disease) {
  const q = normalizeForMatch(question);
  if (!q) return 0;
  const tokens = new Set(q.split(' ').filter(Boolean));

  let score = 0;
  const fields = [
    disease.name,
    disease.id,
    disease.latin,
    disease.desc,
    ...(disease.visualSigns || []),
    ...(disease.symptoms || []).map(findSymptomLabel)
  ].map(normalizeForMatch);

  fields.forEach(text => {
    if (!text) return;
    tokens.forEach(token => {
      if (token.length < 3) return;
      if (text.includes(token)) score += 1;
    });
  });

  return score;
}

function getRelevantDiseases(question, maxItems = 4) {
  const scored = DISEASES
    .map(disease => ({ disease, score: scoreDiseaseRelevance(question, disease) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map(item => item.disease);

  return scored.length ? scored : DISEASES.slice(0, Math.min(maxItems, DISEASES.length));
}

function getRelevantKnowledgeBlocks(question) {
  const q = normalizeForMatch(question);
  const blocks = [];
  const keywords = {
    vaccination: ['vaccine', 'vaccination', 'fmd', 'bq', 'hs', 'anthrax', 'brucellosis'],
    feeding: ['feed', 'feeding', 'diet', 'nutrition', 'roughage', 'concentrate', 'water'],
    first_aid: ['first aid', 'wound', 'fever', 'bloat', 'diarrhea', 'snake', 'fracture'],
    milk: ['milk', 'yield', 'lactation', 'mastitis', 'production'],
    pregnancy: ['pregnant', 'pregnancy', 'calving', 'gestation', 'dry off', 'retained placenta']
  };

  Object.entries(keywords).forEach(([key, list]) => {
    if (list.some(word => q.includes(word))) blocks.push(CHAT_KNOWLEDGE[key]);
  });

  if (!blocks.length) {
    blocks.push(CHAT_KNOWLEDGE.first_aid, CHAT_KNOWLEDGE.feeding);
  }

  return blocks;
}

function getRecentCaseContext(maxItems = 3) {
  const history = getHistoryRecords().slice(0, maxItems);
  if (!history.length) return 'No recent local diagnosis history.';

  return history.map((item, idx) => {
    const disease = getHistoryPrimaryDisease(item);
    const urgency = disease?.urgency || 'unknown';
    return `Case ${idx + 1}: ${getHistoryDisplayName(item)} | confidence ${item.confidence || 0}% | urgency ${urgency} | date ${item.date}`;
  }).join('\n');
}
// No API Key here! It is securely hidden in the backend's .env file.

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  
  addChatMessage(msg, 'user');
  input.value = '';
  document.getElementById('chatSuggestions').style.display = 'none';
  
  // Show typing indicator
  const typingId = showTypingIndicator();
  
  try {
    const reply = await callLocalBackendAPI(msg);
    removeTypingIndicator(typingId);
    addChatMessage(reply, 'bot');
  } catch (err) {
    console.error('Backend API Error:', err);
    removeTypingIndicator(typingId);
    addChatMessage(getOfflineChatReply(msg), 'bot');
  }
}

function getOfflineChatReply(question) {
  const q = String(question || '');
  const disease = getRelevantDiseases(q, 1)[0];
  const localizedDisease = disease ? getLocalizedDisease(disease) : null;
  const offlineTitle = getI18nText('chat_offline_title', 'Offline mode active.');
  const offlineBest = getI18nText('chat_offline_best_match', 'Best local match');
  const offlineSigns = getI18nText('chat_offline_key_signs', 'Key signs');
  const offlineSteps = getI18nText('chat_offline_steps', 'Priority steps now');
  const offlinePrevention = getI18nText('chat_offline_prevention', 'Prevention focus');
  const offlineUrgency = getI18nText('chat_offline_urgency', 'Urgency');
  const offlineConnect = getI18nText('chat_offline_connect', 'For higher-accuracy conversational answers, connect internet and run backend server.');
  if (localizedDisease) {
    return `${offlineTitle} ${offlineBest}: **${localizedDisease.name}**.\n\n- ${offlineSigns}: ${localizedDisease.visualSigns.slice(0, 4).join(', ')}\n- ${offlineSteps}: ${localizedDisease.treatment.slice(0, 4).join(', ')}\n- ${offlinePrevention}: ${localizedDisease.prevention.slice(0, 3).join(', ')}\n- ${offlineUrgency}: ${String(disease.urgency || 'unknown').toUpperCase()}\n\n${offlineConnect}`;
  }

  return getI18nText('chat_offline_generic', 'Offline mode active. I could not map this query to a specific disease confidently. Please share key signs (fever, discharge, appetite loss, lesions, milk drop) and I will guide with local rules, or connect backend for full AI response.');
}

async function callLocalBackendAPI(question) {
  const relevantDiseases = getRelevantDiseases(question, 4);
  const diseasesContext = relevantDiseases.map(d => {
    const localized = getLocalizedDisease(d);
    return `Disease: ${localized.name} (${localized.latin})
Description: ${localized.desc}
Visual Signs: ${localized.visualSigns.join(', ')}
Symptoms: ${d.symptoms.map(findSymptomLabel).join(', ')}
Treatment: ${localized.treatment.join(', ')}
Prevention: ${localized.prevention.join(', ')}
Severity: ${d.severity.toUpperCase()}
Urgency: ${String(d.urgency || '').toUpperCase()}
Contagious: ${d.contagious}`;
  }).join('\n\n');

  const additionalContext = getRelevantKnowledgeBlocks(question).join('\n\n');
  const recentCases = getRecentCaseContext(3);

  const langCode = getSelectedLanguageCode();
  const langName = getSelectedLanguageName();
  const systemPrompt = `You are PASHU CARE AI, a veterinary assistant focused on cattle health.

PREFERRED LANGUAGE: ${langName}

RESPONSE RULES:
1. Answer ONLY from the provided context. If evidence is weak, say "not enough evidence".
2. Keep output practical and concise: probable cause, why, immediate steps, warning signs, and prevention.
3. Never invent drug dosages. If dosage is requested, advise veterinarian confirmation.
4. If question is emergency-like (severe breathing issue, collapse, heavy bleeding, unable to stand), prioritize emergency referral.
5. Reply strictly in ${langName}. If the user writes in a different language, still respond in ${langName}.
6. If multiple diseases are plausible, rank top 2-3 with brief reasoning.

RELEVANT DISEASE CONTEXT:
${diseasesContext}

RELEVANT GENERAL CONTEXT:
${additionalContext}

RECENT LOCAL CASES:
${recentCases}`;

  const payload = {
    systemPrompt: systemPrompt,
    question: question,
    useRag: true,
    ragTopK: 5,
    langCode: langCode,
    langName: langName
  };

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to get response from Backend API. Is the server running?");
  }

  const data = await response.json();
  return data.reply || 'I could not generate a reliable response right now. Please retry with specific symptoms.';
}

function askSuggestion(btn) {
  document.getElementById('chatInput').value = btn.textContent;
  sendChat();
}

function addChatMessage(text, sender) {
  const chatMessages = document.getElementById('chatMessages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  
  const avatar = sender === 'bot' ? '&#129302;' : '&#128100;';
  const label = sender === 'bot' ? '<strong>PASHU CARE AI</strong><br>' : '';
  
  // Simple markdown conversion for chat bubbles
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>')
    .replace(/•/g, '&bull;')
    .replace(/- /g, '&bull; ');
  
  msgDiv.innerHTML = `
    <div class="chat-msg-avatar">${avatar}</div>
    <div class="chat-msg-bubble">${label}${formatted}</div>
  `;
  
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const chatMessages = document.getElementById('chatMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-msg bot';
  typingDiv.id = 'typing-indicator';
  typingDiv.innerHTML = `
    <div class="chat-msg-avatar">&#129302;</div>
    <div class="chat-msg-bubble">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return 'typing-indicator';
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// === Theme Toggle Logic ===
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light-theme');
  localStorage.setItem('pashucare_theme', isLight ? 'light' : 'dark');
  updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
  const iconLight = document.querySelector('.theme-icon-light');
  const iconDark = document.querySelector('.theme-icon-dark');
  if (iconLight && iconDark) {
    iconLight.style.display = isLight ? 'none' : 'inline';
    iconDark.style.display = isLight ? 'inline' : 'none';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('pashucare_theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  const useLight = savedTheme === 'light' || (!savedTheme && prefersLight);
  if (useLight) {
    document.documentElement.classList.add('light-theme');
  }
  updateThemeIcon(useLight);
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', initTheme);

// === Dashboard Metrics ===
function updateDashboardMetrics() {
  const history = getHistoryRecords();
  const dashScans = document.getElementById('dashTotalScans');
  const dashAlerts = document.getElementById('dashAlerts');
  const dashHealthyCases = document.getElementById('dashHealthyCases');
  const dashUnclearScans = document.getElementById('dashUnclearScans');
  const dashLatestDiagnosis = document.getElementById('dashLatestDiagnosis');

  const latest = history[0] || null;
  const alertCases = history.filter(item => isAlertHistoryEntry(item)).length;

  const healthyCases = history.filter(item => isHealthyHistoryEntry(item)).length;
  const unclearScans = history.filter(item => isInvalidHistoryEntry(item)).length;

  if (dashScans) dashScans.textContent = String(history.length);
  if (dashAlerts) dashAlerts.textContent = String(alertCases);
  if (dashHealthyCases) dashHealthyCases.textContent = String(healthyCases);
  if (dashUnclearScans) dashUnclearScans.textContent = String(unclearScans);

  if (dashLatestDiagnosis) {
    if (!latest) {
      dashLatestDiagnosis.innerHTML = `<div class="empty-mini">${getI18nText('dash_last_report_empty', 'No report yet')}</div>`;
    } else {
      const disease = getHistoryPrimaryDisease(latest);
      const localizedDisease = disease ? getLocalizedDisease(disease) : null;
      const topDiagnosis = escapeHtml(getHistoryDisplayName(latest));
      const visualLine = localizedDisease?.visualSigns?.length
        ? escapeHtml(localizedDisease.visualSigns[0])
        : escapeHtml(getI18nText('diag_visual_not_available', 'No key visual signs available'));
      const recommendation = localizedDisease?.treatment?.length
        ? escapeHtml(localizedDisease.treatment[0])
        : escapeHtml(getI18nText('dash_reco_fallback', 'Consult a veterinarian for guidance.'));
      const protocol = localizedDisease?.prevention?.length
        ? escapeHtml(localizedDisease.prevention[0])
        : escapeHtml(getI18nText('dash_protocol_fallback', 'Isolate and monitor the animal.'));
      const modelStatusLabel = isModelLoaded
        ? getI18nText('dash_model_ready', 'Model ready')
        : getI18nText('dash_model_loading', 'Model loading');
      const modelStatusClass = isModelLoaded ? 'ready' : 'loading';
      dashLatestDiagnosis.innerHTML = `
        <div class="dash-last-report-card">
          <div class="dash-last-report-media" id="dashLatestEvidence">&#128247;</div>
          <div class="dash-last-report-main">
            <div class="dash-report-title">${topDiagnosis}</div>
            <div class="dash-report-visual"><strong>${escapeHtml(getI18nText('report_visual', 'Visual'))}:</strong> ${visualLine}</div>
            <div class="dash-report-reco">
              <div class="dash-reco-item">
                <div class="dash-reco-title">${escapeHtml(getI18nText('dash_recommendation', 'Recommendation'))}</div>
                <div class="dash-reco-text">${recommendation}</div>
              </div>
              <div class="dash-reco-item">
                <div class="dash-reco-title">${escapeHtml(getI18nText('dash_protocol', 'Protocol'))}</div>
                <div class="dash-reco-text">${protocol}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="latest-scan-meta">
          <span class="meta-label">${escapeHtml(getI18nText('dash_last_scan', 'Last Scan'))}</span>
          <span class="meta-value">${formatDashboardTimestamp(latest.date)}</span>
        </div>
        <div class="dash-last-report-bottom">
          <div class="dash-last-thumb-small" id="dashLatestThumbSmall">&#128247;</div>
          <span class="dash-last-bottom-text">${escapeHtml(String(latest.confidence || 0))}% ${escapeHtml(getI18nText('history_confidence_short', 'confidence'))}</span>
          <span class="dash-model-status ${modelStatusClass}">${escapeHtml(modelStatusLabel)}</span>
        </div>
      `;

      if (latest.hasImage !== false) {
        loadImageFromDB(latest.id, imgData => {
          if (!imgData) return;
          const mainEl = document.getElementById('dashLatestEvidence');
          const smallEl = document.getElementById('dashLatestThumbSmall');
          if (mainEl) mainEl.innerHTML = `<img src="${imgData}" alt="Latest report evidence" style="width:100%;height:100%;object-fit:cover;">`;
          if (smallEl) smallEl.innerHTML = `<img src="${imgData}" alt="Latest report thumb" style="width:100%;height:100%;object-fit:cover;">`;
        });
      }
    }
  }

  renderDashboardRecentActivity(history);
}
function formatDashboardTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  const datePart = date.toLocaleDateString();
  const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${datePart} · ${timePart}`;
}

let currentActivityFilter = 'all';

function setActivityFilter(filter, triggerEl) {
  currentActivityFilter = filter || 'all';
  document.querySelectorAll('.activity-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  if (triggerEl) triggerEl.classList.add('active');
  renderDashboardRecentActivity();
}

function renderDashboardRecentActivity(history = getHistoryRecords()) {
  const container = document.getElementById('dashRecentActivity');
  if (!container) return;

  const statTotal = document.getElementById('dashActTotal');
  const statUrgent = document.getElementById('dashActUrgent');
  const statAvgConf = document.getElementById('dashActAvgConf');

  const safe = value => String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);

  const activityData = history.map(item => {
    const disease = getHistoryPrimaryDisease(item);
    const confidence = Math.round(Number(item.confidence || 0));
    const isUnclear = isInvalidHistoryEntry(item);
    const isAlert = isAlertHistoryEntry(item);
    const statusClass = isUnclear ? 'unclear' : (isAlert ? 'urgent' : 'healthy');
    const statusLabel = statusClass === 'unclear'
      ? getI18nText('dash_status_unclear', 'Needs Re-scan')
      : statusClass === 'urgent'
      ? getI18nText('dash_status_urgent', 'Urgent')
      : getI18nText('dash_status_healthy', 'Healthy');

    return {
      item,
      disease,
      isAlert,
      isUnclear,
      statusClass,
      statusLabel,
      confidence
    };
  });

  const urgentCount = activityData.filter(entry => entry.isAlert).length;
  const avgConfidence = activityData.length
    ? Math.round(activityData.reduce((sum, entry) => sum + entry.confidence, 0) / activityData.length)
    : 0;

  if (statTotal) statTotal.textContent = String(activityData.length);
  if (statUrgent) statUrgent.textContent = String(urgentCount);
  if (statAvgConf) statAvgConf.textContent = activityData.length ? `${avgConfidence}%` : '--';

  const filtered = activityData.filter(entry => {
    if (currentActivityFilter === 'urgent') return entry.isAlert;
    if (currentActivityFilter === 'healthy') return !entry.isAlert && !entry.isUnclear;
    if (currentActivityFilter === 'unclear') return entry.isUnclear;
    return true;
  }).slice(0, 7);

  if (!filtered.length) {
    const emptyText = activityData.length
      ? getI18nText('dash_activity_empty_filter', 'No records for selected filter.')
      : getI18nText('dash_empty', 'No diagnosis records yet. Run your first scan to populate this dashboard.');
    container.innerHTML = `
      <div class="empty-state-mini">${emptyText}</div>
    `;
    return;
  }

  container.innerHTML = filtered.map((entry) => {
    const topDiagnosis = safe(getHistoryDisplayName(entry.item));
    const confidence = `${entry.confidence}%`;
    const dateText = formatDashboardTimestamp(entry.item.date);
    const severity = entry.disease?.severity ? getSeverityLabel(entry.disease.severity) : getI18nText('label_na', 'N/A');
    return `
      <div class="dash-activity-item">
        <div class="dash-activity-main">
          <div class="dash-activity-title">${topDiagnosis}</div>
          <div class="dash-activity-meta">${dateText}</div>
        </div>
        <div class="dash-activity-right">
          <span class="dash-activity-conf">${confidence}</span>
          <span class="dash-activity-sev">${severity}</span>
          <span class="dash-activity-level ${entry.statusClass}">${entry.statusLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

// === Nutrient Calculator ===
function calculateNutrients() {
  const weight = parseFloat(document.getElementById('calcWeight').value);
  const yieldLiters = parseFloat(document.getElementById('calcYield').value);

  if (!weight || weight < 50 || weight > 1500) {
    alert(getI18nText('nutri_invalid_weight', 'Please enter a valid cow weight between 50 and 1500 kg.'));
    return;
  }

  // Basic formula for maintenance + milk production
  // Maintenance: ~1.5% - 2% of body weight in Dry Matter (DM)
  const maintenanceDM = weight * 0.015;
  // Production: ~0.4kg DM per liter of milk
  const productionDM = (yieldLiters || 0) * 0.4;
  
  const totalDM = maintenanceDM + productionDM;
  
  // Rough rule of thumb: 60% Roughage, 40% Concentrate
  const roughage = (totalDM * 0.6).toFixed(1);
  const concentrate = (totalDM * 0.4).toFixed(1);
  
  // Water: ~4 liters per 1kg of DM, plus ~3 liters per liter of milk
  const water = ((totalDM * 4) + ((yieldLiters || 0) * 3)).toFixed(0);

  document.getElementById('resRoughage').textContent = `${roughage} kg`;
  document.getElementById('resConcentrate').textContent = `${concentrate} kg`;
  document.getElementById('resWater').textContent = `${water} L`;
  
  const resContainer = document.getElementById('calcResults');
  resContainer.style.display = 'grid';
  resContainer.style.animation = 'none';
  resContainer.offsetHeight; // trigger reflow
  resContainer.style.animation = 'fadeInUp 0.5s ease-out forwards';
}

// === Feedback System ===
// =========================================================
// MODERNIZED TAB RENDERERS (override legacy definitions)
// =========================================================
function renderReportTab() {
  const cardsView = document.getElementById('reportCardsView');
  const detailPanel = document.getElementById('reportDetailPanel');
  const detail = document.getElementById('reportDetailContent');
  const reportTab = document.getElementById('tab-report');
  if (!cardsView || !detailPanel || !detail) return;

  const history = getHistoryRecords();
  if (!history.length) {
    if (reportTab) reportTab.classList.remove('report-fullscreen');
    cardsView.style.display = 'grid';
    detailPanel.style.display = 'none';
    cardsView.innerHTML = `
      <div class="glass-card history-detail-empty" style="padding:36px;">
        <div class="empty-icon">&#128203;</div>
        <p>${getI18nText('report_empty', 'Run a diagnosis first, then open this tab for complete report details.')}</p>
      </div>
    `;
    return;
  }

  if (selectedReportIndex !== null && selectedReportIndex >= history.length) {
    selectedReportIndex = null;
  }

  if (selectedReportIndex === null) {
    if (reportTab) reportTab.classList.remove('report-fullscreen');
    cardsView.style.display = 'grid';
    detailPanel.style.display = 'none';
    cardsView.innerHTML = history.map((h, i) => {
      const isInvalid = isInvalidHistoryEntry(h);
      const isHealthy = isHealthyHistoryEntry(h);
      const badgeClass = isInvalid ? 'low' : isHealthy ? 'ok' : 'warn';
      const badgeLabel = isInvalid
        ? getI18nText('hist_filter_invalid', 'Invalid/Non-Cattle')
        : isHealthy
          ? getI18nText('hist_filter_healthy', 'Healthy')
          : getI18nText('hist_filter_alert', 'Alert');
      return `
      <div class="glass-card report-card-item">
        <div class="report-card-top">
          <span class="report-card-tag">${getI18nText('report_card_tag', 'Diagnostic Report')}</span>
          <span class="report-card-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="report-card-title">${escapeHtml(getHistoryDisplayName(h))}</div>
        <div class="report-card-image" id="report-card-img-${h.id}">
          <span>&#128247;</span>
        </div>
        <div class="report-card-meta">${new Date(h.date).toLocaleDateString()} &middot; ${new Date(h.date).toLocaleTimeString()}</div>
        <div class="report-card-foot">
          <span class="report-card-confidence">${h.confidence}% ${getI18nText('history_confidence_short', 'confidence')}</span>
          <button class="btn btn-primary btn-sm" type="button" onclick="selectReportItem(${i})">${getI18nText('history_open_report', 'View Report')}</button>
        </div>
      </div>
    `;
    }).join('');

    history.forEach(h => {
      if (h.hasImage !== false) {
        loadImageFromDB(h.id, imgData => {
          if (imgData) {
            const el = document.getElementById(`report-card-img-${h.id}`);
            if (el) el.innerHTML = `<img src="${imgData}" alt="Report evidence" style="width:100%;height:100%;object-fit:cover;">`;
          }
        });
      }
    });
    return;
  }

  if (reportTab) reportTab.classList.add('report-fullscreen');
  cardsView.style.display = 'none';
  detailPanel.style.display = 'block';
  renderHistoryDetail(history[selectedReportIndex], 'reportDetailContent');
  const scrollRoot = document.querySelector('.content-scroll');
  if (scrollRoot) scrollRoot.scrollTop = 0;
}

function closeReportDetail() {
  selectedReportIndex = null;
  renderReportTab();
}

let currentHistoryFilter = 'all';

function isInvalidHistoryEntry(entry) {
  const primaryId = String(entry?.primaryId || '').toLowerCase();
  const diagnosis = String(entry?.topDiagnosis || '').toLowerCase();
  const confidence = Number(entry?.confidence || 0);
  return primaryId === 'low_confidence' ||
    primaryId === 'not_cow' ||
    primaryId === 'unclear_input' ||
    diagnosis.includes('low confidence') ||
    diagnosis.includes('not suitable') ||
    confidence < 20;
}

function isHealthyHistoryEntry(entry) {
  const primaryId = String(entry?.primaryId || '').toLowerCase();
  const diagnosis = String(entry?.topDiagnosis || '').toLowerCase();
  if (isInvalidHistoryEntry(entry)) return false;
  return primaryId === 'healthy_cow' || diagnosis.includes('healthy cow');
}

function isAlertHistoryEntry(entry) {
  if (isInvalidHistoryEntry(entry)) return false;
  if (isHealthyHistoryEntry(entry)) return false;
  const primaryId = String(entry?.primaryId || '').toLowerCase();
  if (DISEASES.some(d => d.id === primaryId)) return true;
  const disease = getHistoryPrimaryDisease(entry);
  if (disease) return true;
  return Number(entry?.confidence || 0) >= 20;
}

function setHistoryFilter(filter, triggerEl) {
  currentHistoryFilter = filter || 'all';
  document.querySelectorAll('.history-filter').forEach(btn => btn.classList.remove('active'));
  if (triggerEl) triggerEl.classList.add('active');
  loadHistory();
}

function loadHistory() {
  const history = getHistoryRecords();
  const grid = document.getElementById('historyGrid');
  const empty = document.getElementById('historyEmptyState');
  if (!grid || !empty) return;

  if (!history.length) {
    empty.style.display = 'block';
    grid.innerHTML = '';
    renderReportTab();
    return;
  }

  empty.style.display = 'none';
  if (selectedHistoryIndex !== null && selectedHistoryIndex >= history.length) {
    selectedHistoryIndex = null;
  }

  const indexed = history.map((h, i) => ({ h, i }));
  const filtered = indexed.filter(({ h }) => {
    if (currentHistoryFilter === 'healthy') return !isInvalidHistoryEntry(h) && !isAlertHistoryEntry(h);
    if (currentHistoryFilter === 'alert') return isAlertHistoryEntry(h);
    if (currentHistoryFilter === 'invalid') return isInvalidHistoryEntry(h);
    return true;
  });

  if (!filtered.length) {
    empty.style.display = 'block';
    empty.innerHTML = `
      <div class="empty-icon">&#128221;</div>
      <p>${getI18nText('hist_empty_filter', 'No records for selected filter.')}</p>
    `;
    grid.innerHTML = '';
    renderReportTab();
    return;
  }

  empty.style.display = 'none';
  grid.innerHTML = filtered.map(({ h, i }) => {
    const confClass = h.confidence >= 60 ? 'high' : h.confidence >= 35 ? 'medium' : 'low';
    const statusClass = isInvalidHistoryEntry(h) ? 'invalid' : isAlertHistoryEntry(h) ? 'alert' : 'healthy';
    const statusLabel = statusClass === 'invalid'
      ? getI18nText('hist_filter_invalid', 'Invalid/Non-Cattle')
      : statusClass === 'alert'
        ? getI18nText('hist_filter_alert', 'Alert')
        : getI18nText('hist_filter_healthy', 'Healthy');
    return `
      <div class="history-row-card ${i === selectedHistoryIndex ? 'active' : ''}" onclick="selectHistoryCard(${i})" style="animation-delay:${(i * 0.04).toFixed(2)}s">
        <div class="history-row-left">
          <div class="history-row-thumb" id="hist-img-${h.id}">&#128209;</div>
          <div class="history-row-main">
            <div class="history-row-title">${escapeHtml(getHistoryDisplayName(h))}</div>
            <div class="history-row-date">${new Date(h.date).toLocaleDateString()} | ${new Date(h.date).toLocaleTimeString()}</div>
            <div class="history-row-confidence ${confClass}">${h.confidence}% ${getI18nText('history_confidence_short', 'confidence')}</div>
          </div>
        </div>
        <div class="history-row-right">
          <span class="history-row-status ${statusClass}">${statusLabel}</span>
          <span class="history-row-meta">${getI18nText('guest', 'Guest')}</span>
          <div class="history-row-actions">
            <button type="button" class="history-open-btn" onclick="event.stopPropagation(); openReportFromHistory(${i});">${getI18nText('history_open_report', 'View Report')}</button>
            <button type="button" class="history-delete-btn" onclick="removeHistoryItem(${i}, event)" aria-label="${getI18nText('history_delete_report', 'Delete Report')}">&#128465;</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  filtered.forEach(({ h }) => {
    if (h.hasImage !== false) {
      loadImageFromDB(h.id, imgData => {
        if (imgData) {
          const el = document.getElementById(`hist-img-${h.id}`);
          if (el) el.innerHTML = `<img src="${imgData}" alt="Scan" style="width:100%;height:100%;object-fit:cover;">`;
        }
      });
    }
  });

  renderReportTab();
}

function calculateNutrients() {
  const weightInput = document.getElementById('calcWeight');
  const yieldInput = document.getElementById('calcYield');
  const roughageEl = document.getElementById('resRoughage');
  const concentrateEl = document.getElementById('resConcentrate');
  const waterEl = document.getElementById('resWater');
  const resContainer = document.getElementById('calcResults');
  if (!weightInput || !yieldInput || !roughageEl || !concentrateEl || !waterEl || !resContainer) return;

  const weight = parseFloat(weightInput.value);
  const yieldLiters = parseFloat(yieldInput.value);
  if (!weight || weight < 50 || weight > 1500) {
    alert(getI18nText('nutri_invalid_weight', 'Please enter a valid cow weight between 50 and 1500 kg.'));
    return;
  }

  const maintenanceDM = weight * 0.015;
  const productionDM = (yieldLiters || 0) * 0.4;
  const totalDM = maintenanceDM + productionDM;

  const roughage = (totalDM * 0.6).toFixed(1);
  const concentrate = (totalDM * 0.4).toFixed(1);
  const water = ((totalDM * 4) + ((yieldLiters || 0) * 3)).toFixed(0);

  roughageEl.textContent = `${roughage} kg`;
  concentrateEl.textContent = `${concentrate} kg`;
  waterEl.textContent = `${water} L`;

  resContainer.style.display = 'grid';
  resContainer.style.animation = 'none';
  resContainer.offsetHeight;
  resContainer.style.animation = 'fadeInUp 0.35s ease-out forwards';
}

function submitFeedback() {
  const name = document.getElementById('feedName').value;
  const msg = document.getElementById('feedMsg').value;

  if (!msg.trim()) {
    alert(getI18nText('alert_feedback_empty', 'Please enter a message before submitting.'));
    return;
  }

  const feedback = JSON.parse(localStorage.getItem('pashucare_feedback') || '[]');
  feedback.unshift({
    date: new Date().toISOString(),
    name: (name || 'Anonymous').trim(),
    message: msg.trim()
  });
  localStorage.setItem('pashucare_feedback', JSON.stringify(feedback.slice(0, 200)));

  alert(getI18nText('alert_feedback_saved', 'Feedback saved locally on this device.'));
  document.getElementById('feedName').value = '';
  document.getElementById('feedMsg').value = '';
}

// === Mock Login ===
function mockLogin() {
  const btn = document.getElementById('loginBtn');
  if (!btn) return;
  const isLoggedIn = btn.getAttribute('data-logged-in') === 'true';
  if (isLoggedIn) {
    btn.setAttribute('data-logged-in', 'false');
    btn.textContent = getI18nText('set_login_btn', 'Login / Register');
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    document.querySelector('.user-name').textContent = getI18nText('guest', 'Guest');
  } else {
    btn.setAttribute('data-logged-in', 'true');
    btn.textContent = getI18nText('set_logout_btn', 'Logout');
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-secondary');
    document.querySelector('.user-name').textContent = getI18nText('user_local', 'Local User');
  }
}












