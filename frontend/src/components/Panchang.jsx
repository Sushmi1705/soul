import React, { useState, useEffect, useMemo } from "react";
import { MapPin, RefreshCw, Sparkles, AlertCircle, HelpCircle, X, Compass, Calendar, Clock, ShieldAlert, Award, Search, Globe } from "lucide-react";
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

  const fetchPanchang = async (cityName) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      const res = await fetch(`${apiUrl}/api/panchang?city=${encodeURIComponent(cityName)}`);
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full max-w-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border border-[#B38B36]/30 p-6 md:p-8 rounded-3xl shadow-2xl relative max-h-[85vh] overflow-y-auto text-[#3C2A21] scrollbar-none"
            >
              <button 
                onClick={() => setShowDetailedModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#725D46] hover:text-[#3C2A21] transition-all transform cursor-pointer border border-[#E5E1D8]"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div className="text-center pb-2 border-b border-[#B38B36]/15">
                  <div className="w-10 h-10 rounded-full bg-[#B38B36]/15 flex items-center justify-center mx-auto mb-2.5 text-[#8E6B23] border border-[#B38B36]/25">
                    <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '60s' }} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Vedic Panchangam</h3>
                  <p className="text-xs text-[#725D46] mt-1.5 font-light">
                    Real-time celestial elements for <span className="font-bold text-[#3C2A21]">{data.city}</span> ({data.local_time})
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <h4 className="font-serif text-xs uppercase tracking-widest text-[#8E6B23] font-bold border-b border-stone-200 pb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      The 5 Core Elements
                    </h4>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                        <span className="font-semibold text-stone-600">Tithi (Lunar Day)</span>
                        <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-2.5 py-0.5 rounded-lg">{data.elements?.tithi}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                        <span className="font-semibold text-stone-600">Nakshatra (Lunar Mansion)</span>
                        <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-2.5 py-0.5 rounded-lg">{data.elements?.nakshatra}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                        <span className="font-semibold text-stone-600">Yoga (Solilunar Aspect)</span>
                        <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-2.5 py-0.5 rounded-lg">{data.elements?.yoga}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-stone-100">
                        <span className="font-semibold text-stone-600">Karana (Half Tithi)</span>
                        <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-2.5 py-0.5 rounded-lg">{data.elements?.karana}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5">
                        <span className="font-semibold text-stone-600">Vara (Day of the Week)</span>
                        <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-2.5 py-0.5 rounded-lg">{data.elements?.vara}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-serif text-xs uppercase tracking-widest text-[#8E6B23] font-bold border-b border-stone-200 pb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Dynamic Vedic Hours
                    </h4>
                    
                    <div className="space-y-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-stone-600">
                        <div className="bg-white/60 p-2 border border-[#E5E1D8] rounded-lg">
                          <span className="text-[7.5px] uppercase tracking-widest block font-bold text-stone-400 mb-0.5">Sunrise</span>
                          <span className="font-serif font-bold text-[#3C2A21]">{data.sunrise}</span>
                        </div>
                        <div className="bg-white/60 p-2 border border-[#E5E1D8] rounded-lg">
                          <span className="text-[7.5px] uppercase tracking-widest block font-bold text-stone-400 mb-0.5">Sunset</span>
                          <span className="font-serif font-bold text-[#3C2A21]">{data.sunset}</span>
                        </div>
                      </div>

                      <div className="bg-green-50/60 border border-green-200/50 p-2.5 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest block font-bold text-green-700 mb-0.5 flex items-center gap-1">
                            <Award className="w-3 h-3" /> Abhijit Muhurat
                          </span>
                          <span className="text-[10px] text-green-600 font-light">Best time for new beginnings</span>
                        </div>
                        <span className="font-serif font-bold text-green-800 text-[13px]">{data.abhijit.start} - {data.abhijit.end}</span>
                      </div>

                      <div className="bg-red-50/60 border border-red-200/50 p-2.5 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest block font-bold text-red-700 mb-0.5 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Rahu Kaal
                          </span>
                          <span className="text-[10px] text-red-600 font-light">Avoid starting new projects</span>
                        </div>
                        <span className="font-serif font-bold text-red-800 text-[13px]">{data.rahu_kaal.start} - {data.rahu_kaal.end}</span>
                      </div>

                      <div className="bg-amber-50/60 border border-amber-200/50 p-2.5 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest block font-bold text-amber-800 mb-0.5 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Yama Gandha
                          </span>
                          <span className="text-[10px] text-amber-700 font-light">Inauspicious timing slot</span>
                        </div>
                        <span className="font-serif font-bold text-[#3C2A21] text-[13px]">{data.yama_gandha.start} - {data.yama_gandha.end}</span>
                      </div>

                      <div className="bg-amber-50/60 border border-amber-200/50 p-2.5 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="text-[8px] uppercase tracking-widest block font-bold text-amber-800 mb-0.5 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Gulika Kaal
                          </span>
                          <span className="text-[10px] text-amber-700 font-light">Obstruction energy slot</span>
                        </div>
                        <span className="font-serif font-bold text-[#3C2A21] text-[13px]">{data.gulika_kaal.start} - {data.gulika_kaal.end}</span>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-[#B38B36]/15">
                  <button 
                    onClick={() => setShowDetailedModal(false)}
                    className="bg-[#B38B36] hover:bg-[#8E6B23] text-white px-8 py-3 rounded-full text-[10px] tracking-widest uppercase font-bold shadow-md hover:shadow-lg transition-all active:scale-95 transform cursor-pointer border border-[#E5C06A]/30"
                  >
                    Close Panchangam
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Panchang;
