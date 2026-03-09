/* ============================================================
   PASHU CARE - AI Cow Disease Diagnostic Engine
   Powered by TensorFlow.js + Google Teachable Machine
   ============================================================ */

// Ã¢â€â‚¬Ã¢â€â‚¬ Disease Knowledge Base Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Symptom Categories Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬ State Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
let uploadedImage = null;
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
  return langTable[key] || enTable[key] || fallback || key;
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
    window.requestIdleCallback(() => { runPreload(); }, { timeout: 2000 });
    return;
  }

  setTimeout(() => { runPreload(); }, 400);
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
    setDiagnosisReadiness('Ready to run diagnosis', 'ready');
  } else {
    setDiagnosisReadiness('Awaiting image or symptom input', 'pending');
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
    badge.textContent = 'Online Model';
    badge.classList.add('online');
    return;
  }

  if (mode === 'local') {
    badge.textContent = 'Offline Model';
    badge.classList.add('offline');
    return;
  }

  if (mode === 'checking') {
    badge.textContent = 'Checking Online...';
    badge.classList.add('checking');
    return;
  }

  if (mode === 'symptom-only') {
    badge.textContent = 'Symptom Engine Fallback';
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
    if (IS_LOCAL_DEV) {
      await disableServiceWorkerForLocalDev();
      return;
    }

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

// Ã¢â€â‚¬Ã¢â€â‚¬ Initialization Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
document.addEventListener('DOMContentLoaded', () => {
  removeLegacyRegistryUI();
  startDevInstantReload();
  setupNavigation();
  setupDragDrop();
  setupFileInput();
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
    if (!res.ok) { errEl.textContent = data.error || 'Login failed.'; return; }
    localStorage.setItem('pashucare_user', JSON.stringify(data.user));
    localStorage.setItem('pashucare_token', data.token);
    updateAuthUI(data.user);
    closeAuthModal();
  } catch (err) {
    errEl.textContent = 'Connection failed. Is the server running?';
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
    if (!res.ok) { errEl.textContent = data.error || 'Signup failed.'; return; }
    localStorage.setItem('pashucare_user', JSON.stringify(data.user));
    localStorage.setItem('pashucare_token', data.token);
    updateAuthUI(data.user);
    closeAuthModal();
  } catch (err) {
    errEl.textContent = 'Connection failed. Is the server running?';
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
    nameEls.forEach(el => { if (el) el.textContent = 'Guest'; });
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


// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
// FILE UPLOAD & DRAG-DROP
// Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â
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

function handleFile(file) {
  if (!file.type.startsWith('image/')) return alert('Please upload an image file.');
  if (file.size > 10 * 1024 * 1024) return alert('File too large. Maximum 10MB.');
  const reader = new FileReader();
  reader.onload = e => {
    uploadedImage = e.target.result;
    const preview = document.getElementById('uploadPreview');
    const placeholder = document.getElementById('uploadPlaceholder');
    const previewImg = document.getElementById('previewImage');
    
    if (previewImg) previewImg.src = uploadedImage;
    if (placeholder) placeholder.style.display = 'none';
    if (preview) {
      preview.style.display = 'block';
      // Enable image-only diagnosis immediately after valid image load.
      updateAnalyzeButtonState();
      
      // Keep scanner flash very short to avoid perceived lag.
      const dropZone = document.getElementById('dropZone');
      if (dropZone) dropZone.classList.add('scanning');
      
      setTimeout(() => {
        if (dropZone) dropZone.classList.remove('scanning');
        updateAnalyzeButtonState();
      }, 200);
    }
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Symptom Selector Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function renderSymptomCategories() {
  const container = document.getElementById('symptomCategories');
  if (!container) return;
  container.innerHTML = SYMPTOM_CATEGORIES.map(cat => `
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Analysis Engine Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
async function startAnalysis() {
  if (!uploadedImage && selectedSymptoms.size === 0) {
    return alert('Please upload an image or select symptoms first.');
  }
  setDiagnosisReadiness('Analysis in progress...', 'processing');
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
      alert('Not enough evidence to generate a reliable report. Add clearer image or select symptoms.');
      return;
    }

    renderResults(results);
    saveToHistory(results);

    if (resultsSec) resultsSec.classList.add('visible');
  } catch (err) {
    console.error('Analysis render/save failed:', err);
    alert('Scan completed but report rendering failed. Please retry once.');
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
  if (icon) icon.textContent = 'OK';
}

function normalizeLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function generateDiagnosis(mlResults) {
  const hasSymptoms = selectedSymptoms.size > 0;
  const hasMl = Array.isArray(mlResults) && mlResults.length > 0;
  if (!hasSymptoms && !hasMl) {
    if (uploadedImage) {
      return [{
        id: 'unclear_input',
        name: 'Image Not Suitable for Cattle Diagnosis',
        latin: 'Input Quality Check',
        category: 'general',
        icon: 'âš ï¸',
        severity: 'low',
        desc: 'Model prediction could not be completed for this image. Please retake and upload a clearer cattle image.',
        visualSigns: ['Insufficient model evidence for classification'],
        symptoms: [],
        treatment: ['Retake image with proper lighting and clear cattle focus'],
        prevention: ['Keep camera steady and frame only the cow/affected region'],
        urgency: 'low',
        contagious: false,
        score: 0,
        matchedSymptoms: [],
        isPrimary: true
      }];
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
      return [{
        id: 'healthy_cow',
        name: 'Healthy Cow (No Visible Disease)',
        latin: 'Clinical Screen: Normal',
        category: 'general',
        icon: 'âœ…',
        severity: 'low',
        desc: 'No clear visual disease pattern was detected in the uploaded image.',
        visualSigns: ['Body condition appears normal', 'No major external lesion pattern detected'],
        symptoms: [],
        treatment: ['No immediate treatment required based on this image'],
        prevention: ['Continue regular vaccination, hygiene, and routine vet checks'],
        urgency: 'low',
        contagious: false,
        score: Math.round(topProb * 100),
        matchedSymptoms: [],
        isPrimary: true
      }];
    }

    if (topProb >= 0.6 && (topClass.includes('not a cow') || topClass.includes('not cow'))) {
      return [{
        id: 'not_cow',
        name: 'Image Not Suitable for Cattle Diagnosis',
        latin: 'Input Verification',
        category: 'general',
        icon: 'âš ï¸',
        severity: 'low',
        desc: 'The uploaded photo does not appear to contain a cow or a clinically useful cattle region.',
        visualSigns: ['Non-cattle image pattern detected'],
        symptoms: [],
        treatment: ['Upload a clear image of the cow or affected body area'],
        prevention: ['Use close focus, good lighting, and avoid unrelated objects in frame'],
        urgency: 'low',
        contagious: false,
        score: Math.round(topProb * 100),
        matchedSymptoms: [],
        isPrimary: true
      }];
    }

    if (topProb < 0.4) {
      return [{
        id: 'unclear_input',
        name: 'Image Not Suitable for Cattle Diagnosis',
        latin: 'Input Quality Check',
        category: 'general',
        icon: 'âš ï¸',
        severity: 'low',
        desc: 'The uploaded image is too unclear or may not contain a cow. Please retake and upload a clinically relevant cattle image.',
        visualSigns: ['Insufficient visual match for cattle diagnosis'],
        symptoms: [],
        treatment: ['Re-upload with clearer focus on the cow or affected region'],
        prevention: ['Keep good lighting and frame only the cow/affected area'],
        urgency: 'low',
        contagious: false,
        score: Math.round(topProb * 100),
        matchedSymptoms: [],
        isPrimary: true
      }];
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
    return [{
      id: 'low_confidence',
      name: 'Image Needs Re-scan',
      latin: 'Insufficient Pattern Match',
      category: 'general',
      icon: 'â„¹ï¸',
      severity: 'low',
      desc: 'The model could not confidently match this image to known cattle disease classes.',
      visualSigns: ['No high-confidence class match'],
      symptoms: [],
      treatment: ['Retake image with closer focus on the affected cattle area'],
      prevention: ['Use a sharp image with adequate lighting and a visible cow region'],
      urgency: 'low',
      contagious: false,
      score: Math.round(Number(topPrediction.probability || 0) * 100),
      matchedSymptoms: [],
      isPrimary: true
    }];
  }

  return scored;
}

// Render Results Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function renderResults(results) {
  const resultTime = document.getElementById('resultTime');
  const resultCount = document.getElementById('resultCount');
  const grid = document.getElementById('resultsGrid');
  if (!grid) return;
  if (resultTime) resultTime.textContent = new Date().toLocaleString();
  if (resultCount) {
    const altCount = Math.max(results.length - 1, 0);
    resultCount.textContent = altCount ? `1 Primary | ${altCount} Alternatives` : '1 Primary';
  }

  const primary = results[0];
  const alternatives = results.slice(1);
  const sevClass = primary.severity;
  const urgencyClass = primary.urgency === 'urgent' ? 'urgent' : primary.urgency === 'moderate' ? 'moderate' : 'low';
  const urgencyLabel = primary.urgency === 'urgent' ? 'Seek veterinary care immediately' : primary.urgency === 'moderate' ? 'Schedule vet visit within 48 hours' : 'Monitor and treat at home initially';
  const confPercent = Math.round(primary.score);

  grid.innerHTML = `
    <!-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â PRIMARY DIAGNOSIS - Big Hero Card Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â -->
    <div class="primary-result animate-in" id="result-0">
      <div class="primary-result-badge">PRIMARY DIAGNOSIS</div>

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
            <span class="conf-ring-label">Confidence</span>
          </div>
        </div>
        <div class="primary-result-info">
          <div class="primary-disease-icon">${primary.icon}</div>
          <h2 class="primary-disease-name">${primary.name}</h2>
          <p class="primary-disease-latin">${primary.latin}</p>
          <div class="result-badges">
            <span class="severity-badge ${sevClass}">${sevClass.toUpperCase()}</span>
            ${primary.contagious ? '<span class="severity-badge medium">Contagious</span>' : '<span class="severity-badge low">Non-Contagious</span>'}
            ${primary.matchedSymptoms.length ? `<span class="severity-badge low">${primary.matchedSymptoms.length} symptoms matched</span>` : ''}
          </div>
        </div>
      </div>

      <p class="primary-result-desc">${primary.desc}</p>

      <div class="urgency-banner ${urgencyClass}">${urgencyLabel}</div>

      <div class="primary-details-grid">
        <div class="detail-block"><div class="detail-block-title">Visual Signs</div><ul>${primary.visualSigns.map(v=>`<li>${v}</li>`).join('')}</ul></div>
        <div class="detail-block"><div class="detail-block-title">Treatment</div><ul>${primary.treatment.map(t=>`<li>${t}</li>`).join('')}</ul></div>
        <div class="detail-block"><div class="detail-block-title">Prevention</div><ul>${primary.prevention.map(p=>`<li>${p}</li>`).join('')}</ul></div>
        <div class="detail-block"><div class="detail-block-title">Symptoms</div><ul>${primary.symptoms.map(s=>`<li>${findSymptomLabel(s)}</li>`).join('')}</ul></div>
      </div>
    </div>

    <!-- Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â OTHER POSSIBILITIES (Collapsed) Ã¢â€¢ÂÃ¢â€¢ÂÃ¢â€¢Â -->
    ${alternatives.length ? `
    <div class="alternatives-section animate-in animate-in-delay-2">
      <button class="alternatives-toggle" onclick="toggleAlternatives()" id="altToggleBtn">
        <span>Other Possibilities (${alternatives.length})</span>
        <span class="alt-chevron" id="altChevron">&#9662;</span>
      </button>
      <div class="alternatives-list" id="alternativesList">
        ${alternatives.map((r, i) => `
          <div class="alt-card glass-card">
            <div class="alt-card-left">
              <span class="alt-icon">${r.icon}</span>
              <div>
                <div class="alt-name">${r.name}</div>
                <div class="alt-latin">${r.latin}</div>
              </div>
            </div>
            <div class="alt-card-right">
              <span class="alt-conf">${Math.round(r.score)}%</span>
              <span class="severity-badge ${r.severity}" style="font-size:10px;padding:2px 8px;">${r.severity}</span>
            </div>
          </div>
        `).join('')}
        <p class="alt-disclaimer">These are low-probability alternatives. The primary diagnosis above is the most likely condition.</p>
      </div>
    </div>` : ''}
  `;
}

function findSymptomLabel(id) {
  for (const cat of SYMPTOM_CATEGORIES) {
    const s = cat.symptoms.find(s => s.id === id);
    if (s) return s.label;
  }
  return id.replace(/_/g, ' ');
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

  const entry = {
    id: entryId,
    synced: false,
    date: new Date().toISOString(),
    primaryId: results[0].id,
    topDiagnosis: results[0].name,
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

const OFFLINE_REPORT_SOURCES = [
  "WOAH FMD: https://www.woah.org/en/disease/foot-and-mouth-disease/",
  "WOAH LSD: https://www.woah.org/en/disease/lumpy-skin-disease/",
  "Merck FMD: https://www.merckvetmanual.com/infectious-diseases/foot-and-mouth-disease/foot-and-mouth-disease-in-animals",
  "Merck Ringworm Cattle: https://www.merckvetmanual.com/integumentary-system/dermatophytosis/dermatophytosis-in-cattle",
  "Merck Photosensitization: https://www.merckvetmanual.com/integumentary-system/photosensitization/overview-of-photosensitization-in-animals",
  "FAO FMD PCP tools: https://www.fao.org/3/cb9465en/cb9465en.pdf"
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

function getReportStatus(entry, disease) {
  if (isInvalidHistoryEntry(entry)) {
    return {
      label: "Input Not Suitable",
      confidenceLabel: `${entry.confidence}% Confidence`,
      summary: "Uploaded image does not contain clear cattle diagnostic evidence. Re-scan with a focused clinical image."
    };
  }
  if (isHealthyHistoryEntry(entry)) {
    return {
      label: "Healthy",
      confidenceLabel: `${entry.confidence}% Confidence`,
      summary: "Animal is in excellent health condition with no abnormalities detected."
    };
  }
  return {
    label: disease ? disease.name : "Alert",
    confidenceLabel: `${entry.confidence}% Confidence`,
    summary: disease ? disease.desc : "Model detected an alert condition. Veterinary review is recommended."
  };
}

function getOfflineProfile(entry, disease) {
  if (isInvalidHistoryEntry(entry)) {
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
  if (OFFLINE_REPORT_PROFILES[profileKey]) return OFFLINE_REPORT_PROFILES[profileKey];
  if (isHealthyHistoryEntry(entry)) return OFFLINE_REPORT_PROFILES.healthy_cow;

  return {
    statusTitle: "Overall Health Assessment",
    statusSummary: disease ? disease.desc : "Alert condition detected by model.",
    riskTitle: "Potential Diseases",
    riskFindings: [
      `Primary finding: ${disease ? disease.name : (entry.topDiagnosis || "Unspecified condition")}`,
      "Use veterinary examination to confirm diagnosis and stage."
    ],
    protocolTitle: "Protocol & Recommendations",
    protocol: disease ? disease.prevention : ["Isolate clinically affected animal and monitor progression."],
    observationTitle: "Key Visual Signs",
    observation: disease ? disease.visualSigns : ["No structured signs available for this class."],
    carePlanTitle: "Treatment & Medication",
    carePlan: disease ? disease.treatment : ["Follow veterinarian-guided supportive management."],
    nutritionTitle: "Nutrient Needs",
    nutrition: [
      ["Feed Quality", "High-quality palatable ration"],
      ["Hydration", "Continuous clean water"],
      ["Energy", "Maintain body condition"],
      ["Minerals", "Balanced mineral-vitamin supplementation"]
    ],
    careInstructionsTitle: "Care Instructions",
    careInstructions: disease ? disease.prevention : ["Maintain hygiene and avoid stressors during recovery."]
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
  const altLine = alternatives.length
    ? `Alternative low-confidence classes: ${alternatives.map(a => `${a.name} (${a.score}%)`).join(", ")}.`
    : "No alternative high-probability class identified.";
  const diseaseLine = disease
    ? `Primary mapped class: ${disease.name}. Severity: ${disease.severity}. Urgency: ${disease.urgency}.`
    : `Primary mapped class: ${entry.topDiagnosis || "Unknown"}.`;
  return [diseaseLine, altLine];
}

function getFollowUpPlan(entry, disease) {
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
  window.print();
}

async function shareReportQR(reportId) {
  const shareCode = `pashucare://report/${reportId}`;
  const shareText = `PASHU CARE Report Code: ${shareCode}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "PASHU CARE Detailed Report", text: shareText });
      return;
    }
  } catch (_) {}
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareCode);
      alert("Report code copied. You can convert this code to QR in any scanner app.");
      return;
    }
  } catch (_) {}
  prompt("Copy report code:", shareCode);
}

function renderHistoryDetail(entry, targetId = 'reportDetailContent') {
  const detail = document.getElementById(targetId);
  if (!detail) return;

  const disease = getHistoryPrimaryDisease(entry);
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
  const diseaseObservationList = disease && Array.isArray(disease.visualSigns) ? disease.visualSigns : [];
  const observationList = Array.from(new Set([...profileObservationList, ...diseaseObservationList]));

  const safeDiagnosis = escapeHtml(entry.topDiagnosis || getI18nText('report_unknown_case', 'Unknown case'));
  const confidenceText = `${entry.confidence}%`;
  const summaryStatus = escapeHtml(status.label);
  const summaryGenerated = escapeHtml(generatedText);
  const summarySource = OFFLINE_REPORT_SOURCES.map(s => `<li>${escapeHtml(s)}</li>`).join("");
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
    if (!list.length) return `<p class="report-v3-desc">No items available.</p>`;
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
    <section class="report-v3-shell">
      <header class="report-v3-hero">
        <div>
          <p class="report-v3-eyebrow">Clinical Diagnostic Report</p>
          <h2 class="report-v3-title">${summaryStatus} - Veterinary Report</h2>
          <p class="report-v3-subtitle">Generated: ${summaryGenerated}</p>
        </div>
        <div class="report-v3-actions">
          <button class="btn btn-secondary btn-sm" type="button" onclick="exportReportPdf('${entry.id}')">Export PDF</button>
          <button class="btn btn-secondary btn-sm" type="button" onclick="shareReportQR('${entry.id}')">Share QR</button>
          <button class="btn btn-secondary btn-sm" type="button" onclick="handleReportBack()">Back</button>
        </div>
      </header>

      <div class="report-v3-metrics">
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">Confidence</span>
          <span class="report-v3-metric-value">${confidenceText}</span>
        </div>
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">Primary Class</span>
          <span class="report-v3-metric-value">${summaryStatus}</span>
        </div>
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">Case ID</span>
          <span class="report-v3-metric-value">#${escapeHtml(String(entry.id).slice(-6).toUpperCase())}</span>
        </div>
        <div class="report-v3-metric">
          <span class="report-v3-metric-label">Review Time</span>
          <span class="report-v3-metric-value">${escapeHtml(compactTime)}</span>
        </div>
      </div>

      <section class="report-v3-grid">
        <div class="report-v3-col-main">
          <article class="report-v3-card">
            <p class="report-v3-kicker">Status Overview</p>
            <h3>Diagnosis Status</h3>
            <p class="report-v3-meta">${escapeHtml(profile.statusTitle)}</p>
            <div class="result-badges report-v3-badges">
              <span class="severity-badge low">${summaryStatus}</span>
              <span class="severity-badge low">${escapeHtml(status.confidenceLabel)}</span>
            </div>
            <p class="report-v3-desc">${escapeHtml(status.summary)}</p>
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">Risk</p>
            <h3>${escapeHtml(profile.riskTitle)}</h3>
            <p class="report-v3-meta">AI Findings</p>
            ${renderList(riskItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">Protocol</p>
            <h3>${escapeHtml(profile.protocolTitle)}</h3>
            <p class="report-v3-meta">Guidance</p>
            ${renderList(protocolItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">Observation</p>
            <h3>${escapeHtml(profile.observationTitle)}</h3>
            <p class="report-v3-meta">Visual</p>
            ${renderList(observationItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">Care Plan</p>
            <h3>${escapeHtml(profile.carePlanTitle)}</h3>
            <p class="report-v3-meta">Suggested</p>
            ${renderList(carePlanItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">Monitoring</p>
            <h3>Clinical Monitoring Plan</h3>
            <p class="report-v3-meta">Follow-up</p>
            ${renderList(monitoringItems)}
          </article>

          <article class="report-v3-card">
            <p class="report-v3-kicker">Differential</p>
            <h3>Differential Context</h3>
            <p class="report-v3-meta">Model interpretation</p>
            ${renderList(differentialItems)}
          </article>
        </div>

        <aside class="report-v3-col-side">
          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Quick Summary</p>
            <div class="history-alt-list">
              <div class="history-alt-item"><div class="history-alt-name">Confidence</div><div class="history-alt-score">${confidenceText}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Category</div><div class="history-alt-score">${summaryStatus}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Generated</div><div class="history-alt-score">${summaryGenerated}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Date</div><div class="history-alt-score">${escapeHtml(compactDate)}</div></div>
            </div>
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Nutrition</p>
            <h3>${escapeHtml(profile.nutritionTitle)}</h3>
            <p class="report-v3-meta">Daily</p>
            <div class="history-alt-list">${getOfflineNutritionTable(profile)}</div>
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Care</p>
            <h3>${escapeHtml(profile.careInstructionsTitle)}</h3>
            <p class="report-v3-meta">Guidance</p>
            ${renderList(careInstructionItems)}
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Red Flags</p>
            <h3>Escalation Alerts</h3>
            <p class="report-v3-meta">Urgent triggers</p>
            ${renderList(redFlagItems)}
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Biosecurity</p>
            <h3>Infection Control Checklist</h3>
            <p class="report-v3-meta">Farm protocol</p>
            ${renderList(biosecurityItems)}
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Evidence</p>
            <h3>Photo Evidence</h3>
            <p class="report-v3-meta">Captured</p>
            <div class="report-evidence-image report-v3-evidence" id="detail-evidence-${entry.id}">
              <span>Report photo evidence</span>
            </div>
          </article>

          <article class="report-v3-card report-v3-compact">
            <p class="report-v3-kicker">Metadata</p>
            <h3>Additional Info</h3>
            <p class="report-v3-meta">Record</p>
            <div class="history-alt-list">
              <div class="history-alt-item"><div class="history-alt-name">Report Type</div><div class="history-alt-score">Automated Scan</div></div>
              <div class="history-alt-item"><div class="history-alt-name">User</div><div class="history-alt-score">Guest</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Scan Date</div><div class="history-alt-score">${summaryGenerated}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Diagnosis Class</div><div class="history-alt-score">${safeDiagnosis}</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Knowledge Base Mode</div><div class="history-alt-score">Offline Clinical Profiles</div></div>
              <div class="history-alt-item"><div class="history-alt-name">Clinical Use</div><div class="history-alt-score">Decision support only; vet confirmation required</div></div>
            </div>
          </article>
        </aside>
      </section>

      <section class="report-v3-card report-v3-compact">
        <p class="report-v3-kicker">Follow-up Timeline</p>
        <h3>Action Schedule</h3>
        ${renderList(followUpItems)}
      </section>

      <section class="report-v3-footnote report-v3-card report-v3-compact">
        <p class="report-v3-kicker">Clinical Basis</p>
        <ul>${summarySource}</ul>
      </section>

      ${alternatives.length ? `
        <section class="report-v3-card report-v3-compact">
          <p class="report-v3-kicker">Other Possibilities</p>
          <div class="history-alt-list">
            ${alternatives.map(item => `
              <div class="history-alt-item">
                <div class="history-alt-name">${escapeHtml(item.name)}</div>
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
        if (evidence) evidence.innerHTML = `<img src="${imgData}" alt="Evidence Image" style="width:100%;height:100%;object-fit:cover;">`;
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
        <p>Run a diagnosis first, then open this tab for complete report details.</p>
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
  if (!confirm('Remove this report from history?')) return;

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
        <div class="history-item-diagnosis" style="font-weight:700; font-size:16px; margin-bottom:4px; color:var(--neutral-100);">${h.topDiagnosis}</div>
        <div class="history-item-date" style="font-size:12px; color:var(--neutral-500); margin-bottom:12px;">${new Date(h.date).toLocaleDateString()}  -  ${new Date(h.date).toLocaleTimeString()}</div>
        <div class="history-item-confidence" style="color:${color}; font-weight:700; font-size:20px;">${h.confidence}% conf.</div>
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
  if (confirm('Are you sure you want to clear all diagnostic history?')) {
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

// Ã¢â€â‚¬Ã¢â€â‚¬ AI Chat Engine Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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
    return `Case ${idx + 1}: ${item.topDiagnosis || 'Unknown case'} | confidence ${item.confidence || 0}% | urgency ${urgency} | date ${item.date}`;
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
  if (disease) {
    return `Offline mode active. Best local match: **${disease.name}**.\n\n- Key signs: ${disease.visualSigns.slice(0, 4).join(', ')}\n- Priority steps now: ${disease.treatment.slice(0, 4).join(', ')}\n- Prevention focus: ${disease.prevention.slice(0, 3).join(', ')}\n- Urgency: ${String(disease.urgency || 'unknown').toUpperCase()}\n\nFor higher-accuracy conversational answers, connect internet and run backend server.`;
  }

  return `Offline mode active. I could not map this query to a specific disease confidently. Please share key signs (fever, discharge, appetite loss, lesions, milk drop) and I will guide with local rules, or connect backend for full AI response.`;
}

async function callLocalBackendAPI(question) {
  const relevantDiseases = getRelevantDiseases(question, 4);
  const diseasesContext = relevantDiseases.map(d => `Disease: ${d.name} (${d.latin})
Description: ${d.desc}
Visual Signs: ${d.visualSigns.join(', ')}
Symptoms: ${d.symptoms.map(findSymptomLabel).join(', ')}
Treatment: ${d.treatment.join(', ')}
Prevention: ${d.prevention.join(', ')}
Severity: ${d.severity.toUpperCase()}
Urgency: ${String(d.urgency || '').toUpperCase()}
Contagious: ${d.contagious}`).join('\n\n');

  const additionalContext = getRelevantKnowledgeBlocks(question).join('\n\n');
  const recentCases = getRecentCaseContext(3);

  const systemPrompt = `You are PASHU CARE AI, a veterinary assistant focused on cattle health.

RESPONSE RULES:
1. Answer ONLY from the provided context. If evidence is weak, say "not enough evidence".
2. Keep output practical and concise: probable cause, why, immediate steps, warning signs, and prevention.
3. Never invent drug dosages. If dosage is requested, advise veterinarian confirmation.
4. If question is emergency-like (severe breathing issue, collapse, heavy bleeding, unable to stand), prioritize emergency referral.
5. Reply in the same language/script used by the user (including Hinglish style if used).
6. If multiple diseases are plausible, rank top 2-3 with brief reasoning.

RELEVANT DISEASE CONTEXT:
${diseasesContext}

RELEVANT GENERAL CONTEXT:
${additionalContext}

RECENT LOCAL CASES:
${recentCases}`;

  const payload = {
    systemPrompt: systemPrompt,
    question: question
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
    .replace(/â€¢/g, '&bull;')
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Theme Toggle Logic Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Dashboard Metrics Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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
      const topDiagnosis = escapeHtml(latest.topDiagnosis || getI18nText('report_unknown_case', 'Unknown case'));
      const visualLine = disease?.visualSigns?.length
        ? escapeHtml(disease.visualSigns[0])
        : escapeHtml(getI18nText('diag_visual_not_available', 'No key visual signs available'));
      dashLatestDiagnosis.innerHTML = `
        <div class="dash-last-report-card">
          <div class="dash-last-report-media" id="dashLatestEvidence">&#128247;</div>
          <div class="dash-last-report-main">
            <div class="dash-report-title">${topDiagnosis}</div>
            <div class="dash-report-visual"><strong>Visual:</strong> ${visualLine}</div>
          </div>
        </div>
        <div class="latest-scan-meta">
          <span class="meta-label">${escapeHtml(getI18nText('dash_last_scan', 'Last Scan'))}</span>
          <span class="meta-value">${formatDashboardTimestamp(latest.date)}</span>
        </div>
        <div class="dash-last-report-bottom">
          <div class="dash-last-thumb-small" id="dashLatestThumbSmall">&#128247;</div>
          <span class="dash-last-bottom-text">${escapeHtml(String(latest.confidence || 0))}% ${escapeHtml(getI18nText('history_confidence_short', 'confidence'))}</span>
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
    const topDiagnosis = safe(entry.item.topDiagnosis || getI18nText('report_unknown_case', 'Unknown case'));
    const confidence = `${entry.confidence}%`;
    const dateText = formatDashboardTimestamp(entry.item.date);
    const severity = entry.disease?.severity ? String(entry.disease.severity).toUpperCase() : 'N/A';
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Nutrient Calculator Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function calculateNutrients() {
  const weight = parseFloat(document.getElementById('calcWeight').value);
  const yieldLiters = parseFloat(document.getElementById('calcYield').value);

  if (!weight || weight < 50 || weight > 1500) {
    alert("Please enter a valid cow weight between 50 and 1500 kg.");
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

// Ã¢â€â‚¬Ã¢â€â‚¬ Feedback System Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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
          <span class="report-card-tag">Diagnostic Report</span>
          <span class="report-card-badge ${badgeClass}">${badgeLabel}</span>
        </div>
        <div class="report-card-title">${escapeHtml(h.topDiagnosis || getI18nText('report_unknown_case', 'Unknown case'))}</div>
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
            <div class="history-row-title">${escapeHtml(h.topDiagnosis || getI18nText('report_unknown_case', 'Unknown case'))}</div>
            <div class="history-row-date">${new Date(h.date).toLocaleDateString()} | ${new Date(h.date).toLocaleTimeString()}</div>
            <div class="history-row-confidence ${confClass}">${h.confidence}% ${getI18nText('history_confidence_short', 'confidence')}</div>
          </div>
        </div>
        <div class="history-row-right">
          <span class="history-row-status ${statusClass}">${statusLabel}</span>
          <span class="history-row-meta">${getI18nText('guest', 'Guest')}</span>
          <div class="history-row-actions">
            <button type="button" class="history-open-btn" onclick="event.stopPropagation(); openReportFromHistory(${i});">${getI18nText('history_open_report', 'View Report')}</button>
            <button type="button" class="history-delete-btn" onclick="removeHistoryItem(${i}, event)" aria-label="Delete Report">&#128465;</button>
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
    alert('Please enter a valid cow weight between 50 and 1500 kg.');
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
    alert("Please enter a message before submitting.");
    return;
  }

  const feedback = JSON.parse(localStorage.getItem('pashucare_feedback') || '[]');
  feedback.unshift({
    date: new Date().toISOString(),
    name: (name || 'Anonymous').trim(),
    message: msg.trim()
  });
  localStorage.setItem('pashucare_feedback', JSON.stringify(feedback.slice(0, 200)));

  alert('Feedback saved locally on this device.');
  document.getElementById('feedName').value = '';
  document.getElementById('feedMsg').value = '';
}

// Ã¢â€â‚¬Ã¢â€â‚¬ Mock Login Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function mockLogin() {
  const btn = document.getElementById('loginBtn');
  if (!btn) return;
  const isLoggedIn = btn.getAttribute('data-logged-in') === 'true';
  if (isLoggedIn) {
    btn.setAttribute('data-logged-in', 'false');
    btn.textContent = "Login / Register";
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    document.querySelector('.user-name').textContent = "Guest";
  } else {
    btn.setAttribute('data-logged-in', 'true');
    btn.textContent = "Logout";
    btn.classList.add('btn-primary');
    btn.classList.remove('btn-secondary');
    document.querySelector('.user-name').textContent = "Local User";
  }
}











