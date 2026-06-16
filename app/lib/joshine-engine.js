// ─────────────────────────────────────────────────────────────────────────────
// joshine-engine.js  v2.0
// Rule-based chatbot with: context tracking, fuzzy matching, follow-up
// resolution, numbered list selection, name capture, multi-intent scoring.
// ─────────────────────────────────────────────────────────────────────────────

// ── KNOWLEDGE BASE ────────────────────────────────────────────────────────────

const KB = {
  company: {
    name: "Canaan Global International",
    tagline: "Commit · Endure · Achieve · Satisfy",
    overview:
      "Canaan Global International is a specialised shipping and logistics company that caters exclusively to the needs of the granite industry. " +
      "The company has extensive experience handling all types of granite, including marble, slate, limestone, and other natural and artificial stone. " +
      "With a focus on providing end-to-end solutions, Canaan delivers reliable and cost-effective turnkey shipping and transportation services to customers across the global stone industry.",
    stoneTypes: ["Granite", "Marble", "Slate", "Limestone", "Natural Stone", "Artificial Stone"],
    address:
      "No. 3/802-123 & 124, Opp. to Emmanuel Believer's Church, Zion Nagar, Theri Road, Pudukottai, Tuticorin – 628103, Tamil Nadu, India",
    email: ["canaanglobal@canaanglobal.com", "tutsal@canaanglobal.com"],
    phone: "+91 90470 12891",
    branches: ["Tuticorin (HQ)", "Chennai", "Madurai", "Cochin"],
    achievements: ["Best Logistics Partner", "AEO Certified", "ISO 9001:2015", "100% Delivery Success"],
    crew: ["Jonathan Davis (Operations Director)", "Sarah Jenkins (Head of Customs Clearance)", "Michael Chen (Logistics Coordinator)", "David Smith (Fleet Manager)", "Emily Davis (Client Relations Manager)"]
  },
  accreditations: {
    title: "Accreditations & Licenses",
    summary: "Canaan holds multiple prestigious licenses and certifications proving our excellence.",
    list: ["Customs Broker License (Official EF Card)", "ISO Certificates", "FFFAI Membership", "Customs Broker Associations in Chennai, Cochin, and Tuticorin", "Bolt Seal & Warner Dealerships"]
  },
  updates: {
    title: "Updates & Circulars",
    summary: "We track Daily Exchange Rates (USD, EUR, GBP, AED) against INR and provide the latest Customs Circulars and notifications for our clients."
  },
  services: {
    transportation: {
      title: "Transportation Services",
      short: "GPS-tracked fleet that moves granite from quarry to destination port — safely and on time.",
      detail:
        "Our transportation division operates a modern, GPS-tracked fleet designed specifically for granite and heavy cargo. Every vehicle is monitored in real-time through our computerised dispatch system, which continuously optimises routes to ensure punctual, damage-free delivery — from the quarry gate all the way to the destination port.",
      features: [
        "Real-time GPS tracking on every vehicle",
        "Computerised dispatch & route optimisation",
        "Quarry-to-port full-chain coverage",
        "On-time delivery with live status updates",
      ],
    },
    cargo: {
      title: "Cargo Management",
      short: "End-to-end project cargo management for heavy, oversized and complex shipments.",
      detail:
        "Handling oversized or multi-leg shipments requires precise coordination across carriers, terminals, and customs authorities. Our project cargo team takes full ownership — from procurement planning through final delivery — making sure nothing slips through the cracks, regardless of cargo weight or complexity.",
      features: [
        "Dedicated project managers for every shipment",
        "Heavy & oversized cargo specialists",
        "Procurement-to-delivery coordination",
        "Complex multi-modal shipment planning",
      ],
    },
    documentation: {
      title: "Documentation & Compliance",
      short: "We handle all international shipping paperwork and regulatory compliance on your behalf.",
      detail:
        "International shipping involves a maze of regulations that differ by country, commodity, and cargo type. Our compliance team is fluent in the rules of every major destination market. We prepare and file all documentation, manage customs declarations, and ensure full regulatory adherence — so your shipment clears without delays.",
      features: [
        "Experts in multi-country shipping regulations",
        "Full documentation preparation & filing",
        "Customs clearance support",
        "Zero-delay compliance at all destinations",
      ],
    },
    lashing: {
      title: "Lashing & Fumigation",
      short: "Wooden lashing, palletisation, crating, Heat Treatment & ISPM-compliant fumigation.",
      detail:
        "Proper securing and phytosanitary treatment are mandatory for most international stone shipments. We manufacture custom wooden crates, apply lashing and palletisation tailored to each consignment, and carry out Heat Treatment and fumigation in strict accordance with ISPM (International Standards for Phytosanitary Measures) norms.",
      features: [
        "Custom wooden lashing & palletisation",
        "Bespoke crating for any cargo dimension",
        "Heat Treatment certification",
        "Fumigation as per ISPM norms",
      ],
    },
  },
  operations: {
    import: {
      title: "Import Operations",
      summary: "A precise 5-step import workflow — from document receipt to final cargo delivery.",
      steps: [
        { num: "01", title: "Document Receipt", desc: "Import documentation is collected and verified from the customer upon shipment arrival." },
        { num: "02", title: "Arrival Confirmation & Bill of Entry Filing", desc: "Cargo arrival status is confirmed and the bill of entry is filed for customs processing." },
        { num: "03", title: "Customs Clearance Processing", desc: "Upon receipt of original shipping documents, import customs clearance procedures are completed." },
        { num: "04", title: "Delivery Order Coordination", desc: "Parallel coordination is carried out with shipping liners to obtain delivery orders efficiently." },
        { num: "05", title: "Final Cargo Delivery", desc: "Cleared import cargo is dispatched and delivered safely to the customer destination." },
      ],
    },
    export: {
      title: "Export Operations",
      summary: "A seamless 5-step export workflow — from document collection to vessel gate-in.",
      steps: [
        { num: "01", title: "Document Collection", desc: "Required export documents are received and verified from the customer for shipment processing." },
        { num: "02", title: "Cargo Readiness Confirmation", desc: "Cargo availability, packing status, and shipment readiness are confirmed prior to movement." },
        { num: "03", title: "Shipping Bill Filing", desc: "Export shipping bill documentation is prepared and filed through customs clearance procedures." },
        { num: "04", title: "Stuffing Plan Coordination", desc: "Container stuffing plans are prepared and coordinated with the operations division for execution." },
        { num: "05", title: "Container Stuffing & Gate-In", desc: "Cargo stuffing is completed securely and containers are gated into the terminal for vessel movement." },
      ],
    },
  },
  ecosystem: {
    overview:
      "The Canaan Global Ecosystem is a network of four specialised divisions that work together to manage the complete logistics and supply chain process — from cargo movement and customs clearance to commercial coordination and transportation.",
    divisions: [
      {
        id: "cgl",
        name: "Canaan Global Logistics (CGL)",
        role: "The operational core responsible for moving cargo efficiently across different transport modes.",
        functions: ["Freight Forwarding", "Multimodal Transportation", "Vessel Operations", "NVOCC Services", "Cargo Consolidation"],
      },
      {
        id: "cgss",
        name: "Canaan Global Shipping Services (CGSS)",
        role: "The customs and compliance division that manages regulatory requirements for international trade.",
        functions: ["Customs Brokerage", "Import & Export Clearance", "Trade Documentation", "Port Clearance Coordination"],
      },
      {
        id: "cgi",
        name: "Canaan Global International (CGI)",
        role: "The commercial and administrative hub that supports the wider Canaan network.",
        functions: ["Nominations & Coordination", "Billing Management", "Invoice Processing", "Commercial Transport Administration", "Internal Operational Integration"],
      },
      {
        id: "rehoboth",
        name: "Rehoboth Transports",
        role: "The transportation arm responsible for ground logistics and fleet operations.",
        functions: ["Cargo Transportation", "Fleet Coordination", "Raw Material Movement", "External Logistics Support", "Integrated Transport Handling"],
        billing: "External raw material transportation is billed through Rehoboth. When CHA (customs) services are involved, billing is processed through CGI.",
      },
    ],
  },
};

// Numbered list order for services
const SERVICE_LIST = ["transportation", "documentation", "warehousing", "lashing", "nvocc", "rfid"];

// ── TELEMETRY ─────────────────────────────────────────────────────────────────

/**
 * Log missed queries for telemetry.
 * In a production environment, this should hit an analytics webhook.
 */
