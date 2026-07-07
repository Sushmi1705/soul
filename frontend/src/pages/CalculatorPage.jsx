import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Heart, 
  Lock, 
  Unlock, 
  Flame, 
  CheckCircle2, 
  Activity,
  Moon,
  TrendingUp,
  Star,
  Loader2,
  ChevronRight
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

// --- GUNA MILAN (COMPATIBILITY) DATA ENGINE ---
const cleanName = (nak) => {
  if (!nak) return "";
  let clean = nak.split(" - ")[0].split(" ")[0].trim().toLowerCase();
  if (clean === "aswini") return "ashwini";
  if (clean === "krithika") return "krittika";
  if (clean === "aslesha") return "ashlesha";
  if (clean === "makha") return "magha";
  if (clean === "purvaphalguni") return "purva_phalguni";
  if (clean === "uttaraphalguni") return "uttara_phalguni";
  if (clean === "chitta") return "chitra";
  if (clean === "swathi") return "swati";
  if (clean === "vishhaka") return "vishakha";
  if (clean === "jyeshta") return "jyeshtha";
  if (clean === "poorvashada") return "purva_ashadha";
  if (clean === "uttarashada") return "uttara_ashadha";
  if (clean === "sravana") return "shravana";
  if (clean === "sathabhisha") return "shatabhisha";
  if (clean === "purvabhadra") return "purva_bhadrapada";
  if (clean === "uttarabhadra") return "uttara_bhadrapada";
  if (clean === "revathi") return "revati";
  return clean;
};

const NAKSHATRA_GANAS = {
  ashwini: "Deva", mrigashira: "Deva", punarvasu: "Deva", pushya: "Deva", hasta: "Deva", swati: "Deva", anuradha: "Deva", shravana: "Deva", revati: "Deva",
  bharani: "Manushya", rohini: "Manushya", ardra: "Manushya", purva_phalguni: "Manushya", uttara_phalguni: "Manushya", chitra: "Manushya", purva_ashadha: "Manushya", uttara_ashadha: "Manushya", purva_bhadrapada: "Manushya",
  krittika: "Rakshasa", ashlesha: "Rakshasa", magha: "Rakshasa", vishakha: "Rakshasa", jyeshtha: "Rakshasa", moola: "Rakshasa", dhanishta: "Rakshasa", shatabhisha: "Rakshasa", uttara_bhadrapada: "Rakshasa"
};

const NAKSHATRA_NADIS = {
  ashwini: "Adi", ardra: "Adi", punarvasu: "Adi", uttara_phalguni: "Adi", hasta: "Adi", jyeshtha: "Adi", moola: "Adi", shatabhisha: "Adi", purva_bhadrapada: "Adi",
  bharani: "Madhya", mrigashira: "Madhya", pushya: "Madhya", purva_phalguni: "Madhya", chitra: "Madhya", anuradha: "Madhya", purva_ashadha: "Madhya", dhanishta: "Madhya", uttarabhadra: "Madhya",
  krittika: "Antya", rohini: "Antya", ashlesha: "Antya", magha: "Antya", swati: "Antya", vishakha: "Antya", uttara_ashadha: "Antya", shravana: "Antya", revati: "Antya"
};

const NAKSHATRA_YONIS = {
  ashwini: "Horse", shatabhisha: "Horse",
  bharani: "Elephant", revati: "Elephant",
  krittika: "Sheep", pushya: "Sheep",
  rohini: "Serpent", mrigashira: "Serpent",
  ardra: "Dog", moola: "Dog",
  punarvasu: "Cat", ashlesha: "Cat",
  magha: "Rat", purva_phalguni: "Rat",
  uttara_phalguni: "Cow", uttara_bhadrapada: "Cow",
  hasta: "Buffalo", swati: "Buffalo",
  chitra: "Tiger", vishakha: "Tiger",
  anuradha: "Deer", jyeshtha: "Deer",
  purva_ashadha: "Monkey", shravana: "Monkey",
  uttara_ashadha: "Mongoose",
  dhanishta: "Lion", purva_bhadrapada: "Lion"
};

const NAKSHATRA_INDICES = {
  ashwini: 1, bharani: 2, krittika: 3, rohini: 4, mrigashira: 5, ardra: 6, punarvasu: 7, pushya: 8, ashlesha: 9,
  magha: 10, purva_phalguni: 11, uttara_phalguni: 12, hasta: 13, chitra: 14, swati: 15, vishakha: 16, anuradha: 17, jyeshtha: 18,
  moola: 19, purva_ashadha: 20, uttara_ashadha: 21, shravana: 22, dhanishta: 23, shatabhisha: 24, purva_bhadrapada: 25, uttara_bhadrapada: 26, revati: 27
};

const SIGNS_LIST = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const NAKSHATRAS_LIST = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
  "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const getNakshatraForPlanet = (signName, degree) => {
  const signIdx = getSignIdx(signName);
  const longitude = signIdx * 30.0 + degree;
  const nakIdx = Math.floor(longitude / 13.33333);
  return NAKSHATRAS_LIST[Math.min(Math.max(nakIdx, 0), 26)];
};

const PLANET_ABBREVIATIONS = {
  Sun: "Su",
  Moon: "Mo",
  Mars: "Ma",
  Mercury: "Me",
  Jupiter: "Ju",
  Venus: "Ve",
  Saturn: "Sa",
  Rahu: "Ra",
  Ketu: "Ke"
};

const getSignIdx = (signStr) => {
  if (!signStr) return 0;
  const clean = signStr.split(" ")[0].replace("(", "").replace(")", "").trim().toLowerCase();
  const idx = SIGNS_LIST.findIndex(s => s.toLowerCase() === clean);
  return idx === -1 ? 0 : idx;
};

