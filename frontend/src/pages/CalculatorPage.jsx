import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Calendar, Clock, MapPin, User } from "lucide-react";
import { Country, State, City } from "country-state-city";

const CALCULATOR_DETAILS = {
  "moon-sign": { title: "Moon Sign Calculator", desc: "Understand your emotional nature, instincts, and how you truly respond to life situations." },
  "numerology": { title: "Numerology Calculator", desc: "Discover your core personality, identity, and the deeper forces that influence your everyday actions." },
  "kundli-matching": { title: "Kundli Matching", desc: "Decode your life path, destiny, and hidden patterns through the power of numbers." },
  "lagna": { title: "Lagna Calculator", desc: "Check marriage compatibility with detailed Guna Milan and deeper relationship insights." },
  "nakshatra": { title: "Nakshatra Calculator", desc: "Find your rising sign and understand how you express yourself and appear to the world." },
  "baby-name": { title: "Baby Name Calculator", desc: "Know your current Mahadasha and how planetary periods are shaping your life and decisions." },
  "flames": { title: "Flames Calculator", desc: "Explore your Chinese zodiac sign, personality traits, and the elements that influence your nature." },
  "rahu-ketu": { title: "Rahu Ketu Calculator", desc: "Reveal your personal lucky numbers to make better choices and attract positive opportunities." }
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
    case "kundli-matching":
      return {
        ...base,
        calculatedValue: "Relationship Harmony Analysis",
        description: life.relationship?.compatibility || "Your compatibility profile."
      };
    case "baby-name":
      return {
        ...base,
        calculatedValue: `Auspicious Syllables: ${astro.nakshatra.startsWith('Krithika') ? 'A, I, U, E' : 'L, A, E, O'}`,
        description: `Auspicious naming sounds derived from your Nakshatra (${astro.nakshatra}). Naming the baby with these letters aligns them harmoniously with cosmic energy.`
      };
    case "flames":
      return {
        ...base,
        calculatedValue: "FLAMES Compatibility Analysis",
        description: life.relationship?.marriage || "Your deep compatibility and relationship potential."
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
    pob: ""
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setCountries(Country.getAllCountries());
  }, [id]);

  // Handle Country Change
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

  // Handle State Change
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

  // Handle City Change
  const handleCityChange = (e) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
  };

  // Sync Country/State/City selections to formData.pob
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dob || !formData.tob || !formData.pob) {
      alert("Please fill in Birth Date, Birth Time, and Place of Birth.");
      return;
    }
    
    setLoading(true);
    const finalFormData = {
      ...formData,
      name: formData.name.trim() || "Seeker",
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
    <div className="pt-[140px] pb-24 relative z-10 bg-[#FDFBF7] min-h-screen overflow-hidden">
      {/* Mystic floating background shapes */}
      <div className="absolute top-20 left-1/4 w-[50%] h-[50%] bg-[#B38B36]/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[50%] h-[50%] bg-[#725D46]/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      
      {/* Rotating background orbits */}
      <div className="absolute top-36 -left-36 w-96 h-96 rounded-full border border-[#B38B36]/10 border-dashed animate-spin pointer-events-none z-0" style={{ animationDuration: '120s' }} />
      <div className="absolute bottom-36 -right-36 w-96 h-96 rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none z-0" style={{ animationDuration: '90s', animationDirection: 'reverse' }} />

      {/* Main content container */}
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Navigation back button */}
        <button 
          onClick={handleGoBack} 
          className="inline-flex items-center text-stone-500 hover:text-[#B38B36] transition-colors mb-8 group cursor-pointer text-xs font-bold tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Calculators
        </button>

        {/* Clean, Premium Title section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-[9px] tracking-[0.25em] text-[#8E6B23] uppercase font-black block mb-2">Free Calculators</span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#3C2A21] mb-4 font-bold tracking-tight">{calc.title}</h1>
          <p className="text-[#6E5D53] max-w-xl mx-auto text-xs md:text-sm leading-relaxed font-light">{calc.desc}</p>
        </motion.div>

        {!result ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(60,42,33,0.06)] border border-[#B38B36]/20"
          >
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-[#B38B36]" /> Full Name
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
                    <Calendar className="w-4.5 h-4.5 text-[#B38B36]" /> Date of Birth
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
                    <Clock className="w-4.5 h-4.5 text-[#B38B36]" /> Time of Birth
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
                  <MapPin className="w-4.5 h-4.5 text-[#B38B36]" /> Place of Birth
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Country */}
                  <div className="relative">
                    <select
                      required
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer appearance-none animate-none"
                    >
                      <option value="" className="bg-[#FFFDF9] text-[#3C2A21]">Select Country</option>
                      {countries.map((c) => (
                        <option key={c.isoCode} value={c.isoCode} className="bg-[#FFFDF9] text-[#3C2A21]">
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
                        className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer appearance-none animate-none"
                      >
                        <option value="" className="bg-[#FFFDF9] text-[#3C2A21]">Select State</option>
                        {states.map((s) => (
                          <option key={s.isoCode} value={s.isoCode} className="bg-[#FFFDF9] text-[#3C2A21]">
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
                      className="w-full bg-[#FDFBF7]/60 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21] cursor-pointer disabled:opacity-50 appearance-none animate-none"
                    >
                      <option value="" className="bg-[#FFFDF9] text-[#3C2A21]">Select City</option>
                      {cities.map((city, idx) => (
                        <option key={idx} value={city.name} className="bg-[#FFFDF9] text-[#3C2A21]">
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-[#B38B36] text-white rounded-full py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#9A752B] transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-white" /> Calculating Cosmos...
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
            className="bg-white/60 backdrop-blur-xl p-8 md:p-14 rounded-[2.5rem] shadow-[0_30px_60px_rgba(60,42,33,0.08)] border border-[#B38B36]/30 text-center relative overflow-hidden max-w-3xl mx-auto"
          >
            {/* Elegant double-line golden frames */}
            <div className="absolute inset-4 border border-[#B38B36]/20 rounded-[2rem] pointer-events-none z-0" />
            <div className="absolute inset-5 border border-[#B38B36]/5 rounded-[1.8rem] pointer-events-none z-0" />
            
            {/* Fine line orbit visuals in background */}
            <svg viewBox="0 0 100 100" className="absolute -right-20 -top-20 h-80 text-[#B38B36]/5 fill-none pointer-events-none z-0">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            </svg>

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto bg-[#B38B36]/10 rounded-full flex items-center justify-center mb-6 border border-[#B38B36]/20">
                <Sparkles className="w-10 h-10 text-[#8E6B23] animate-pulse" />
              </div>
              <h3 className="font-serif text-3xl text-[#3C2A21] font-semibold tracking-wide mb-2">Your Cosmic Destiny</h3>
              
              <h4 className="font-serif text-xl md:text-2xl text-[#8E6B23] font-semibold tracking-wide border-b border-[#B38B36]/20 pb-3 px-6 inline-block mb-8">
                {result.calculatedValue}
              </h4>
              
              {/* Detailed description paragraph */}
              <div className="bg-white/45 border border-[#B38B36]/15 rounded-2xl p-6 md:p-8 text-left text-sm md:text-base text-[#5C4D43] leading-relaxed space-y-4 mb-8 font-light max-w-2xl mx-auto shadow-[0_10px_30px_rgba(179,139,54,0.04)]">
                <p className="first-letter:text-3xl first-letter:font-serif first-letter:text-[#8E6B23] first-letter:mr-1 first-letter:float-left">{result.description}</p>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10 max-w-2xl mx-auto">
                <div className="bg-white/55 border border-[#B38B36]/15 hover:border-[#B38B36]/40 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-4">
                  <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] block mb-1.5 font-bold">Moon Sign</span>
                  <span className="text-xs md:text-sm text-[#3C2A21] font-serif font-semibold">{result.rasi?.split(" ")[0]}</span>
                </div>
                <div className="bg-white/55 border border-[#B38B36]/15 hover:border-[#B38B36]/40 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-4">
                  <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] block mb-1.5 font-bold">Nakshatra</span>
                  <span className="text-xs md:text-sm text-[#3C2A21] font-serif font-semibold">{result.nakshatra}</span>
                </div>
                <div className="bg-white/55 border border-[#B38B36]/15 hover:border-[#B38B36]/40 hover:shadow-[0_8px_25px_rgba(179,139,54,0.08)] hover:-translate-y-0.5 transition-all duration-300 rounded-xl p-4">
                  <span className="text-[9px] uppercase tracking-widest text-[#6E5D53] block mb-1.5 font-bold">Rising Sign</span>
                  <span className="text-xs md:text-sm text-[#3C2A21] font-serif font-semibold">{result.lagna?.split(" ")[0]}</span>
                </div>
              </div>

              {/* Graha Sthiti (Planetary Readouts) */}
              {result.planetaryPositions && (
                <div className="max-w-2xl mx-auto mb-10 text-left">
                  <h5 className="font-serif text-[#8E6B23] text-xs uppercase tracking-widest text-center mb-6 font-semibold flex items-center justify-center gap-3">
                    <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                    Planetary Positions (Graha Sthiti)
                    <span className="w-6 h-[1px] bg-[#B38B36]/30"></span>
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-white/45 p-5 rounded-2xl border border-[#B38B36]/10 shadow-[0_10px_30px_rgba(179,139,54,0.04)]">
                    {Object.entries(result.planetaryPositions).map(([planet, sign]) => (
                      <div key={planet} className="flex justify-between items-center px-4 py-2 border-b border-[#B38B36]/10 text-xs">
                        <span className="text-[#6E5D53] font-medium">{planet}</span>
                        <span className="text-[#3C2A21] font-serif font-semibold">{sign}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-center items-center max-w-xl mx-auto">
                <button 
                  onClick={() => setResult(null)}
                  className="text-xs uppercase tracking-widest font-bold text-white bg-[#B38B36] hover:bg-[#8E6B23] px-12 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 transform cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  Recalculate
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
