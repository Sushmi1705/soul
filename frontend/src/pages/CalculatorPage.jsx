import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Heart, 
  Flame, 
  Lock, 
  AlertCircle, 
  Compass, 
  RefreshCw, 
  Unlock,
  CheckCircle2
} from "lucide-react";
import { Country, State, City } from "country-state-city";

const CALCULATOR_DETAILS = {
  "moon-sign": { title: "Moon Sign Calculator", desc: "Understand your emotional nature, instincts, and how you truly respond to life situations." },
  "numerology": { title: "Numerology Calculator", desc: "Decode your life path, destiny, and hidden patterns through the power of numbers." },
  "kundli-matching": { title: "Kundli Matching", desc: "Check marriage compatibility with detailed Guna Milan and deeper relationship insights." },
  "lagna": { title: "Lagna Calculator", desc: "Find your rising sign (Lagna) and understand how you express yourself and appear to the world." },
  "nakshatra": { title: "Nakshatra Calculator", desc: "Understand your Nakshatra (birth star), lunar mansion, and its influence on your life path." },
  "baby-name": { title: "Baby Name Calculator", desc: "Find auspicious starting syllables and names for your baby based on their birth star (Nakshatra)." },
  "flames": { title: "Flames Calculator", desc: "Find relationship compatibility using the classic FLAMES (Friend, Love, Affection, Marriage, Enemy, Sibling) algorithm." },
  "rahu-ketu": { title: "Rahu Ketu Calculator", desc: "Discover the placements of Rahu & Ketu (Lunar Nodes) in your chart and their karmic lessons." }
};

// Guna Milan Constants & Data Mappings
const NAKSHATRAS_LIST = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", 
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", 
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", 
  "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", 
  "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const RASIS_LIST = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const getVarna = (rasi) => {
  const r = rasi?.toLowerCase() || "";
  if (r.includes("cancer") || r.includes("scorpio") || r.includes("pisces")) return { name: "Brahmin", points: 4 };
  if (r.includes("aries") || r.includes("leo") || r.includes("sagittarius")) return { name: "Kshatriya", points: 3 };
  if (r.includes("taurus") || r.includes("virgo") || r.includes("capricorn")) return { name: "Vaishya", points: 2 };
  return { name: "Shudra", points: 1 }; 
};

const getVashyaGroup = (rasi) => {
  const r = rasi?.toLowerCase() || "";
  if (r.includes("aries") || r.includes("taurus") || r.includes("leo") || (r.includes("sagittarius") && !r.includes("1st")) || (r.includes("capricorn") && !r.includes("2nd"))) {
    return "Chatushpada";
  }
  if (r.includes("gemini") || r.includes("virgo") || r.includes("libra") || (r.includes("sagittarius") && r.includes("1st")) || r.includes("aquarius")) {
    return "Manav";
  }
  if (r.includes("cancer") || r.includes("pisces") || (r.includes("capricorn") && r.includes("2nd"))) {
    return "Jalachar";
  }
  if (r.includes("scorpio")) {
    return "Keeta";
  }
  return "Manav";
};

const YONI_MAP = {
  "Ashwini": "Horse", "Shatabhisha": "Horse",
  "Bharani": "Elephant", "Revati": "Elephant",
  "Krittika": "Sheep", "Pushya": "Sheep",
  "Rohini": "Serpent", "Mrigashira": "Serpent",
  "Ardra": "Dog", "Moola": "Dog",
  "Punarvasu": "Cat", "Ashlesha": "Cat",
  "Magha": "Rat", "Purva Phalguni": "Rat",
  "Uttara Phalguni": "Cow", "Uttara Bhadrapada": "Cow",
  "Hasta": "Buffalo", "Swati": "Buffalo",
  "Chitra": "Tiger", "Vishakha": "Tiger",
  "Anuradha": "Deer", "Jyeshtha": "Deer",
  "Purva Ashadha": "Monkey", "Shravana": "Monkey",
  "Uttara Ashadha": "Mongoose",
  "Dhanishta": "Lion", "Purva Bhadrapada": "Lion"
};

const getYoniScore = (y1, y2) => {
  if (y1 === y2) return 4;
  const hostility = {
    "Horse": "Lion", "Elephant": "Lion", "Sheep": "Monkey", "Serpent": "Mongoose",
    "Dog": "Cat", "Cat": "Rat", "Rat": "Cat", "Cow": "Tiger", "Buffalo": "Horse",
    "Tiger": "Cow", "Deer": "Dog", "Monkey": "Sheep", "Mongoose": "Serpent", "Lion": "Elephant"
  };
  if (hostility[y1] === y2 || hostility[y2] === y1) return 0;
  
  const friendly = {
    "Horse": ["Elephant", "Deer"], "Elephant": ["Horse", "Cow"],
    "Sheep": ["Cow", "Buffalo"], "Serpent": ["Serpent"],
    "Dog": ["Mongoose"], "Cat": ["Monkey"], "Rat": ["Mongoose"],
    "Cow": ["Elephant", "Sheep"], "Buffalo": ["Sheep", "Cow"],
    "Tiger": ["Lion"], "Deer": ["Horse"], "Monkey": ["Cat"],
    "Mongoose": ["Rat", "Dog"], "Lion": ["Tiger"]
  };
  if (friendly[y1]?.includes(y2) || friendly[y2]?.includes(y1)) return 3;
  return 2;
};

const LORD_MAP = {
  "Aries": "Mars", "Scorpio": "Mars",
  "Taurus": "Venus", "Libra": "Venus",
  "Gemini": "Mercury", "Virgo": "Mercury",
  "Cancer": "Moon",
  "Leo": "Sun",
  "Sagittarius": "Jupiter", "Pisces": "Jupiter",
  "Capricorn": "Saturn", "Aquarius": "Saturn"
};