function logFallback(_query) {
  if (process.env.NODE_ENV === "development") {
    console.warn("[Joshine] Fallback triggered");
  }
  // Example Webhook integration for the future:
  // fetch("https://your-webhook-url.com/analytics", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ event: "fallback", query, timestamp: new Date() })
  // }).catch(() => {});
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[''‘’`]/g, "'")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Abbreviation / shorthand expansion table ──────────────────────────────────
const ABBREV = {
  // Division abbreviations
  cgl: "canaan global logistics freight forwarding multimodal",
  cgss: "canaan global shipping services customs brokerage port clearance",
  cgi: "canaan global international billing nominations commercial",
  // Industry terms
  cha: "customs house agent customs brokerage",
  nvocc: "non vessel operating common carrier freight forwarding",
  ispm: "fumigation phytosanitary heat treatment",
  gps: "tracking real time visibility",
  hq: "headquarters office address",
  // Shorthand
  pls: "please",
  plz: "please",
  thx: "thanks",
  ty: "thank you",
  asap: "urgent immediately",
  doc: "documentation documents",
  docs: "documentation documents",
  imp: "import",
  exp: "export",
  fwd: "freight forwarding",
  // Informal
  u: "you",
  ur: "your",
  r: "are",
  wanna: "want to",
  gonna: "going to",
  wut: "what",
  wat: "what",
  hw: "how",
};

// ── Synonym Expansion & Stemming ─────────────────────────────────────────────
const SYNONYMS = {
  // Pricing
  quote: "pricing", cost: "pricing", fee: "pricing", fees: "pricing", price: "pricing", prices: "pricing",
  // Transportation & Shipping
  haul: "transportation", ship: "transportation", carry: "transportation", move: "transportation",
  shipping: "transportation", shipped: "transportation", ships: "transportation",
  transporting: "transportation", transported: "transportation", transports: "transportation",
  // Documentation
  clearance: "documentation", paperwork: "documentation", documents: "documentation",
  // Accreditations & Updates
  licenses: "license", licensed: "license",
  accreditations: "accreditation", accredited: "accreditation",
  certifications: "certification", certified: "certification",
  circulars: "circular", updates: "update",
  // Achievements & Complaints
  achievements: "achievement", achieved: "achievement",
  complaints: "complaint", complaining: "complaint", complained: "complaint"
};

/**
 * Preprocess user input:
 * 1. Collapse repeated characters (heeelp → help)
 * 2. Expand abbreviations and synonyms token by token
 * 3. Normalize (lowercase, strip punctuation)
 */
function preprocess(raw) {
  // Collapse 3+ repeated chars to 2 ("soooo" → "soo", "heeelp" → "heelp")
  let text = raw.replace(/(.)(\1{2,})/g, "$1$1");
  // Normalize first
  text = normalize(text);
  // Expand abbreviations and synonyms
  const tokens = text.split(" ");
  const expanded = tokens.flatMap((t) => {
    let e = ABBREV[t];
    if (!e && SYNONYMS[t]) e = SYNONYMS[t];
    return e ? e.split(" ") : [t];
  });
  return expanded.join(" ");
}

// Levenshtein distance (for fuzzy keyword matching)
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// Returns true if any token in the normalised input is within edit distance
// of any word in `keywords`. Dynamic threshold based on length prevents aggressive false positives.
function fuzzyHit(norm, keywords) {
  const tokens = norm.split(" ");
  return keywords.some((kw) =>
    tokens.some((tok) => {
      if (tok === kw) return true;
      if (tok.length < 4 || kw.length < 4) return false;
      // Dynamic threshold: 1 error for 4-6 char words, 2 errors for 7+ char words
      const maxErrors = Math.max(tok.length, kw.length) > 6 ? 2 : 1;
      return levenshtein(tok, kw) <= maxErrors;
    })
  );
}

// ── Context-aware score boosting ──────────────────────────────────────────────
// When the user is already in a topic conversation, boost related intents
const CONTEXT_BOOSTS = {
  import_ops:   ["documentation", "div_cgss", "export_ops"],
  export_ops:   ["documentation", "lashing", "div_cgss", "import_ops"],
  div_cgl:      ["transportation", "cargo", "ecosystem", "div_rehoboth"],
  div_cgss:     ["documentation", "import_ops", "export_ops"],
  div_cgi:      ["div_cgss", "pricing", "ecosystem"],
  div_rehoboth: ["transportation", "div_cgl", "cargo", "fleet"],
  ecosystem:    ["div_cgl", "div_cgss", "div_cgi", "div_rehoboth"],
  transportation: ["cargo", "div_cgl", "div_rehoboth", "cargo_types", "fleet"],
  cargo:        ["transportation", "div_cgl", "cargo_types"],
  cargo_types:  ["cargo", "granite", "transportation"],
  fleet:        ["transportation", "div_rehoboth"],
  documentation: ["import_ops", "export_ops", "div_cgss"],
  lashing:      ["documentation", "export_ops"],
  about:        ["ecosystem", "branches", "granite", "crew", "achievements", "accreditations"],
  granite:      ["cargo_types", "transportation"],
  accreditations: ["about", "documentation", "ecosystem"],
  updates:      ["import_ops", "export_ops", "documentation"],
  crew:         ["about", "ecosystem", "branches"],
  achievements: ["about", "ecosystem"],
};

function boostForContext(scores, ctx) {
  if (!ctx?.lastTopic) return scores;
  const related = CONTEXT_BOOSTS[ctx.lastTopic] || [];
  const boosted = { ...scores };
  for (const id of related) {
    if (boosted[id] !== undefined) {
      boosted[id] = Math.ceil(boosted[id] * 1.5);
    }
  }
  return boosted;
}

// ── Intent → chip label map (for smart fallback) ─────────────────────────────
const INTENT_LABELS = {
  transportation: "Transportation",
  cargo: "Cargo Management",
  cargo_types: "What We Carry",
  fleet: "Our Fleet",
  documentation: "Documentation",
  lashing: "Lashing & Fumigation",
  import_ops: "Import Process",
  export_ops: "Export Process",
  ecosystem: "The Ecosystem",
  div_cgl: "About CGL",
  div_cgss: "About CGSS",
  div_cgi: "About CGI",
  div_rehoboth: "About Rehoboth",
  contact: "Contact Us",
  pricing: "Get a Quote",
  branches: "Our Branches",
  about: "About Canaan",
  services_list: "Our Services",
  working_hours: "Working Hours",
  granite: "Granite Industry",
  accreditations: "Accreditations",
  updates: "Latest Updates",
  achievements: "Our Achievements",
  crew: "Our Crew",
};

/**
 * Build a smart near-miss fallback that suggests the closest topics
 * instead of a generic "I don't understand".
 */
function buildSmartFallback(scores) {
  const candidates = Object.entries(scores)
    .filter(([id]) => INTENT_LABELS[id])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (candidates.length === 0) return RESPONSES.fallback();

  const topLabel = INTENT_LABELS[candidates[0][0]];
  const chips = [
    ...candidates.map(([id]) => INTENT_LABELS[id]).filter(Boolean),
    "Our Services",
  ].slice(0, 4);

  return {
    text:
      pickOne([
        `Hmm, I didn't quite catch that. 🤔\n\nDid you mean to ask about *${topLabel}*?`,
        `I'm not sure I understood that fully.\n\nMaybe you were asking about *${topLabel}*?`,
      ]) + "\n\nTry one of these:",
    chips,
  };
}

// ── INTENT DEFINITIONS ────────────────────────────────────────────────────────
// Each intent has:
//   keywords  – array of { w (weight), p (regex) }
//   fuzzy     – optional array of { kw (string[]), w } for edit-distance matching

