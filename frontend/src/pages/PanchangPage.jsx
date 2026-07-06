import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  X, 
  Compass, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  Award, 
  Search, 
  Globe, 
  Sun, 
  Moon, 
  ChevronRight, 
  Home,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { toast } from "sonner";

const PanchangPage = () => {
  const navigate = useNavigate();
  
  // Format today's date as YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [city, setCity] = useState("New Delhi");
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [choghadiyaTab, setChoghadiyaTab] = useState("day");

  // Cities API / Modal State
  const [apiCities, setApiCities] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [visibleLimit, setVisibleLimit] = useState(150);

  const fetchPanchang = async (cityName, dateStr) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://127.0.0.1:8005";
      const queryDate = dateStr ? `&date=${dateStr}` : "";
      const res = await fetch(`${apiUrl}/api/panchang?city=${encodeURIComponent(cityName)}${queryDate}&t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        toast.error("Failed to load Panchang data from celestial registry.");
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
    fetchPanchang(city, selectedDate);
  }, [city, selectedDate]);

  useEffect(() => {
    if (isCityModalOpen) {
      fetchCities();
    }
  }, [isCityModalOpen]);

  const handleRefresh = () => {
    fetchPanchang(city, selectedDate);
  };

  const getStatusStyle = (color) => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-50/70 border-red-200/60",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          titleColor: "text-red-700",
          descColor: "text-red-600/80",
          indicatorColor: "bg-red-600"
        };
      case "green":
        return {
          bg: "bg-green-50/70 border-green-200/60",
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          titleColor: "text-green-700",
          descColor: "text-green-600/80",
          indicatorColor: "bg-green-600"
        };
      case "yellow":
      default:
        return {
          bg: "bg-amber-50/70 border-amber-200/60",
          iconBg: "bg-amber-100",
          iconColor: "text-amber-600",
          titleColor: "text-amber-700",
          descColor: "text-amber-600/80",
          indicatorColor: "bg-amber-600"
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
    setIsCityModalOpen(false);
    setModalSearch("");
  };

  return (
    <div className="pt-24 pb-20 relative z-10 bg-[#FDFBF7] text-[#3C2A21] min-h-screen">
      {/* Banner Header Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[260px] md:h-[300px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
        {/* Abstract celestial background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 opacity-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/10 opacity-5 pointer-events-none" />
        <div className="absolute right-10 bottom-5 w-44 h-44 opacity-[0.03] text-white">
          <Compass className="w-full h-full animate-spin-slow" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link to="/" className="text-white/65 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold">
                  <Home className="w-3.5 h-3.5" />
                  Home
                </Link>
                <span className="text-white/30 text-xs">/</span>
                <span className="text-white font-semibold text-xs">Panchang</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-white font-bold leading-tight tracking-tight">
                Cosmic Panchangam
              </h1>
              <p className="text-stone-300 text-xs md:text-sm mt-2 font-light max-w-xl">
                Explore real-time dynamic celestial alignments, planetary hour periods, auspicious Abhijit slots, and complete daily Chaughadiya divisions.
              </p>
            </div>

            {/* Quick Actions (Inputs) */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 min-w-[150px] md:flex-initial">
                <input 
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full md:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#E5C06A] transition-colors cursor-pointer"
                />
              </div>

              <div className="relative flex-1 min-w-[180px] md:flex-initial">
                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className="w-full text-left bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs flex justify-between items-center transition-colors shadow-sm"
                >
                  <span className="truncate">{city.split(',')[0]}</span>
                  <MapPin className="w-4 h-4 text-[#E5C06A]" />
                </button>
              </div>

              <button 
                onClick={handleRefresh}
                className="bg-[#B38B36] hover:bg-[#E5C06A] hover:text-[#3C2A21] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Section Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-[#725D46]">
            <Loader2Spinner />
            <p className="font-serif text-lg animate-pulse">Calculating astrological charts and ephemeris metrics...</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            
            {/* Row 1: Current Status & Planetary Graphic Arc */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Status card */}
              <div className={`col-span-1 lg:col-span-2 relative overflow-hidden border p-8 rounded-[28px] transition-all duration-500 shadow-md ${statusStyle.bg} flex flex-col justify-between`}>
                <div className="absolute top-0 right-0 w-44 h-44 opacity-5">
                  <Sparkles className="w-full h-full text-[#B38B36]" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#725D46] font-extrabold">Cosmic Energy Alert</span>
                    <span className="text-[10px] bg-white border border-[#E5E1D8] px-2 py-0.5 rounded-md font-mono text-stone-600 font-bold">{data.local_time}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStyle.iconBg} shadow border border-black/5`}>
                      {data.status.color === "red" ? (
                        <AlertCircle className={`w-6 h-6 ${statusStyle.iconColor}`} />
                      ) : data.status.color === "green" ? (
                        <Sparkles className={`w-6 h-6 ${statusStyle.iconColor}`} />
                      ) : (
                        <HelpCircle className={`w-6 h-6 ${statusStyle.iconColor}`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-serif text-3xl font-extrabold tracking-tight ${statusStyle.titleColor}`}>{data.status.label}</h3>
                      <p className={`text-xs tracking-wide font-medium mt-1 leading-relaxed ${statusStyle.descColor}`}>{data.status.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-stone-600 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block font-bold text-stone-400">Sunrise</span>
                    <span className="font-serif font-bold text-[#3C2A21] mt-0.5 block">{data.sunrise}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block font-bold text-stone-400">Sunset</span>
                    <span className="font-serif font-bold text-[#3C2A21] mt-0.5 block">{data.sunset}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block font-bold text-green-600">Abhijit Muhurat</span>
                    <span className="font-serif font-bold text-[#3C2A21] mt-0.5 block">{data.abhijit.start} - {data.abhijit.end}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider block font-bold text-red-600">Rahu Kaal</span>
                    <span className="font-serif font-bold text-[#3C2A21] mt-0.5 block">{data.rahu_kaal.start} - {data.rahu_kaal.end}</span>
                  </div>
                </div>
              </div>

              {/* Graphical Wheel chart */}
              <div className="bg-white border border-[#E5E1D8] rounded-[28px] p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#B38B36] rounded-full animate-ping" />
                  <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-stone-400">Daytime Division</span>
                </div>

                <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1EDE4" strokeWidth="10" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#E67E22" 
                    strokeWidth="10" 
                    strokeDasharray={`${(data.percentages.day_time / 100.0) * circumference} ${circumference}`}
                    strokeDashoffset="0"
                    className="transition-all duration-1000 ease-out"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#84CC16" 
                    strokeWidth="12" 
                    strokeDasharray={`${(data.percentages.abhijit / 100.0) * circumference} ${circumference}`}
                    strokeDashoffset={-((data.abhijit.start_decimal) / 24.0) * circumference}
                    className="transition-all duration-1000 ease-out"
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#C2410C" 
                    strokeWidth="12" 
                    strokeDasharray={`${(data.percentages.rahu_kaal / 100.0) * circumference} ${circumference}`}
                    strokeDashoffset={-((data.rahu_kaal.start_decimal) / 24.0) * circumference}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="text-center mt-4">
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">Current City Time</span>
                  <span className="font-serif text-xl font-bold text-[#3C2A21]">{data.local_time}</span>
                  <div className="flex gap-4 items-center justify-center mt-3 text-[9px] font-bold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#E67E22]" /> Day ({data.percentages.day_time}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#C2410C]" /> Rahu ({data.percentages.rahu_kaal}%)</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" /> Abhijit ({data.percentages.abhijit}%)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Row 2: Active Choghadiya Hero Card */}
            {data.choghadiya?.active && (
              <div className="relative overflow-hidden rounded-[28px] border border-[#B38B36]/25 shadow-md">
                {(() => {
                  const active = data.choghadiya.active;
                  let bannerBg = "from-[#FDFBF7] to-[#FAF6EE]";
                  let badgeBg = "bg-stone-100 text-stone-700 border-stone-200";
                  let indicatorColor = "bg-[#B38B36]";
                  
                  if (active.status === "shubh") {
                    bannerBg = "from-green-50/40 to-[#FAF6EE]";
                    badgeBg = "bg-green-100 text-green-800 border-green-200/50";
                    indicatorColor = "bg-green-600";
                  } else if (active.status === "asubh") {
                    bannerBg = "from-red-50/40 to-[#FAF6EE]";
                    badgeBg = "bg-red-100 text-red-800 border-red-200/50";
                    indicatorColor = "bg-red-600";
                  } else if (active.status === "neutral") {
                    bannerBg = "from-blue-50/40 to-[#FAF6EE]";
                    badgeBg = "bg-blue-100 text-blue-800 border-blue-200/50";
                    indicatorColor = "bg-blue-600";
                  }

                  const tabName = data.choghadiya.day.some(s => s.name === active.name && s.start === active.start) ? "day" : "night";
                  const currentList = data.choghadiya[tabName];
                  const currentIndex = currentList.findIndex(s => s.name === active.name && s.start === active.start);
                  const nextPeriod = currentList[(currentIndex + 1) % 8];

                  return (
                    <div className={`p-8 bg-gradient-to-r ${bannerBg} flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${indicatorColor} animate-pulse`} />
                          <span className="text-[10px] tracking-[0.25em] uppercase text-[#725D46] font-extrabold">Current Time Period</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <h4 className="font-serif text-3xl font-extrabold tracking-tight">{active.name}</h4>
                          <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${badgeBg}`}>
                            {active.status === "shubh" ? "Auspicious (Labh/Shubh/Amrit)" : active.status === "asubh" ? "Inauspicious (Rog/Kaal/Udveg)" : "Neutral (Char)"}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 font-light italic">{active.desc} is currently active in this timezone.</p>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
                        <div className="bg-white/80 border border-[#E5E1D8] px-5 py-2.5 rounded-xl shadow-sm">
                          <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-bold mb-0.5">Active Time Slot</span>
                          <span className="font-mono text-sm font-extrabold text-[#3C2A21]">{active.start} - {active.end}</span>
                        </div>
                        {nextPeriod && (
                          <div className="flex items-center gap-1.5 text-[10px] text-[#725D46] font-semibold bg-[#FBF6EC] px-3 py-1 rounded-lg border border-[#B38B36]/15 self-start md:self-auto shadow-sm">
                            <span>Upcoming Time Block: {nextPeriod.name}</span>
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

            {/* Row 3: Heavenly Pulse & Vedic Hours grids */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Heavenly Pulse & Core Elements */}
              <div className="bg-white/70 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-5">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#B38B36]" />
                    Heavenly Pulse & Elements
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    The five core metrics (Panchang) and lunar planetary signs defining today's energy fields.
                  </p>
                </div>
                
                <div className="space-y-4 text-xs">
                  {[
                    { label: "Tithi (Lunar Day)", value: data.elements?.tithi },
                    { label: "Nakshatra (Lunar Mansion)", value: data.elements?.nakshatra },
                    { label: "Yoga (Solilunar Aspect)", value: data.elements?.yoga },
                    { label: "Karana (Half Tithi)", value: data.elements?.karana },
                    { label: "Vara (Day of the Week)", value: data.elements?.vara },
                    { label: "Moon Sign (Rashi)", value: data.elements?.moon_sign },
                    { label: "Moon Phase", value: data.elements?.moon_phase }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-stone-100 last:border-0 last:pb-0">
                      <span className="font-bold text-stone-600">{item.label}</span>
                      <span className="font-serif text-[#3C2A21] font-bold text-[13px] bg-white border border-[#E5E1D8] px-3.5 py-1.5 rounded-xl shadow-sm">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Vedic Hours */}
              <div className="bg-white/70 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-5">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#B38B36]" />
                    Dynamic Vedic Hours
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Daily planetary alignments determining auspicious Abhijit slots and cautionary timing gates.
                  </p>
                </div>
                
                <div className="space-y-3.5 text-xs">
                  {/* Sun / Moon Icons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                        <Sun className="w-4.5 h-4.5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest block font-bold text-stone-400">Sunrise</span>
                        <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.sunrise}</span>
                      </div>
                    </div>
                    <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <Moon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest block font-bold text-stone-400">Sunset</span>
                        <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.sunset}</span>
                      </div>
                    </div>
                  </div>

                  {[
                    { title: "Abhijit Muhurat", time: `${data.abhijit.start} - ${data.abhijit.end}`, desc: "Ideal for starting important tasks & new beginnings", status: "good" },
                    { title: "Rahu Kaal", time: `${data.rahu_kaal.start} - ${data.rahu_kaal.end}`, desc: "Caution: Period of malefic energy. Avoid investments.", status: "bad" },
                    { title: "Yama Gandha", time: `${data.yama_gandha.start} - ${data.yama_gandha.end}`, desc: "Inauspicious. Postpone journeys & partnerships.", status: "warning" },
                    { title: "Gulika Kaal", time: `${data.gulika_kaal.start} - ${data.gulika_kaal.end}`, desc: "Obstruction energy slot. Slow down operations.", status: "warning" }
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
                      <div key={idx} className={`border p-4 rounded-2xl flex items-center justify-between shadow-sm transition-colors ${indicatorBg}`}>
                        <div>
                          <span className="text-[9px] uppercase tracking-widest block font-extrabold mb-0.5 flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> {hour.title}
                          </span>
                          <span className={`text-[10px] ${tagColor} font-light`}>{hour.desc}</span>
                        </div>
                        <span className="font-serif font-extrabold text-[13px] bg-white/70 px-3.5 py-1.5 rounded-xl border border-black/5 shadow-sm">{hour.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Row 4: Detailed Chaughadiya Table */}
            <div className="bg-white/70 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#B38B36]" />
                    Chaughadiya (Time Periods)
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Eight dynamic segments representing daily auspicious and cautionary intervals.
                  </p>
                </div>
                
                {/* Tab Selector */}
                <div className="flex gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200/50 self-start sm:self-auto">
                  <button 
                    onClick={() => setChoghadiyaTab("day")}
                    className={`px-6 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                      choghadiyaTab === "day" 
                        ? "bg-[#B38B36] text-white shadow-sm" 
                        : "text-stone-500 hover:text-[#3C2A21]"
                    }`}
                  >
                    Day
                  </button>
                  <button 
                    onClick={() => setChoghadiyaTab("night")}
                    className={`px-6 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
                      className={`relative border p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 ${bgStyle} ${
                        isCurrentActive ? "ring-2 ring-[#B38B36] shadow-md scale-[1.03] bg-[#FFFDF9]" : "shadow-sm hover:shadow"
                      }`}
                    >
                      {isCurrentActive && (
                        <span className="absolute -top-2.5 right-3 bg-[#B38B36] text-white text-[8px] tracking-widest uppercase font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                          Active
                        </span>
                      )}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center gap-1.5">
                          <span className="font-serif text-base font-extrabold text-[#3C2A21]">{slot.name}</span>
                          <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-md font-extrabold border ${badgeColor}`}>
                            {slot.status === "shubh" ? "Shubh" : slot.status === "asubh" ? "Asubh" : "Char"}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#725D46] font-light italic">{slot.desc}</p>
                      </div>
                      <div className="mt-5 pt-3 border-t border-stone-100">
                        <p className="text-[10px] font-mono text-stone-600 font-bold tracking-tight">{slot.start} - {slot.end}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 5: Sacred Fasting Table (2026) */}
            <div className="bg-white/70 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
              <div>
                <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#B38B36]" />
                  Sacred Fasting & Ekadashi (2026)
                </h4>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Highly auspicious monthly Ekadashi dates and lunar fasting periods observed globally.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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
                  <div key={index} className="bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-[#B38B36]/30 transition-all duration-300">
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

            {/* Row 6: Auspicious Muhurats Shortcuts */}
            <div className="bg-[#FAF6EE] border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
              <div>
                <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#B38B36]" />
                  Auspicious Shubh Muhurats (2026)
                </h4>
                <p className="text-xs text-stone-500 font-light mt-1">
                  Plan your life journeys during optimal cosmic alignments. Explore dates tailored to key categories.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { title: "Vivah (Marriage) Muhurat", path: "/shubh-muhurat-2026/vivah", desc: "Plan sacred marriage unions under harmonious planetary alignments." },
                  { title: "Vehicle Purchase Muhurat", path: "/shubh-muhurat-2026/namkaran", desc: "Select auspicious days for procuring automobiles and vehicles." },
                  { title: "Property Purchase Muhurat", path: "/shubh-muhurat-2026/vidyarambh", desc: "Identify optimal periods for registry, property purchase & construction." }
                ].map((muh, index) => (
                  <button 
                    key={index} 
                    onClick={() => navigate(muh.path)}
                    className="w-full text-left bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-sm flex flex-col justify-between hover:border-[#B38B36] hover:shadow-md transition-all duration-300 group cursor-pointer"
                  >
                    <div>
                      <h5 className="font-serif text-base font-bold text-[#3C2A21] group-hover:text-[#B38B36] transition-colors">{muh.title}</h5>
                      <p className="text-xs text-[#725D46] font-light mt-2 leading-relaxed">{muh.desc}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] tracking-wider uppercase font-bold text-[#B38B36] mt-4">
                      <span>Explore Dates</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500 text-sm">
            <AlertCircle className="w-8 h-8 text-amber-600 mb-2" />
            <span>Failed to construct Panchang payload. Check selected location.</span>
          </div>
        )}
      </div>

      {/* Global City Search Modal */}
      <AnimatePresence>
        {isCityModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md">
            <div className="absolute inset-0" onClick={() => setIsCityModalOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-lg bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border border-[#B38B36]/30 p-6 rounded-3xl shadow-2xl relative max-h-[80vh] flex flex-col text-[#3C2A21] z-55"
            >
              <button 
                onClick={() => setIsCityModalOpen(false)}
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

    </div>
  );
};

const Loader2Spinner = () => (
  <svg 
    className="animate-spin h-10 w-10 text-[#B38B36]" 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle 
      className="opacity-25" 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
    />
  </svg>
);

export default PanchangPage;