const getMaitriScore = (lord1, lord2) => {
  if (lord1 === lord2) return 5;
  const relationships = {
    "Sun": { "Moon": "Friend", "Mars": "Friend", "Jupiter": "Friend", "Mercury": "Neutral", "Venus": "Enemy", "Saturn": "Enemy" },
    "Moon": { "Sun": "Friend", "Mercury": "Friend", "Mars": "Neutral", "Jupiter": "Neutral", "Venus": "Neutral", "Saturn": "Neutral" },
    "Mars": { "Sun": "Friend", "Moon": "Friend", "Jupiter": "Friend", "Saturn": "Neutral", "Venus": "Neutral", "Mercury": "Enemy" },
    "Mercury": { "Sun": "Friend", "Venus": "Friend", "Mars": "Neutral", "Jupiter": "Neutral", "Saturn": "Neutral", "Moon": "Enemy" },
    "Jupiter": { "Sun": "Friend", "Moon": "Friend", "Mars": "Friend", "Saturn": "Neutral", "Mercury": "Enemy", "Venus": "Enemy" },
    "Venus": { "Mercury": "Friend", "Saturn": "Friend", "Mars": "Neutral", "Jupiter": "Neutral", "Sun": "Enemy", "Moon": "Enemy" },
    "Saturn": { "Mercury": "Friend", "Venus": "Friend", "Jupiter": "Neutral", "Sun": "Enemy", "Moon": "Enemy", "Mars": "Enemy" }
  };
  const r1 = relationships[lord1]?.[lord2] || "Neutral";
  const r2 = relationships[lord2]?.[lord1] || "Neutral";
  
  if (r1 === "Friend" && r2 === "Friend") return 5;
  if ((r1 === "Friend" && r2 === "Neutral") || (r1 === "Neutral" && r2 === "Friend")) return 4;
  if (r1 === "Neutral" && r2 === "Neutral") return 3;
  if ((r1 === "Enemy" && r2 === "Neutral") || (r1 === "Neutral" && r2 === "Enemy")) return 1;
  return 0;
};

const GANA_MAP = {
  "Ashwini": "Deva", "Mrigashira": "Deva", "Punarvasu": "Deva", "Pushya": "Deva", "Hasta": "Deva", "Swati": "Deva", "Anuradha": "Deva", "Shravana": "Deva", "Revati": "Deva",
  "Bharani": "Manushya", "Rohini": "Manushya", "Ardra": "Manushya", "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya", "Chitra": "Manushya", "Purva Ashadha": "Manushya", "Uttara Ashadha": "Manushya", "Purva Bhadrapada": "Manushya",
  "Krittika": "Rakshasa", "Ashlesha": "Rakshasa", "Magha": "Rakshasa", "Vishakha": "Rakshasa", "Jyeshtha": "Rakshasa", "Moola": "Rakshasa", "Dhanishta": "Rakshasa", "Shatabhisha": "Rakshasa", "Uttara Bhadrapada": "Rakshasa"
};

const getGanaScore = (g1, g2) => {
  if (g1 === g2) return 6;
  if ((g1 === "Deva" && g2 === "Manushya") || (g1 === "Manushya" && g2 === "Deva")) return 5;
  if ((g1 === "Deva" && g2 === "Rakshasa") || (g1 === "Rakshasa" && g2 === "Deva")) return 1;
  return 0;
};

const getBhakootScore = (idx1, idx2) => {
  const diff = Math.abs(idx1 - idx2);
  const dist = diff > 6 ? 12 - diff : diff;
  if (dist === 0 || dist === 2 || dist === 3 || dist === 4) return 7;
  return 0; 
};

const NADI_MAP = {
  "Ashwini": "Adi", "Ardra": "Adi", "Punarvasu": "Adi", "Uttara Phalguni": "Adi", "Hasta": "Adi", "Jyeshtha": "Adi", "Moola": "Adi", "Shatabhisha": "Adi", "Purva Bhadrapada": "Adi",
  "Bharani": "Madhya", "Mrigashira": "Madhya", "Pushya": "Madhya", "Purva Phalguni": "Madhya", "Chitra": "Madhya", "Anuradha": "Madhya", "Purva Ashadha": "Madhya", "Dhanishta": "Madhya", "Uttara Bhadrapada": "Madhya",
  "Krittika": "Antya", "Rohini": "Antya", "Ashlesha": "Antya", "Magha": "Antya", "Swati": "Antya", "Vishakha": "Antya", "Uttara Ashadha": "Antya", "Shravana": "Antya", "Revati": "Antya"
};

const getNadiScore = (n1, n2) => {
  if (n1 === n2) return 0; 
  return 8;
};

