import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Moon, Star, Loader2, User, Calendar, Clock, MapPin } from "lucide-react";
import { useDesign } from "@/context/DesignContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Country, State, City } from "country-state-city";

const LOADING_MESSAGES = [
  "Mapping planetary coordinates...",
  "Calculating Nakshatra alignment...",
  "Synthesizing Lagna (Rising Sign) aspects...",
  "Aligning birth chart with today's transits...",
  "Consulting the celestial blueprint..."
];

const ZODIAC_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const PLANET_GLYPHS = [
  { symbol: "☉", angle: 0 },
  { symbol: "☽", angle: 40 },
  { symbol: "☿", angle: 80 },
  { symbol: "♀", angle: 120 },
  { symbol: "♂", angle: 160 },
  { symbol: "♃", angle: 200 },
  { symbol: "♄", angle: 240 },
  { symbol: "☊", angle: 280 },
  { symbol: "☋", angle: 320 }
];

const starNodes = [
  { x: 42, y: 44, delay: 0.1 },
  { x: 50, y: 38, delay: 0.3 },
  { x: 58, y: 46, delay: 0.5 },
  { x: 50, y: 50, delay: 0.7 },
  { x: 40, y: 56, delay: 0.9 },
  { x: 48, y: 62, delay: 1.1 },
  { x: 60, y: 56, delay: 1.3 }
];

const starLines = [
  { from: 0, to: 1, delay: 0.4 },
  { from: 1, to: 2, delay: 0.6 },
  { from: 2, to: 3, delay: 0.8 },
  { from: 3, to: 4, delay: 1.0 },
  { from: 4, to: 5, delay: 1.2 },
  { from: 3, to: 6, delay: 1.4 }
];

const getCalculationLogs = (data) => {
  const nameLabel = data.name ? data.name.toUpperCase() : "SEEKER";
  const cityLabel = data.pob ? data.pob.split(",")[0].trim() : "COORDINATES";
  
  return [
    `INIT: Aligning celestial chart for ${nameLabel}...`,
    `GEOLOC: Resolving lat/long for ${cityLabel}...`,
    `TIME: Syncing local birth time ${data.tob} (${data.dob})...`,
    `EPHEMERIS: Loading high-precision JPL DE440 ephemeris...`,
    `AYANAMSA: Applying Lahiri zodiac correction (-24.25°)...`,
    `SUN: Computing longitude... Resolving degree aspects...`,
    `MOON: Tracking Lunar Mansion (Nakshatra) positions...`,
    `LAGNA: Calculating Ascendant for POB coordinates...`,
    `SUCCESS: Celestial blueprint mapped. Preparing report...`
  ];
};