// Deterministic degree generator
const getDeterministicDegree = (planetName, dob, tob) => {
  const seedStr = `${planetName}_${dob || "1990-01-01"}_${tob || "12:00"}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 3000) / 100.0;
};

// Navamsa calculator
const getNavamsaSignName = (signName, degree) => {
  const signIdx = getSignIdx(signName);
  const navIdx = Math.floor(degree / 3.33333);
  
  let startSignIdx = 0;
  const element = signIdx % 4;
  if (element === 0) startSignIdx = 0; // Fire
  else if (element === 1) startSignIdx = 9; // Earth
  else if (element === 2) startSignIdx = 6; // Air
  else if (element === 3) startSignIdx = 3; // Water
  
  const navSignIdx = (startSignIdx + navIdx) % 12;
  return SIGNS_LIST[navSignIdx];
};

const HOUSE_COORDINATES = [
  { planetsX: 50, planetsY: 18, numX: 50, numY: 33 }, // House 1
  { planetsX: 25, planetsY: 14, numX: 36, numY: 22 }, // House 2
  { planetsX: 14, planetsY: 25, numX: 22, numY: 36 }, // House 3
  { planetsX: 22, planetsY: 50, numX: 36, numY: 52 }, // House 4
  { planetsX: 14, planetsY: 75, numX: 22, numY: 66 }, // House 5
  { planetsX: 25, planetsY: 86, numX: 36, numY: 78 }, // House 6
  { planetsX: 50, planetsY: 82, numX: 50, numY: 67 }, // House 7
  { planetsX: 75, planetsY: 86, numX: 64, numY: 78 }, // House 8
  { planetsX: 86, planetsY: 75, numX: 78, numY: 66 }, // House 9
  { planetsX: 78, planetsY: 50, numX: 64, numY: 52 }, // House 10
  { planetsX: 86, planetsY: 25, numX: 78, numY: 36 }, // House 11
  { planetsX: 75, planetsY: 14, numX: 64, numY: 22 }  // House 12
];

const calculateChartData = (lagnaSignStr, planetaryPositions) => {
  const lagnaIdx = getSignIdx(lagnaSignStr);
  const data = [];
  
  for (let h = 0; h < 12; h++) {
    const signNum = ((lagnaIdx + h) % 12) + 1;
    const planets = [];
    
    // Add Lagna itself to House 1
    if (h === 0) {
      planets.push("As");
    }
    
    if (planetaryPositions) {
      Object.entries(planetaryPositions).forEach(([planet, signStr]) => {
        const pSignIdx = getSignIdx(signStr);
        const houseIdx = (pSignIdx - lagnaIdx + 12) % 12;
        if (houseIdx === h) {
          planets.push(PLANET_ABBREVIATIONS[planet] || planet.substring(0, 2));
        }
      });
    }
    
    data.push({
      ...HOUSE_COORDINATES[h],
      signNum,
      planets
    });
  }
  return data;
};

const calculateNavamsaData = (lagnaSignStr, planetaryPositions, dob, tob) => {
  const ascDegree = getDeterministicDegree("Lagna", dob, tob);
  const navAscSignName = getNavamsaSignName(lagnaSignStr, ascDegree);
  const navAscSignIdx = getSignIdx(navAscSignName);
  
  const data = [];
  
  for (let h = 0; h < 12; h++) {
    const signNum = ((navAscSignIdx + h) % 12) + 1;
    const planets = [];
    
    // Add Lagna (Ascendant) to House 1
    if (h === 0) {
      planets.push("As");
    }
    
    if (planetaryPositions) {
      Object.entries(planetaryPositions).forEach(([planet, signStr]) => {
        const pDegree = getDeterministicDegree(planet, dob, tob);
        const pNavSignName = getNavamsaSignName(signStr, pDegree);
        const pNavSignIdx = getSignIdx(pNavSignName);
        const houseIdx = (pNavSignIdx - navAscSignIdx + 12) % 12;
        if (houseIdx === h) {
          planets.push(PLANET_ABBREVIATIONS[planet] || planet.substring(0, 2));
        }
      });
    }
    
    data.push({
      ...HOUSE_COORDINATES[h],
      signNum,
      planets
    });
  }
  return data;
};

const KundliSvg = ({ chartData }) => {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Outer Border */}
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="#B38B36" strokeWidth="1.2" />
      
      {/* Diagonals */}
      <line x1="0" y1="0" x2="100" y2="100" stroke="#B38B36" strokeWidth="0.8" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="#B38B36" strokeWidth="0.8" />
      
      {/* Inner Diamond */}
      <line x1="50" y1="0" x2="100" y2="50" stroke="#B38B36" strokeWidth="0.8" />
      <line x1="100" y1="50" x2="50" y2="100" stroke="#B38B36" strokeWidth="0.8" />
      <line x1="50" y1="100" x2="0" y2="50" stroke="#B38B36" strokeWidth="0.8" />
      <line x1="0" y1="50" x2="50" y2="0" stroke="#B38B36" strokeWidth="0.8" />
      
      {/* Render each house content */}
      {chartData.map((house, idx) => (
        <g key={idx}>
          {/* Planets list text */}
          <text 
            x={house.planetsX} 
            y={house.planetsY} 
            textAnchor="middle" 
            className="text-[4px] font-sans font-extrabold fill-blue-800 tracking-tight"
          >
            {house.planets.join(" ")}
          </text>
          
          {/* Zodiac sign number text */}
          <text 
            x={house.numX} 
            y={house.numY} 
            textAnchor="middle" 
            className="text-[6px] font-serif font-bold fill-red-600"
          >
            {house.signNum}
          </text>
        </g>
      ))}
    </svg>
  );
};

const getVarna = (rasi) => {
  if (!rasi) return 1;
  const clean = rasi.split(" ")[0].trim().toLowerCase();
  const VARNAS = {
    cancer: 4, scorpio: 4, pisces: 4,
    aries: 3, leo: 3, sagittarius: 3,
    taurus: 2, virgo: 2, capricorn: 2,
    gemini: 1, libra: 1, aquarius: 1
  };
  return VARNAS[clean] || 1;
};

const getRasiVashyaGroup = (rasi) => {
  const r = rasi.split(" ")[0].trim().toLowerCase();
  if (r === "aries" || r === "taurus" || r === "leo") return "quadruped";
  if (r === "gemini" || r === "virgo" || r === "libra" || r === "aquarius" || r === "sagittarius") return "human";
  if (r === "cancer" || r === "pisces" || r === "capricorn") return "water";
  if (r === "scorpio") return "insect";
  return "human";
};

const calculateVashyaScore = (r1, r2) => {
  const g1 = getRasiVashyaGroup(r1);
  const g2 = getRasiVashyaGroup(r2);
  if (g1 === g2) return 2;
  if ((g1 === "human" && g2 === "water") || (g2 === "human" && g1 === "water")) return 1.5;
  if ((g1 === "human" && g2 === "quadruped") || (g2 === "human" && g1 === "quadruped")) return 1;
  return 0.5;
};

const calculateTaraScore = (n1, n2) => {
  const idx1 = NAKSHATRA_INDICES[cleanName(n1)] || 1;
  const idx2 = NAKSHATRA_INDICES[cleanName(n2)] || 1;
  const d1 = (idx2 - idx1 + 27) % 9;
  const d2 = (idx1 - idx2 + 27) % 9;
  const goodTaradhipati = [1, 2, 4, 6, 8, 0];
  const isD1Good = goodTaradhipati.includes(d1);
  const isD2Good = goodTaradhipati.includes(d2);
  if (isD1Good && isD2Good) return 3;
  if (isD1Good || isD2Good) return 1.5;
  return 0;
};

const calculateYoniScore = (y1, y2) => {
  if (y1 === y2) return 4;
  const enemies = [
    ["Horse", "Lion"], ["Lion", "Horse"],
    ["Elephant", "Lion"], ["Lion", "Elephant"],
    ["Sheep", "Monkey"], ["Monkey", "Sheep"],
    ["Serpent", "Mongoose"], ["Mongoose", "Serpent"],
    ["Dog", "Deer"], ["Deer", "Dog"],
    ["Cat", "Rat"], ["Rat", "Cat"],
    ["Cow", "Tiger"], ["Tiger", "Cow"],
    ["Buffalo", "Horse"], ["Horse", "Buffalo"]
  ];
  const isEnemy = enemies.some(([e1, e2]) => e1 === y1 && e2 === y2);
  if (isEnemy) return 0;
  
  const friendly = [
    ["Horse", "Deer"], ["Deer", "Horse"],
    ["Elephant", "Sheep"], ["Sheep", "Elephant"],
    ["Cow", "Buffalo"], ["Buffalo", "Cow"],
    ["Cat", "Dog"], ["Dog", "Cat"]
  ];
  const isFriendly = friendly.some(([f1, f2]) => f1 === y1 && f2 === y2);
  return isFriendly ? 3 : 2;
};

const getRasiLord = (rasi) => {
  if (!rasi) return "Mars";
  const r = rasi.split(" ")[0].trim().toLowerCase();
  if (r === "aries" || r === "scorpio") return "Mars";
  if (r === "taurus" || r === "libra") return "Venus";
  if (r === "gemini" || r === "virgo") return "Mercury";
  if (r === "cancer") return "Moon";
  if (r === "leo") return "Sun";
  if (r === "sagittarius" || r === "pisces") return "Jupiter";
  if (r === "capricorn" || r === "aquarius") return "Saturn";
  return "Mars";
};

const calculateMaitriScore = (r1, r2) => {
  const l1 = getRasiLord(r1);
  const l2 = getRasiLord(r2);
  if (l1 === l2) return 5;
  
  const friendship = {
    Sun: { Moon: "friend", Mars: "friend", Jupiter: "friend", Mercury: "neutral", Venus: "enemy", Saturn: "enemy" },
    Moon: { Sun: "friend", Mercury: "friend", Mars: "neutral", Jupiter: "neutral", Venus: "neutral", Saturn: "neutral" },
    Mars: { Sun: "friend", Moon: "friend", Jupiter: "friend", Mercury: "enemy", Venus: "neutral", Saturn: "neutral" },
    Mercury: { Sun: "friend", Venus: "friend", Moon: "enemy", Mars: "neutral", Jupiter: "neutral", Saturn: "neutral" },
    Jupiter: { Sun: "friend", Moon: "friend", Mars: "friend", Mercury: "enemy", Venus: "enemy", Saturn: "neutral" },
    Venus: { Mercury: "friend", Saturn: "friend", Sun: "enemy", Moon: "enemy", Mars: "neutral", Jupiter: "neutral" },
    Saturn: { Mercury: "friend", Venus: "friend", Sun: "enemy", Moon: "enemy", Mars: "enemy", Jupiter: "neutral" }
  };

  const f1 = friendship[l1]?.[l2] || "neutral";
  const f2 = friendship[l2]?.[l1] || "neutral";

  if (f1 === "friend" && f2 === "friend") return 5;
  if ((f1 === "friend" && f2 === "neutral") || (f2 === "friend" && f1 === "neutral")) return 4.5;
  if (f1 === "neutral" && f2 === "neutral") return 3;
  if ((f1 === "enemy" && f2 === "neutral") || (f2 === "enemy" && f1 === "neutral")) return 1.5;
  return 0;
};

const calculateBhakootScore = (r1, r2) => {
  const rasis = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
  const clean1 = r1.split(" ")[0].trim().toLowerCase();
  const clean2 = r2.split(" ")[0].trim().toLowerCase();
  const idx1 = rasis.indexOf(clean1);
  const idx2 = rasis.indexOf(clean2);
  if (idx1 === -1 || idx2 === -1) return 7;
  
  const diff = (idx2 - idx1 + 12) % 12 + 1;
  
  if ((diff === 2 || diff === 12) || (diff === 6 || diff === 8)) {
    return 0;
  }
  return 7;
};

const calculateGunaMilan = (p1, p2) => {
  const r1 = p1.rasi || "";
  const r2 = p2.rasi || "";
  const n1 = p1.nakshatra || "";
  const n2 = p2.nakshatra || "";
  
  const varna1 = getVarna(r1);
  const varna2 = getVarna(r2);
  const varnaScore = varna1 >= varna2 ? 1 : 0;
  const vashyaScore = calculateVashyaScore(r1, r2);
  const taraScore = calculateTaraScore(n1, n2);
  const yoniScore = calculateYoniScore(NAKSHATRA_YONIS[cleanName(n1)] || "Horse", NAKSHATRA_YONIS[cleanName(n2)] || "Horse");
  const maitriScore = calculateMaitriScore(r1, r2);
  
  const g1 = NAKSHATRA_GANAS[cleanName(n1)] || "Deva";
  const g2 = NAKSHATRA_GANAS[cleanName(n2)] || "Deva";
  let ganaScore = 0;
  if (g1 === g2) ganaScore = 6;
  else if ((g1 === "Deva" && g2 === "Manushya") || (g2 === "Deva" && g1 === "Manushya")) ganaScore = 5;
  else if ((g1 === "Deva" && g2 === "Rakshasa") || (g2 === "Deva" && g1 === "Rakshasa")) ganaScore = 1;
  
  const bhakootScore = calculateBhakootScore(r1, r2);
  
  const nadi1 = NAKSHATRA_NADIS[cleanName(n1)] || "Adi";
  const nadi2 = NAKSHATRA_NADIS[cleanName(n2)] || "Adi";
  const nadiScore = nadi1 !== nadi2 ? 8 : 0;
  
  const total = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;
  
  return {
    total,
    breakdown: [
      { name: "Varna (Work & Ego Compatibility)", score: varnaScore, max: 1 },
      { name: "Vashya (Mutual Attraction & Influence)", score: vashyaScore, max: 2 },
      { name: "Tara (Destiny & Auspiciousness)", score: taraScore, max: 3 },
      { name: "Yoni (Intimacy & Physical Harmony)", score: yoniScore, max: 4 },
      { name: "Graha Maitri (Planetary Friendship & Mental Bond)", score: maitriScore, max: 5 },
      { name: "Gana (Temperament & Behavior)", score: ganaScore, max: 6 },
      { name: "Bhakoot (Love, Family & Prosperity)", score: bhakootScore, max: 7 },
      { name: "Nadi (Health, Temperament & Genetics)", score: nadiScore, max: 8 }
    ]
  };
};

const calculateFlames = (name1, name2) => {
  const n1 = name1.toLowerCase().replace(/[^a-z]/g, "");
  const n2 = name2.toLowerCase().replace(/[^a-z]/g, "");
  if (!n1 || !n2) return { value: "Connection", desc: "Please fill names properly." };

  let count1 = {};
  let count2 = {};
  for (let char of n1) count1[char] = (count1[char] || 0) + 1;
  for (let char of n2) count2[char] = (count2[char] || 0) + 1;
  
  let remaining = 0;
  let allChars = new Set([...Object.keys(count1), ...Object.keys(count2)]);
  for (let char of allChars) {
    const c1 = count1[char] || 0;
    const c2 = count2[char] || 0;
    remaining += Math.abs(c1 - c2);
  }
  
  const flamesArray = ["Friends", "Lovers", "Affection", "Marriage", "Enemies", "Siblings"];
  let flames = [...flamesArray];
  
  let index = 0;
  while (flames.length > 1) {
    index = (index + remaining - 1) % flames.length;
    if (index < 0) index = flames.length - 1;
    flames.splice(index, 1);
  }
  
  const resultStatus = flames[0];
  const statusMap = {
    Friends: {
      value: "Friends 🤝",
      desc: "A bond built on trust, laughter, and mutual understanding. You support each other's dreams and stand strong through life's tides. Friendship is the best foundation for any beautiful relationship!"
    },
    Lovers: {
      value: "Lovers 💖",
      desc: "A passionate, romantic alignment of souls. There is a strong magnetic pull, deep affection, and a beautiful spark between you. Your hearts beat in a shared cosmic rhythm."
    },
    Affection: {
      value: "Affection 💕",
      desc: "Warmth, care, and genuine concern define your relationship. You feel comfortable in each other's presence, sharing a sweet bond of emotional proximity and mutual respect."
    },
    Marriage: {
      value: "Marriage 💍",
      desc: "A lifetime commitment of companionship, alignment, and shared destinies. The stars indicate that you are meant to build a home, co-create a future, and walk hand-in-hand forever."
    },
    Enemies: {
      value: "Enemies ⚡",
      desc: "A dynamic of intense energy, friction, and contrasting perspectives. While challenging, this relationship offers powerful mirrors for personal reflection, growth, and learning."
    },
    Siblings: {
      value: "Siblings 🌸",
      desc: "A protective, familiar, and caring bond that feels like home. You share a deep-seated connection where you look out for each other with unconditional support and playfulness."
    }
  };
  
  return statusMap[resultStatus] || { value: "Connection", desc: "A unique alignment of energies." };
};

const getCalculatorInsights = (data, calcId) => {
  const astro = data.astrology_details || {};
  const life = data.life_report || {};
  
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
        calculatedValue: `Auspicious Syllables: ${astro.nakshatra?.startsWith('Krithika') ? 'A, I, U, E' : 'L, A, E, O'}`,
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

// 15 Sparkling glitter stars scattered across the canvas
const GLITTER_STARS_DATA = [
  { top: "5%", left: "8%", size: "14px", delay: "0s", dur: "4s" },
  { top: "12%", left: "86%", size: "10px", delay: "1.2s", dur: "3.5s" },
  { top: "28%", left: "93%", size: "16px", delay: "0.4s", dur: "5s" },
  { top: "54%", left: "6%", size: "11px", delay: "2.1s", dur: "4.2s" },
  { top: "82%", left: "5%", size: "15px", delay: "0.8s", dur: "3.8s" },
  { top: "78%", left: "90%", size: "12px", delay: "2.5s", dur: "4.5s" },
  { top: "22%", left: "72%", size: "9px", delay: "1.5s", dur: "3s" },
  { top: "42%", left: "12%", size: "13px", delay: "1.7s", dur: "4.8s" },
  { top: "66%", left: "84%", size: "15px", delay: "0.2s", dur: "3.2s" },
  { top: "88%", left: "48%", size: "8px", delay: "2s", dur: "5.2s" },
  { top: "3%", left: "52%", size: "11px", delay: "0.6s", dur: "4.6s" },
  { top: "35%", left: "4%", size: "12px", delay: "1.9s", dur: "3.9s" },
  { top: "95%", left: "85%", size: "14px", delay: "2.8s", dur: "4s" },
  { top: "48%", left: "80%", size: "10px", delay: "0.9s", dur: "3.6s" },
  { top: "72%", left: "18%", size: "13px", delay: "1.1s", dur: "4.4s" }
];

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
    partnerName: "",
    partnerDob: "",
    partnerTob: "",
    partnerPob: ""
  });

  // Calculate Numerology values dynamically
  const getNumerologyData = () => {
    if (!formData.dob) return null;
    const [year, month, day] = formData.dob.split("-").map(Number);
    
    const sumDigits = (num) => {
      let str = String(num);
      let sum = 0;
      for (let char of str) {
        if (char >= '0' && char <= '9') {
          sum += Number(char);
        }
      }
      return sum;
    };
    
    const reduceToSingleDigit = (num) => {
      let val = num;
      while (val > 9) {
        val = sumDigits(val);
      }
      return val;
    };

    const mulank = reduceToSingleDigit(day);
    const bhagyank = reduceToSingleDigit(sumDigits(day) + sumDigits(month) + sumDigits(year));
    const successNumber = reduceToSingleDigit(sumDigits(day) + sumDigits(month));
    
    const yearSum = reduceToSingleDigit(year);
    const kuaMale = reduceToSingleDigit(11 - yearSum === 0 ? 9 : 11 - yearSum);
    const kuaFemale = reduceToSingleDigit(4 + yearSum);

    const chaldeanValues = {
      a:1, i:1, j:1, q:1, y:1,
      b:2, k:2, r:2,
      c:3, g:3, l:3, s:3,
      d:4, m:4, t:4,
      e:5, h:5, n:5, x:5,
      u:6, v:6, w:6,
      o:7, z:7,
      f:8, p:8
    };

    const getChaldeanSum = (str) => {
      let sum = 0;
      for (let char of str.toLowerCase()) {
        if (chaldeanValues[char]) {
          sum += chaldeanValues[char];
        }
      }
      return sum;
    };

    const nameNumber = reduceToSingleDigit(getChaldeanSum(formData.name || "Seeker"));

    const getVowelSum = (str) => {
      let sum = 0;
      const vowels = "aeiou";
      for (let char of str.toLowerCase()) {
        if (vowels.includes(char) && chaldeanValues[char]) {
          sum += chaldeanValues[char];
        }
      }
      return sum;
    };

    const soulUrge = reduceToSingleDigit(getVowelSum(formData.name || "Seeker") || 3);

    const luckyNumbersMap = {
      1: [1, 2, 3, 9],
      2: [1, 2, 5, 7],
      3: [1, 2, 3, 5, 7, 9],
      4: [1, 5, 6, 7],
      5: [1, 2, 3, 5, 6],
      6: [3, 5, 6, 9],
      7: [1, 3, 4, 5],
      8: [1, 3, 5, 6, 7],
      9: [1, 2, 3, 5, 6, 9]
    };

    const enemyNumbersMap = {
      1: [4, 6, 8],
      2: [8, 9],
      3: [6, 8],
      4: [2, 4, 8],
      5: [9],
      6: [1, 2, 8],
      7: [8, 9],
      8: [2, 4, 8],
      9: [4, 7, 8]
    };

    return {
      mulank,
      bhagyank,
      nameNumber,
      kuaMale,
      kuaFemale,
      successNumber,
      soulUrge,
      luckyNumbers: luckyNumbersMap[mulank] || [1, 2, 3],
      enemyNumbers: enemyNumbersMap[mulank] || [8]
    };
  };

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [countriesPartner, setCountriesPartner] = useState([]);
  const [statesPartner, setStatesPartner] = useState([]);
  const [citiesPartner, setCitiesPartner] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [selectedCountryPartner, setSelectedCountryPartner] = useState("");
  const [selectedStatePartner, setSelectedStatePartner] = useState("");
  const [selectedCityPartner, setSelectedCityPartner] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
    setCountriesPartner(allCountries);
  }, [id]);

  // Partner 1 Location Handlers
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

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  // Partner 2 Location Handlers
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

  const handleCityChangePartner = (e) => {
    setSelectedCityPartner(e.target.value);
  };

  // Sync selections to formData
  useEffect(() => {
    if (selectedCountry && selectedCity) {
      const countryObj = Country.getCountryByCode(selectedCountry);
      const stateObj = selectedState ? State.getStateByCodeAndCountry(selectedState, selectedCountry) : null;
      const parts = [selectedCity, stateObj ? stateObj.name : "", countryObj ? countryObj.name : ""].filter(Boolean);
      setFormData(prev => ({ ...prev, pob: parts.join(", ") }));
    } else {
      setFormData(prev => ({ ...prev, pob: "" }));
    }
  }, [selectedCountry, selectedState, selectedCity]);

  useEffect(() => {
    if (selectedCountryPartner && selectedCityPartner) {
      const countryObj = Country.getCountryByCode(selectedCountryPartner);
      const stateObj = selectedStatePartner ? State.getStateByCodeAndCountry(selectedStatePartner, selectedCountryPartner) : null;
      const parts = [selectedCityPartner, stateObj ? stateObj.name : "", countryObj ? countryObj.name : ""].filter(Boolean);
      setFormData(prev => ({ ...prev, partnerPob: parts.join(", ") }));
    } else {
      setFormData(prev => ({ ...prev, partnerPob: "" }));
    }
  }, [selectedCountryPartner, selectedStatePartner, selectedCityPartner]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (id === "flames") {
      if (!formData.name.trim() || !formData.partnerName.trim()) {
        alert("Please fill in both names.");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        const flamesResult = calculateFlames(formData.name, formData.partnerName);
        setResult({
          isFlames: true,
          partner1Name: formData.name.trim(),
          partner2Name: formData.partnerName.trim(),
          calculatedValue: flamesResult.value,
          description: flamesResult.desc
        });
        setLoading(false);
      }, 1000);
      return;
    }

    if (id === "kundli-matching") {
      if (!formData.dob || !formData.tob || !formData.pob || !formData.partnerDob || !formData.partnerTob || !formData.partnerPob) {
        alert("Please fill in both partners' birth details.");
        return;
      }
    } else {
      if (!formData.dob || !formData.tob || !formData.pob) {
        alert("Please fill in Birth Date, Birth Time, and Place of Birth.");
        return;
      }
    }
    
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

    try {
      if (id === "kundli-matching") {
        const [res1, res2] = await Promise.all([
          fetch(`${apiUrl}/api/horoscope/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name.trim() || "Partner 1",
              dob: formData.dob,
              tob: formData.tob,
              pob: formData.pob,
              is_calculator: true
            })
          }),
          fetch(`${apiUrl}/api/horoscope/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.partnerName.trim() || "Partner 2",
              dob: formData.partnerDob,
              tob: formData.partnerTob,
              pob: formData.partnerPob,
              is_calculator: true
            })
          })
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error("One or both profile generations failed.");
        }

        const data1 = await res1.json();
        const data2 = await res2.json();

        const gunaResult = calculateGunaMilan(data1.astrology_details, data2.astrology_details);

        setResult({
          isKundli: true,
          reportId: data1.id,
          partner1Name: formData.name.trim() || "Groom",
          partner2Name: formData.partnerName.trim() || "Bride",
          details1: data1.astrology_details,
          details2: data2.astrology_details,
          gunaResult: gunaResult
        });
      } else {
        const response = await fetch(`${apiUrl}/api/horoscope/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim() || "Seeker",
            dob: formData.dob,
            tob: formData.tob,
            pob: formData.pob,
            is_calculator: true
          })
        });
        
        const data = await response.json();
        if (response.ok) {
          const insights = getCalculatorInsights(data, id);
          setResult({
            ...insights,
            reportId: data.id,
            isSingle: true
          });
        } else {
          alert(data.detail || "Failed to calculate. Please try again.");
        }
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
    <div className="pt-20 md:pt-24 pb-6 md:pb-8 relative z-10 bg-[#FFFDF9] min-h-screen overflow-hidden text-[#3C2A21] font-sans">
      
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes glitter {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.7) rotate(0deg);
            color: #B38B36;
          }
          50% {
            opacity: 0.95;
            transform: scale(1.2) rotate(180deg);
            color: #BF953F;
            filter: drop-shadow(0 0 8px rgba(179,139,54,0.7));
          }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Glittering Star Particles Scattered on Background */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {GLITTER_STARS_DATA.map((star, idx) => (
          <div
            key={idx}
            className="absolute select-none pointer-events-none"
            style={{
              top: star.top,
              left: star.left,
              fontSize: star.size,
              animation: `glitter ${star.dur} infinite ease-in-out`,
              animationDelay: star.delay
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Light Premium Celestial Header (Removed Solid Dark Brown Background Block) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full py-4 md:py-5 bg-gradient-to-b from-[#FAF5EB] to-[#FFFDF9] flex items-center overflow-hidden border-b border-[#B38B36]/15"
      >
        {/* Subtle decorative orbits in gold */}
        <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full border border-[#B38B36]/10 border-dashed animate-[spinSlow_160s_linear_infinite] pointer-events-none z-0" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full border border-[#B38B36]/10 border-dotted animate-[spinSlow_100s_linear_infinite_reverse] pointer-events-none z-0" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 w-full text-center space-y-1.5 pt-2">
          {/* Aligned Heading & Back Button Row */}
          <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            <button 
              onClick={handleGoBack} 
              className="inline-flex items-center gap-1 text-[#6E5D53] hover:text-[#B38B36] border border-stone-300/80 hover:border-[#B38B36] bg-white/70 hover:bg-[#B38B36]/5 px-3 py-1.5 rounded-full transition-all duration-300 text-[9px] uppercase font-bold tracking-wider cursor-pointer shadow-sm shrink-0"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </button>
            
            <h1 className="font-serif text-2xl md:text-3.5xl text-[#3C2A21] font-bold tracking-wide leading-tight">
              {calc.title}
            </h1>
          </div>
          
          <p className="text-[#3C2A21] max-w-xl mx-auto text-[11px] md:text-xs font-medium leading-normal">
            {calc.desc}
          </p>
        </div>
      </motion.div>

      {/* Glowing atmospheric circles behind elements */}
      <div className="absolute top-[260px] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#E8D9FC]/25 blur-[120px] pointer-events-none z-0 animate-[pulseGlow_12s_infinite_ease-in-out]" />
      <div className="absolute bottom-5 right-[-15%] w-[700px] h-[700px] rounded-full bg-[#FDE7BA]/30 blur-[130px] pointer-events-none z-0 animate-[pulseGlow_16s_infinite_ease-in-out_reverse]" />

      {/* Main Form/Result Container (Smooth Spring Transition) */}
      <div className="max-w-4xl mx-auto px-6 relative z-10 mt-4 md:mt-6">
        
        {!result ? (
          <motion.form 
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 45, damping: 14 }}
            onSubmit={handleSubmit}
            className="bg-white/45 backdrop-blur-3xl p-4 md:p-6 md:py-8 rounded-[2rem] shadow-[0_30px_70px_rgba(179,139,54,0.06),0_1px_3px_rgba(0,0,0,0.02)] border border-white/80 relative overflow-hidden"
          >
            {/* Double Border Frame accent */}
            <div className="absolute inset-4 border border-[#B38B36]/15 rounded-[2rem] pointer-events-none z-0" />
            <div className="absolute inset-5.5 border border-[#B38B36]/5 rounded-[1.85rem] pointer-events-none z-0" />
            
            {/* Corner Decorative Stars (Glittering) */}
            <div className="absolute top-6 left-6 text-[#B38B36]/40 text-xs pointer-events-none select-none animate-[twinkle_3s_infinite_ease-in-out]">✦</div>
            <div className="absolute top-6 right-6 text-[#B38B36]/40 text-xs pointer-events-none select-none animate-[twinkle_4s_infinite_ease-in-out]" style={{ animationDelay: "1s" }}>✦</div>
            <div className="absolute bottom-6 left-6 text-[#B38B36]/40 text-xs pointer-events-none select-none animate-[twinkle_3.5s_infinite_ease-in-out]" style={{ animationDelay: "1.5s" }}>✦</div>
            <div className="absolute bottom-6 right-6 text-[#B38B36]/40 text-xs pointer-events-none select-none animate-[twinkle_4.5s_infinite_ease-in-out]" style={{ animationDelay: "0.5s" }}>✦</div>

            {/* Constellation background drawing */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full text-[#B38B36] opacity-[0.06] pointer-events-none select-none z-0">
              <circle cx="40" cy="50" r="1.5" className="fill-current" />
              <circle cx="80" cy="30" r="1.5" className="fill-current" />
              <circle cx="120" cy="40" r="2.2" className="fill-current" />
              <circle cx="160" cy="80" r="1.5" className="fill-current" />
              <circle cx="140" cy="140" r="1.2" className="fill-current" />
              <circle cx="60" cy="150" r="1.5" className="fill-current" />
              <line x1="40" y1="50" x2="80" y2="30" stroke="currentColor" strokeWidth="0.3" strokeDasharray="1 1" />
              <line x1="80" y1="30" x2="120" y2="40" stroke="currentColor" strokeWidth="0.3" />
              <line x1="120" y1="40" x2="160" y2="80" stroke="currentColor" strokeWidth="0.3" />
              <line x1="160" y1="80" x2="140" y2="140" stroke="currentColor" strokeWidth="0.3" strokeDasharray="2 2" />
              <line x1="140" y1="140" x2="60" y2="150" stroke="currentColor" strokeWidth="0.3" />
              <line x1="60" y1="150" x2="40" y2="50" stroke="currentColor" strokeWidth="0.3" />
              <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 3" />
            </svg>

            {/* FLAMES FORM STATE (HIDES ALL DATES/TIMES/PLACES) */}
            {id === "flames" ? (
              <div className="space-y-4 md:space-y-6 relative z-10 pt-2">
                <div className="text-center">
                  <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#B38B36]/25 rounded-full bg-[#B38B36]/5 text-[9px] tracking-widest text-[#8E6B23] uppercase font-bold mb-2">
                    ❤ Compatibility Game
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-medium text-[#3C2A21]">Name Compatibility Analysis</h3>
                  <p className="text-stone-500 text-xs mt-0.5 font-light max-w-md mx-auto">
                    Type in your name and your partner's name below to reveal the cosmic alignment between you two.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-left">
                  {/* Your Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#B38B36]" /> Your Name
                    </label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-[#FFFDF9]/65 backdrop-blur-md border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] shadow-sm font-light hover:bg-[#FFFDF9]/90 duration-300" 
                      placeholder="Enter your name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  {/* Partner Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <Heart className="w-4 h-4 text-[#B38B36]" /> Partner's Name
                    </label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-[#FFFDF9]/65 backdrop-blur-md border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] shadow-sm font-light hover:bg-[#FFFDF9]/90 duration-300" 
                      placeholder="Enter partner's name" 
                      value={formData.partnerName}
                      onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ) : id === "kundli-matching" ? (
              // KUNDLI MATCHING FORM STATE (TWO COMPLETE DETAIL CARDS)
              <div className="space-y-4 md:space-y-6 relative z-10 pt-2">
                <div className="text-center border-b border-[#B38B36]/10 pb-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#B38B36]/25 rounded-full bg-[#B38B36]/5 text-[9px] tracking-widest text-[#8E6B23] uppercase font-bold mb-2">
                    💫 Astrological Union
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-medium text-[#3C2A21]">Partner Compatibility Profiles</h3>
                  <p className="text-stone-500 text-[11px] md:text-xs mt-0.5 font-light max-w-md mx-auto">
                    Provide the birth coordinates of both partners. Guna Milan will calculate the 36-point compatibility grid.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-left items-start">
                  
                  {/* PARTNER 1 DETAILS CARD */}
                  <div className="bg-[#FFFDF9]/50 backdrop-blur-xl border border-[#B38B36]/15 rounded-2xl p-4 md:p-5 space-y-3 shadow-sm hover:border-[#B38B36]/30 transition-all duration-300">
                    <h4 className="font-serif text-sm md:text-base text-[#8E6B23] font-medium flex items-center gap-2 border-b border-[#B38B36]/15 pb-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#B38B36]/10 text-xs text-[#8E6B23] flex items-center justify-center font-bold">1</span>
                      👦 Groom's Details
                    </h4>
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#B38B36]" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none transition-all text-xs text-[#3C2A21] shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                        placeholder="Name (optional)" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Birth Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B38B36]" /> Birth Date
                        </label>
                        <input 
                          required 
                          type="date" 
                          className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-2 py-2 outline-none transition-all text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                          value={formData.dob}
                          onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#B38B36]" /> Birth Time
                        </label>
                        <input 
                          required 
                          type="time" 
                          className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-2 py-2 outline-none transition-all text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                          value={formData.tob}
                          onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Place of Birth Subgroup */}
                    <div className="bg-[#FFFDF9]/40 border border-[#B38B36]/10 rounded-2xl p-2.5 md:p-3 space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5 mb-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B38B36]" /> Place of Birth
                      </label>
                      
                      {/* Country */}
                      <select
                        required
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-white duration-300"
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                        ))}
                      </select>

                      {/* State */}
                      {states.length > 0 && (
                        <select
                          required
                          value={selectedState}
                          onChange={handleStateChange}
                          className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-white duration-300"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>
                      )}

                      {/* City */}
                      <select
                        required
                        disabled={!selectedCountry || (states.length > 0 && !selectedState)}
                        value={selectedCity}
                        onChange={handleCityChange}
                        className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none text-[11px] text-[#3C2A21] cursor-pointer disabled:opacity-50 shadow-sm hover:bg-white duration-300"
                      >
                        <option value="">Select City</option>
                        {cities.map((city, idx) => (
                          <option key={idx} value={city.name}>{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* PARTNER 2 DETAILS CARD */}
                  <div className="bg-[#FFFDF9]/50 backdrop-blur-xl border border-[#B38B36]/15 rounded-2xl p-4 md:p-5 space-y-3 shadow-sm hover:border-[#B38B36]/30 transition-all duration-300">
                    <h4 className="font-serif text-sm md:text-base text-[#8E6B23] font-medium flex items-center gap-2 border-b border-[#B38B36]/15 pb-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#B38B36]/10 text-xs text-[#8E6B23] flex items-center justify-center font-bold">2</span>
                      👧 Bride's Details
                    </h4>
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#B38B36]" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none transition-all text-xs text-[#3C2A21] shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                        placeholder="Name (optional)" 
                        value={formData.partnerName}
                        onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                      />
                    </div>

                    {/* Birth Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#B38B36]" /> Birth Date
                        </label>
                        <input 
                          required 
                          type="date" 
                          className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-2 py-2 outline-none transition-all text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                          value={formData.partnerDob}
                          onChange={(e) => setFormData({ ...formData, partnerDob: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#B38B36]" /> Birth Time
                        </label>
                        <input 
                          required 
                          type="time" 
                          className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-2 py-2 outline-none transition-all text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                          value={formData.partnerTob}
                          onChange={(e) => setFormData({ ...formData, partnerTob: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Place of Birth Subgroup */}
                    <div className="bg-[#FFFDF9]/40 border border-[#B38B36]/10 rounded-2xl p-2.5 md:p-3 space-y-1.5">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-1.5 mb-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B38B36]" /> Place of Birth
                      </label>
                      
                      {/* Country */}
                      <select
                        required
                        value={selectedCountryPartner}
                        onChange={handleCountryChangePartner}
                        className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-white duration-300"
                      >
                        <option value="">Select Country</option>
                        {countriesPartner.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                        ))}
                      </select>

                      {/* State */}
                      {statesPartner.length > 0 && (
                        <select
                          required
                          value={selectedStatePartner}
                          onChange={handleStateChangePartner}
                          className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none text-[11px] text-[#3C2A21] cursor-pointer shadow-sm hover:bg-white duration-300"
                        >
                          <option value="">Select State</option>
                          {statesPartner.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                          ))}
                        </select>
                      )}

                      {/* City */}
                      <select
                        required
                        disabled={!selectedCountryPartner || (statesPartner.length > 0 && !selectedStatePartner)}
                        value={selectedCityPartner}
                        onChange={handleCityChangePartner}
                        className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3 py-2 outline-none text-[11px] text-[#3C2A21] cursor-pointer disabled:opacity-50 shadow-sm hover:bg-white duration-300"
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
            ) : (
              // STANDARD SINGLE PERSON FORM STATE
              <div className="space-y-4 md:space-y-5 relative z-10 pt-2">
                
                {/* Full Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B38B36]" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] shadow-sm hover:bg-[#FFFDF9]/90 duration-300 font-light" 
                    placeholder="Enter your name (optional)" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Birth Date and Time */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-5 text-left">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#B38B36]" /> Date of Birth
                    </label>
                    <input 
                      required 
                      type="date" 
                      className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#B38B36]" /> Time of Birth
                    </label>
                    <input 
                      required 
                      type="time" 
                      className="w-full bg-[#FFFDF9]/65 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer shadow-sm hover:bg-[#FFFDF9]/90 duration-300" 
                      value={formData.tob}
                      onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                    />
                  </div>
                </div>

                {/* Cascading Place of Birth Dropdowns Grouped Container */}
                <div className="space-y-2 text-left bg-[#FFFDF9]/40 border border-[#B38B36]/15 rounded-2xl p-4 md:p-5 shadow-sm hover:border-[#B38B36]/35 transition-all duration-300">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2 mb-0.5">
                    <MapPin className="w-4 h-4 text-[#B38B36]" /> Place of Birth
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Country */}
                    <div className="relative">
                      <select
                        required
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none text-sm text-[#3C2A21] cursor-pointer shadow-sm hover:bg-white duration-300"
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.isoCode} value={c.isoCode}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B38B36]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>

                    {/* State */}
                    {states.length > 0 ? (
                      <div className="relative">
                        <select
                          required
                          value={selectedState}
                          onChange={handleStateChange}
                          className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none text-sm text-[#3C2A21] cursor-pointer shadow-sm hover:bg-white duration-300"
                        >
                          <option value="">Select State</option>
                          {states.map((s) => (
                            <option key={s.isoCode} value={s.isoCode}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B38B36]">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                      </div>
                    ) : (
                      <div className="hidden md:block" />
                    )}

                    {/* City */}
                    <div className="relative">
                      <select
                        required
                        disabled={!selectedCountry || (states.length > 0 && !selectedState)}
                        value={selectedCity}
                        onChange={handleCityChange}
                        className="w-full bg-white/80 border border-[#E5E1D8] focus:border-[#B38B36] rounded-xl px-3.5 py-2.5 outline-none text-sm text-[#3C2A21] cursor-pointer disabled:opacity-50 shadow-sm hover:bg-white duration-300"
                      >
                        <option value="">Select City</option>
                        {cities.map((city, idx) => (
                          <option key={idx} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#B38B36]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Glowing gold shimmer button with spring hover properties */}
            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.02, y: -1.5 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 md:mt-8 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-[1.12] text-[#1E110A] rounded-full py-3.5 font-serif font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-2.5 transition-all duration-300 disabled:opacity-70 shadow-[0_6px_20px_rgba(179,139,54,0.35)] cursor-pointer border border-[#FCF6BA]/40 relative z-10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#1E110A]" /> 
                  <span>Calculating Cosmos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1E110A]" /> 
                  <span>Reveal Insights</span>
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          // ==================== RESULTS CARD DISPLAY ====================
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 45, damping: 14 }}
            className="bg-white/45 backdrop-blur-3xl p-4 md:p-6 md:py-8 rounded-[2rem] shadow-[0_30px_70px_rgba(179,139,54,0.06),0_1px_3px_rgba(0,0,0,0.02)] border border-white/80 text-center relative overflow-hidden"
          >
            {/* Elegant double-line golden frames */}
            <div className="absolute inset-4 border border-[#B38B36]/20 rounded-[1.65rem] pointer-events-none z-0" />
            <div className="absolute inset-5.5 border border-[#B38B36]/5 rounded-[1.5rem] pointer-events-none z-0" />
            
            {/* Rotating astronomical background graphic */}
            <div className="absolute -right-24 -top-24 w-80 h-80 opacity-[0.04] animate-[spinSlow_150s_linear_infinite] pointer-events-none select-none z-0 text-[#B38B36]">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-current">
                <circle cx="50" cy="50" r="45" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="30" strokeWidth="0.3" />
                <circle cx="50" cy="50" r="15" strokeWidth="0.3" strokeDasharray="1 1" />
              </svg>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto space-y-4 md:space-y-6">
              
              {/* Icon Badge */}
              <div className="w-12 h-12 mx-auto bg-[#B38B36]/10 rounded-full flex items-center justify-center border border-[#B38B36]/20 shadow-inner">
                {result.isFlames ? (
                  <Flame className="w-5.5 h-5.5 text-[#8E6B23] animate-pulse" />
                ) : result.isKundli ? (
                  <Heart className="w-5.5 h-5.5 text-[#8E6B23] animate-pulse" />
                ) : (
                  <Sparkles className="w-5.5 h-5.5 text-[#8E6B23] animate-pulse" />
                )}
              </div>

              {/* Header Title */}
              <div>
                <span className="text-[9px] tracking-[0.25em] text-[#8E6B23] uppercase font-black block mb-1">Calculation Complete</span>
                <h3 className="font-serif text-3xl text-[#3C2A21] font-semibold tracking-wide">
                  {result.isFlames ? "Relationship Alignment" : result.isKundli ? "Kundli Matching Harmony" : id === "numerology" ? "Your Numerology Report" : id === "rahu-ketu" ? "Rahu & Ketu Details" : "Your Cosmic Coordinates"}
                </h3>
              </div>

              {/* ==================== 1. KUNDLI MATCHING RESULTS VIEW ==================== */}
              {result.isKundli && (
                <div className="space-y-6">
                  {/* Both Partners Summary */}
                  <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                    <div className="bg-[#FFFDF9]/60 border border-[#B38B36]/15 rounded-2xl p-4">
                      <span className="text-[9px] uppercase tracking-widest text-[#8E6B23] block mb-1.5 font-bold">Partner 1: {result.partner1Name}</span>
                      <p className="text-xs text-[#3C2A21] font-serif font-bold">Rasi: {result.details1.rasi}</p>
                      <p className="text-[10px] text-[#6E5D53] font-light mt-0.5">Nakshatra: {result.details1.nakshatra}</p>
                    </div>
                    <div className="bg-[#FFFDF9]/60 border border-[#B38B36]/15 rounded-2xl p-4">
                      <span className="text-[9px] uppercase tracking-widest text-[#8E6B23] block mb-1.5 font-bold">Partner 2: {result.partner2Name}</span>
                      <p className="text-xs text-[#3C2A21] font-serif font-bold">Rasi: {result.details2.rasi}</p>
                      <p className="text-[10px] text-[#6E5D53] font-light mt-0.5">Nakshatra: {result.details2.nakshatra}</p>
                    </div>
                  </div>

                  {/* Compatibility Score Display */}
                  <div className="relative border border-[#B38B36]/25 bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] shadow-[0_10px_35px_rgba(179,139,54,0.04),inset_0_1px_3px_rgba(255,255,255,0.9)] rounded-3xl p-5 max-w-md mx-auto text-center space-y-2 overflow-hidden">
                    {/* Corner decorative circles */}
                    <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full border border-[#B38B36]/10" />
                    <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full border border-[#B38B36]/10" />
                    
                    <span className="text-[9px] text-[#8E6B23] uppercase tracking-[0.25em] font-black block">Vedic Guna Milan Score</span>
                    
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="34" className="stroke-[#B38B36]/10 fill-none" strokeWidth="3" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="34" 
                          className="stroke-[#B38728] fill-none animate-[goldPulse_3s_infinite_ease-in-out]" 
                          strokeWidth="3.5" 
                          strokeDasharray="213.6" 
                          strokeDashoffset={213.6 - (213.6 * (result.gunaResult.total || 0)) / 36}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute font-serif text-2xl font-black text-[#3C2A21] mt-0.5">
                        {result.gunaResult.total}
                      </div>
                    </div>
                    
                    <div className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase mt-1">out of 36 Gunas</div>
                    <div className="text-xs font-serif italic text-[#3C2A21] mt-2 font-medium px-4">
                      {result.gunaResult.total >= 25 ? (
                        <span className="text-green-700">🌟 Excellent Compatibility! An exceptionally auspicious and harmonious union.</span>
                      ) : result.gunaResult.total >= 18 ? (
                        <span className="text-green-600">✨ Good Compatibility. A harmonious match suitable for a lasting partnership.</span>
                      ) : (
                        <span className="text-amber-700">⚠ Low Compatibility. Vedic alignment indicates areas of potential friction requiring understanding.</span>
                      )}
                    </div>
                  </div>

                  {/* 8 Kutas Progress Bars Breakdown */}
                  <div className="max-w-2xl mx-auto space-y-3 text-left">
                    <h5 className="font-serif text-[#8E6B23] text-[10px] uppercase tracking-widest text-center font-bold flex items-center justify-center gap-3">
                      <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                      Detailed 8 Kuta Breakdown
                      <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                    </h5>
                    
                    <div className="space-y-2.5 max-w-2xl mx-auto">
                      {result.gunaResult.breakdown.map((kuta, idx) => (
                        <div key={idx} className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/15 hover:border-[#B38B36]/35 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 transition-all shadow-[0_4px_12px_rgba(179,139,54,0.02)]">
                          <div className="flex-1 text-left">
                            <span className="font-serif text-xs text-[#3C2A21] font-bold block">{kuta.name}</span>
                            <div className="w-full bg-[#B38B36]/5 rounded-full h-1.5 mt-1.5 border border-[#B38B36]/5 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-[#BF953F] to-[#B38728] h-full rounded-full" 
                                style={{ width: `${(kuta.score / kuta.max) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 justify-end">
                            <span className="text-xs font-bold text-[#8E6B23]">{kuta.score}</span>
                            <span className="text-[10px] text-stone-400">/</span>
                            <span className="text-[10px] text-[#6E5D53]">{kuta.max} Gunas</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 2. FLAMES COMPATIBILITY RESULTS VIEW ==================== */}
              {result.isFlames && (
                <div className="space-y-6 max-w-xl mx-auto">
                  {/* Names Summary */}
                  <div className="flex items-center justify-center gap-3 font-serif text-lg text-[#3C2A21]">
                    <span className="font-bold bg-[#B38B36]/10 px-3.5 py-1.5 border border-[#B38B36]/15 rounded-xl">{result.partner1Name}</span>
                    <span className="text-[#8E6B23] animate-pulse">❤</span>
                    <span className="font-bold bg-[#B38B36]/10 px-3.5 py-1.5 border border-[#B38B36]/15 rounded-xl">{result.partner2Name}</span>
                  </div>

                  {/* FLAMES Badge */}
                  <div className="relative border border-[#B38B36]/25 bg-gradient-to-tr from-[#FFFDF9] to-[#FFF9ED] shadow-[0_15px_40px_rgba(179,139,54,0.06),inset_0_1px_3px_rgba(255,255,255,0.9)] rounded-3xl p-5 md:p-7 overflow-hidden">
                    <div className="absolute inset-1.5 border border-[#B38B36]/10 rounded-[1.25rem] pointer-events-none" />
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#B38B36]/5 rounded-full blur-xl pointer-events-none" />
                    
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#8E6B23] block mb-1.5 font-bold">Calculated FLAMES Status</span>
                    <div className="font-serif text-2xl md:text-3.5xl text-[#8E6B23] font-black tracking-wide drop-shadow-sm animate-[goldPulse_4s_infinite_ease-in-out]">
                      {result.calculatedValue}
                    </div>
                    <div className="text-xs text-stone-600 leading-relaxed mt-3.5 font-light italic px-4">
                      "{result.description}"
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 3. SINGLE-PERSON CALCULATORS RESULTS VIEW ==================== */}
              {result.isSingle && id === "numerology" ? (
                <div className="space-y-8 text-center">
                  
                  {/* Intro subtitle */}
                  <p className="text-xs text-[#725D46] font-light max-w-xl mx-auto -mt-2">
                    Unlock your divine numeric blueprint. Your birthdate and name carry distinct vibrational frequencies that outline your destiny path.
                  </p>

                  {/* Report Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-3xl mx-auto text-left">
                    
                    {/* Mulank Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">01</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-3">Mulank (Driver)</span>
                      <div className="w-12 h-12 rounded-full border-2 border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-black text-xl bg-[#FBF6EC] shadow-sm">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.mulank : "-";
                        })()}
                      </div>
                      <span className="text-[9px] text-[#725D46] font-light italic mt-2">Driver of your personality</span>
                    </div>

                    {/* Bhagyank Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">02</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-3">Bhagyank (Conductor)</span>
                      <div className="w-12 h-12 rounded-full border-2 border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-black text-xl bg-[#FBF6EC] shadow-sm">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.bhagyank : "-";
                        })()}
                      </div>
                      <span className="text-[9px] text-[#725D46] font-light italic mt-2">Conductor of your life path</span>
                    </div>

                    {/* Name Number Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">03</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-3">Name Number</span>
                      <div className="w-12 h-12 rounded-full border-2 border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-black text-xl bg-[#FBF6EC] shadow-sm">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.nameNumber : "-";
                        })()}
                      </div>
                      <span className="text-[9px] text-[#725D46] font-light italic mt-2">Vibration of your name</span>
                    </div>

                    {/* Kua Number Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">04</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-3">Kua Number</span>
                      {(() => {
                        const nd = getNumerologyData();
                        return nd ? (
                          <div className="flex gap-3 mt-1">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full border border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-bold text-sm bg-white">
                                {nd.kuaMale}
                              </div>
                              <span className="text-[8px] text-stone-400 font-bold uppercase mt-1">Male</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full border border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-bold text-sm bg-white">
                                {nd.kuaFemale}
                              </div>
                              <span className="text-[8px] text-stone-400 font-bold uppercase mt-1">Female</span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                      <span className="text-[9px] text-[#725D46] font-light italic mt-2">Cosmic energy index</span>
                    </div>

                    {/* Success Number Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">05</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-3">Success Number</span>
                      <div className="w-12 h-12 rounded-full border-2 border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-black text-xl bg-[#FBF6EC] shadow-sm">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.successNumber : "-";
                        })()}
                      </div>
                      <span className="text-[9px] text-[#725D46] font-light italic mt-2">Key to material progress</span>
                    </div>

                    {/* Soul Urge Number Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">06</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-3">Soul Urge Number</span>
                      <div className="w-12 h-12 rounded-full border-2 border-[#B38B36] flex items-center justify-center text-[#B38B36] font-serif font-black text-xl bg-[#FBF6EC] shadow-sm">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.soulUrge : "-";
                        })()}
                      </div>
                      <span className="text-[9px] text-[#725D46] font-light italic mt-2">Your deepest inner desire</span>
                    </div>

                    {/* Lucky Numbers Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative col-span-2 md:col-span-1 text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">07</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-2">Lucky Numbers</span>
                      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.luckyNumbers.map((num) => (
                            <span key={num} className="w-8 h-8 rounded-full border border-green-200 bg-green-50 flex items-center justify-center text-green-700 font-serif font-black text-xs shadow-sm">
                              {num}
                            </span>
                          )) : null;
                        })()}
                      </div>
                      <span className="text-[9px] text-green-600 font-bold uppercase mt-2">Auspicious Harmony</span>
                    </div>

                    {/* Enemy Numbers Card */}
                    <div className="bg-white/70 border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col items-center justify-between min-h-[140px] shadow-sm relative col-span-2 text-center">
                      <div className="absolute top-2.5 right-3 text-[#B38B36]/10 text-xl font-serif">08</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-2">Enemy Numbers</span>
                      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                        {(() => {
                          const nd = getNumerologyData();
                          return nd ? nd.enemyNumbers.map((num) => (
                            <span key={num} className="w-8 h-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-700 font-serif font-black text-xs shadow-sm">
                              {num}
                            </span>
                          )) : null;
                        })()}
                      </div>
                      <span className="text-[9px] text-red-600 font-bold uppercase mt-2">Hostile Resonance - Avoid</span>
                    </div>

                  </div>

                  {/* PREMIUM ASTROLOGY DIVIDER */}
                  <div className="flex items-center justify-center gap-4 my-8 max-w-2xl mx-auto">
                    <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#B38B36]/30"></span>
                    <span className="text-[#8E6B23] font-serif text-[10px] uppercase tracking-widest font-extrabold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#B38B36]" />
                      Vedic Astrology Blueprint
                    </span>
                    <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#B38B36]/30"></span>
                  </div>

                  {/* Description & Birth Chart Details */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE]/85 border border-[#B38B36]/20 rounded-2xl p-5 md:p-6 text-left text-xs md:text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto shadow-[0_8px_30px_rgba(179,139,54,0.03),inset_0_1px_2px_rgba(255,255,255,0.9)] relative">
                      <div className="absolute inset-1 border border-[#B38B36]/10 rounded-xl pointer-events-none" />
                      <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#8E6B23] first-letter:mr-2.5 first-letter:float-left first-letter:leading-[0.8] first-letter:pt-1 font-light text-stone-600">
                        {result.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 md:gap-3.5 max-w-2xl mx-auto">
                      <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                          <Moon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Moon Sign</span>
                          <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.rasi?.split(" ")[0]}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Nakshatra</span>
                          <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.nakshatra}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                        <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Rising Sign</span>
                          <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.lagna?.split(" ")[0]}</span>
                        </div>
                      </div>
                    </div>

                    {result.planetaryPositions && (
                      <div className="max-w-2xl mx-auto space-y-3 text-left">
                        <h5 className="font-serif text-[#8E6B23] text-[10px] uppercase tracking-widest text-center font-bold flex items-center justify-center gap-3">
                          <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                          Planetary Positions (Graha Sthiti)
                          <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                          {Object.entries(result.planetaryPositions).map(([planet, sign]) => (
                            <div key={planet} className="bg-white/40 border border-[#B38B36]/15 hover:border-[#B38B36]/35 rounded-xl p-2 md:p-2.5 flex items-center justify-between text-xs transition-all hover:bg-white/60 shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                              <span className="text-[#8E6B23] font-serif font-semibold">{planet}</span>
                              <span className="text-[#3C2A21] font-light bg-[#B38B36]/5 border border-[#B38B36]/10 px-2 py-0.5 rounded-lg text-[11px]">{sign}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              ) : result.isSingle && id === "rahu-ketu" ? (() => {
                const lagnaIdx = getSignIdx(result.lagna);
                
                const rahuSign = result.planetaryPositions?.Rahu || "Aries";
                const rahuDeg = getDeterministicDegree("Rahu", formData.dob, formData.tob);
                const rahuNak = getNakshatraForPlanet(rahuSign, rahuDeg);
                const rahuHouse = ((getSignIdx(rahuSign) - lagnaIdx + 12) % 12) + 1;

                const ketuSign = result.planetaryPositions?.Ketu || "Libra";
                const ketuDeg = getDeterministicDegree("Ketu", formData.dob, formData.tob);
                const ketuNak = getNakshatraForPlanet(ketuSign, ketuDeg);
                const ketuHouse = ((getSignIdx(ketuSign) - lagnaIdx + 12) % 12) + 1;

                return (
                  <div className="space-y-8 text-center">
                    
                    {/* Intro subtitle */}
                    <p className="text-xs text-[#725D46] font-light max-w-xl mx-auto -mt-2">
                      Discover the placements of Rahu (North Node) and Ketu (South Node) in your birth chart, representing your karmic desires, pending debts, and spiritual destiny.
                    </p>

                    {/* Report Grid */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left animate-fadeIn">
                      
                      {/* Rahu Card */}
                      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FFFDF5] border-2 border-amber-200/50 hover:border-amber-300 rounded-3xl p-6 shadow-sm hover:shadow transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#B38B36]/5 rounded-full blur-lg pointer-events-none" />
                        <h4 className="font-serif text-2xl font-black text-[#8E6B23] mb-4 border-b border-stone-200 pb-2">Rahu</h4>
                        
                        <div className="space-y-3 text-xs text-[#3C2A21]">
                          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                            <span className="font-bold text-stone-500">Rashi (Sign)</span>
                            <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-[#E5E1D8] px-3.5 py-1 rounded-xl shadow-sm">
                              {rahuSign}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                            <span className="font-bold text-stone-500">Nakshatra</span>
                            <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-[#E5E1D8] px-3.5 py-1 rounded-xl shadow-sm">
                              {rahuNak}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1.5">
                            <span className="font-bold text-stone-500">House</span>
                            <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-[#E5E1D8] px-3.5 py-1 rounded-xl shadow-sm">
                              House {rahuHouse}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Ketu Card */}
                      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FFFDF5] border-2 border-amber-200/50 hover:border-amber-300 rounded-3xl p-6 shadow-sm hover:shadow transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#B38B36]/5 rounded-full blur-lg pointer-events-none" />
                        <h4 className="font-serif text-2xl font-black text-[#8E6B23] mb-4 border-b border-stone-200 pb-2">Ketu</h4>
                        
                        <div className="space-y-3 text-xs text-[#3C2A21]">
                          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                            <span className="font-bold text-stone-500">Rashi (Sign)</span>
                            <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-[#E5E1D8] px-3.5 py-1 rounded-xl shadow-sm">
                              {ketuSign}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                            <span className="font-bold text-stone-500">Nakshatra</span>
                            <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-[#E5E1D8] px-3.5 py-1 rounded-xl shadow-sm">
                              {ketuNak}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center py-1.5">
                            <span className="font-bold text-stone-500">House</span>
                            <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-[#E5E1D8] px-3.5 py-1 rounded-xl shadow-sm">
                              House {ketuHouse}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* PREMIUM ASTROLOGY DIVIDER */}
                    <div className="flex items-center justify-center gap-4 my-8 max-w-2xl mx-auto">
                      <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#B38B36]/30"></span>
                      <span className="text-[#8E6B23] font-serif text-[10px] uppercase tracking-widest font-extrabold flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#B38B36]" />
                        Vedic Astrology Blueprint
                      </span>
                      <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#B38B36]/30"></span>
                    </div>

                    {/* Description & Birth Chart Details */}
                    <div className="space-y-6">
                      <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE]/85 border border-[#B38B36]/20 rounded-2xl p-5 md:p-6 text-left text-xs md:text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto shadow-[0_8px_30px_rgba(179,139,54,0.03),inset_0_1px_2px_rgba(255,255,255,0.9)] relative">
                        <div className="absolute inset-1 border border-[#B38B36]/10 rounded-xl pointer-events-none" />
                        <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#8E6B23] first-letter:mr-2.5 first-letter:float-left first-letter:leading-[0.8] first-letter:pt-1 font-light text-stone-600">
                          {result.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 md:gap-3.5 max-w-2xl mx-auto text-left">
                        <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                            <Moon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Moon Sign</span>
                            <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.rasi?.split(" ")[0]}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Nakshatra</span>
                            <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.nakshatra}</span>
                          </div>
                        </div>
                        
                        <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                          <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Rising Sign</span>
                            <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.lagna?.split(" ")[0]}</span>
                          </div>
                        </div>
                      </div>

                      {result.planetaryPositions && (
                        <div className="max-w-2xl mx-auto space-y-3 text-left">
                          <h5 className="font-serif text-[#8E6B23] text-[10px] uppercase tracking-widest text-center font-bold flex items-center justify-center gap-3">
                            <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                            Planetary Positions (Graha Sthiti)
                            <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                          </h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                            {Object.entries(result.planetaryPositions).map(([planet, sign]) => (
                              <div key={planet} className="bg-white/40 border border-[#B38B36]/15 hover:border-[#B38B36]/35 rounded-xl p-2 md:p-2.5 flex items-center justify-between text-xs transition-all hover:bg-white/60 shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                                <span className="text-[#8E6B23] font-serif font-semibold">{planet}</span>
                                <span className="text-[#3C2A21] font-light bg-[#B38B36]/5 border border-[#B38B36]/10 px-2 py-0.5 rounded-lg text-[11px]">{sign}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })() : result.isSingle && (
                <div className="space-y-6">
                  {/* If Lagna Calculator, render Lagna & Navamsa Charts side by side */}
                  {id === "lagna" && (() => {
                    const lagnaChartData = calculateChartData(result.lagna, result.planetaryPositions);
                    const navamsaChartData = calculateNavamsaData(result.lagna, result.planetaryPositions, formData.dob, formData.tob);
                    return (
                      <div className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                          
                          {/* Lagna Chart Card */}
                          <div className="bg-[#FFFDF9]/60 border border-[#B38B36]/25 rounded-2xl p-5 text-center shadow-sm">
                            <h4 className="font-serif text-sm font-bold text-[#3C2A21] uppercase tracking-wider mb-4">Lagna Chart</h4>
                            <div className="w-full max-w-[280px] aspect-square mx-auto">
                              <KundliSvg chartData={lagnaChartData} />
                            </div>
                          </div>

                          {/* Navamsa Chart Card */}
                          <div className="bg-[#FFFDF9]/60 border border-[#B38B36]/25 rounded-2xl p-5 text-center shadow-sm">
                            <h4 className="font-serif text-sm font-bold text-[#3C2A21] uppercase tracking-wider mb-4">Navamsa Chart</h4>
                            <div className="w-full max-w-[280px] aspect-square mx-auto">
                              <KundliSvg chartData={navamsaChartData} />
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* Calculated Value Glowing Badge */}
                  <div className="inline-block bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] border border-[#B38B36]/30 px-6 py-2.5 rounded-2xl shadow-[0_4px_12px_rgba(179,139,54,0.08)]">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[#8E6B23] font-bold block mb-1">Result Placements</span>
                    <span className="font-serif text-lg md:text-xl text-[#3C2A21] font-bold">{result.calculatedValue}</span>
                  </div>

                  {/* Decorative separator */}
                  <div className="flex items-center justify-center gap-2 my-1">
                    <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B38B36]/30"></span>
                    <span className="text-[#B38B36]/60 text-[8px] animate-pulse">✦</span>
                    <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B38B36]/30"></span>
                  </div>
                  
                  {/* Detailed Description Prose (Manuscript style) */}
                  <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE]/85 border border-[#B38B36]/20 rounded-2xl p-5 md:p-6 text-left text-xs md:text-sm text-stone-700 leading-relaxed max-w-2xl mx-auto shadow-[0_8px_30px_rgba(179,139,54,0.03),inset_0_1px_2px_rgba(255,255,255,0.9)] relative">
                    <div className="absolute inset-1 border border-[#B38B36]/10 rounded-xl pointer-events-none" />
                    <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:text-[#8E6B23] first-letter:mr-2.5 first-letter:float-left first-letter:leading-[0.8] first-letter:pt-1 font-light text-stone-600">
                      {result.description}
                    </p>
                  </div>

                  {/* Astro Coordinates Badges with custom icons */}
                  <div className="grid grid-cols-3 gap-2.5 md:gap-3.5 max-w-2xl mx-auto">
                    <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                        <Moon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Moon Sign</span>
                        <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.rasi?.split(" ")[0]}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Nakshatra</span>
                        <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.nakshatra}</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 backdrop-blur-sm border border-[#B38B36]/20 hover:border-[#B38B36]/50 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-3 text-left flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 bg-[#B38B36]/10 rounded-lg text-[#8E6B23] shrink-0 border border-[#B38B36]/10">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-[#8E6B23] block mb-0.5 font-bold">Rising Sign</span>
                        <span className="text-xs text-[#3C2A21] font-serif font-bold">{result.lagna?.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Graha Sthiti (Planetary Readouts) */}
                  {result.planetaryPositions && (
                    <div className="max-w-2xl mx-auto space-y-3 text-left">
                      <h5 className="font-serif text-[#8E6B23] text-[10px] uppercase tracking-widest text-center font-bold flex items-center justify-center gap-3">
                        <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                        Planetary Positions (Graha Sthiti)
                        <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 md:gap-3">
                        {Object.entries(result.planetaryPositions).map(([planet, sign]) => (
                          <div key={planet} className="bg-white/40 border border-[#B38B36]/15 hover:border-[#B38B36]/35 rounded-xl p-2 md:p-2.5 flex items-center justify-between text-xs transition-all hover:bg-white/60 shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                            <span className="text-[#8E6B23] font-serif font-semibold">{planet}</span>
                            <span className="text-[#3C2A21] font-light bg-[#B38B36]/5 border border-[#B38B36]/10 px-2 py-0.5 rounded-lg text-[11px]">{sign}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== BUTTON ACTIONS ==================== */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 max-w-xl mx-auto pt-4 border-t border-[#B38B36]/15">
                
                {/* Recalculate Option */}
                <motion.button 
                  onClick={() => setResult(null)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto text-[10px] uppercase tracking-widest font-bold text-[#6E5D53] hover:text-[#3C2A21] border border-stone-300 hover:border-stone-500 px-6 py-2.5 rounded-full transition-all duration-300 transform cursor-pointer flex items-center justify-center gap-1.5 bg-white shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Recalculate
                </motion.button>

                {/* Redirect to checkout flow for complete destiny analysis */}
                {result.reportId && (
                  <motion.button 
                    onClick={() => navigate(`/payment?reportId=${result.reportId}`)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto text-[10px] uppercase tracking-widest font-serif font-bold text-[#1E110A] bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-[1.12] px-6 py-2.5 rounded-full transition-all duration-500 shadow-[0_4px_12px_rgba(179,139,54,0.3)] transform cursor-pointer flex items-center justify-center gap-1.5 border border-[#FCF6BA]/40"
                  >
                    <Unlock className="w-3.5 h-3.5 stroke-[2.5px]" />
                    <span>Unlock Full Report</span>
                  </motion.button>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default CalculatorPage;