const normalizeNakshatraName = (name) => {
  if (!name) return "";
  const cleaned = name.split(" - ")[0].trim().toLowerCase();
  
  if (cleaned.includes("ashwini") || cleaned.includes("aswini")) return "Ashwini";
  if (cleaned.includes("bharani")) return "Bharani";
  if (cleaned.includes("krittika") || cleaned.includes("krithika")) return "Krittika";
  if (cleaned.includes("rohini")) return "Rohini";
  if (cleaned.includes("mrigashira") || cleaned.includes("mrigasira")) return "Mrigashira";
  if (cleaned.includes("ardra")) return "Ardra";
  if (cleaned.includes("punarvasu")) return "Punarvasu";
  if (cleaned.includes("pushya")) return "Pushya";
  if (cleaned.includes("ashlesha") || cleaned.includes("aslesha")) return "Ashlesha";
  if (cleaned.includes("magha") || cleaned.includes("makha")) return "Magha";
  if (cleaned.includes("purva phalguni") || cleaned.includes("purvaphalguni") || cleaned.includes("poorvaphalguni")) return "Purva Phalguni";
  if (cleaned.includes("uttara phalguni") || cleaned.includes("uttaraphalguni")) return "Uttara Phalguni";
  if (cleaned.includes("hasta")) return "Hasta";
  if (cleaned.includes("chitra")) return "Chitra";
  if (cleaned.includes("swati") || cleaned.includes("swathi")) return "Swati";
  if (cleaned.includes("vishakha") || cleaned.includes("vishhaka")) return "Vishakha";
  if (cleaned.includes("anuradha")) return "Anuradha";
  if (cleaned.includes("jyeshtha") || cleaned.includes("jyeshta")) return "Jyeshtha";
  if (cleaned.includes("moola") || cleaned.includes("mula")) return "Moola";
  if (cleaned.includes("purva ashadha") || cleaned.includes("poorvashada") || cleaned.includes("purvaashadha")) return "Purva Ashadha";
  if (cleaned.includes("uttara ashadha") || cleaned.includes("uttarashada") || cleaned.includes("uttaraashadha")) return "Uttara Ashadha";
  if (cleaned.includes("shravana") || cleaned.includes("sravana")) return "Shravana";
  if (cleaned.includes("dhanishta") || cleaned.includes("dhanistha")) return "Dhanishta";
  if (cleaned.includes("shatabhisha") || cleaned.includes("sathabhisha")) return "Shatabhisha";
  if (cleaned.includes("purva bhadrapada") || cleaned.includes("purvabhadra") || cleaned.includes("purvabhadrapada")) return "Purva Bhadrapada";
  if (cleaned.includes("uttara bhadrapada") || cleaned.includes("uttarabhadra") || cleaned.includes("uttarabhadrapada")) return "Uttara Bhadrapada";
  if (cleaned.includes("revati") || cleaned.includes("revathi")) return "Revati";
  
  return name.split(" - ")[0].trim();
};

const normalizeRasiName = (name) => {
  if (!name) return "";
  const cleaned = name.split(" ")[0].toLowerCase();
  if (cleaned.includes("mesha") || cleaned.includes("aries")) return "Aries";
  if (cleaned.includes("vrishabha") || cleaned.includes("vrishabh") || cleaned.includes("taurus")) return "Taurus";
  if (cleaned.includes("mithuna") || cleaned.includes("mithun") || cleaned.includes("gemini")) return "Gemini";
  if (cleaned.includes("karka") || cleaned.includes("kark") || cleaned.includes("cancer")) return "Cancer";
  if (cleaned.includes("simha") || cleaned.includes("singh") || cleaned.includes("leo")) return "Leo";
  if (cleaned.includes("kanya") || cleaned.includes("virgo")) return "Virgo";
  if (cleaned.includes("tula") || cleaned.includes("libra")) return "Libra";
  if (cleaned.includes("vrischika") || cleaned.includes("scorpio")) return "Scorpio";
  if (cleaned.includes("dhanu") || cleaned.includes("sagittarius")) return "Sagittarius";
  if (cleaned.includes("makara") || cleaned.includes("makar") || cleaned.includes("capricorn")) return "Capricorn";
  if (cleaned.includes("kumbha") || cleaned.includes("kumbh") || cleaned.includes("aquarius")) return "Aquarius";
  if (cleaned.includes("meena") || cleaned.includes("meen") || cleaned.includes("pisces")) return "Pisces";
  
  return name.split(" ")[0];
};

const calculateGunaMilan = (p1, p2) => {
  const r1 = normalizeRasiName(p1.rasi);
  const r2 = normalizeRasiName(p2.rasi);
  const n1 = normalizeNakshatraName(p1.nakshatra);
  const n2 = normalizeNakshatraName(p2.nakshatra);

  // 1. Varna (Max: 1)
  const v1 = getVarna(r1);
  const v2 = getVarna(r2);
  const varnaScore = v1.points >= v2.points ? 1 : 0;

  // 2. Vashya (Max: 2)
  const vg1 = getVashyaGroup(r1);
  const vg2 = getVashyaGroup(r2);
  let vashyaScore = 0;
  if (vg1 === vg2) vashyaScore = 2;
  else if ((vg1 === "Manav" && vg2 === "Jalachar") || (vg1 === "Jalachar" && vg2 === "Manav")) vashyaScore = 1;
  else if ((vg1 === "Chatushpada" && vg2 === "Jalachar") || (vg1 === "Jalachar" && vg2 === "Chatushpada")) vashyaScore = 1;

  // 3. Tara (Max: 3)
  const idxN1 = NAKSHATRAS_LIST.indexOf(n1);
  const idxN2 = NAKSHATRAS_LIST.indexOf(n2);
  let taraScore = 0;
  if (idxN1 !== -1 && idxN2 !== -1) {
    const dist1 = ((idxN2 - idxN1 + 27) % 9) || 9;
    const dist2 = ((idxN1 - idxN2 + 27) % 9) || 9;
    const goodRemainders = [2, 4, 6, 8, 9];
    const isGood1 = goodRemainders.includes(dist1);
    const isGood2 = goodRemainders.includes(dist2);
    if (isGood1 && isGood2) taraScore = 3;
    else if (isGood1 || isGood2) taraScore = 1.5;
  } else {
    taraScore = 1.5;
  }

  // 4. Yoni (Max: 4)
  const y1 = YONI_MAP[n1] || "Horse";
  const y2 = YONI_MAP[n2] || "Horse";
  const yoniScore = getYoniScore(y1, y2);

  // 5. Graha Maitri (Max: 5)
  const lord1 = LORD_MAP[r1] || "Mars";
  const lord2 = LORD_MAP[r2] || "Mars";
  const maitriScore = getMaitriScore(lord1, lord2);

  // 6. Gana (Max: 6)
  const g1 = GANA_MAP[n1] || "Deva";
  const g2 = GANA_MAP[n2] || "Deva";
  const ganaScore = getGanaScore(g1, g2);

  // 7. Bhakoot (Max: 7)
  const idxR1 = RASIS_LIST.indexOf(r1);
  const idxR2 = RASIS_LIST.indexOf(r2);
  let bhakootScore = 0;
  if (idxR1 !== -1 && idxR2 !== -1) {
    bhakootScore = getBhakootScore(idxR1, idxR2);
  } else {
    bhakootScore = 7;
  }

  // 8. Nadi (Max: 8)
  const nad1 = NADI_MAP[n1] || "Adi";
  const nad2 = NADI_MAP[n2] || "Adi";
  const nadiScore = getNadiScore(nad1, nad2);

  const totalScore = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;

  return {
    totalScore,
    breakdown: [
      { name: "Varna (Work & Ego Compatibility)", score: varnaScore, max: 1, desc: `${v1.name} to ${v2.name}` },
      { name: "Vashya (Mutual Attraction & Control)", score: vashyaScore, max: 2, desc: `${vg1} to ${vg2}` },
      { name: "Tara (Destiny & Auspiciousness)", score: taraScore, max: 3, desc: `${n1} to ${n2}` },
      { name: "Yoni (Physical & Intimacy Compatibility)", score: yoniScore, max: 4, desc: `${y1} to ${y2}` },
      { name: "Graha Maitri (Planetary Friendship of Lords)", score: maitriScore, max: 5, desc: `${lord1} to ${lord2}` },
      { name: "Gana (Temperament & Social Behavior)", score: ganaScore, max: 6, desc: `${g1} to ${g2}` },
      { name: "Bhakoot (Emotional Love & Longevity)", score: bhakootScore, max: 7, desc: `${r1} & ${r2} Placement` },
      { name: "Nadi (Health, Temperament & Genetics)", score: nadiScore, max: 8, desc: `${nad1} & ${nad2} Nadis` }
    ]
  };
};

