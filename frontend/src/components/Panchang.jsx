import React, { useState, useEffect, useMemo } from "react";
import { MapPin, RefreshCw, Sparkles, AlertCircle, HelpCircle, X, Compass, Calendar, Clock, ShieldAlert, Award, Search, Globe, Sun, Moon, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Panchang = () => {
  const [city, setCity] = useState("New Delhi");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetailedModal, setShowDetailedModal] = useState(false);

  // Cities API / Modal State
  const [apiCities, setApiCities] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(150);
  const [choghadiyaTab, setChoghadiyaTab] = useState("day");

  const fetchPanchang = async (cityName) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      const res = await fetch(`${apiUrl}/api/panchang?city=${encodeURIComponent(cityName)}&t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        toast.error("Failed to load Panchang data from celestial servers.");
      }
    } catch (err) {
      console.error("Panchang load error:", err);
      toast.error("Connection failed. Could not reach panchang registry.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    if (apiCities.length > 0) return;
    setApiLoading(true);
    setApiError(false);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      const res = await fetch(`${apiUrl}/api/cities`);
      if (res.ok) {
        const data = await res.json();
        setApiCities(data);
      } else {
        setApiError(true);
      }
    } catch (err) {
      console.error("Cities API load error:", err);
      setApiError(true);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    fetchPanchang(city);
  }, [city]);

  useEffect(() => {
    if (isModalOpen) {
      fetchCities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleRefresh = () => {
    fetchPanchang(city);
  };

  const getStatusStyle = (color) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-50/70 border-red-200/60",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          titleColor: "text-red-700",
          descColor: "text-red-600/80"
        };
      case "green":
        return {
          bg: "bg-green-50/70 border-green-200/60",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          titleColor: "text-green-700",
          descColor: "text-green-600/80"
        };
      case "yellow":
      default:
        return {
          bg: "bg-amber-50/70 border-amber-200/60",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          titleColor: "text-amber-700",
          descColor: "text-amber-600/80"
        };
    }
  };

  const statusStyle = data ? getStatusStyle(data.status.color) : getStatusStyle("yellow");

  const circumference = 251.32;

  // Filter cities for search
  const filteredCities = useMemo(() => {
    if (!modalSearch) return apiCities;
    const query = modalSearch.toLowerCase().trim();
    return apiCities.filter((c) => 
      c.name.toLowerCase().includes(query) || 
      c.formatted.toLowerCase().includes(query)
    );
  }, [apiCities, modalSearch]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      setVisibleLimit((prev) => Math.min(prev + 150, filteredCities.length));
    }
  };

  const handleSelectCity = (c) => {
    setCity(c.formatted);
    setIsModalOpen(false);
    setModalSearch("");
  };

  return (
    <section className="py-24 bg-[#FDFBF7]" id="panchang">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="font-serif text-5xl text-[#3C2A21] mb-6 leading-tight">
              Today's Panchang
            </h2>
            <p className="text-[#725D46] mb-8 leading-relaxed max-w-lg font-light text-sm">
              Visualize the day's energy. The chart highlights <span className="font-bold text-[#3C2A21]">Rahu Kaal</span> (avoid) and <span className="font-bold text-[#3C2A21]">Abhijit Muhurat</span> (best time).
            </p>

            <div className="inline-flex items-center gap-2 bg-[#E5C06A]/20 px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase font-bold text-[#8A5A1B] mb-8 shadow-sm">
              Panchang for {city.split(',')[0]}
            </div>

            <div className={`relative overflow-hidden border p-8 rounded-2xl mb-8 transition-all duration-500 shadow-[0_4px_20px_rgba(60,42,33,0.02)] ${loading ? "bg-white/40 border-stone-200" : statusStyle.bg}`}>
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <Sparkles className="w-full h-full text-[#B38B36]" />
              </div>
              
              <div className="text-[10px] tracking-[0.25em] uppercase text-[#725D46] mb-4 font-bold">
                Current Status {data && <span className="normal-case font-light text-stone-500">({data.local_time})</span>}
              </div>

              {loading ? (
                <div className="flex items-center gap-3 py-2 text-stone-500 text-sm">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#B38B36]" />
                  <span>Computing celestial alignments...</span>
                </div>
              ) : data ? (
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusStyle.iconBg} shadow-sm border border-black/5`}>
                    {data.status.color === "red" ? (
                      <AlertCircle className={`w-5 h-5 ${statusStyle.iconColor}`} />
                    ) : data.status.color === "green" ? (
                      <Sparkles className={`w-5 h-5 ${statusStyle.iconColor}`} />
                    ) : (
                      <HelpCircle className={`w-5 h-5 ${statusStyle.iconColor}`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-serif text-2xl font-bold ${statusStyle.titleColor}`}>{data.status.label}</h3>
                    <p className={`text-xs tracking-wide font-medium mt-1 leading-relaxed ${statusStyle.descColor}`}>{data.status.description}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {data && !loading && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-sm border border-[#E5E1D8] p-4 rounded-xl shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                  <span className="text-[8px] uppercase tracking-widest text-[#725D46] block mb-1 font-bold">Sunrise</span>
                  <span className="font-serif text-base text-[#3C2A21] font-bold">{data.sunrise}</span>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-[#E5E1D8] p-4 rounded-xl shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                  <span className="text-[8px] uppercase tracking-widest text-[#725D46] block mb-1 font-bold">Sunset</span>
                  <span className="font-serif text-base text-[#3C2A21] font-bold">{data.sunset}</span>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-[#E5E1D8] p-4 rounded-xl shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                  <span className="text-[8px] uppercase tracking-widest text-[#725D46] block mb-1 font-bold text-green-700">Abhijit Muhurat</span>
                  <span className="font-serif text-base text-[#84CC16] font-bold">{data.abhijit.start} - {data.abhijit.end}</span>
                </div>
                <div className="bg-white/60 backdrop-blur-sm border border-[#E5E1D8] p-4 rounded-xl shadow-[0_2px_8px_rgba(179,139,54,0.01)]">
                  <span className="text-[8px] uppercase tracking-widest text-[#725D46] block mb-1 font-bold text-red-700">Rahu Kaal</span>
                  <span className="font-serif text-base text-[#C2410C] font-bold">{data.rahu_kaal.start} - {data.rahu_kaal.end}</span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex-1 min-w-[180px] relative">
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white border border-[#E5E1D8] px-4 py-3 rounded-lg text-sm text-[#3C2A21] appearance-none focus:outline-none focus:border-[#B38B36] transition-colors cursor-pointer shadow-sm"
                >
                  <option value="New Delhi">New Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="London">London</option>
                  <option value="New York">New York</option>
                  
                  {!["new delhi", "mumbai", "bangalore", "london", "new york"].includes(city.toLowerCase()) && (
                    <option value={city}>{city}</option>
                  )}
                </select>
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B38B36] pointer-events-none" />
              </div>
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E5E1D8] px-6 py-3 rounded-lg text-sm text-[#3C2A21] hover:bg-white transition-colors active:scale-95 transform cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh Data
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-[#FBF6EC] border border-[#E5E1D8] px-6 py-3 rounded-lg text-sm text-[#3C2A21] hover:bg-white hover:border-[#B38B36]/50 transition-colors active:scale-95 transform cursor-pointer shadow-sm font-semibold"
              >
                <Globe className="w-4 h-4 text-[#B38B36]" />
                View More
              </button>
            </div>

            {data && !loading && (
              <button 
                onClick={() => setShowDetailedModal(true)}
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase font-bold text-[#3C2A21] border-b border-[#3C2A21]/20 pb-1 hover:text-[#B38B36] hover:border-[#B38B36] hover:gap-3 transition-all duration-300 transform cursor-pointer bg-transparent"
              >
                <span>View detailed panchang</span>
                <span>✦</span>
              </button>
            )}

          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[450px] aspect-square bg-[#FDFBF7] border border-[#E5E1D8] rounded-2xl p-12 flex flex-col items-center justify-center shadow-md">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1E293B" strokeWidth="12" />
                {data && !loading && (
                  <>
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#E67E22" 
                      strokeWidth="12" 
                      strokeDasharray={`${(data.day_length_decimal / 24.0) * circumference} ${circumference}`}
                      strokeDashoffset={-(data.sunrise_decimal / 24.0) * circumference}
                      className="transition-all duration-1000 ease-out"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#84CC16" 
                      strokeWidth="14" 
                      strokeDasharray={`${(0.8 / 24.0) * circumference} ${circumference}`}
                      strokeDashoffset={-(data.abhijit.start_decimal / 24.0) * circumference}
                      className="transition-all duration-1000 ease-out"
                    />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#C2410C" 
                      strokeWidth="14" 
                      strokeDasharray={`${(data.rahu_kaal.length_decimal / 24.0) * circumference} ${circumference}`}
                      strokeDashoffset={-(data.rahu_kaal.start_decimal / 24.0) * circumference}
                      className="transition-all duration-1000 ease-out"
                    />
                  </>
                )}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[#725D46] mb-1">Now in</div>
                <div className="font-serif text-2xl text-[#3C2A21] font-bold">{city.split(',')[0]}</div>
                {data && !loading && (
                  <div className="text-xs text-stone-500 font-mono mt-1 font-semibold">{data.local_time}</div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* View More Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border border-[#B38B36]/30 p-6 rounded-3xl shadow-2xl relative max-h-[80vh] flex flex-col text-[#3C2A21]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#725D46] hover:text-[#3C2A21] transition-all transform cursor-pointer border border-[#E5E1D8]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#B38B36]" />
                  Select City
                </h3>
                <p className="text-xs text-[#725D46] font-light mt-1">
                  Choose from our comprehensive global database of over 140,000 cities.
                </p>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => {
                    setModalSearch(e.target.value);
                    setVisibleLimit(150);
                  }}
                  placeholder="Type city name to search..."
                  className="w-full bg-white border border-[#E5E1D8] pl-10 pr-4 py-2.5 rounded-xl text-sm text-[#3C2A21] focus:outline-none focus:border-[#B38B36] transition-colors shadow-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B38B36]" />
                {modalSearch && (
                  <button 
                    onClick={() => {
                      setModalSearch("");
                      setVisibleLimit(150);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div 
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto border border-[#E5E1D8]/60 rounded-xl bg-white/50 backdrop-blur-sm p-2 space-y-1 scrollbar-thin"
              >
                {apiLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-500 text-xs">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#B38B36]" />
                    <span>Loading cities database...</span>
                  </div>
                ) : apiError ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-red-500 text-xs px-4">
                    <AlertCircle className="w-6 h-6 mb-2" />
                    <p className="font-semibold">Failed to load cities.</p>
                    <button 
                      onClick={fetchCities}
                      className="mt-2 text-xs text-[#B38B36] underline hover:text-[#9A752B]"
                    >
                      Retry Connection
                    </button>
                  </div>
                ) : filteredCities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-stone-400 text-xs italic">
                    No matching cities found.
                  </div>
                ) : (
                  <>
                    {filteredCities.slice(0, visibleLimit).map((c, idx) => {
                      const isSelected = city.toLowerCase() === c.name.toLowerCase() || city.toLowerCase() === c.formatted.toLowerCase();
                      return (
                        <button
                          key={`${c.name}-${c.country}-${idx}`}
                          onClick={() => handleSelectCity(c)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-colors hover:bg-[#FBF6EC] flex justify-between items-center ${
                            isSelected 
                              ? "bg-[#FBF6EC] text-[#B38B36] font-bold" 
                              : "text-[#3C2A21] font-medium"
                          }`}
                        >
                          <span>{c.formatted}</span>
                          {isSelected && <span className="text-[10px] text-[#B38B36] font-semibold">✦ Selected</span>}
                        </button>
                      );
                    })}
                    {visibleLimit < filteredCities.length && (
                      <div className="text-center py-2 text-[10px] text-stone-400">
                        Scroll down to load more...
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetailedModal && data && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3C2A21]/70 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setShowDetailedModal(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-4xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border-2 border-[#B38B36]/35 rounded-[32px] shadow-2xl relative max-h-[90vh] overflow-y-auto text-[#3C2A21] scrollbar-none flex flex-col"
            >
              {/* Sticky Header Bar */}
              <div className="sticky top-0 bg-gradient-to-b from-[#FFFDF9] via-[#FFFDF9] to-transparent z-10 pt-6 px-6 md:px-8 pb-4 border-b border-[#B38B36]/15 backdrop-blur-md flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Compass className="w-5 h-5 text-[#B38B36]" />
                    <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8E6B23]">Celestial Guide</span>
                  </div>
                  <h3 className="font-serif text-3xl font-bold tracking-tight">Vedic Panchangam</h3>
                  <p className="text-xs text-[#725D46] mt-1 font-light">
                    Real-time energy for <span className="font-bold text-[#3C2A21]">{data.city}</span> ({data.local_time})
                  </p>
                </div>
                <button 
                  onClick={() => setShowDetailedModal(false)}
                  className="p-2.5 rounded-full hover:bg-[#FBF6EC] text-[#725D46] hover:text-[#3C2A21] transition-all transform cursor-pointer border border-[#E5E1D8] shadow-sm active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 space-y-8 flex-1">
                
                {/* 1. Active Choghadiya Big Banner (AstroArunPandit Style) */}
                {data.choghadiya?.active && (
                  <div className="relative overflow-hidden rounded-2xl border border-[#B38B36]/20 shadow-md">
                    <div className="absolute top-0 right-0 w-48 h-full opacity-[0.03] pointer-events-none select-none">
                      <Compass className="w-full h-full text-[#B38B36] rotate-45" />
                    </div>
                    
                    {(() => {
                      const active = data.choghadiya.active;
                      let bannerBg = "from-[#FDFBF7] to-[#FAF6EE]";
                      let accentColor = "text-[#B38B36]";
                      let badgeBg = "bg-stone-100 text-stone-700 border-stone-200";
                      let indicatorColor = "bg-[#B38B36]";
                      
                      if (active.status === "shubh") {
                        bannerBg = "from-green-50/30 to-[#FAF6EE]";
                        accentColor = "text-green-700";
                        badgeBg = "bg-green-100 text-green-800 border-green-200/50";
                        indicatorColor = "bg-green-600";
                      } else if (active.status === "asubh") {
                        bannerBg = "from-red-50/30 to-[#FAF6EE]";
                        accentColor = "text-red-700";
                        badgeBg = "bg-red-100 text-red-800 border-red-200/50";
                        indicatorColor = "bg-red-600";
                      } else if (active.status === "neutral") {
                        bannerBg = "from-blue-50/30 to-[#FAF6EE]";
                        accentColor = "text-blue-700";
                        badgeBg = "bg-blue-100 text-blue-800 border-blue-200/50";
                        indicatorColor = "bg-blue-600";
                      }

                      const tabName = data.choghadiya.day.some(s => s.name === active.name && s.start === active.start) ? "day" : "night";
                      const currentList = data.choghadiya[tabName];
                      const currentIndex = currentList.findIndex(s => s.name === active.name && s.start === active.start);
                      const nextPeriod = currentList[(currentIndex + 1) % 8];

                      return (
                        <div className={`p-6 bg-gradient-to-r ${bannerBg} flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor} animate-pulse`} />
                              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#725D46]">Current Chaughadiya</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                              <h4 className="font-serif text-3xl font-bold tracking-tight">{active.name}</h4>
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                                {active.status === "shubh" ? "Auspicious" : active.status === "asubh" ? "Inauspicious" : "Neutral (Char)"}
                              </span>
                            </div>
                            <p className="text-xs text-stone-500 font-light italic">{active.desc} is active locally</p>
                          </div>
                          
                          <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                            <div className="bg-white/80 border border-[#E5E1D8] px-5 py-2.5 rounded-xl shadow-sm">
                              <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold mb-0.5">Active Time Slot</span>
                              <span className="font-mono text-sm font-extrabold text-[#3C2A21]">{active.start} - {active.end}</span>
                            </div>
                            {nextPeriod && (
                              <div className="flex items-center gap-1.5 text-[10px] text-[#725D46] font-semibold bg-[#FBF6EC] px-3 py-1 rounded-lg border border-[#B38B36]/15 self-start md:self-auto">
                                <span>Next: {nextPeriod.name}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                                <span className="font-mono">{nextPeriod.start}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Grid Layout for Core Elements and Vedic Hours */}
                <div className="grid lg:grid-cols-2 gap-8">
                  
                  {/* The 5 Core Elements */}
                  <div className="bg-white/55 border border-[#B38B36]/15 rounded-2xl p-6 shadow-sm space-y-4">
                    <h4 className="font-serif text-sm uppercase tracking-widest text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      The 5 Core Elements
                    </h4>
                    
                    <div className="space-y-3.5 text-xs">
                      {[
                        { label: "Tithi (Lunar Day)", value: data.elements?.tithi },
                        { label: "Nakshatra (Lunar Mansion)", value: data.elements?.nakshatra },
                        { label: "Yoga (Solilunar Aspect)", value: data.elements?.yoga },
                        { label: "Karana (Half Tithi)", value: data.elements?.karana },
                        { label: "Vara (Day of the Week)", value: data.elements?.vara },
                        { label: "Moon Sign (Rashi)", value: data.elements?.moon_sign },
                        { label: "Moon Phase", value: data.elements?.moon_phase }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0 last:pb-0">
                          <span className="font-semibold text-stone-600">{item.label}</span>
                          <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-3 py-1 rounded-lg shadow-sm">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Vedic Hours */}
                  <div className="bg-white/55 border border-[#B38B36]/15 rounded-2xl p-6 shadow-sm space-y-4">
                    <h4 className="font-serif text-sm uppercase tracking-widest text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Dynamic Vedic Hours
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3 text-stone-600">
                        <div className="bg-white/80 p-3 border border-[#E5E1D8] rounded-xl flex items-center gap-2.5 shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                            <Sun className="w-4 h-4 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest block font-bold text-stone-400">Sunrise</span>
                            <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.sunrise}</span>
                          </div>
                        </div>
                        <div className="bg-white/80 p-3 border border-[#E5E1D8] rounded-xl flex items-center gap-2.5 shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <Moon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-widest block font-bold text-stone-400">Sunset</span>
                            <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.sunset}</span>
                          </div>
                        </div>
                      </div>

                      {[
                        { title: "Abhijit Muhurat", time: `${data.abhijit.start} - ${data.abhijit.end}`, desc: "Best time for new beginnings", status: "good" },
                        { title: "Rahu Kaal", time: `${data.rahu_kaal.start} - ${data.rahu_kaal.end}`, desc: "Avoid starting new projects", status: "bad" },
                        { title: "Yama Gandha", time: `${data.yama_gandha.start} - ${data.yama_gandha.end}`, desc: "Inauspicious timing slot", status: "warning" },
                        { title: "Gulika Kaal", time: `${data.gulika_kaal.start} - ${data.gulika_kaal.end}`, desc: "Obstruction energy slot", status: "warning" }
                      ].map((hour, idx) => {
                        let indicatorBg = "bg-amber-50/60 border-amber-200/50 text-amber-800";
                        let tagColor = "text-amber-700";
                        
                        if (hour.status === "good") {
                          indicatorBg = "bg-green-50/60 border-green-200/50 text-green-800";
                          tagColor = "text-green-700";
                        } else if (hour.status === "bad") {
                          indicatorBg = "bg-red-50/60 border-red-200/50 text-red-800";
                          tagColor = "text-red-700";
                        }

                        return (
                          <div key={idx} className={`border p-3 rounded-xl flex items-center justify-between shadow-sm transition-colors ${indicatorBg}`}>
                            <div>
                              <span className="text-[9px] uppercase tracking-widest block font-extrabold mb-0.5 flex items-center gap-1">
                                <Award className="w-3.5 h-3.5" /> {hour.title}
                              </span>
                              <span className={`text-[10px] ${tagColor} font-light`}>{hour.desc}</span>
                            </div>
                            <span className="font-serif font-extrabold text-[13px] bg-white/70 px-3 py-1 rounded-lg border border-black/5 shadow-sm">{hour.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Detailed Chaughadiya Table */}
                <div className="bg-white/55 border border-[#B38B36]/15 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
                    <h4 className="font-serif text-sm uppercase tracking-widest text-[#8E6B23] font-bold flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin-slow" />
                      Chaughadiya (Time Periods)
                    </h4>
                    
                    {/* Tab Selector */}
                    <div className="flex gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200/50 self-start sm:self-auto">
                      <button 
                        onClick={() => setChoghadiyaTab("day")}
                        className={`px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          choghadiyaTab === "day" 
                            ? "bg-[#B38B36] text-white shadow-sm" 
                            : "text-stone-500 hover:text-[#3C2A21]"
                        }`}
                      >
                        Day
                      </button>
                      <button 
                        onClick={() => setChoghadiyaTab("night")}
                        className={`px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          choghadiyaTab === "night" 
                            ? "bg-[#B38B36] text-white shadow-sm" 
                            : "text-stone-500 hover:text-[#3C2A21]"
                        }`}
                      >
                        Night
                      </button>
                    </div>
                  </div>

                  {/* 8 Period Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {data.choghadiya?.[choghadiyaTab]?.map((slot, index) => {
                      const isCurrentActive = data.choghadiya?.active?.name === slot.name && data.choghadiya?.active?.start === slot.start && data.choghadiya?.active?.end === slot.end;
                      
                      let bgStyle = "bg-white border-[#E5E1D8] hover:border-[#B38B36]/30";
                      let badgeColor = "bg-stone-100 text-stone-600 border-stone-200";
                      
                      if (slot.status === "shubh") {
                        bgStyle = "bg-green-50/30 border-green-200/40 hover:border-green-300";
                        badgeColor = "bg-green-100 text-green-700 border-green-200/30";
                      } else if (slot.status === "asubh") {
                        bgStyle = "bg-red-50/30 border-red-200/40 hover:border-red-300";
                        badgeColor = "bg-red-100 text-red-700 border-red-200/30";
                      } else if (slot.status === "neutral") {
                        bgStyle = "bg-blue-50/30 border-blue-200/40 hover:border-blue-300";
                        badgeColor = "bg-blue-100 text-blue-700 border-blue-200/30";
                      }

                      return (
                        <div 
                          key={`${slot.name}-${index}`} 
                          className={`relative border p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 ${bgStyle} ${
                            isCurrentActive ? "ring-2 ring-[#B38B36] shadow-md scale-[1.03] bg-[#FFFDF9]" : "shadow-sm hover:shadow"
                          }`}
                        >
                          {isCurrentActive && (
                            <span className="absolute -top-2.5 right-3 bg-[#B38B36] text-white text-[7px] tracking-widest uppercase font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                              Active
                            </span>
                          )}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center gap-1">
                              <span className="font-serif text-sm font-extrabold text-[#3C2A21]">{slot.name}</span>
                              <span className={`text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-extrabold border ${badgeColor}`}>
                                {slot.status === "shubh" ? "Shubh" : slot.status === "asubh" ? "Asubh" : "Char"}
                              </span>
                            </div>
                            <p className="text-[9px] text-[#725D46] font-light italic">{slot.desc}</p>
                          </div>
                          <div className="mt-4 pt-2 border-t border-stone-100">
                            <p className="text-[9px] font-mono text-stone-600 font-bold tracking-tight">{slot.start} - {slot.end}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Sacred Fasting Table */}
                <div className="bg-white/55 border border-[#B38B36]/15 rounded-2xl p-6 shadow-sm space-y-5">
                  <div>
                    <h4 className="font-serif text-sm uppercase tracking-widest text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#B38B36]" />
                      Sacred Fasting (2026)
                    </h4>
                    <p className="text-xs text-stone-500 font-light mt-1">
                      Highly auspicious Ekadashi fasting dates and cosmic observances for the year.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { month: "January", fastings: ["Shattila Ekadashi (14)", "Jaya Ekadashi (29)"] },
                      { month: "February", fastings: ["Vijaya Ekadashi (13)", "Amalaki Ekadashi (27)"] },
                      { month: "March", fastings: ["Papamochani Ekadashi (15)", "Kamada Ekadashi (29)"] },
                      { month: "April", fastings: ["Varuthini Ekadashi (13)", "Mohini Ekadashi (27)"] },
                      { month: "May", fastings: ["Apara Ekadashi (13)", "Nirjala Ekadashi (27)"] },
                      { month: "June", fastings: ["Yogini Ekadashi (11)", "Devshayani Ekadashi (25)"] },
                      { month: "July", fastings: ["Kamika Ekadashi (10)", "Shravana Putrada (24)"] },
                      { month: "August", fastings: ["Aja Ekadashi (09)", "Parsva Ekadashi (23)"] },
                      { month: "September", fastings: ["Indira Ekadashi (07)", "Papankusha Ekadashi (22)"] },
                      { month: "October", fastings: ["Rama Ekadashi (06)", "Devutthana Ekadashi (20)"] },
                      { month: "November", fastings: ["Utpanna Ekadashi (05)", "Mokshada Ekadashi (20)"] },
                      { month: "December", fastings: ["Saphala Ekadashi (05)", "Putrada Ekadashi (19)"] }
                    ].map((item, index) => (
                      <div key={index} className="bg-white border border-[#E5E1D8] p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:border-[#B38B36]/30 transition-all duration-300">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-2">{item.month}</span>
                          <div className="space-y-1.5">
                            {item.fastings.map((fasting, fIdx) => (
                              <div key={fIdx} className="text-xs text-[#3C2A21] font-medium flex items-start gap-1.5">
                                <span className="text-[#B38B36] mt-0.5">✦</span>
                                <span>{fasting}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Bottom Footer Bar */}
              <div className="p-6 border-t border-[#B38B36]/15 bg-[#FAF6EE] rounded-b-[30px] flex justify-center">
                <button 
                  onClick={() => setShowDetailedModal(false)}
                  className="bg-[#B38B36] hover:bg-[#8E6B23] text-white px-10 py-3.5 rounded-full text-[10px] tracking-widest uppercase font-extrabold shadow-md hover:shadow-lg transition-all active:scale-95 transform cursor-pointer border border-[#E5C06A]/30"
                >
                  Close Detailed Panchangam
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Panchang;