const CelestialOracleHero = () => {
  const { bgDesign } = useDesign();
  const navigate = useNavigate();
  
  const [step, setStep] = useState("form"); // "form" | "loading"
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    pob: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState([]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Load countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

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

  // Sync country, state, city to formData.pob
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

  const videoIds = {
    design1: "csfFVRy_2nM",
    design2: "csfFVRy_2nM",
    design3: "csfFVRy_2nM",
    design4: "csfFVRy_2nM"
  };

  const currentVideoId = videoIds[bgDesign] || videoIds.design1;
  const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";

  // Cycle loading messages
  useEffect(() => {
    let timer;
    if (step === "loading") {
      timer = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(timer);
  }, [step]);

  // Load calculations dynamic logs ticker
  useEffect(() => {
    if (step !== "loading") {
      setVisibleLogs([]);
      return;
    }
    
    setVisibleLogs([]);
    const logsList = getCalculationLogs(formData);
    
    const timers = [];
    logsList.forEach((logText, idx) => {
      const timer = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, logText].slice(-4));
      }, idx * 320);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [step, formData]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dob || !formData.tob || !formData.pob) {
      toast.error("Please fill in Birth Date, Birth Time, and Place of Birth.");
      return;
    }

    setSubmitting(true);
    setStep("loading");

    try {
      const response = await fetch(`${apiUrl}/api/horoscope/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (response.ok) {
        // Artificially wait to show the cosmic loading animations
        setTimeout(() => {
          navigate(`/payment?reportId=${data.id}`);
        }, 3000);
      } else {
        toast.error(data.detail || "Failed to generate horoscope. Try again.");
        setStep("form");
      }
    } catch (error) {
      console.error("Horoscope error:", error);
      toast.error("Connection failed. Could not reach celestial servers.");
      setStep("form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHeroButtonClick = () => {
    const element = document.getElementById("hero-form-card");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        document.getElementById("name-input")?.focus();
      }, 500);
    }
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-[110vh] flex items-center overflow-hidden bg-[#FDFBF7]"
      >
        {/* Light Refraction & Prism Effects */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] bg-gradient-to-l from-[#B38B36]/10 to-transparent blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[100%] bg-gradient-to-tr from-[#B38B36]/5 to-transparent blur-[100px] rounded-full" />
        </div>

        {/* Video Background (Subtle & Ethereal Astrology Loop) */}
        <div className="hidden md:block absolute inset-0 z-0 opacity-[0.25] overflow-hidden">
          <iframe
            key={currentVideoId}
            className="absolute top-1/2 left-1/2 w-[110vw] h-[62vw] min-h-[110vh] min-w-[195vh] -translate-x-1/2 -translate-y-1/2 scale-110 grayscale contrast-[1.1] brightness-[1.0] max-w-none"
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&loop=1&playlist=${currentVideoId}&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0&hd=1`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>

        {/* Massive Decorative Typography (Background Layer) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none pointer-events-none">
          <span className="font-serif text-[40vw] text-brand-dark/[0.02] leading-none tracking-tighter uppercase translate-y-20">
            Oracle
          </span>
        </div>

        {/* Main Content (Asymmetric Layout) */}
        <div className="relative z-20 max-w-7xl xl:max-w-[1360px] 2xl:max-w-[1480px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 items-center py-20 lg:py-0">
          
          {/* Left Column: Heading and Marketing Copy */}
          <div className="lg:col-span-7 text-left">
            <div className="flex items-center gap-4 mb-8 animate-reveal opacity-0" style={{ animationDelay: '0.2s' }}>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 border border-[#B38B36]/30 rounded-full bg-[#B38B36]/10 text-[10px] tracking-[0.2em] uppercase text-[#B38B36] font-bold">
                ✨ AI Personalized Horoscope
              </span>
            </div>

            <h1 className="font-serif text-[#3C2A21] text-4xl md:text-6xl lg:text-[4.8rem] leading-[1.1] tracking-tight mb-8 animate-reveal opacity-0" style={{ animationDelay: '0.4s' }}>
              Do You Know How Your Day Will <span className="italic font-light text-[#8E6B23] block sm:inline">Unfold Today?</span>
            </h1>

            <div className="max-w-lg space-y-8 animate-reveal opacity-0" style={{ animationDelay: '0.6s' }}>
              <p className="text-lg text-stone-500 leading-relaxed font-light">
                Discover what the stars have planned for you. Reveal today's cosmic guidance, planetary movements, and see what destiny has planned in seconds.
              </p>
              <div className="flex flex-row items-center gap-4">
                <button 
                  onClick={handleHeroButtonClick}
                  className="px-6 py-3.5 bg-[#B38B36] hover:bg-[#8E6B23] text-white text-[9px] tracking-[0.2em] uppercase font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Check My Horoscope
                </button>
                <button 
                  onClick={handleHeroButtonClick}
                  className="px-6 py-3.5 border border-[#B38B36]/40 hover:bg-[#B38B36] text-[#8E6B23] hover:text-white text-[9px] tracking-[0.2em] uppercase font-bold rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Reveal Future
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Birth Chart Input Form */}
          <div className="lg:col-span-5 relative w-full mt-8 lg:mt-0 animate-reveal opacity-0" style={{ animationDelay: '0.8s' }}>
            <div className="relative w-full max-w-md lg:ml-auto lg:mr-0 mx-auto z-10 xl:translate-x-6 2xl:translate-x-12 transition-transform duration-500">
               <div className="absolute inset-0 bg-[#B38B36]/5 blur-[100px] rounded-full pointer-events-none" />
               
               {/* Slow Rotating Background Zodiac Wheel Watermark */}
               <svg viewBox="0 0 1000 1000" className="w-full h-full text-[#B38B36] fill-current opacity-15 animate-[spinSlow_120s_linear_infinite] absolute inset-0 pointer-events-none select-none z-0">
                  <circle cx="500" cy="500" r="480" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  {Array.from({ length: 12 }).map((_, i) => (
                     <line
                       key={i}
                       x1="500" y1="500"
                       x2={500 + Math.cos((i * Math.PI * 2) / 12) * 480}
                       y2={500 + Math.sin((i * Math.PI * 2) / 12) * 480}
                       stroke="currentColor" strokeWidth="0.5"
                     />
                  ))}
               </svg>
               
               {/* Form Card */}
               <div id="hero-form-card" className="relative z-10 w-full bg-gradient-to-b from-[#1C120C]/98 via-[#2D1E16]/96 to-[#170E09]/98 border-0 rounded-3xl p-6 md:p-8 backdrop-blur-md glittery-form-card">
                 
                 {/* Golden Cosmic Radial Glow Overlays */}
                 <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_-20%,rgba(229,192,106,0.3),transparent_70%)] pointer-events-none z-0" />
                 <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_50%_120%,rgba(179,139,54,0.15),transparent_70%)] pointer-events-none z-0" />
                 
                 {/* Twinkling Glitter Stars */}
                 <div className="absolute top-[6%] left-[8%] text-[#E5C06A] select-none pointer-events-none text-xs animate-[twinkle_3s_infinite_linear] z-10">✦</div>
                 <div className="absolute top-[18%] right-[10%] text-[#E5C06A] select-none pointer-events-none text-[10px] animate-[twinkle_4s_infinite_linear] z-10" style={{ animationDelay: '0.7s' }}>✦</div>
                 <div className="absolute bottom-[28%] left-[5%] text-[#E5C06A] select-none pointer-events-none text-[13px] animate-[twinkle_5s_infinite_linear] z-10" style={{ animationDelay: '1.4s' }}>✧</div>
                 <div className="absolute bottom-[8%] right-[12%] text-[#E5C06A] select-none pointer-events-none text-xs animate-[twinkle_3.5s_infinite_linear] z-10" style={{ animationDelay: '2.1s' }}>✦</div>
                 <div className="absolute top-[45%] right-[6%] text-[#E5C06A] select-none pointer-events-none text-[11px] animate-[twinkle_4.5s_infinite_linear] z-10" style={{ animationDelay: '1.1s' }}>✧</div>
                 <div className="absolute top-[12%] left-[45%] text-[#E5C06A] select-none pointer-events-none text-[8px] animate-[twinkle_2.5s_infinite_linear] z-10" style={{ animationDelay: '0.3s' }}>✦</div>
                 <div className="absolute bottom-[48%] left-[10%] text-[#E5C06A] select-none pointer-events-none text-[9px] animate-[twinkle_3.8s_infinite_linear] z-10" style={{ animationDelay: '1.8s' }}>✦</div>
                 <div className="absolute bottom-[18%] left-[48%] text-[#E5C06A] select-none pointer-events-none text-[10px] animate-[twinkle_4.2s_infinite_linear] z-10" style={{ animationDelay: '2.5s' }}>✧</div>
                 
                 <AnimatePresence mode="wait">
                    {step === "form" ? (
                      <motion.div
                        key="form-fields"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 border border-[#E5C06A]/30 rounded-full bg-[#E5C06A]/10 text-[9px] tracking-widest uppercase text-[#E5C06A] font-bold mb-2 z-10 relative">
                            ✨ Map Your Destiny
                          </span>
                          <h3 className="font-serif text-2xl text-brand-dark font-semibold tracking-wide z-10 relative">
                            Vedic Birth Chart
                          </h3>
                          <p className="text-[10px] text-stone-500 font-light mt-1 z-10 relative">
                            Enter your exact coordinates to align planetary transits.
                          </p>
                          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B38B36]/30 to-transparent mx-auto mt-4 mb-2" />
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
                          {/* Name */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center">
                            <label className="col-span-1 md:col-span-4 text-left md:text-left text-[10px] uppercase tracking-[0.2em] text-brand-dark font-sans font-bold z-10 relative drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                              Full Name
                            </label>
                            <div className="col-span-1 md:col-span-8 relative group">
                              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36] group-focus-within:text-[#E5C06A] group-focus-within:scale-110 transition-all duration-300 z-20" />
                              <Input
                                id="name-input"
                                name="name"
                                placeholder="Your name (optional)"
                                value={formData.name}
                                onChange={handleFormChange}
                                className="pl-[38px] h-11 bg-[#FCFAF2]/35 hover:bg-[#FFFDF9]/60 border-[#B38B36]/30 hover:border-[#E5C06A]/60 focus-visible:ring-1 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] focus-visible:shadow-[0_0_15px_rgba(229,192,106,0.25)] text-[#1E110A] text-xs rounded-xl shadow-sm transition-all z-10 relative"
                              />
                            </div>
                          </div>

                          {/* Date of Birth */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center">
                            <label className="col-span-1 md:col-span-4 text-left md:text-left text-[10px] uppercase tracking-[0.2em] text-brand-dark font-sans font-bold z-10 relative drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                              Date of Birth
                            </label>
                            <div className="col-span-1 md:col-span-8 relative group">
                              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36] group-focus-within:text-[#E5C06A] group-focus-within:scale-110 transition-all duration-300 z-20" />
                              <Input
                                name="dob"
                                required
                                type="date"
                                value={formData.dob}
                                onChange={handleFormChange}
                                className="pl-[38px] h-11 bg-[#FCFAF2]/35 hover:bg-[#FFFDF9]/60 border-[#B38B36]/30 hover:border-[#E5C06A]/60 focus-visible:ring-1 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] focus-visible:shadow-[0_0_15px_rgba(229,192,106,0.25)] text-[#1E110A] text-xs rounded-xl shadow-sm transition-all cursor-pointer z-10 relative"
                              />
                            </div>
                          </div>

                          {/* Birth Time */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start md:items-center">
                            <label className="col-span-1 md:col-span-4 text-left md:text-left text-[10px] uppercase tracking-[0.2em] text-brand-dark font-sans font-bold z-10 relative drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                              Time of Birth
                            </label>
                            <div className="col-span-1 md:col-span-8 relative group">
                              <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B38B36] group-focus-within:text-[#E5C06A] group-focus-within:scale-110 transition-all duration-300 z-20" />
                              <Input
                                name="tob"
                                required
                                type="time"
                                value={formData.tob}
                                onChange={handleFormChange}
                                className="pl-[38px] h-11 bg-[#FCFAF2]/35 hover:bg-[#FFFDF9]/60 border-[#B38B36]/30 hover:border-[#E5C06A]/60 focus-visible:ring-1 focus-visible:ring-[#E5C06A] focus-visible:border-[#E5C06A] focus-visible:shadow-[0_0_15px_rgba(229,192,106,0.25)] text-[#1E110A] text-xs rounded-xl shadow-sm transition-all cursor-pointer z-10 relative"
                              />
                            </div>
                          </div>

                          {/* Birth Place (3 Dropdowns) */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-start">
                            <label className="col-span-1 md:col-span-4 text-left md:text-left text-[10px] uppercase tracking-[0.2em] text-brand-dark font-sans font-bold z-10 relative pt-3 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                              Place of Birth
                            </label>
                            <div className="col-span-1 md:col-span-8 flex flex-col gap-2.5 z-10 relative">
                              {/* Country Selector */}
                              <div className="relative">
                                <select
                                  required
                                  value={selectedCountry}
                                  onChange={handleCountryChange}
                                  className="w-full h-11 px-3 bg-[#FCFAF2]/35 hover:bg-[#FFFDF9]/60 border-[#B38B36]/30 hover:border-[#E5C06A]/60 focus:ring-1 focus:ring-[#E5C06A] focus:border-[#E5C06A] text-[#1E110A] text-xs rounded-xl shadow-sm cursor-pointer outline-none transition-all z-10 relative"
                                >
                                  <option value="" className="bg-[#FFFDF9] text-[#1E110A]">Select Country</option>
                                  {countries.map((c) => (
                                    <option key={c.isoCode} value={c.isoCode} className="bg-[#FFFDF9] text-[#1E110A]">
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* State Selector */}
                              {states.length > 0 && (
                                <div className="relative">
                                  <select
                                    required
                                    value={selectedState}
                                    onChange={handleStateChange}
                                    className="w-full h-11 px-3 bg-[#FCFAF2]/35 hover:bg-[#FFFDF9]/60 border-[#B38B36]/30 hover:border-[#E5C06A]/60 focus:ring-1 focus:ring-[#E5C06A] focus:border-[#E5C06A] text-[#1E110A] text-xs rounded-xl shadow-sm cursor-pointer outline-none transition-all z-10 relative"
                                  >
                                    <option value="" className="bg-[#FFFDF9] text-[#1E110A]">Select State</option>
                                    {states.map((s) => (
                                      <option key={s.isoCode} value={s.isoCode} className="bg-[#FFFDF9] text-[#1E110A]">
                                        {s.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* City Selector */}
                              <div className="relative">
                                <select
                                  required
                                  disabled={!selectedCountry || (states.length > 0 && !selectedState)}
                                  value={selectedCity}
                                  onChange={handleCityChange}
                                  className="w-full h-11 px-3 bg-[#FCFAF2]/35 hover:bg-[#FFFDF9]/60 border-[#B38B36]/30 hover:border-[#E5C06A]/60 focus:ring-1 focus:ring-[#E5C06A] focus:border-[#E5C06A] text-[#1E110A] text-xs rounded-xl shadow-sm cursor-pointer outline-none transition-all z-10 relative disabled:opacity-50"
                                >
                                  <option value="" className="bg-[#FFFDF9] text-[#1E110A]">Select City</option>
                                  {cities.map((city, idx) => (
                                    <option key={idx} value={city.name} className="bg-[#FFFDF9] text-[#1E110A]">
                                      {city.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full mt-4 py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] hover:brightness-[1.12] text-[#1E110A] font-serif font-bold tracking-[0.22em] uppercase rounded-xl transition-all duration-500 shadow-[0_4px_20px_rgba(179,139,54,0.3)] hover:shadow-[0_8px_30px_rgba(229,192,106,0.55)] flex items-center justify-center gap-2 text-xs cursor-pointer hover:scale-[1.02] border border-[#FCF6BA]/40 z-10 relative"
                          >
                            <span>GENERATE HOROSCOPE</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[3px]" />
                          </button>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="loading-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-6 flex flex-col items-center justify-center text-center space-y-6 min-h-[350px] z-10 relative overflow-hidden"
                      >
                        {/* Twinkling loading background particles */}
                        <div className="absolute inset-0 pointer-events-none select-none">
                          <div className="absolute top-1/4 left-1/4 text-[#E5C06A] text-xs animate-[twinkle_2.5s_infinite_linear]">✦</div>
                          <div className="absolute top-1/3 right-1/4 text-[#E5C06A] text-[10px] animate-[twinkle_3s_infinite_linear]" style={{ animationDelay: '0.5s' }}>✧</div>
                          <div className="absolute bottom-1/4 left-1/3 text-[#E5C06A] text-[9px] animate-[twinkle_4s_infinite_linear]" style={{ animationDelay: '1.2s' }}>✦</div>
                          <div className="absolute bottom-1/3 right-1/3 text-[#E5C06A] text-[11px] animate-[twinkle_3.5s_infinite_linear]" style={{ animationDelay: '0.8s' }}>✧</div>
                        </div>

                        {/* Title Header */}
                        <div className="space-y-1 z-10 relative">
                          <h4 className="font-serif text-[#E5C06A] text-sm tracking-[0.25em] uppercase font-bold shimmer-glitter-text">
                            Celestial Alignment
                          </h4>
                          <p className="text-[8px] text-[#F4EBE1]/40 tracking-[0.3em] uppercase font-light">
                            Synthesizing Vedic Birth Chart
                          </p>
                        </div>

                        {/* Concentric Multilayered Celestial Orbits */}
                        <div className="relative w-48 h-48 flex items-center justify-center my-1">
                          {/* Inner glowing core aura */}
                          <div className="absolute w-40 h-40 bg-[radial-gradient(circle,rgba(229,192,106,0.12)_0%,transparent_70%)] blur-md rounded-full animate-pulse" />
                          
                          {/* Concentric SVG System */}
                          <svg viewBox="0 0 100 100" className="w-full h-full text-[#E5C06A] fill-none overflow-visible">
                            {/* 1. Outer Ring: Rotating Zodiac Track */}
                            <g className="animate-[spin_40s_linear_infinite] origin-center">
                              <circle cx="50" cy="50" r="48" stroke="rgba(229,192,106,0.15)" strokeWidth="0.4" />
                              <circle cx="50" cy="50" r="45" stroke="rgba(229,192,106,0.18)" strokeWidth="0.2" strokeDasharray="1 3" />
                              {Array.from({ length: 12 }).map((_, i) => {
                                const angle = (i * 30 * Math.PI) / 180;
                                return (
                                  <line
                                    key={i}
                                    x1="50"
                                    y1="50"
                                    x2={50 + Math.cos(angle) * 48}
                                    y2={50 + Math.sin(angle) * 48}
                                    stroke="rgba(229,192,106,0.08)"
                                    strokeWidth="0.15"
                                    strokeDasharray="2 3"
                                  />
                                );
                              })}
                              {/* Zodiac Symbols */}
                              {ZODIAC_SYMBOLS.map((symbol, i) => {
                                const angle = (i * 30 * Math.PI) / 180;
                                const x = 50 + Math.cos(angle) * 42;
                                const y = 50 + Math.sin(angle) * 42;
                                return (
                                  <text
                                    key={i}
                                    x={x}
                                    y={y}
                                    fill="rgba(229,192,106,0.6)"
                                    fontSize="3.2"
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    className="select-none font-sans"
                                    transform={`rotate(${i * 30 + 90}, ${x}, ${y})`}
                                  >
                                    {symbol}
                                  </text>
                                );
                              })}
                            </g>

                            {/* 2. Middle Ring: Counter-rotating Planet Track */}
                            <g className="animate-[spin_25s_linear_infinite_reverse] origin-center">
                              <circle cx="50" cy="50" r="32" stroke="rgba(229,192,106,0.22)" strokeWidth="0.3" strokeDasharray="3 3" />
                              {PLANET_GLYPHS.map((glyph, idx) => {
                                const angleRad = (glyph.angle * Math.PI) / 180;
                                const x = 50 + Math.cos(angleRad) * 32;
                                const y = 50 + Math.sin(angleRad) * 32;
                                return (
                                  <g key={idx} transform={`rotate(${-glyph.angle}, ${x}, ${y})`}>
                                    <circle cx={x} cy={y} r="2.2" fill="#1C120C" stroke="rgba(229,192,106,0.7)" strokeWidth="0.35" />
                                    <text
                                      x={x}
                                      y={y}
                                      fill="#E5C06A"
                                      fontSize="3.5"
                                      textAnchor="middle"
                                      dominantBaseline="central"
                                      className="select-none font-bold"
                                    >
                                      {glyph.symbol}
                                    </text>
                                  </g>
                                );
                              })}
                            </g>

                            {/* 3. Inner Ring: Rapid Dotted Track */}
                            <g className="animate-[spin_12s_linear_infinite] origin-center">
                              <circle cx="50" cy="50" r="23" stroke="rgba(229,192,106,0.25)" strokeWidth="0.4" strokeDasharray="1 2" />
                            </g>

                            {/* 4. Active Sweeping Progress Ring */}
                            <motion.circle
                              cx="50"
                              cy="50"
                              r="46"
                              stroke="url(#goldGradient)"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              fill="none"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 3, ease: "easeInOut" }}
                              style={{ transform: "rotate(-90deg)", transformOrigin: "50px 50px" }}
                              className="drop-shadow-[0_0_3px_rgba(229,192,106,0.35)]"
                            />

                            {/* Constellation mapping in the center */}
                            <g>
                              {starLines.map((line, idx) => {
                                const fromNode = starNodes[line.from];
                                const toNode = starNodes[line.to];
                                return (
                                  <motion.line
                                    key={idx}
                                    x1={fromNode.x}
                                    y1={fromNode.y}
                                    x2={toNode.x}
                                    y2={toNode.y}
                                    stroke="rgba(229,192,106,0.45)"
                                    strokeWidth="0.3"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: line.delay, duration: 1 }}
                                  />
                                );
                              })}
                              {starNodes.map((node, idx) => (
                                <g key={idx}>
                                  <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="1.2"
                                    fill="#E5C06A"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                                    transition={{ delay: node.delay, duration: 0.6 }}
                                  />
                                  <motion.circle
                                    cx={node.x}
                                    cy={node.y}
                                    r="2.5"
                                    stroke="rgba(229,192,106,0.3)"
                                    strokeWidth="0.15"
                                    fill="none"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                                    transition={{
                                      delay: node.delay,
                                      duration: 1.8,
                                      repeat: Infinity,
                                      repeatDelay: 0.5
                                    }}
                                  />
                                </g>
                              ))}
                            </g>

                            {/* Gradients definitions */}
                            <defs>
                              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#BF953F" />
                                <stop offset="50%" stopColor="#FCF6BA" />
                                <stop offset="100%" stopColor="#B38728" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* Central Core Portal */}
                          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-b from-[#1C120C]/90 to-[#170E09]/90 border border-[#E5C06A]/25 flex items-center justify-center shadow-[0_0_15px_rgba(229,192,106,0.15)]">
                            <Sparkles className="w-4 h-4 text-[#E5C06A] animate-pulse" />
                          </div>
                        </div>

                        {/* Real-time Calculation Log Console Ticker */}
                        <div className="w-full max-w-xs mx-auto bg-[#1C120C]/60 border border-[#E5C06A]/15 rounded-xl p-3 font-mono text-[9px] text-[#E5C06A]/80 text-left h-24 flex flex-col justify-end gap-1 shadow-inner relative overflow-hidden backdrop-blur-md">
                          {/* Laser Scanning Overlay Line */}
                          <div className="absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E5C06A]/30 to-transparent top-0 animate-[scan_2s_ease-in-out_infinite]" />
                          
                          <div className="flex flex-col gap-1 overflow-y-hidden">
                            {visibleLogs.map((log, index) => (
                              <div key={index} className="flex items-start gap-1.5 opacity-90 animate-[fadeIn_0.2s_ease-out]">
                                <span className="text-[#B38B36] font-bold select-none">›</span>
                                <span className="leading-tight break-all font-light">{log}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cycling Ethereal Subtitle Messages */}
                        <div className="space-y-1 relative z-10 w-full max-w-xs mx-auto pt-2">
                          <div className="h-6 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                              <motion.p
                                key={loadingMessageIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.25 }}
                                className="text-[#E5C06A] font-serif text-xs tracking-wider uppercase font-semibold shimmer-glitter-text"
                              >
                                {LOADING_MESSAGES[loadingMessageIndex]}
                              </motion.p>
                            </AnimatePresence>
                          </div>
                          
                          <p className="text-[7px] text-[#F4EBE1]/40 tracking-[0.3em] uppercase font-light">Consulting planetary ephemeris</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }

        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .shimmer-glitter-text {
          background: linear-gradient(
            135deg,
            #8E6B23 0%,
            #B38B36 50%,
            #8E6B23 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textShimmer 4s ease infinite;
          display: inline-block;
          filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.9));
          transition: all 0.5s ease;
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 
              0 20px 50px rgba(179, 139, 54, 0.1),
              0 0 30px rgba(229, 192, 106, 0.05),
              inset 0 0 15px rgba(255, 255, 255, 0.25);
          }
          50% {
            box-shadow: 
              0 25px 60px rgba(179, 139, 54, 0.15),
              0 0 40px rgba(229, 192, 106, 0.1),
              inset 0 0 25px rgba(255, 255, 255, 0.35);
          }
        }
        .glittery-form-card {
          animation: float-gentle 8s ease-in-out infinite, glow-pulse 6s ease-in-out infinite;
          background: rgba(253, 251, 247, 0.22) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(229, 192, 106, 0.25) !important;
          transition: all 0.5s ease-in-out;
        }
        .glittery-form-card:hover {
          background: rgba(253, 251, 247, 0.35) !important;
          border-color: rgba(229, 192, 106, 0.4) !important;
          box-shadow: 
            0 30px 70px rgba(179, 139, 54, 0.2),
            0 0 50px rgba(229, 192, 106, 0.15),
            inset 0 0 25px rgba(255, 255, 255, 0.4) !important;
        }
        .glittery-form-card label {
          color: #3C2A21 !important;
          font-family: Outfit, sans-serif !important;
          font-size: 10px !important;
          font-weight: 700 !important;
          letter-spacing: 0.2em !important;
          text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8) !important;
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.15;
            transform: scale(0.75) rotate(0deg);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.3) rotate(90deg);
            filter: drop-shadow(0 0 6px rgba(229, 192, 106, 0.7));
          }
        }
        @keyframes scan {
          0% { left: -35%; }
          100% { left: 110%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 0.9; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CelestialOracleHero;