const runFlamesLogic = (name1, name2) => {
  const n1 = name1.toLowerCase().replace(/\s+/g, "");
  const n2 = name2.toLowerCase().replace(/\s+/g, "");
  
  let count1 = {};
  let count2 = {};
  for (let c of n1) count1[c] = (count1[c] || 0) + 1;
  for (let c of n2) count2[c] = (count2[c] || 0) + 1;
  
  let uniqueCount = 0;
  const allChars = new Set([...Object.keys(count1), ...Object.keys(count2)]);
  for (let char of allChars) {
    const f1 = count1[char] || 0;
    const f2 = count2[char] || 0;
    uniqueCount += Math.abs(f1 - f2);
  }

  const flames = [
    { letter: "F", name: "Friends", desc: "You share a natural, easy-going bond filled with laughter, mutual support, and pure companionship.", color: "text-blue-500 bg-blue-50 border-blue-200" },
    { letter: "L", name: "Lovers", desc: "A passionate, romantic spark connects your hearts. Your chemistry is magnetic and filled with deep emotional resonance.", color: "text-red-500 bg-red-50 border-red-200" },
    { letter: "A", name: "Affection", desc: "A warm, tender, and caring relationship. You feel comfortable, secure, and deeply fond of each other.", color: "text-pink-500 bg-pink-50 border-pink-200" },
    { letter: "M", name: "Marriage", desc: "A lifelong union of souls. The cosmic currents align you for deep commitment, building a home, and facing the future hand-in-hand.", color: "text-[#8E6B23] bg-[#B38B36]/5 border-[#B38B36]/20" },
    { letter: "E", name: "Enemies", desc: "Tension and challenge. You bring out strong reactions in each other which can lead to friction, but also teaches valuable self-lessons.", color: "text-stone-500 bg-stone-50 border-stone-200" },
    { letter: "S", name: "Siblings", desc: "A protective, familiar, and playful sibling-like connection. You look out for each other and share deep trust.", color: "text-teal-500 bg-teal-50 border-teal-200" }
  ];

  let list = [...flames];
  let index = 0;
  
  if (uniqueCount > 0) {
    while (list.length > 1) {
      index = (index + uniqueCount - 1) % list.length;
      list.splice(index, 1);
    }
  } else {
    list = [flames[0]];
  }

  return {
    calculatedValue: `FLAMES Compatibility: ${list[0].name}`,
    description: list[0].desc,
    letter: list[0].letter,
    flamesName: list[0].name,
    colorClass: list[0].color,
    isFlames: true,
    name1,
    name2
  };
};

const getCalculatorInsights = (data, calcId) => {
  const astro = data.astrology_details;
  const life = data.life_report;
  
  const base = {
    rasi: astro.rasi,
    nakshatra: astro.nakshatra,
    lagna: astro.lagna,
    planetaryPositions: astro.planetary_positions || null
  };

  switch (calcId) {
    case "moon-sign":
      return {
        ...base,
        calculatedValue: `Moon Sign: ${astro.rasi}`,
        description: life.personality?.emotional_nature || "Your emotional blueprint."
      };
    case "lagna":
      return {
        ...base,
        calculatedValue: `Lagna (Rising): ${astro.lagna}`,
        description: life.spiritual?.purpose || "Your life orientation and physical self."
      };
    case "nakshatra":
      return {
        ...base,
        calculatedValue: `Nakshatra: ${astro.nakshatra}`,
        description: life.personality?.hidden_talents || "Your core constellation placement."
      };
    case "rahu-ketu":
      return {
        ...base,
        calculatedValue: `Rahu in ${astro.planetary_positions?.Rahu || 'Aries'} / Ketu in ${astro.planetary_positions?.Ketu || 'Libra'}`,
        description: life.spiritual?.karma || "Your karmic coordinates and destiny path."
      };
    case "numerology":
      return {
        ...base,
        calculatedValue: `Lucky Number: ${astro.lucky_number} | Lucky Color: ${astro.lucky_color}`,
        description: life.personality?.strengths || "Your numerological blueprint."
      };
    case "baby-name":
      return {
        ...base,
        calculatedValue: `Auspicious Syllables: ${astro.nakshatra.startsWith('Krithika') ? 'A, I, U, E' : 'L, A, E, O'}`,
        description: `Auspicious naming sounds derived from your Nakshatra (${astro.nakshatra}). Naming the baby with these letters aligns them harmoniously with cosmic energy.`
      };
    default:
      return {
        ...base,
        calculatedValue: `Solar Zodiac: ${astro.zodiac}`,
        description: life.personality?.strengths || "Your cosmic signature."
      };
  }
};

const CalculatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const calc = CALCULATOR_DETAILS[id] || { title: "Astrology Calculator", desc: "Discover cosmic insights." };
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: "",
    // Partner 2 / compatibility fields
    partnerName: "",
    partnerDob: "",
    partnerTob: "",
    partnerPob: ""
  });

  const [countries, setCountries] = useState([]);
  
  // Partner 1 selections
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Partner 2 selections
  const [statesPartner, setStatesPartner] = useState([]);
  const [citiesPartner, setCitiesPartner] = useState([]);
  const [selectedCountryPartner, setSelectedCountryPartner] = useState("");
  const [selectedStatePartner, setSelectedStatePartner] = useState("");
  const [selectedCityPartner, setSelectedCityPartner] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setCountries(Country.getAllCountries());
    setResult(null); // clear results when id changes
  }, [id]);

  // Handle Country Change (Partner 1)
  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState("");
    setSelectedCity("");
    
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode);
      setStates(countryStates);
      
      if (countryStates.length === 0) {
        setCities(City.getCitiesOfCountry(countryCode));
      } else {
        setCities([]);
      }
    } else {
      setStates([]);
      setCities([]);
    }
  };

  // Handle State Change (Partner 1)
  const handleStateChange = (e) => {
    const stateCode = e.target.value;
    setSelectedState(stateCode);
    setSelectedCity("");
    
    if (stateCode) {
      setCities(City.getCitiesOfState(selectedCountry, stateCode));
    } else {
      setCities([]);
    }
  };

  // Handle City Change (Partner 1)
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };

  // Handle Country Change (Partner 2)
  const handleCountryChangePartner = (e) => {
    const countryCode = e.target.value;
    setSelectedCountryPartner(countryCode);
    setSelectedStatePartner("");
    setSelectedCityPartner("");
    
    if (countryCode) {
      const countryStates = State.getStatesOfCountry(countryCode);
      setStatesPartner(countryStates);
      
      if (countryStates.length === 0) {
        setCitiesPartner(City.getCitiesOfCountry(countryCode));
      } else {
        setCitiesPartner([]);
      }
    } else {
      setStatesPartner([]);
      setCitiesPartner([]);
    }
  };

  // Handle State Change (Partner 2)
  const handleStateChangePartner = (e) => {
    const stateCode = e.target.value;
    setSelectedStatePartner(stateCode);
    setSelectedCityPartner("");
    
    if (stateCode) {
      setCitiesPartner(City.getCitiesOfState(selectedCountryPartner, stateCode));
    } else {
      setCitiesPartner([]);
    }
  };

  // Handle City Change (Partner 2)
  const handleCityChangePartner = (e) => {
    const cityName = e.target.value;
    setSelectedCityPartner(cityName);
  };

  // Sync Partner 1 location to pob
  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const countryObj = Country.getCountryByCode(selectedCountry);
      const stateObj = selectedState ? State.getStateByCodeAndCountry(selectedState, selectedCountry) : null;
      
      const parts = [
        selectedCity,
        stateObj ? stateObj.name : "",
        countryObj ? countryObj.name : ""
      ].filter(Boolean);
      
      setFormData((prev) => ({
        ...prev,
        pob: parts.join(", ")
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        pob: ""
      }));
    }
  }, [selectedCountry, selectedState, selectedCity]);

  // Sync Partner 2 location to partnerPob
  useEffect(() => {
    if (selectedCountryPartner && selectedCityPartner) {
      const countryObj = Country.getCountryByCode(selectedCountryPartner);
      const stateObj = selectedStatePartner ? State.getStateByCodeAndCountry(selectedStatePartner, selectedCountryPartner) : null;
      
      const parts = [
        selectedCityPartner,
        stateObj ? stateObj.name : "",
        countryObj ? countryObj.name : ""
      ].filter(Boolean);
      
      setFormData((prev) => ({
        ...prev,
        partnerPob: parts.join(", ")
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        partnerPob: ""
      }));
    }
  }, [selectedCountryPartner, selectedStatePartner, selectedCityPartner]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verification by Mode
    if (id === "flames") {
      if (!formData.name || !formData.partnerName) {
        alert("Please fill in names for both partners.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const flamesResult = runFlamesLogic(formData.name, formData.partnerName);
        setResult(flamesResult);
        setLoading(false);
      }, 1200);
      return;
    }

    if (id === "kundli-matching") {
      if (!formData.dob || !formData.tob || !formData.pob || !formData.partnerDob || !formData.partnerTob || !formData.partnerPob) {
        alert("Please fill in all birth details for both partners.");
        return;
      }
      setLoading(true);
      
      const f1 = {
        name: formData.name.trim() || "Partner 1",
        dob: formData.dob,
        tob: formData.tob,
        pob: formData.pob,
        is_calculator: true
      };
      
      const f2 = {
        name: formData.partnerName.trim() || "Partner 2",
        dob: formData.partnerDob,
        tob: formData.partnerTob,
        pob: formData.partnerPob,
        is_calculator: true
      };

      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

      try {
        const [res1, res2] = await Promise.all([
          fetch(`${apiUrl}/api/horoscope/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(f1)
          }),
          fetch(`${apiUrl}/api/horoscope/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(f2)
          })
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error("Vedic calculation endpoints returned error.");
        }

        const data1 = await res1.json();
        const data2 = await res2.json();

        // Calculate Guna Milan client-side using retrieved planetary metrics
        const matchInfo = calculateGunaMilan(data1.astrology_details, data2.astrology_details);

        setResult({
          isKundliMatch: true,
          totalScore: matchInfo.totalScore,
          breakdown: matchInfo.breakdown,
          rasi1: data1.astrology_details.rasi,
          nakshatra1: data1.astrology_details.nakshatra,
          lagna1: data1.astrology_details.lagna,
          rasi2: data2.astrology_details.rasi,
          nakshatra2: data2.astrology_details.nakshatra,
          lagna2: data2.astrology_details.lagna,
          name1: f1.name,
          name2: f2.name,
          calculatedValue: `Guna Match: ${matchInfo.totalScore} / 36`,
          description: matchInfo.totalScore >= 18 
            ? `An auspicious match! A Guna Milan score of ${matchInfo.totalScore} out of 36 represents strong compatibility, deep emotional alignment, and a high probability of marital happiness according to Vedic principles.` 
            : `A moderate or challenging match. A Guna Milan score of ${matchInfo.totalScore} out of 36 suggests some areas of friction, particularly in temperaments or health guidelines. It is advised to perform deeper chart matching and consult remedial actions.`
        });
      } catch (error) {
        console.error("Vedic calculation error:", error);
        alert("Failed to calculate Kundli compatibility. Please reach celestial servers.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Default Single-Person Calculator Logic
    if (!formData.dob || !formData.tob || !formData.pob) {
      alert("Please fill in Birth Date, Birth Time, and Place of Birth.");
      return;
    }
    
    setLoading(true);
    const finalFormData = {
      name: formData.name.trim() || "Seeker",
      dob: formData.dob,
      tob: formData.tob,
      pob: formData.pob,
      is_calculator: true
    };

    const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

    try {
      const response = await fetch(`${apiUrl}/api/horoscope/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalFormData)
      });
      
      const data = await response.json();
      if (response.ok) {
        const insights = getCalculatorInsights(data, id);
        setResult(insights);
      } else {
        alert(data.detail || "Failed to calculate. Please try again.");
      }
    } catch (error) {
      console.error("Calculator error:", error);
      alert("Connection failed. Could not reach celestial servers.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("calculators");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div className="pt-24 pb-24 relative z-10 bg-[#FDFBF7] min-h-screen overflow-hidden font-[Outfit,sans-serif]">
      
      {/* Premium top banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[220px] md:h-[260px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
        <div className="absolute inset-0 bg-black/55 z-10" />
        
        {/* Decorative background orbits */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full border border-[#B38B36]/15 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-16 -right-16 w-[350px] h-[350px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

        <div className="relative z-20 max-w-4xl mx-auto px-6 w-full text-center mt-6">
          <button 
            onClick={handleGoBack} 
            className="inline-flex items-center text-white/70 hover:text-[#B38B36] transition-colors mb-4 group cursor-pointer text-[10px] tracking-[0.25em] uppercase font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            Back to Calculators
          </button>
          <span className="text-[8px] tracking-[0.25em] text-[#B38B36] uppercase font-bold block mb-1">Free Calculators</span>
          <h1 className="font-serif text-3xl md:text-4xl text-white font-bold tracking-wide">{calc.title}</h1>
          <p className="text-white/70 max-w-xl mx-auto text-xs leading-relaxed font-light mt-1.5">{calc.desc}</p>
        </div>
      </motion.div>

      {/* Floating decorative elements for body content */}
      <div className="absolute top-[350px] left-1/4 w-[50%] h-[50%] bg-[#B38B36]/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[50%] h-[50%] bg-[#725D46]/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 mt-12">
        {!result ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(60,42,33,0.06)] border border-[#B38B36]/20"
          >
            <div className="space-y-6">
              
              {/* Mode 1: Flames Calculator (Names only) */}
              {id === "flames" && (
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  {/* Your Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#B38B36]" /> Your Name
                    </label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  {/* Partner's Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#B38B36]" /> Partner's Name
                    </label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" 
                      placeholder="Enter partner's name" 
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Mode 2: Kundli Matching (Two full birth details profiles) */}
              {id === "kundli-matching" && (
                <div className="space-y-8">
                  {/* Partner 1 Info */}
                  <div className="bg-[#FDFBF7]/50 p-6 rounded-2xl border border-[#B38B36]/15 text-left space-y-4">
                    <h3 className="font-serif text-[#8E6B23] font-bold text-sm tracking-wider flex items-center gap-2 border-b border-[#B38B36]/10 pb-2">
                      <User className="w-4 h-4" /> First Partner Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53]">Full Name</label>
                        <input 
                          required
                          type="text" 
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21]" 
                          placeholder="Name / Seeker" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53]">Date of Birth</label>
                        <input 
                          required
                          type="date" 
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer" 
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53]">Time of Birth</label>
                        <input 
                          required
                          type="time" 
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer" 
                          value={formData.tob}
                          onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Partner 1 Place of Birth Selectors */}
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B38B36]" /> Place of Birth
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          required
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer"
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                          ))}
                        </select>

                        <select
                          required
                          disabled={states.length === 0}
                          value={selectedState}
                          onChange={handleStateChange}
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>

                        <select
                          required
                          disabled={!selectedCountry || (states.length > 0 && !selectedState)}
                          value={selectedCity}
                          onChange={handleCityChange}
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Select City</option>
                          {cities.map((city, idx) => (
                            <option key={idx} value={city.name}>{city.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Partner 2 Info */}
                  <div className="bg-[#FDFBF7]/50 p-6 rounded-2xl border border-[#B38B36]/15 text-left space-y-4">
                    <h3 className="font-serif text-[#8E6B23] font-bold text-sm tracking-wider flex items-center gap-2 border-b border-[#B38B36]/10 pb-2">
                      <User className="w-4 h-4" /> Second Partner Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53]">Full Name</label>
                        <input 
                          required
                          type="text" 
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21]" 
                          placeholder="Name / Partner" 
                          value={formData.partnerName}
                          onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53]">Date of Birth</label>
                        <input 
                          required
                          type="date" 
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer" 
                          value={formData.partnerDob}
                          onChange={(e) => setFormData({ ...formData, partnerDob: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53]">Time of Birth</label>
                        <input 
                          required
                          type="time" 
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer" 
                          value={formData.partnerTob}
                          onChange={(e) => setFormData({ ...formData, partnerTob: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Partner 2 Place of Birth Selectors */}
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#6E5D53] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B38B36]" /> Place of Birth
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select
                          required
                          value={selectedCountryPartner}
                          onChange={handleCountryChangePartner}
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer"
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                          ))}
                        </select>

                        <select
                          required
                          disabled={statesPartner.length === 0}
                          value={selectedStatePartner}
                          onChange={handleStateChangePartner}
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Select State</option>
                          {statesPartner.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>

                        <select
                          required
                          disabled={!selectedCountryPartner || (statesPartner.length > 0 && !selectedStatePartner)}
                          value={selectedCityPartner}
                          onChange={handleCityChangePartner}
                          className="w-full bg-white/70 border border-[#E5E1D8] rounded-lg px-3 py-2 outline-none focus:border-[#B38B36] text-xs text-[#3C2A21] cursor-pointer disabled:opacity-50"
                        >
                          <option value="">Select City</option>
                          {citiesPartner.map((city, idx) => (
                            <option key={idx} value={city.name}>{city.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Default Single Person Calculators */}
              {id !== "flames" && id !== "kundli-matching" && (
                <>
                  {/* Full Name */}
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#B38B36]" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" 
                      placeholder="Enter your name (optional)" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Birth Date and Time */}
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#B38B36]" /> Date of Birth
                      </label>
                      <input 
                        required 
                        type="date" 
                        className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer" 
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#B38B36]" /> Time of Birth
                      </label>
                      <input 
                        required 
                        type="time" 
                        className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer" 
                        value={formData.tob}
                        onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Cascading Place of Birth Dropdowns */}
                  <div className="space-y-2 text-left">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#B38B36]" /> Place of Birth
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <select
                          required
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer appearance-none"
                        >
                          <option value="">Select Country</option>
                          {countries.map((c) => (
                            <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B38B36]">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>

                      <div className="relative">
                        <select
                          required
                          disabled={states.length === 0}
                          value={selectedState}
                          onChange={handleStateChange}
                          className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B38B36]">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>

                      <div className="relative">
                        <select
                          required
                          disabled={!selectedCountry || (states.length > 0 && !selectedState)}
                          value={selectedCity}
                          onChange={handleCityChange}
                          className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select City</option>
                          {cities.map((city, idx) => (
                            <option key={idx} value={city.name}>{city.name}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B38B36]">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-[#B38B36] text-white rounded-full py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#9A752B] transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-white" /> Calculating Cosmos...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" /> Reveal Insights
                  </span>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/60 backdrop-blur-xl p-6 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_rgba(60,42,33,0.08)] border border-[#B38B36]/30 text-center relative overflow-hidden"
          >
            {/* Elegant double-line golden frames */}
            <div className="absolute inset-4 border border-[#B38B36]/20 rounded-[2rem] pointer-events-none z-0" />
            <div className="absolute inset-5 border border-[#B38B36]/5 rounded-[1.8rem] pointer-events-none z-0" />
            
            {/* Fine line orbit visuals in background */}
            <svg viewBox="0 0 100 100" className="absolute -right-20 -top-20 h-80 text-[#B38B36]/5 fill-none pointer-events-none z-0">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>

            <div className="relative z-10 space-y-6">
              
              {/* Cosmic Insignia Icon */}
              <div className="w-16 h-16 mx-auto bg-[#B38B36]/10 rounded-full flex items-center justify-center border border-[#B38B36]/20 shadow-inner">
                {result.isFlames ? (
                  <Flame className="w-8 h-8 text-red-500 animate-pulse" />
                ) : result.isKundliMatch ? (
                  <Heart className="w-8 h-8 text-[#8E6B23] animate-pulse" />
                ) : (
                  <Sparkles className="w-8 h-8 text-[#8E6B23] animate-pulse" />
                )}
              </div>

              {/* Title & Results Values */}
              <div>
                <h3 className="font-serif text-2xl text-[#3C2A21] font-medium tracking-wide mb-1">
                  {result.isKundliMatch ? "Vedic Horoscope Compatibility" : result.isFlames ? "FLAMES Friendship & Love Test" : "Your Celestial Blueprint"}
                </h3>
                
                {/* Score display */}
                {result.isKundliMatch ? (
                  <div className="inline-block px-6 py-2 border border-[#B38B36]/30 rounded-full bg-[#B38B36]/5 text-[#8E6B23] font-serif font-bold text-xl mt-2">
                    {result.calculatedValue}
                  </div>
                ) : result.isFlames ? (
                  <div className="flex flex-col items-center gap-1 mt-2">
                    <span className="text-[10px] uppercase font-bold text-stone-500 tracking-widest">{result.name1} & {result.name2}</span>
                    <span className={`inline-block px-8 py-3 border rounded-full font-serif font-black text-2xl shadow-inner ${result.colorClass}`}>
                      {result.flamesName}
                    </span>
                  </div>
                ) : (
                  <h4 className="font-serif text-lg text-[#8E6B23] font-semibold tracking-wide border-b border-[#B38B36]/20 pb-2 px-6 inline-block">
                    {result.calculatedValue}
                  </h4>
                )}
              </div>

              {/* Comparative Profile Layout for Kundli Match */}
              {result.isKundliMatch && (
                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto border-t border-b border-[#B38B36]/10 py-4 my-2">
                  <div className="bg-white/40 border border-[#B38B36]/10 rounded-xl p-3.5 space-y-1">
                    <h5 className="font-serif text-xs font-bold text-[#3C2A21] border-b border-stone-200 pb-1">{result.name1}</h5>
                    <div className="text-[11px] text-stone-500 space-y-0.5 text-left pl-2">
                      <p><strong>Moon Sign:</strong> {result.rasi1}</p>
                      <p><strong>Nakshatra:</strong> {result.nakshatra1}</p>
                      <p><strong>Ascendant:</strong> {result.lagna1}</p>
                    </div>
                  </div>
                  <div className="bg-white/40 border border-[#B38B36]/10 rounded-xl p-3.5 space-y-1">
                    <h5 className="font-serif text-xs font-bold text-[#3C2A21] border-b border-stone-200 pb-1">{result.name2}</h5>
                    <div className="text-[11px] text-stone-500 space-y-0.5 text-left pl-2">
                      <p><strong>Moon Sign:</strong> {result.rasi2}</p>
                      <p><strong>Nakshatra:</strong> {result.nakshatra2}</p>
                      <p><strong>Ascendant:</strong> {result.lagna2}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description box */}
              <div className="bg-white/45 border border-[#B38B36]/15 rounded-2xl p-6 text-left text-xs md:text-sm text-[#5C4D43] leading-relaxed max-w-2xl mx-auto shadow-[0_10px_30px_rgba(179,139,54,0.04)] font-light">
                <p className="first-letter:text-2xl first-letter:font-serif first-letter:text-[#8E6B23] first-letter:mr-1 first-letter:float-left">
                  {result.description}
                </p>
              </div>

              {/* Kundli Match Breakdown of 8 Kutas */}
              {result.isKundliMatch && (
                <div className="max-w-2xl mx-auto text-left">
                  <h5 className="font-serif text-[#8E6B23] text-xs uppercase tracking-widest text-center mb-4 font-semibold flex items-center justify-center gap-3">
                    <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                    Ashta Koota Compatibility Breakdown
                    <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                  </h5>
                  <div className="bg-white/45 border border-[#B38B36]/10 rounded-2xl p-4 md:p-6 divide-y divide-[#B38B36]/10 shadow-[0_10px_30px_rgba(179,139,54,0.04)]">
                    {result.breakdown.map((koot, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2.5 text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[#3C2A21] font-serif font-bold block">{koot.name}</span>
                          <span className="text-[10px] text-stone-500 italic block">{koot.desc}</span>
                        </div>
                        <span className={`font-mono font-bold px-3 py-1 rounded-full text-xs shadow-inner ${
                          koot.score === 0 
                            ? 'text-red-600 bg-red-50 border border-red-100' 
                            : koot.score === koot.max 
                            ? 'text-green-600 bg-green-50 border border-green-100'
                            : 'text-[#8E6B23] bg-[#B38B36]/10 border border-[#B38B36]/10'
                        }`}>
                          {koot.score} / {koot.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Coordinates Grid (Single Person only) */}
              {!result.isFlames && !result.isKundliMatch && (
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-2 max-w-2xl mx-auto">
                  <div className="bg-white/55 border border-[#B38B36]/15 hover:border-[#B38B36]/40 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] block mb-1.5 font-bold">Moon Sign</span>
                    <span className="text-xs md:text-sm text-[#3C2A21] font-serif font-semibold">{result.rasi?.split(" ")[0]}</span>
                  </div>
                  <div className="bg-white/55 border border-[#B38B36]/15 hover:border-[#B38B36]/40 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] block mb-1.5 font-bold">Nakshatra</span>
                    <span className="text-xs md:text-sm text-[#3C2A21] font-serif font-semibold">{result.nakshatra}</span>
                  </div>
                  <div className="bg-white/55 border border-[#B38B36]/15 hover:border-[#B38B36]/40 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] block mb-1.5 font-bold">Rising Sign</span>
                    <span className="text-xs md:text-sm text-[#3C2A21] font-serif font-semibold">{result.lagna?.split(" ")[0]}</span>
                  </div>
                </div>
              )}

              {/* Graha Sthiti (Single Person only) */}
              {!result.isFlames && !result.isKundliMatch && result.planetaryPositions && (
                <div className="max-w-2xl mx-auto mb-2 text-left">
                  <h5 className="font-serif text-[#8E6B23] text-xs uppercase tracking-widest text-center mb-4 font-semibold flex items-center justify-center gap-3">
                    <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                    Planetary Positions (Graha Sthiti)
                    <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                  </h5>
                  <div className="grid grid-cols-3 gap-3 bg-white/45 p-4 rounded-2xl border border-[#B38B36]/10 shadow-[0_10px_30px_rgba(179,139,54,0.04)]">
                    {Object.entries(result.planetaryPositions).map(([planet, sign]) => (
                      <div key={planet} className="flex justify-between items-center px-3 py-1.5 border-b border-[#B38B36]/10 text-xs">
                        <span className="text-[#6E5D53] font-medium">{planet}</span>
                        <span className="text-[#3C2A21] font-serif font-semibold">{sign}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-xl mx-auto pt-4">
                <button 
                  onClick={() => setResult(null)}
                  className="text-xs uppercase tracking-widest font-bold text-[#6E5D53] border border-stone-300 hover:border-stone-500 bg-white px-8 py-4 rounded-full transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                  Recalculate
                </button>
                <button 
                  onClick={handleGoBack}
                  className="text-xs uppercase tracking-widest font-bold text-white bg-[#B38B36] hover:bg-[#8E6B23] px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 transform flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-white" />
                  Explore More Calculators
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
};

export default CalculatorPage;