const INTENTS = [
  // ── Greeting ──
  {
    id: "greeting",
    keywords: [
      { w: 3, p: /\b(hi|hello|hey|howdy|hiya)\b/ },
      { w: 2, p: /\bgood\s*(morning|afternoon|evening|day)\b/ },
      { w: 1, p: /\b(greetings|sup|yo|what'?s\s*up)\b/ },
    ],
  },

  // ── Farewell ──
  {
    id: "farewell",
    keywords: [
      { w: 3, p: /\b(bye|goodbye|see\s*ya|see\s*you|take\s*care|ciao)\b/ },
      { w: 1, p: /\b(later|good\s*night|have\s*a\s*good)\b/ },
    ],
  },

  // ── Thanks ──
  {
    id: "thanks",
    keywords: [
      { w: 3, p: /\b(thank\s*you|thanks|thank\s*u|thx|ty)\b/ },
      { w: 1, p: /\b(appreciate|helpful|perfect|great|awesome|nice|brilliant|cool|superb)\b/ },
    ],
  },

  // ── Help / General inquiry ──
  {
    id: "help",
    keywords: [
      { w: 3, p: /\bhelp\b/ },
      { w: 3, p: /\bwhat\s*can\s*you\s*(do|help|assist)\b/ },
      { w: 3, p: /\bhow\s*can\s*(i|you)\s*(help|assist|use|get)\b/ },
      { w: 2, p: /\b(options|menu|capabilities|features?)\b/ },
      { w: 2, p: /\bi\s*need\s*(help|assistance|support)\b/ },
      { w: 2, p: /\b(assist|assistance|support)\b/ },
      { w: 1, p: /\bguide\s*me\b/ },
    ],
  },

  // ── Services list ──
  {
    id: "services_list",
    keywords: [
      { w: 5, p: /\bservices?\b/ },
      { w: 4, p: /\bwhat\s*do\s*you\s*(do|offer|provide|handle|cover|deal|manage)\b/ },
      { w: 4, p: /\bwhat\s*(do|can)\s*(you|guys|canaan)\s*(do|offer|handle|provide|cover)\b/ },
      { w: 4, p: /\bwhat\s*(you|guys|canaan)\s*(handle|offer|do|cover|deal\s*with|manage)\b/ },
      { w: 4, p: /\bwhat\s*(are\s*your|your)\s*(services?|offerings?|solutions?)\b/ },
      { w: 3, p: /\b(handle|handles|handling)\b/ },
      { w: 3, p: /\b(deal\s*with|dealing\s*with)\b/ },
      { w: 3, p: /\bwhat\s*(industries|areas|sectors|fields)\b/ },
      { w: 3, p: /\ball\s*(your\s*)?(services?|offerings?|solutions?)\b/ },
      { w: 3, p: /\b(speciali[sz]e|speciali[sz]ation)\b/ },
      { w: 3, p: /\bwhat\s*kind\s*of\b/ },
      { w: 2, p: /\b(offer|provide|capabilities|solutions?)\b/ },
      { w: 2, p: /\byou\s*(guys?|all|team|company)\s*(do|offer|handle|cover|provide)\b/ },
      { w: 2, p: /\b(ship|shipping|logistics|freight)\b/ },
      { w: 1, p: /\bwhat\s*else\b/ },
    ],
  },

  // ── Transportation ──
  {
    id: "transportation",
    keywords: [
      { w: 5, p: /\btransport(ation)?\b/ },
      { w: 4, p: /\b(truck|fleet|vehicle|gps)\b/ },
      { w: 3, p: /\b(deliver|delivery|dispatch|route)\b/ },
      { w: 3, p: /\b(quarry|port|shipment)\b/ },
      { w: 3, p: /\bhow\s*(do\s*you|does)\s*(transport|move|deliver|ship)\b/ },
      { w: 2, p: /\b(move|moving|carry|carrying|transfer)\b/ },
      { w: 2, p: /\b(track|tracking|real\s*time)\b/ },
      { w: 2, p: /\bhow\s*(is|are)\s*(cargo|goods|shipment)\s*(moved|transported|delivered)\b/ },
      { w: 1, p: /\b(road|ground|land)\s*(transport|logistics|movement)\b/ },
    ],
    fuzzy: [{ kw: ["transportation", "transport", "logistics"], w: 2 }],
  },

  // ── Cargo ──
  {
    id: "cargo",
    keywords: [
      { w: 5, p: /\bcargo\b/ },
      { w: 4, p: /\b(heavy|oversized|oversize)\b/ },
      { w: 4, p: /\bproject\s*cargo\b/ },
      { w: 3, p: /\bcomplex\s*shipment\b/ },
      { w: 3, p: /\b(coordinate|coordination|procurement)\b/ },
      { w: 3, p: /\bheavy\s*(goods?|load|shipment|cargo)\b/ },
      { w: 2, p: /\b(large|big|massive|bulky)\s*(load|shipment|cargo|goods?)\b/ },
      { w: 2, p: /\bhow\s*do\s*(you\s*)?manage\b/ },
      { w: 1, p: /\bfreight\s*management\b/ },
    ],
    fuzzy: [{ kw: ["cargo", "freight"], w: 2 }],
  },

  // ── Documentation ──
  {
    id: "documentation",
    keywords: [
      { w: 5, p: /\bdocument(ation|s)?\b/ },
      { w: 5, p: /\bcompliance\b/ },
      { w: 4, p: /\bcustoms?\b/ },
      { w: 3, p: /\b(regulat|regulations?)\b/ },
      { w: 3, p: /\b(paperwork|permit|clearance|licen[sc]e)\b/ },
      { w: 3, p: /\bhow\s*(do\s*you\s*)?(handle|manage)\s*(customs?|documents?|compliance)\b/ },
      { w: 2, p: /\b(rules?|requirements?|laws?)\b/ },
      { w: 2, p: /\binternational\s*(rules?|laws?|standards?)\b/ },
      { w: 2, p: /\b(filing|file|filed)\b/ },
    ],
    fuzzy: [{ kw: ["documentation", "compliance", "customs"], w: 2 }],
  },

  // ── Lashing & fumigation ──
  {
    id: "lashing",
    keywords: [
      { w: 5, p: /\blash(ing)?\b/ },
      { w: 5, p: /\bfumigat(e|ion)?\b/ },
      { w: 5, p: /\bispm\b/ },
      { w: 4, p: /\bpalleti[sz](ation|e)?\b/ },
      { w: 4, p: /\bcrat(e|ing)\b/ },
      { w: 4, p: /\bheat\s*treat(ment)?\b/ },
      { w: 3, p: /\bwooden\s*(lash|crate|pallet)\b/ },
      { w: 2, p: /\bwooden\b/ },
      { w: 2, p: /\bpack(aging|ing|ed)?\b/ },
      { w: 2, p: /\bsecur(e|ing|ity)\b/ },
      { w: 1, p: /\bphytosanitary\b/ },
    ],
    fuzzy: [{ kw: ["lashing", "fumigation", "palletisation"], w: 2 }],
  },

  // ── Contact ──
  {
    id: "contact",
    keywords: [
      { w: 4, p: /\bcontact\b/ },
      { w: 4, p: /\b(phone|call|ring|number)\b/ },
      { w: 4, p: /\b(email|mail|e-mail)\b/ },
      { w: 3, p: /\b(reach|touch|speak|talk|connect)\b/ },
      { w: 3, p: /\bhow\s*(do|can)\s*i\s*(reach|contact|get\s*in\s*touch)\b/ },
      { w: 2, p: /\bget\s*in\s*touch\b/ },
      { w: 2, p: /\bi\s*want\s*to\s*(talk|speak|call|connect)\b/ },
      { w: 1, p: /\b(enquir[ey]|inquiry|inquire)\b/ },
    ],
  },

  // ── Address ──
  {
    id: "address",
    keywords: [
      { w: 5, p: /\baddress\b/ },
      { w: 4, p: /\b(location|located|situated)\b/ },
      { w: 4, p: /\bwhere\s*(are\s*you|is\s*(the\s*)?(office|company|hq|headquarter))\b/ },
      { w: 3, p: /\b(hq|headquarter)\b/ },
      { w: 2, p: /\bfind\s*(you|us)\b/ },
      { w: 2, p: /\bvisit\s*(you|us|office|canaan)\b/ },
      { w: 1, p: /\btuticorin\b/ },
    ],
  },

  // ── Branches ──
  {
    id: "branches",
    keywords: [
      { w: 5, p: /\bbranch(es)?\b/ },
      { w: 4, p: /\b(chennai|madurai|cochin|kochi)\b/ },
      { w: 3, p: /\b(offices?|locations?|cities?)\b/ },
      { w: 3, p: /\bwhere\s*(are\s*your|do\s*you\s*have)\s*(offices?|branches?|locations?)\b/ },
      { w: 2, p: /\bwhere\s*else\b/ },
      { w: 2, p: /\bother\s*(office|location|city|state)\b/ },
    ],
  },

  // ── About ──
  {
    id: "about",
    keywords: [
      { w: 4, p: /\babout\b/ },
      { w: 4, p: /\bwho\s*(are\s*you|is\s*canaan)\b/ },
      { w: 3, p: /\btell\s*me\b/ },
      { w: 3, p: /\bcanaan\s*global\b/ },
      { w: 3, p: /\bwhat\s*(is|does)\s*canaan\b/ },
      { w: 3, p: /\bwhat\s*kind\s*of\s*(company|firm|business)\b/ },
      { w: 2, p: /\b(overview|background|specialised|specialized)\b/ },
      { w: 2, p: /\b(turnkey|end.to.end|end\s*to\s*end)\b/ },
      { w: 2, p: /\bstone\s*(industry|company|logistics)\b/ },
      { w: 1, p: /\b(company|founded|established|history|experience)\b/ },
    ],
  },

  // ── Granite / Stone types ──
  {
    id: "granite",
    keywords: [
      { w: 5, p: /\bgranite\b/ },
      { w: 4, p: /\b(marble|slate|limestone)\b/ },
      { w: 3, p: /\bnatural\s*stone\b/ },
      { w: 3, p: /\bartificial\s*stone\b/ },
      { w: 3, p: /\bstone\s*(industry|shipping|export|trade|type)\b/ },
      { w: 2, p: /\bdo\s*you\s*(handle|ship|transport|export|deal\s*with)\s*(granite|marble|stone|slate|limestone)\b/ },
      { w: 2, p: /\bstone\b/ },
      { w: 2, p: /\b(quarry|quarries)\b/ },
      { w: 1, p: /\bmineral\b/ },
    ],
    fuzzy: [{ kw: ["granite", "marble", "limestone", "slate"], w: 2 }],
  },

  // ── Cargo Types / What we carry ──
  {
    id: "cargo_types",
    keywords: [
      // Direct intent questions
      { w: 6, p: /\bwhat\s*(cargo|goods?|products?)\s*(do\s*you\s*)?(carry|handle|ship|transport|move|accept)\b/ },
      { w: 6, p: /\bwhat\s*(type|kind|sort|variety|varieties)\s*of\s*(cargo|goods?|shipment|freight)\b/ },
      { w: 5, p: /\b(cargo\s*types?|cargo\s*categor(y|ies)|types?\s*of\s*cargo)\b/ },
      { w: 5, p: /\bdo\s*you\s*(carry|ship|handle|transport|accept)\b/ },
      { w: 5, p: /\bcan\s*you\s*(ship|carry|handle|transport|move)\b/ },
      // Coir & Natural Fibre
      { w: 5, p: /\bcoir\b/ },
      { w: 4, p: /\bnatural\s*fib(re|er)\b/ },
      { w: 3, p: /\bcoconut\s*fib(re|er)\b/ },
      // Agricultural Machinery
      { w: 5, p: /\bagricultural\s*machine(ry|s?)\b/ },
      { w: 4, p: /\b(tractor|tractors)\b/ },
      { w: 4, p: /\bfarm\s*(equipment|machine(ry|s?)|implement)\b/ },
      // Palletised Cargo
      { w: 5, p: /\bpallet(s|ised|ized)?\s*cargo\b/ },
      { w: 4, p: /\bshrink\s*wrap\b/ },
      // Industrial Rolls & Coils
      { w: 5, p: /\bindustrial\s*(rolls?|coils?)\b/ },
      { w: 4, p: /\b(hdpe|geotextile|geotextiles?)\b/ },
      { w: 3, p: /\b(reels?|coils?)\b/ },
      // Chemical Drums & Barrels
      { w: 5, p: /\bchemical\s*(drums?|barrels?)\b/ },
      { w: 4, p: /\b(drums?|barrels?)\b/ },
      { w: 3, p: /\bregulated\s*(liquid|cargo|goods?)\b/ },
      // Bulk Grain & Seeds
      { w: 5, p: /\bbulk\s*(grain|seeds?|rice)\b/ },
      { w: 4, p: /\b(grain|grains|seeds?|rice)\b/ },
      // Bagged Cargo
      { w: 5, p: /\bbagged\s*cargo\b/ },
      { w: 4, p: /\b(pp\s*sack|sacks?|bagged|bags?)\s*(cargo|goods?)?\b/ },
      // Bale Cargo
      { w: 5, p: /\bbale\s*cargo\b/ },
      { w: 4, p: /\b(bales?|baling)\b/ },
      // Cashew & Agri Commodities
      { w: 5, p: /\bcashew\b/ },
      { w: 4, p: /\bagri\s*commodit(y|ies)\b/ },
      { w: 3, p: /\b(nuts?|jute|produce)\b/ },
      // Pipes
      { w: 5, p: /\b(pipes?|pipeline)\b/ },
      // Heavy Machinery
      { w: 5, p: /\bheavy\s*machine(ry|s?)\b/ },
      { w: 5, p: /\b(jcb|excavator|bulldozer|backhoe)\b/ },
      { w: 4, p: /\bconstruction\s*(equipment|machine(ry|s?)|vehicle)\b/ },
      // Bulk Liquid & Gas
      { w: 5, p: /\bbulk\s*(liquid|gas)\s*cargo\b/ },
      { w: 4, p: /\b(iso\s*tank|tanker|pressuri[sz]ed\s*vessel)\b/ },
      { w: 3, p: /\bliquid\s*cargo\b/ },
      // Special Cargo
      { w: 4, p: /\bspecial\s*cargo\b/ },
      { w: 3, p: /\bwhat\s*(all\s*)?(do\s*you|can\s*you)\s*(ship|carry|handle|accept)\b/ },
      { w: 3, p: /\bwhat\s*(goods?|items?|products?)\s*(do\s*you|can\s*you)\b/ },
    ],
    fuzzy: [{ kw: ["coir", "cashew", "grain", "pallet", "bale", "coil", "drum", "tractor"], w: 3 }],
  },

  // ── Fleet / Vehicles ──
  {
    id: "fleet",
    keywords: [
      { w: 6, p: /\b(fleet|vehicles?)\b/ },
      { w: 5, p: /\b(truck|trucks|lorry|lorries)\b/ },
      { w: 5, p: /\b(trailer|trailers)\b/ },
      { w: 4, p: /\bhow\s*many\s*(trucks?|vehicles?|trailers?|lorr(y|ies))\b/ },
      { w: 4, p: /\b(wheeler|wheelers)\b/ },
      { w: 4, p: /\bwhat\s*(trucks?|vehicles?|trailers?)\b/ },
      { w: 3, p: /\b(10|12|14|18|22)\s*wheeler\b/ },
      { w: 3, p: /\bcontainer\s*trailer\b/ },
      { w: 2, p: /\b(capacit(y|ies)|tonnes?|tons?)\b/ },
      { w: 2, p: /\brehoboth\s*transport\b/ },
    ],
    fuzzy: [{ kw: ["truck", "vehicle", "fleet", "trailer", "lorry"], w: 3 }],
  },

  // ── Pricing / Quote ──
  {
    id: "pricing",
    keywords: [
      { w: 5, p: /\b(price|pricing|cost|costs|rate|rates)\b/ },
      { w: 5, p: /\b(quote|quotation)\b/ },
      { w: 4, p: /\b(charge|charges|fee|fees)\b/ },
      { w: 4, p: /\bhow\s*much\b/ },
      { w: 3, p: /\bwhat\s*(will|does)\s*it\s*(cost|charge|take)\b/ },
      { w: 3, p: /\bwhat'?s\s*the\s*(cost|price|rate|charge)\b/ },
      { w: 2, p: /\baffordable\b/ },
      { w: 2, p: /\bget\s*a\s*(quote|price|estimate)\b/ },
    ],
  },

  // ── Working hours ──
  {
    id: "working_hours",
    keywords: [
      { w: 4, p: /\b(hours?|timing|timings)\b/ },
      { w: 4, p: /\b(open|closed|available)\b/ },
      { w: 3, p: /\bare\s*you\s*(open|available|closed)\b/ },
      { w: 2, p: /\b(when|what\s*time)\b/ },
      { w: 1, p: /\bschedule\b/ },
    ],
  },

  // ── Urgency ──
  {
    id: "urgency",
    keywords: [
      { w: 5, p: /\b(urgent|urgently|emergency|asap|immediately|right\s*now)\b/ },
      { w: 3, p: /\bcritical\b/ },
      { w: 2, p: /\bhelp\s*me\s*now\b/ },
      { w: 2, p: /\btime\s*sensitive\b/ },
    ],
  },

  // ── Follow-up ──
  {
    id: "followup",
    keywords: [
      { w: 4, p: /\b(more|elaborate|details?|detailed|explain|tell\s*me\s*more)\b/ },
      { w: 3, p: /\b(go\s*on|continue|expand|what\s*else|and\s*then)\b/ },
      { w: 2, p: /\b(further|additional|more\s*info|deeper)\b/ },
      { w: 2, p: /\bhow\s*does\s*that\s*work\b/ },
      { w: 1, p: /\bin\s*(depth|detail)\b/ },
    ],
  },

  // ── Affirmation ──
  {
    id: "affirmation",
    keywords: [
      { w: 3, p: /\b(yes|yeah|yep|yup|sure|okay|ok|alright|absolutely|definitely)\b/ },
      { w: 1, p: /\b(please|go\s*ahead|sure\s*thing|sounds\s*good)\b/ },
    ],
  },

  // ── Negation ──
  {
    id: "negation",
    keywords: [
      { w: 3, p: /\b(no|nope|nah|not\s*really|no\s*thanks|nevermind|never\s*mind)\b/ },
      { w: 1, p: /\bnot\s*interested\b/ },
    ],
  },

  // ── Chitchat: how are you ──
  {
    id: "chitchat_howru",
    keywords: [
      { w: 3, p: /\bhow\s*are\s*you\b/ },
      { w: 3, p: /\bhow'?s\s*it\s*(going|been)\b/ },
      { w: 2, p: /\bare\s*you\s*(okay|fine|well|good)\b/ },
    ],
  },

  // ── Chitchat: who are you / what is your name ──
  {
    id: "chitchat_name",
    keywords: [
      { w: 4, p: /\bwhat'?s?\s*(your|ur)\s*name\b/ },
      { w: 4, p: /\bwho\s*are\s*you\b/ },
      { w: 3, p: /\bare\s*you\s*(an?\s*)?(bot|ai|robot|human|real|virtual|assistant)\b/ },
      { w: 2, p: /\bwhat\s*are\s*you\b/ },
    ],
  },

  // ── Complaint ──
  {
    id: "lashing",
    keywords: [
      { w: 10, p: /\b(lash|lashing|fumigation|fumigate|pallet|palletisation|crate|crating|ispm|heat treatment)\b/i },
    ],
  },
  {
    id: "warehousing",
    keywords: [
      { w: 10, p: /\b(warehouse|warehousing|storage|store)\b/i },
    ],
  },
  {
    id: "nvocc",
    keywords: [
      { w: 10, p: /\b(nvocc|steamer|vessel agent|ship agency)\b/i },
    ],
  },
  {
    id: "rfid",
    keywords: [
      { w: 10, p: /\b(rfid|seal|seals|e-seal|bolt seal|warner)\b/i },
    ],
  },
  {
    id: "complaint",
    keywords: [
      { w: 3, p: /\b(complain|complaint|disappointed|frustrated|angry|upset)\b/ },
      { w: 2, p: /\b(bad|terrible|poor|worst|awful)\s*(service|experience|response)?\b/ },
      { w: 2, p: /\b(issue|problem|trouble)\b/ },
    ],
  },

  // ── Accreditations ──
  {
    id: "accreditations",
    keywords: [
      { w: 5, p: /\b(accreditation|accreditations|certifications?|licenses?)\b/ },
      { w: 4, p: /\b(certified|iso|fffai|aeo)\b/ },
      { w: 4, p: /\b(dealership|bolt\s*seal|warner)\b/ },
      { w: 3, p: /\b(customs\s*broker\s*license|broker\s*license)\b/ },
    ],
    fuzzy: [{ kw: ["accreditations", "certifications", "licenses"], w: 3 }],
  },

  // ── Updates ──
  {
    id: "updates",
    keywords: [
      { w: 5, p: /\b(updates?|circulars?|news|exchange\s*rates?|currencies)\b/ },
      { w: 4, p: /\blatest\s*(news|updates|circulars)\b/ },
      { w: 3, p: /\b(usd|eur|gbp|aed|inr|dollar|euro)\b/ },
    ],
    fuzzy: [{ kw: ["updates", "circulars", "exchange"], w: 3 }],
  },

  // ── Achievements ──
  {
    id: "achievements",
    keywords: [
      { w: 5, p: /\b(achievements?|awards?|success\s*rate)\b/ },
      { w: 4, p: /\b(best\s*logistics|aeo\s*certified)\b/ },
      { w: 3, p: /\bwhat\s*have\s*you\s*(achieved|won|accomplished)\b/ },
    ],
  },

  // ── Crew ──
  {
    id: "crew",
    keywords: [
      { w: 5, p: /\b(crew|team|staff|employees?)\b/ },
      { w: 4, p: /\bwho\s*(works|runs|manages)\b/ },
      { w: 3, p: /\byour\s*(people|team|crew)\b/ },
    ],
  },

  // ── Import operations ──
  {
    id: "import_ops",
    keywords: [
      { w: 5, p: /\bimport(s|ing|ation)?\b/ },
      { w: 4, p: /\bimport\s*(process|workflow|operations?|procedure|steps?)\b/ },
      { w: 4, p: /\bhow\s*(do|does|is)\s*(import|importing)\s*(work|done|handled)\b/ },
      { w: 3, p: /\bbill\s*of\s*entry\b/ },
      { w: 3, p: /\bdelivery\s*order\b/ },
      { w: 2, p: /\bincoming\s*(cargo|shipment|goods)\b/ },
      { w: 2, p: /\b(import|inbound)\s*(clearance|customs)\b/ },
      { w: 1, p: /\bhow\s*do(es)?\s*(import|importing)\b/ },
    ],
    fuzzy: [{ kw: ["import", "importing", "imports"], w: 3 }],
  },

  // ── Export operations ──
  {
    id: "export_ops",
    keywords: [
      { w: 5, p: /\bexport(s|ing|ation)?\b/ },
      { w: 4, p: /\bexport\s*(process|workflow|operations?|procedure|steps?)\b/ },
      { w: 4, p: /\bhow\s*(do|does|is)\s*(export|exporting)\s*(work|done|handled)\b/ },
      { w: 3, p: /\bshipping\s*bill\b/ },
      { w: 3, p: /\bstuffing\s*(plan|container)?\b/ },
      { w: 3, p: /\bgate\s*in\b/ },
      { w: 2, p: /\boutbound\s*(cargo|shipment|goods)\b/ },
      { w: 2, p: /\b(export|outbound)\s*(clearance|customs)\b/ },
      { w: 1, p: /\bhow\s*do(es)?\s*(export|exporting)\b/ },
    ],
    fuzzy: [{ kw: ["export", "exporting", "exports"], w: 3 }],
  },

  // ── Canaan Ecosystem overview ──
  {
    id: "ecosystem",
    keywords: [
      { w: 5, p: /\becosystem\b/ },
      { w: 4, p: /\bdivision(s)?\b/ },
      { w: 3, p: /\b(structure|network|group|family|entity|entities|subsidiaries?)\b/ },
      { w: 3, p: /\bhow\s*(is|are)\s*canaan\s*(structured|organised|organized|set\s*up)\b/ },
      { w: 2, p: /\bcanaan\s*(group|network|companies|entities)\b/ },
      { w: 2, p: /\bhow\s*many\s*(divisions?|companies?|arms?)\b/ },
      { w: 1, p: /\b(cgl|cgss|cgi|rehoboth)\b/ },
    ],
  },

  // ── CGL ──
  {
    id: "div_cgl",
    keywords: [
      { w: 5, p: /\bcgl\b/ },
      { w: 5, p: /\bcanaan\s*global\s*logistics\b/ },
      { w: 3, p: /\b(freight\s*forwarding|multimodal|nvocc|consolidation)\b/ },
      { w: 2, p: /\bvessel\s*operations?\b/ },
      { w: 2, p: /\bfreight\s*(management|handling|services?)\b/ },
      { w: 1, p: /\bfreight\b/ },
    ],
    fuzzy: [{ kw: ["logistics", "forwarding"], w: 2 }],
  },

  // ── CGSS ──
  {
    id: "div_cgss",
    keywords: [
      { w: 5, p: /\bcgss\b/ },
      { w: 5, p: /\bcanaan\s*global\s*shipping\s*services\b/ },
      { w: 4, p: /\bcustoms\s*brokerage\b/ },
      { w: 4, p: /\bport\s*clearance\b/ },
      { w: 3, p: /\btrade\s*documentation\b/ },
      { w: 2, p: /\bcustoms?\s*(house|agent|broker)\b/ },
      { w: 1, p: /\bcha\b/ },
    ],
  },

  // ── CGI ──
  {
    id: "div_cgi",
    keywords: [
      { w: 5, p: /\bcgi\b/ },
      { w: 5, p: /\bcanaan\s*global\s*international\b/ },
      { w: 3, p: /\b(nominations?|billing\s*management|invoice\s*processing)\b/ },
      { w: 2, p: /\bcommercial\s*(hub|admin|administration)\b/ },
      { w: 2, p: /\b(billing|invoic(e|ing))\b/ },
      { w: 1, p: /\boperational\s*integration\b/ },
    ],
  },

  // ── Rehoboth Transports ──
  {
    id: "div_rehoboth",
    keywords: [
      { w: 5, p: /\brehoboth\b/ },
      { w: 4, p: /\brehoboth\s*transports?\b/ },
      { w: 3, p: /\b(fleet\s*coordination|raw\s*material\s*movement)\b/ },
      { w: 2, p: /\bexternal\s*logistics\b/ },
      { w: 2, p: /\bground\s*logistics\b/ },
      { w: 1, p: /\btransportation\s*arm\b/ },
    ],
    fuzzy: [{ kw: ["rehoboth"], w: 3 }],
  },
];

// ── RESPONSE BUILDERS ─────────────────────────────────────────────────────────

const RESPONSES = {
  greeting: (ctx) => ({
    text: ctx?.name
      ? pickOne([
          `Welcome back, ${ctx.name}! 🌊 How can I help you today?`,
          `Good to have you back, ${ctx.name}! What can I do for you?`,
        ])
      : pickOne([
          "Hello! I'm Joshine — your Canaan logistics guide. 🌊\nAsk me anything about our services, cargo, or operations!",
          "Hey there! Welcome to Canaan Global International. 🚢\nWhat would you like to know today?",
          "Hi! I'm Joshine. ✨\nI'm here to help you explore Canaan's world-class logistics services.",
        ]),
    chips: ["Our Services", "What We Carry", "Contact Us"],
  }),

  farewell: () => ({
    text: "Thanks for visiting Canaan Global International! 🚢\nSafe travels — come back anytime. We're always here to help.",
    chips: ["Restart Chat", "Our Services"],
  }),

  thanks: (ctx) => ({
    text: ctx?.name
      ? pickOne([
          `You're welcome, ${ctx.name}! 😊 Anything else I can help with?`,
          `Happy to help, ${ctx.name}! Let me know if you need anything else.`,
        ])
      : pickOne([
          "You're very welcome! 😊 Anything else I can help with?",
          "Happy to help! Let me know if you have more questions.",
          "Anytime! Feel free to ask anything else about our services.",
        ]),
    chips: ["Our Services", "Contact Us"],
  }),

  help: () => ({
    text:
      "Sure, here's what I can help you with:\n\n" +
      "🚛  Transportation Services\n" +
      "🏗️  Cargo Management\n" +
      "📋  Documentation & Compliance\n" +
      "🪵  Lashing & Fumigation\n" +
      "📦  Import Process\n" +
      "🚢  Export Process\n" +
      "💰  Pricing & Quotes\n" +
      "📍  Our Location & Branches\n" +
      "📞  Contact Details\n" +
      "🌊  About Canaan\n\n" +
      "Just tap a topic or type your question!",
    chips: ["Our Services", "Import Process", "Export Process", "Contact Us"],
  }),

  services_list: () => ({
    text:
      "We offer 10 core service areas to handle your logistics end-to-end:\n\n" +
      "1️⃣ Transportation & Cargo Management\n" +
      "2️⃣ Customs Clearance & Documentation\n" +
      "3️⃣ Warehousing & Storage\n" +
      "4️⃣ Lashing & Fumigation\n" +
      "5️⃣ NVOCC & Steamer Agent\n" +
      "6️⃣ RFID E-Seal Security\n\n" +
      "Tap below to explore our full Services page, or ask me about any of these!",
    chips: ["Transportation", "Customs Clearance", "Warehousing", "Get a Quote"],
    listShown: SERVICE_LIST,
    navLink: { href: "/services", label: "View Our Services Page" },
  }),

  services_list_detail: () => ({
    text:
      "Our services are designed to work together as a seamless, end-to-end logistics chain. From the moment the cargo leaves the quarry on our trucks, through customs clearance and port handling, to its final international destination—we manage it all.\n\n" +
      "Want to see real examples of what we carry?",
    chips: ["What We Carry", "Contact Us"],
    navLink: { href: "/services", label: "View Our Services Page" },
  }),

  transportation: () => ({
    text:
      `🚛 Transportation Services\n\n` +
      `${KB.services.transportation.short}\n\n` +
      `Here's what that includes:\n` +
      `• ${KB.services.transportation.features.join("\n• ")}\n\n` +
      `Would you like to get a quote for a specific route, or learn more about our fleet capabilities?`,
    chips: ["Get a Quote", "Our Fleet"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  transportation_detail: () => ({
    text:
      `🚛 More on Transportation\n\n` +
      `${KB.services.transportation.detail}\n\n` +
      `Want to discuss a specific route or cargo? Drop us a message!`,
    chips: ["Get a Quote", "Contact Us", "Other Services"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  cargo: () => ({
    text:
      `🏗️ Cargo Management\n\n` +
      `${KB.services.cargo.short}\n\n` +
      `We cover:\n` +
      `• ${KB.services.cargo.features.join("\n• ")}\n\n` +
      `Are you currently facing any bottlenecks with your oversized or complex shipments?`,
    chips: ["What We Carry", "Contact Us"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  cargo_detail: () => ({
    text:
      `🏗️ More on Cargo Management\n\n` +
      `${KB.services.cargo.detail}\n\n` +
      `Got an oversized or complex shipment? Let's talk — we handle it!`,
    chips: ["Get a Quote", "Contact Us", "Other Services"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  lashing_detail: () => ({
    text:
      `🪵 More on Lashing & Fumigation\n\n` +
      `${KB.services.lashing.detail}\n\n` +
      `Do you need custom crating for a delicate shipment? Let me know!`,
    chips: ["Contact Us", "Get a Quote"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  warehousing: () => ({
    text:
      "📦 *Warehousing & Storage*\n\n" +
      "We provide secure and spacious storage facilities for your short and long-term warehousing needs.",
    chips: ["Get a Quote", "Contact Us"],
    navLink: { href: "/services", label: "View Our Services Page" },
  }),

  nvocc: () => ({
    text:
      "🚢 *NVOCC & Steamer Agent*\n\n" +
      "We offer comprehensive Non-Vessel Operating Common Carrier services for flexible ocean freight, as well as professional ship agency services ensuring smooth port calls for all vessels.",
    chips: ["Get a Quote", "Contact Us"],
    navLink: { href: "/services", label: "View Our Services Page" },
  }),

  rfid: () => ({
    text:
      "🔒 *RFID E-Seals*\n\n" +
      "As an authorized dealer for Bolt Seal and Warner, we provide highly secure, tamper-evident electronic seals to ensure your cargo's integrity throughout transit.",
    chips: ["Get a Quote", "Contact Us"],
    navLink: { href: "/services", label: "View Our Services Page" },
  }),

  documentation: () => ({
    text:
      `📋 Documentation & Compliance\n\n` +
      `${KB.services.documentation.short}\n\n` +
      `This covers:\n` +
      `• ${KB.services.documentation.features.join("\n• ")}\n\n` +
      `Customs can be a headache. Would you like me to explain how our import or export processes work?`,
    chips: ["Import Process", "Export Process"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  documentation_detail: () => ({
    text:
      `📋 More on Documentation & Compliance\n\n` +
      `${KB.services.documentation.detail}\n\n` +
      `Need compliance support for a specific destination? We've got you covered.`,
    chips: ["Get a Quote", "Contact Us", "Other Services"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  lashing: () => ({
    text:
      `🪵 Lashing & Fumigation\n\n` +
      `${KB.services.lashing.short}\n\n` +
      `Services include:\n` +
      `• ${KB.services.lashing.features.join("\n• ")}\n\n` +
      `Many clients who need lashing also require customs clearance. Would you like me to share details on that?`,
    chips: ["Documentation", "Get a Quote"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  lashing_detail: () => ({
    text:
      `🪵 More on Lashing & Fumigation\n\n` +
      `${KB.services.lashing.detail}\n\n` +
      `ISPM-certified fumigation means smooth phytosanitary clearance at any port worldwide.`,
    chips: ["Get a Quote", "Contact Us", "Other Services"],
    navLink: { href: "/services", label: "See Services Page" },
  }),

  contact: () => ({
    text:
      `📞 Here's how to reach us:\n\n` +
      `📧 ${KB.company.email.join("\n📧 ")}\n\n` +
      `📱 ${KB.company.phone}\n\n` +
      `We also have detailed inquiry forms for *Shipping*, *Transportation*, and *RFID Seals* (where you can upload IEC/GST documents directly).`,
    chips: ["Our Services", "What We Carry", "Our Branches"],
    mapEmbed: true,
    contactEmbed: true,
  }),

  address: () => ({
    text:
      `📍 You'll find us here:\n\n` +
      `${KB.company.address}\n\n` +
      `We also have offices in Chennai, Madurai & Cochin.`,
    chips: ["Our Branches", "Contact Us"],
    mapEmbed: true,
  }),

  branches: () => ({
    text:
      `🏢 *Our Offices*\n\n` +
      `Canaan Global operates across *4 locations*:\n\n` +
      `🏠  Tuticorin — Headquarters\n` +
      `🌆  Chennai\n` +
      `🌆  Madurai\n` +
      `🌆  Cochin\n\n` +
      `📱 ${KB.company.phone}\n` +
      `📧 ${KB.company.email[0]}`,
    chips: ["Contact Us", "Our Services"],
  }),

  branches_detail: () => ({
    text:
      `🏢 *Branch Connectivity*\n\n` +
      `With strategic locations across major South Indian port cities (Tuticorin, Chennai, Cochin) and inland hubs (Madurai), our network ensures smooth coordination of export/import shipments, quick customs turnaround, and tight supply chain control.\n\n` +
      `Need to speak to a representative at a specific branch?`,
    chips: ["Contact Us", "Our Services"],
  }),

  about: () => ({
    text:
      `🌊 *About Canaan Global International*\n\n` +
      `"${KB.company.tagline}"\n\n` +
      `${KB.company.overview}\n\n` +
      `📍 HQ in Tuticorin, Tamil Nadu\n` +
      `🏢 Branches: Chennai · Madurai · Cochin`,
    chips: ["Our Services", "The Ecosystem", "Contact Us", "Our Branches"],
    navLink: { href: "/about", label: "Visit About Page" },
  }),

  about_detail: () => ({
    text:
      `🌊 *The Canaan Legacy*\n\n` +
      `For over 15 years, we've built a reputation as the most trusted logistics partner for the Indian stone industry. We aren't just freight forwarders; we are end-to-end project managers who understand the nuances of heavy cargo.\n\n` +
      `Our unique structure—comprising CGL, CGSS, CGI, and Rehoboth Transports—allows us to control every step of the journey.`,
    chips: ["The Ecosystem", "Our Services", "Contact Us"],
    navLink: { href: "/about", label: "Visit About Page" },
  }),

  granite: () => ({
    text:
      `💎 Stone Industry Specialists\n\n` +
      `Canaan Global is built exclusively for the natural and artificial stone trade. Here's what we handle:\n\n` +
      `Stone types: ${KB.company.stoneTypes.join(" · ")}\n\n` +
      `🚛  Moving stone from quarry to port\n` +
      `🏗️  Handling heavy & oversized stone cargo\n` +
      `📋  Regulatory compliance for stone exports\n` +
      `🪵  Lashing & ISPM fumigation for all stone types\n\n` +
      `We cover the full chain — from quarry to your customer's door.`,
    chips: ["Transportation", "Cargo Management", "Documentation", "Lashing & Fumigation"],
    navLink: { href: "/cargo", label: "View Cargo Gallery" },
  }),

  cargo_types: () => ({
    text:
      `📦 What We Carry — 14 Categories\n\n` +
      `We handle a wide range of cargo types:\n\n` +
      `🌿  Coir & Natural Fibre\n` +
      `🚜  Agricultural Machinery\n` +
      `📦  Palletised Cargo\n` +
      `🔩  Industrial Rolls & Coils\n` +
      `🪨  Stones & Marbles\n` +
      `🧪  Chemical Drums & Barrels\n` +
      `🌾  Bulk Grain & Seeds\n` +
      `🛍️  Bagged Cargo\n` +
      `🎁  Bale Cargo\n` +
      `🥜  Cashew & Agri Commodities\n` +
      `🔧  Pipes\n` +
      `🏗️  Heavy Machinery\n` +
      `💧  Bulk Liquid & Gas Cargo\n` +
      `⭐  Special Cargo\n\n` +
      `Tap below to see our full cargo gallery with photos of each category!`,
    chips: ["Tell me more", "Transportation", "Get a Quote"],
    navLink: { href: "/cargo", label: "View Cargo Gallery" },
  }),

  cargo_types_detail: () => ({
    text:
      `📦 About Our Cargo Expertise\n\n` +
      `Canaan has spent 15+ years building hands-on expertise across every category we handle. ` +
      `Our team knows exactly how to pack, lash, fumigate, and document each cargo type for its destination market.\n\n` +
      `🪨 Stones & Marbles — our core, with 15+ years moving granite blocks and marble slabs\n` +
      `🚜 Agricultural Machinery — tractors and farm equipment loaded by our specialist team\n` +
      `🔩 Industrial Rolls & Coils — HDPE and geotextile reels in high-cube containers\n` +
      `🏗️ Heavy Machinery — JCBs, excavators, bulldozers transported across India\n` +
      `💧 Bulk Liquid & Gas — ISO tanks and tankers, fully certified\n\n` +
      `Every shipment we touch is handled with care, compliance, and commitment.`,
    chips: ["Get a Quote", "Contact Us", "Our Services"],
    navLink: { href: "/cargo", label: "View Cargo Gallery" },
  }),

  fleet: () => ({
    text:
      `🚛 Our Fleet — 42 Vehicles Strong\n\n` +
      `Operated by *Rehoboth Transports*, our ground fleet covers the full load spectrum:\n\n` +
      `🚨  40 Ft Container Trailer — up to 40 Tons\n` +
      `🚨  45 Ft Extended Trailer — up to 30 Tons\n` +
      `🚚  10 Wheeler (6x4) — up to 16 Tons\n` +
      `🚚  12 Wheeler (8x4) — up to 20 Tons\n` +
      `🚚  14 Wheeler (10x4) — up to 25 Tons\n` +
      `🚚  20 Ft Container Trailer — up to 20 Tons\n` +
      `🚚  22 Wheeler — up to 30 Tons\n\n` +
      `Every vehicle is GPS-tracked and dispatched through a computerised routing system for on-time delivery.`,
    chips: ["Transportation", "What We Carry", "Contact Us"],
  }),

  pricing: () => ({
    text:
      `💰 Pricing & Quotes\n\n` +
      `Our pricing depends on the cargo type, route, volume, and services needed — so every quote is tailored.\n\n` +
      `The easiest way to get exact numbers is a quick chat with our operations team. Should I open the direct contact form for you?`,
    chips: ["Inquiry Forms", "Our Services"],
    contactEmbed: true,
    navLink: { href: "/#contact", label: "Contact Us" },
  }),

  pricing_detail: () => ({
    text:
      `💰 More on Pricing\n\n` +
      `Because we specialise in project cargo and heavy stone shipments, flat rates rarely apply. We calculate costs based on distance, cargo dimensions, necessary permits, and chosen transport mode.\n\n` +
      `Request a quote today and our team will provide a transparent breakdown!`,
    chips: ["Contact Us", "Our Services"],
    contactEmbed: true,
    navLink: { href: "/#contact", label: "Contact Us" },
  }),

  working_hours: () => ({
    text:
      `🕐 Working Hours\n\n` +
      `We're open Monday through Saturday during regular business hours.\n\n` +
      `For anything urgent outside of those hours:\n` +
      `📧 canaanglobal@canaanglobal.com\n` +
      `📱 ${KB.company.phone}\n\n` +
      `Emails are checked and replied to promptly.`,
    chips: ["Contact Us", "Our Branches"],
    navLink: { href: "/#contact", label: "Contact Us" },
  }),

  urgency: () => ({
    text:
      `🚨 Understood. We move fast on urgent shipments.\n\n` +
      `Let's skip the small talk. Use the direct line or the form below right now, and our team will prioritize your request instantly.`,
    chips: ["Inquiry Forms"],
    contactEmbed: true,
  }),

  chitchat_howru: () => ({
    text: pickOne([
      "Doing great, thanks for asking! 😊 What can I help you with today?",
      "All good over here! Ready to help with anything Canaan-related. What's on your mind?",
      "Running smoothly! 🚀 What would you like to know about our services?",
    ]),
    chips: ["Our Services", "Contact Us"],
  }),

  chitchat_name: () => ({
    text:
      `I'm Joshine — Canaan Global International's assistant! 👋\n\n` +
      `I know our services, operations, and company inside out. I might not answer everything, but I'll do my best.\n\n` +
      `What would you like to know?`,
    chips: ["Our Services", "About Canaan", "Contact Us"],
  }),

  affirmation: (ctx) => {
    const topic = ctx?.lastTopic;
    const detailKey = topic ? `${topic}_detail` : null;
    if (detailKey && RESPONSES[detailKey]) {
      return RESPONSES[detailKey]();
    }
    return {
      text: "Sure! Here's more information:",
      chips: ["Our Services", "Contact Us"],
    };
  },

  negation: (ctx) => {
    if (ctx) ctx.lastTopic = null;
    return {
      text: pickOne([
        "No worries! What else can I help you explore?",
        "Sure, let's look at something else. What would you like to know?",
      ]),
      chips: ["Our Services", "Contact Us", "What We Carry"],
    };
  },

  complaint: () => ({
    text:
      `I hear you, and I am truly sorry you're dealing with this. 🙏 That is incredibly frustrating, and it is absolutely not the standard we set for ourselves.\n\n` +
      `I want to make sure this gets resolved for you immediately. Could you please send a quick message to our operations team below? They will escalate this instantly.`,
    chips: ["Inquiry Forms"],
    contactEmbed: true,
  }),

  fallback: () => ({
    text: pickOne([
      "I'll be honest, I'm still learning the ropes and didn't quite catch that! 😅 Could you rephrase? I'm really good at answering questions about our services or how to get a quote.",
      "My apologies—I'm just a bot and that one went over my head. 🙏 Let's try again! Are you looking for our services, or trying to reach the team?",
      "I might need a human to help with that one! 😅 In the meantime, I can definitely point you towards our logistics services or contact forms."
    ]),
    chips: ["Our Services", "Inquiry Forms"],
  }),

  // ── Accreditations ──
  accreditations: () => ({
    text:
      `📜 *${KB.accreditations.title}*\n\n` +
      `${KB.accreditations.summary}\n\n` +
      `Our key licenses include:\n` +
      `✅ ${KB.accreditations.list.join("\n✅ ")}\n\n` +
      `Tap below to view our official certificates and dealership appointments.`,
    chips: ["About Canaan", "Our Services"],
    navLink: { href: "/accreditations", label: "View Accreditations" },
  }),

  // ── Updates ──
  updates: () => ({
    text:
      `📰 *${KB.updates.title}*\n\n` +
      `${KB.updates.summary}\n\n` +
      `Stay informed with the latest indicative exchange rates (USD, EUR, GBP, AED to INR) and official Customs Circulars directly on our Updates page.`,
    chips: ["Accreditations", "Our Services"],
    navLink: { href: "/updates", label: "View Updates & Circulars" },
  }),

  // ── Achievements ──
  achievements: () => ({
    text:
      `🏆 *Our Achievements*\n\n` +
      `We take pride in our track record. Our key achievements include:\n` +
      `⭐ ${KB.company.achievements.join("\n⭐ ")}\n\n` +
      `Learn more about our legacy on the About page!`,
    chips: ["Our Crew", "About Canaan", "Accreditations"],
    navLink: { href: "/about", label: "Visit About Page" },
  }),

  // ── Crew ──
  crew: () => ({
    text:
      `👥 *Our Crew*\n\n` +
      `Our operations are driven by a dedicated team of logistics experts:\n\n` +
      `🔹 ${KB.company.crew.join("\n🔹 ")}\n\n` +
      `Meet the faces behind Canaan Global on our About page.`,
    chips: ["Our Achievements", "About Canaan", "Our Branches"],
    navLink: { href: "/about", label: "Meet the Team" },
  }),

  // ── Import Operations ──
  import_ops: () => {
    const steps = KB.operations.import.steps;
    const summaryList = steps.map((s) => `${s.num}  ${s.title}`).join("\n");
    return {
      text:
        `📦 *Import Operations*\n\n` +
        `${KB.operations.import.summary}\n\n` +
        summaryList + `\n\n` +
        `Tap "Tell me more" for a full description of each step!`,
      chips: ["Tell me more", "Export Process", "Contact Us"],
    };
  },

  // ── Import detail (follow-up) ──
  import_ops_detail: () => {
    const steps = KB.operations.import.steps;
    const stepsText = steps
      .map((s) => `${s.num}  *${s.title}*\n      ${s.desc}`)
      .join("\n\n");
    return {
      text: `📦 *Import — Full Workflow*\n\n` + stepsText,
      chips: ["Export Process", "Documentation", "Contact Us"],
    };
  },

  // ── Export Operations ──
  export_ops: () => {
    const steps = KB.operations.export.steps;
    const summaryList = steps.map((s) => `${s.num}  ${s.title}`).join("\n");
    return {
      text:
        `🚢 *Export Operations*\n\n` +
        `${KB.operations.export.summary}\n\n` +
        summaryList + `\n\n` +
        `Tap "Tell me more" for a full description of each step!`,
      chips: ["Tell me more", "Import Process", "Get a Quote"],
    };
  },

  // ── Export detail (follow-up) ──
  export_ops_detail: () => {
    const steps = KB.operations.export.steps;
    const stepsText = steps
      .map((s) => `${s.num}  *${s.title}*\n      ${s.desc}`)
      .join("\n\n");
    return {
      text: `🚢 *Export — Full Workflow*\n\n` + stepsText,
      chips: ["Import Process", "Get a Quote", "Contact Us"],
    };
  },

  // ── Canaan Ecosystem overview ──
  ecosystem: () => {
    const divs = KB.ecosystem.divisions;
    return {
      text:
        `🌐 *The Canaan Global Ecosystem*\n\n` +
        `${KB.ecosystem.overview}\n\n` +
        `The network has *4 specialised divisions*:\n\n` +
        `1️⃣  ${divs[0].name}\n` +
        `2️⃣  ${divs[1].name}\n` +
        `3️⃣  ${divs[2].name}\n` +
        `4️⃣  ${divs[3].name}\n\n` +
        `Tap below to learn about each division:`,
      chips: ["About CGL", "About CGSS", "About CGI", "About Rehoboth"],
      listShown: ["div_cgl", "div_cgss", "div_cgi", "div_rehoboth"],
    };
  },

  ecosystem_detail: () => ({
    text:
      `🌐 *More on the Ecosystem*\n\n` +
      `Our four divisions are fully integrated. For example, Rehoboth handles the physical transport of a block of granite, while CGSS manages the customs clearance, and CGL books the ocean freight.\n\n` +
      `This unified approach ensures zero handoff delays and single-point accountability.`,
    chips: ["About CGL", "About CGSS", "Contact Us"],
  }),

  // ── CGL ──
  div_cgl: () => {
    const d = KB.ecosystem.divisions[0];
    return {
      text:
        `⚙️ *${d.name}*\n\n` +
        `${d.role}\n\n` +
        `🔑 Key Functions:\n` +
        `✅ ${d.functions.join("\n✅ ")}`,
      chips: ["About CGSS", "About CGI", "About Rehoboth", "The Ecosystem"],
    };
  },

  div_cgl_detail: () => ({
    text:
      `⚙️ *CGL — Operational Highlights*\n\n` +
      `🔹 *Freight Forwarding* — manages the booking and coordination of cargo across carriers\n` +
      `🔹 *Multimodal Transportation* — combines sea, road, and air for complete chain coverage\n` +
      `🔹 *Vessel Operations* — direct involvement in vessel scheduling and berth coordination\n` +
      `🔹 *NVOCC Services* — operates as a Non-Vessel Operating Common Carrier for flexible routing\n` +
      `🔹 *Cargo Consolidation* — combines smaller shipments for cost-efficient container loads\n\n` +
      `CGL is the engine that keeps Canaan's entire logistics network moving.`,
    chips: ["About CGSS", "About Rehoboth", "Contact Us"],
  }),

  // ── CGSS ──
  div_cgss: () => {
    const d = KB.ecosystem.divisions[1];
    return {
      text:
        `🛂 *${d.name}*\n\n` +
        `${d.role}\n\n` +
        `🔑 Key Functions:\n` +
        `✅ ${d.functions.join("\n✅ ")}`,
      chips: ["About CGL", "About CGI", "Import Process", "Export Process"],
    };
  },

  div_cgss_detail: () => ({
    text:
      `🛂 *CGSS — Customs & Compliance Details*\n\n` +
      `🔹 *Customs Brokerage* — licensed to act as CHA (Customs House Agent) on behalf of importers and exporters\n` +
      `🔹 *Import & Export Clearance* — handles end-to-end regulatory filings for both directions\n` +
      `🔹 *Trade Documentation* — ensures all shipping documents meet international standards\n` +
      `🔹 *Port Clearance Coordination* — liaisons directly with port authorities for smooth vessel releases\n\n` +
      `CGSS ensures your cargo crosses borders without regulatory friction.`,
    chips: ["Import Process", "Export Process", "Contact Us"],
  }),

  // ── CGI ──
  div_cgi: () => {
    const d = KB.ecosystem.divisions[2];
    return {
      text:
        `🏢 *${d.name}*\n\n` +
        `${d.role}\n\n` +
        `🔑 Key Functions:\n` +
        `✅ ${d.functions.join("\n✅ ")}`,
      chips: ["About CGL", "About CGSS", "About Rehoboth", "Contact Us"],
    };
  },

  div_cgi_detail: () => ({
    text:
      `🏢 *CGI — Commercial Hub Details*\n\n` +
      `🔹 *Nominations & Coordination* — manages cargo nominations from clients and forwards them to the operations team\n` +
      `🔹 *Billing Management* — oversees all client and vendor billing cycles\n` +
      `🔹 *Invoice Processing* — generates and tracks all financial documents across the network\n` +
      `🔹 *Commercial Transport Admin* — administers commercial agreements for transport movements\n` +
      `🔹 *Internal Integration* — serves as the connective tissue linking logistics ops with finance\n\n` +
      `Note: When CHA (customs) services are involved, billing is processed through CGI.`,
    chips: ["About CGSS", "Get a Quote", "Contact Us"],
  }),

  // ── Rehoboth Transports ──
  div_rehoboth: () => {
    const d = KB.ecosystem.divisions[3];
    return {
      text:
        `🚛 *${d.name}*\n\n` +
        `${d.role}\n\n` +
        `🔑 Key Functions:\n` +
        `✅ ${d.functions.join("\n✅ ")}\n\n` +
        `💡 *Billing:* ${d.billing}`,
      chips: ["About CGL", "About CGI", "The Ecosystem"],
    };
  },

  div_rehoboth_detail: () => ({
    text:
      `🚛 *Rehoboth Transports — Ground Operations*\n\n` +
      `🔹 *Cargo Transportation* — primary road carrier for all Canaan shipments on land\n` +
      `🔹 *Fleet Coordination* — schedules and manages the entire vehicle fleet for optimal utilisation\n` +
      `🔹 *Raw Material Movement* — transports raw stone and granite directly from quarry sites\n` +
      `🔹 *External Logistics* — supports third-party client logistics as an independent service\n` +
      `🔹 *Integrated Handling* — works in sync with CGL and CGI for end-to-end delivery\n\n` +
      `💡 External raw material transport is billed through *Rehoboth*. CHA-involved services are billed through *CGI*.`,
    chips: ["About CGL", "The Ecosystem", "Contact Us"],
  }),
};

// ── CHIP → INTENT MAP ─────────────────────────────────────────────────────────

export const CHIP_TO_INTENT = {
  "Our Services": "services_list",
  Transportation: "transportation",
  "Tell me more": "followup",
  "Cargo Management": "cargo",
  Documentation: "documentation",
  "Lashing & Fumigation": "lashing",
  "Contact Us": "contact",
  "Get a Quote": "pricing",
  "Our Branches": "branches",
  Address: "address",
  "About Canaan": "about",
  "Other Services": "services_list",
  "All Services": "services_list",
  "What else?": "help",
  "Import Process": "import_ops",
  "Export Process": "export_ops",
  "How Import Works": "import_ops",
  "How Export Works": "export_ops",
  "The Ecosystem": "ecosystem",
  "About CGL": "div_cgl",
  "About CGSS": "div_cgss",
  "About CGI": "div_cgi",
  "About Rehoboth": "div_rehoboth",
  "What We Carry": "cargo_types",
  "View Gallery": "cargo_types",
  "Our Fleet": "fleet",
  "Granite Industry": "granite",
  "Accreditations": "accreditations",
  "Latest Updates": "updates",
  "Exchange Rates": "updates",
  "Customs Circulars": "updates",
  "Our Achievements": "achievements",
  "Our Crew": "crew",
  "Inquiry Forms": "contact",
  "Customs Clearance": "documentation",
  "Warehousing": "warehousing",
  "RFID Seals": "rfid",
  "NVOCC": "nvocc",
};

// Topic intents — these update lastTopic in context
const TOPIC_INTENTS = new Set([
  "transportation", "cargo", "cargo_types", "fleet", "documentation", "lashing",
  "warehousing", "nvocc", "rfid",
  "contact", "address", "branches", "about", "granite",
  "import_ops", "export_ops",
  "ecosystem", "div_cgl", "div_cgss", "div_cgi", "div_rehoboth",
  "accreditations", "updates", "achievements", "crew",
]);

// ── MAIN ENGINE FUNCTION ──────────────────────────────────────────────────────

// Minimum score required for a confident response (lower = smart fallback)
const CONFIDENCE_THRESHOLD = 2;

/**
 * Process user input and return a bot response.
 * @param {string} userInput
 * @param {object} ctx  – conversation context (maintained by caller)
 * @returns {{ text: string, chips: string[], ctx: object }}
 */
export function getResponse(userInput, ctx = {}) {
  const newCtx = {
    lastIntent: ctx.lastIntent ?? null,
    lastTopic:  ctx.lastTopic  ?? null,
    listShown:  ctx.listShown  ?? null,
    msgCount:   (ctx.msgCount  ?? 0) + 1,
    name:       ctx.name       ?? null,
    topicHistory: ctx.topicHistory ?? [],
    isHotLead:  ctx.isHotLead  ?? false,
    hotLeadTriggered: ctx.hotLeadTriggered ?? false,
  };

  const raw = userInput.trim();

  // ── 1. Chip shortcut (exact match) ──────────────────────────────
  if (CHIP_TO_INTENT[raw]) {
    const id = CHIP_TO_INTENT[raw];

    if (id === "followup") {
      const detailKey = newCtx.lastTopic ? `${newCtx.lastTopic}_detail` : null;
      if (detailKey && RESPONSES[detailKey]) {
        const result = RESPONSES[detailKey]();
        return { ...result, ctx: { ...newCtx, listShown: result.listShown ?? null } };
      }
      return { ...RESPONSES.help(), ctx: newCtx };
    }

    if (TOPIC_INTENTS.has(id)) newCtx.lastTopic = id;
    newCtx.lastIntent = id;
    const builder = RESPONSES[id] ?? RESPONSES.fallback;
    const result = builder(newCtx);
    return { ...result, ctx: { ...newCtx, listShown: result.listShown ?? null } };
  }

  // ── 2. Name capture ─────────────────────────────────────────
  const nameMatch = raw.match(/(?:my name is|i am|i'm|call me)\s+([A-Za-z]+)/i);
  if (nameMatch) {
    newCtx.name =
      nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1).toLowerCase();
    return {
      text: `Nice to meet you, ${newCtx.name}! 😊\nHow can I help you with your logistics needs today?`,
      chips: ["Our Services", "Contact Us", "Our Branches"],
      ctx: newCtx,
    };
  }

  // ── 3. Preprocess (abbrev expand + normalise) ────────────────────
  const norm = preprocess(raw);
  if (norm.length < 2) return { ...RESPONSES.fallback(), ctx: newCtx };

  // ── 4. Number selection from a prior list ────────────────────
  const numMatch = norm.match(/^(\d+)$/);
  if (numMatch && newCtx.listShown) {
    const idx = parseInt(numMatch[1]) - 1;
    if (idx >= 0 && idx < newCtx.listShown.length) {
      const chosen = newCtx.listShown[idx];
      newCtx.lastTopic  = chosen;
      newCtx.lastIntent = chosen;
      newCtx.listShown  = null;
      const result = (RESPONSES[chosen] ?? RESPONSES.fallback)(newCtx);
      return { ...result, ctx: { ...newCtx, listShown: result.listShown ?? null } };
    }
  }

  // ── 5. Score all intents ─────────────────────────────────
  const rawScores = {};
  for (const intent of INTENTS) {
    let score = 0;
    for (const { w, p } of intent.keywords) {
      if (p.test(norm)) score += w;
    }
    if (intent.fuzzy) {
      for (const { kw, w } of intent.fuzzy) {
        if (fuzzyHit(norm, kw)) score += w;
      }
    }
    // Bonus: multiple keyword families matched → signal strong relevance
    if (score > 0) {
      const familiesHit = intent.keywords.filter(({ p }) => p.test(norm)).length;
      if (familiesHit >= 2) score += 2;
    }
    if (score > 0) rawScores[intent.id] = score;
  }

  // ── 6. Apply context boost ────────────────────────────────
  const scores = boostForContext(rawScores, newCtx);

  if (Object.keys(scores).length === 0) {
    return { ...RESPONSES.fallback(), ctx: newCtx };
  }

  const sorted  = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [bestId, bestScore] = sorted[0];

  // ── 7. Follow-up resolution ───────────────────────────────
  if (bestId === "followup") {
    const detailKey = newCtx.lastTopic ? `${newCtx.lastTopic}_detail` : null;
    if (detailKey && RESPONSES[detailKey]) {
      const result = RESPONSES[detailKey]();
      return { ...result, ctx: { ...newCtx, listShown: null } };
    }
    return { ...RESPONSES.help(), ctx: newCtx };
  }

  // ── 8. Affirmation — expand on last topic ─────────────────────
  if (bestId === "affirmation") {
    const result = RESPONSES.affirmation(newCtx);
    return { ...result, ctx: newCtx };
  }

  // ── 9. Confidence check ──────────────────────────────────
  // For meta intents (greeting, thanks, negation) any score is fine.
  // For knowledge intents, require a minimum score to avoid false positives.
  const META_INTENTS = new Set([
    "greeting", "farewell", "thanks", "help", "negation",
    "chitchat_howru", "chitchat_name", "urgency", "complaint",
  ]);

  if (!META_INTENTS.has(bestId) && bestScore < CONFIDENCE_THRESHOLD) {
    // Not confident enough — show smart near-miss suggestions
    return { ...buildSmartFallback(scores), ctx: newCtx };
  }

  // ── 10. Multi-Intent (Compound) detection ───────────────────────────
  // If the runner-up topic scores very highly AND is a different service,
  // we combine the answers to form a smart multi-intent response!
  let multiResult = null;
  let bonusChip = null;
  
  if (sorted.length >= 2) {
    const [runnerId, runnerScore] = sorted[1];
    const bothTopics = TOPIC_INTENTS.has(bestId) && TOPIC_INTENTS.has(runnerId);
    const notMeta = !META_INTENTS.has(runnerId);
    
    // Very strong multi-intent match (e.g. "prices and branches")
    if (bothTopics && notMeta && runnerId !== bestId && runnerScore >= 10 && runnerScore >= bestScore * 0.75) {
      const b1 = RESPONSES[bestId];
      const b2 = RESPONSES[runnerId];
      if (b1 && b2) {
        const res1 = b1(newCtx);
        const res2 = b2(newCtx);
        
        multiResult = {
          text: res1.text + `\n\n---\n\nAlso, you asked about ${INTENT_LABELS[runnerId] ?? "this"}:\n\n` + res2.text,
          chips: [...(res1.chips || []), ...(res2.chips || [])].slice(0, 3),
          navLink: res1.navLink || res2.navLink,
          contactEmbed: res1.contactEmbed || res2.contactEmbed,
          mapEmbed: res1.mapEmbed || res2.mapEmbed,
          listShown: res1.listShown || res2.listShown,
        };
        
        newCtx.topicHistory.push(runnerId);
      }
    } 
    // Weak compound match (just suggest it as a chip)
    else if (bothTopics && notMeta && runnerId !== bestId && runnerScore >= bestScore * 0.6) {
      bonusChip = INTENT_LABELS[runnerId] ?? null;
    }
  }

  // ── 11. Build response ───────────────────────────────────
  newCtx.lastIntent = bestId;
  if (TOPIC_INTENTS.has(bestId)) {
    newCtx.lastTopic = bestId;
    if (newCtx.topicHistory[newCtx.topicHistory.length - 1] !== bestId) {
      newCtx.topicHistory.push(bestId);
    }
  }

  // ── Hot Lead Detection ──
  const highIntentTopics = new Set(["pricing", "fleet", "cargo_types", "transportation", "cargo", "contact"]);
  const highIntentCount = newCtx.topicHistory.filter(t => highIntentTopics.has(t)).length;
  if (highIntentCount >= 3 && !newCtx.hotLeadTriggered) {
    newCtx.isHotLead = true;
    newCtx.hotLeadTriggered = true;
  } else {
    newCtx.isHotLead = false;
  }

  const builder = RESPONSES[bestId] ?? RESPONSES.fallback;
  const result  = multiResult || builder(newCtx);

  // Fallback Telemetry Logging
  if (bestId === "fallback") {
    logFallback(raw);
  }

  // Proactive CTA for hot leads (Consultative Shift)
  if (newCtx.isHotLead && !result.contactEmbed && bestId !== "fallback") {
    result.text += `\n\n💡 *Quick tip:* Since you're looking deeply into our services and pricing, I'd highly recommend a quick chat with our operations team to get exact figures. Should I open the direct contact form for you?`;
    result.chips = ["Inquiry Forms", ...result.chips].slice(0, 3);
    result.contactEmbed = true;
  }

  // Inject compound chip if detected
  if (bonusChip && result.chips && !result.chips.includes(bonusChip)) {
    result.chips = [result.chips[0], bonusChip, ...result.chips.slice(1)].slice(0, 4);
  }

  // Filter out any exact duplicate chips
  if (result.chips) {
    result.chips = Array.from(new Set(result.chips));
  }

  return {
    ...result,
    ctx: { ...newCtx, listShown: result.listShown ?? null },
  };
}
