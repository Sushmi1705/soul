import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  CalendarCheck,
  Briefcase,
  TrendingUp,
  Bookmark
} from "lucide-react";
import { toast } from "sonner";

const PanchangPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Format today's date as YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const queryCity = searchParams.get("city");
  const queryDate = searchParams.get("date");

  const [city, setCity] = useState(queryCity || "New Delhi");
  const [selectedDate, setSelectedDate] = useState(queryDate || getTodayString());
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

  // Expandable sections limits (4 months initially)
  const [muhuratMonthsLimit, setMuhuratMonthsLimit] = useState(4);
  const [fastingMonthsLimit, setFastingMonthsLimit] = useState(4);
  const [beginningsMonthsLimit, setBeginningsMonthsLimit] = useState(4);

  // Auspicious Muhurats categories active state
  const [muhuratCategoryTab, setMuhuratCategoryTab] = useState("marriage");

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

  // Sync state to URL search parameters
  useEffect(() => {
    const currentParams = {};
    if (city) currentParams.city = city;
    if (selectedDate) currentParams.date = selectedDate;
    if (searchParams.get("city") !== city || searchParams.get("date") !== selectedDate) {
      setSearchParams(currentParams, { replace: true });
    }
  }, [city, selectedDate, searchParams, setSearchParams]);

  // Sync URL search parameters back to state (for back/forward navigation)
  useEffect(() => {
    const qCity = searchParams.get("city");
    const qDate = searchParams.get("date");
    if (qCity && qCity !== city) {
      setCity(qCity);
    }
    if (qDate && qDate !== selectedDate) {
      setSelectedDate(qDate);
    }
  }, [searchParams, city, selectedDate]);

  useEffect(() => {
    fetchPanchang(city, selectedDate);
  }, [city, selectedDate]);

  useEffect(() => {
    if (isCityModalOpen) {
      fetchCities();
    }
  }, [isCityModalOpen]);

  // Live Auto-Refresh every 60 seconds (Updates local clock & active status parameters)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!loading && data) {
        fetchPanchang(city, selectedDate);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [city, selectedDate, loading, data]);

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

  // Auspicious Muhurats Data
  const auspMuhurats = {
    marriage: [
      { month: "January", dates: ["No Shubh Dates"] },
      { month: "February", dates: ["05", "06", "08", "10", "12", "14", "19", "20", "21", "24", "25", "26"] },
      { month: "March", dates: ["02", "03", "04", "07", "08", "09", "11", "12"] },
      { month: "April", dates: ["15", "20", "21", "25", "26", "27", "28", "29"] },
      { month: "May", dates: ["01", "03", "05", "06", "07", "08", "13", "14"] },
      { month: "June", dates: ["21", "22", "23", "24", "25", "26", "27", "29"] },
      { month: "July", dates: ["01", "06", "07", "11"] },
      { month: "August", dates: ["No Shubh Dates"] },
      { month: "September", dates: ["No Shubh Dates"] },
      { month: "October", dates: ["No Shubh Dates"] },
      { month: "November", dates: ["21", "25", "26"] },
      { month: "December", dates: ["02", "03", "04", "05", "06", "11", "12"] }
    ],
    vehicle: [
      { month: "January", dates: ["01", "02", "04", "05", "11", "12", "14", "21", "28", "29"] },
      { month: "February", dates: ["01", "06", "11", "26", "27"] },
      { month: "March", dates: ["01", "05", "06", "08", "09", "15", "16", "23", "25", "27"] },
      { month: "April", dates: ["01", "02", "03", "06", "12", "13", "20", "24", "29"] },
      { month: "May", dates: ["01", "04", "10", "11", "14"] },
      { month: "June", dates: ["17", "22", "24", "25"] },
      { month: "July", dates: ["02", "03", "05", "08", "12", "19", "24", "29", "30"] },
      { month: "August", dates: ["07", "09", "10", "16", "17", "20", "26", "27", "28", "31"] },
      { month: "September", dates: ["04", "06", "07", "13", "14", "16", "17", "24"] },
      { month: "October", dates: ["21", "22", "25", "28", "30"] },
      { month: "November", dates: ["01", "06", "25", "26", "29"] },
      { month: "December", dates: ["03", "04", "06", "13", "14", "23", "30", "31"] }
    ],
    property: [
      { month: "January", dates: ["01", "02", "08", "15", "16", "22", "23", "29", "30"] },
      { month: "February", dates: ["12", "13", "19", "20", "26", "27"] },
      { month: "March", dates: ["12", "13", "19", "20", "26", "27"] },
      { month: "April", dates: ["09", "10", "16", "17", "23", "24"] },
      { month: "May", dates: ["01", "07", "14"] },
      { month: "June", dates: ["18", "19", "25", "26"] },
      { month: "July", dates: ["16", "17", "23", "24"] },
      { month: "August", dates: ["13", "14", "20", "21", "28"] },
      { month: "September", dates: ["04", "10", "11", "17", "18", "25"] },
      { month: "October", dates: ["01", "02", "08", "16", "22", "23", "29", "30"] },
      { month: "November", dates: ["12", "13", "19", "20", "26", "27"] },
      { month: "December", dates: ["10", "11", "17", "18", "24", "25"] }
    ]
  };

  // Sacred Fasting Calendar
  const fastingCalendar = [
    { month: "January", items: ["Shattila Ekadashi (14)", "Jaya Ekadashi (29)", "Pausha Amavasya (18)", "Pausha Purnima (3)"] },
    { month: "February", items: ["Vijaya Ekadashi (13)", "Amalaki Ekadashi (27)", "Magha Amavasya (17)", "Magha Purnima (1)"] },
    { month: "March", items: ["Papamochani Ekadashi (15)", "Kamada Ekadashi (29)", "Phalguna Amavasya (18)", "Phalguna Purnima (3)"] },
    { month: "April", items: ["Varuthini Ekadashi (13)", "Mohini Ekadashi (27)", "Chaitra Amavasya (17)", "Chaitra Purnima (2)"] },
    { month: "May", items: ["Apara Ekadashi (13)", "Nirjala Ekadashi (27)", "Vaisakha Amavasya (16)", "Vaisakha Purnima (1)"] },
    { month: "June", items: ["Yogini Ekadashi (11)", "Devshayani Ekadashi (25)", "Jyeshtha Amavasya (15)", "Jyeshtha Purnima (1)"] },
    { month: "July", items: ["Kamika Ekadashi (10)", "Shravana Putrada (24)", "Ashadha Amavasya (14)", "Ashadha Purnima (30)"] },
    { month: "August", items: ["Aja Ekadashi (09)", "Parsva Ekadashi (23)", "Shravana Amavasya (12)", "Shravana Purnima (28)"] },
    { month: "September", items: ["Indira Ekadashi (07)", "Papankusha Ekadashi (22)", "Bhadrapada Amavasya (11)", "Bhadrapada Purnima (27)"] },
    { month: "October", items: ["Rama Ekadashi (06)", "Devutthana Ekadashi (20)", "Ashvina Amavasya (10)", "Ashvina Purnima (26)"] },
    { month: "November", items: ["Utpanna Ekadashi (05)", "Mokshada Ekadashi (20)", "Kartika Amavasya (09)", "Kartika Purnima (24)"] },
    { month: "December", items: ["Saphala Ekadashi (05)", "Putrada Ekadashi (19)", "Margashirsha Amavasya (09)", "Margashirsha Purnima (24)"] }
  ];

  // New Beginnings Auspicious dates
  const newBeginnings = [
    { month: "January", items: ["House Warming (15)", "New Job (21)", "Office Opening (28)"] },
    { month: "February", items: ["New Business (06)", "Education Initiation (11)", "Investments (25)"] },
    { month: "March", items: ["Office Opening (09)", "House Warming (23)", "New Job (27)"] },
    { month: "April", items: ["New Business (12)", "Investments (20)", "Education Initiation (24)"] },
    { month: "May", items: ["House Warming (11)", "Office Opening (14)", "New Job (28)"] },
    { month: "June", items: ["New Business (17)", "Investments (22)", "Education Initiation (25)"] },
    { month: "July", items: ["Office Opening (08)", "House Warming (19)", "New Job (24)"] },
    { month: "August", items: ["New Business (09)", "Investments (16)", "Education Initiation (20)"] },
    { month: "September", items: ["House Warming (13)", "Office Opening (16)", "New Job (24)"] },
    { month: "October", items: ["New Business (22)", "Investments (25)", "Education Initiation (28)"] },
    { month: "November", items: ["Office Opening (06)", "House Warming (25)", "New Job (29)"] },
    { month: "December", items: ["New Business (13)", "Investments (23)", "Education Initiation (30)"] }
  ];

  return (
    <div className="pt-24 pb-20 relative z-10 bg-[#FDFBF7] text-[#3C2A21] min-h-screen">
      {/* Banner Header Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[180px] md:h-[220px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
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
                  className="w-full md:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-[#E5C06A] transition-colors cursor-pointer font-semibold"
                />
              </div>

              <div className="relative flex-1 min-w-[180px] md:flex-initial">
                <button
                  onClick={() => setIsCityModalOpen(true)}
                  className="w-full text-left bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs flex justify-between items-center transition-colors shadow-sm font-semibold"
                >
                  <span className="truncate">{city.split(',')[0]}</span>
                  <MapPin className="w-4 h-4 text-[#E5C06A]" />
                </button>
              </div>

              <button 
                onClick={handleRefresh}
                className="bg-[#B38B36] hover:bg-[#E5C06A] hover:text-[#3C2A21] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
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
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            
            {/* Left/Center Content Column (Grid span 3) */}
            <div className="lg:col-span-3 space-y-10">
              
              {/* SECTION 1: CURRENT PANCHANG SUMMARY */}
              <div className={`relative overflow-hidden border p-8 rounded-[28px] transition-all duration-500 shadow-md ${statusStyle.bg} flex flex-col md:flex-row justify-between gap-6`}>
                <div className="absolute top-0 right-0 w-44 h-44 opacity-5 pointer-events-none">
                  <Sparkles className="w-full h-full text-[#B38B36]" />
                </div>
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] tracking-[0.25em] uppercase text-[#725D46] font-extrabold bg-[#B38B36]/10 px-2.5 py-1 rounded border border-[#B38B36]/20">Live Cosmic Pulse</span>
                    <span className="text-[10px] bg-white border border-[#E5E1D8] px-2.5 py-0.5 rounded-md font-mono text-stone-600 font-bold">{data.local_time}</span>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStyle.iconBg} shadow border border-black/5 flex-shrink-0`}>
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

                {/* Progress Wheel Indicator */}
                <div className="flex flex-col items-center justify-center bg-white/50 border border-stone-200/40 p-4 rounded-2xl flex-shrink-0 w-full md:w-40 relative">
                  <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F1EDE4" strokeWidth="8" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      stroke="#B38B36" 
                      strokeWidth="8" 
                      strokeDasharray={`${(data.percentages.day_time / 100.0) * circumference} ${circumference}`}
                      strokeDashoffset="0"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] uppercase tracking-wider text-stone-400 font-extrabold">Day Ratio</span>
                    <span className="font-serif text-sm font-bold text-[#3C2A21]">{data.percentages.day_time}%</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: DAY INFORMATION */}
              <div className="bg-white/60 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-[#B38B36]" />
                    Solar & Lunar Day Cycles
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Solar boundaries and relative lunar positions of the selected place.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 text-xs text-stone-600">
                  <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                      <Sun className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400">Sunrise</span>
                      <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.sunrise}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <Moon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400">Sunset</span>
                      <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.sunset}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-[#B38B36] border border-amber-100">
                      <Compass className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400">Solar Noon</span>
                      <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.solar_noon}</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-amber-50/50 flex items-center justify-center text-stone-500 border border-stone-200/50">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400">Moonrise</span>
                      <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.moonrise}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 rounded-full bg-indigo-50/50 flex items-center justify-center text-stone-500 border border-stone-200/50">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400">Moonset</span>
                      <span className="font-serif font-bold text-[#3C2A21] text-sm">{data.moonset}</span>
                    </div>
                  </div>

                  <div className="bg-white/80 p-4 border border-[#E5E1D8] rounded-2xl flex items-center gap-3 shadow-sm col-span-2 sm:col-span-1">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 border border-stone-200">
                      <Clock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest block font-bold text-stone-400">Day / Night Length</span>
                      <span className="font-serif font-bold text-[#3C2A21] text-xs leading-none mt-1 block">{data.day_length} / {data.night_length}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PANCHANG DETAILS */}
              <div className="bg-white/60 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#B38B36]" />
                    Panchang details & Vedic Markers
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Traditional Indian astronomical markers derived from the Swiss Ephemeris.
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { label: "Tithi (Lunar Day)", value: data.elements?.tithi },
                    { label: "Paksha (Moon Phase Mode)", value: data.elements?.paksha },
                    { label: "Nakshatra (Lunar Mansion)", value: data.elements?.nakshatra },
                    { label: "Yoga (Solilunar Aspect)", value: data.elements?.yoga },
                    { label: "Karana (Half Tithi)", value: data.elements?.karana },
                    { label: "Vara (Weekday Name)", value: data.elements?.vara },
                    { label: "Moon Sign (Zodiac Rashi)", value: data.elements?.moon_sign },
                    { label: "Sun Sign (Zodiac Rashi)", value: data.elements?.sun_sign },
                    { label: "Moon Phase Percentage", value: data.elements?.moon_phase },
                    { label: "Hindu Lunar Month", value: data.elements?.hindu_month },
                    { label: "Samvatsara Year Name", value: data.elements?.samvatsara },
                    { label: "Current Hora Ruler", value: data.elements?.hora },
                    { label: "Nishita Muhurta", value: `${data.nishita_muhurta?.start} - ${data.nishita_muhurta?.end}` },
                    { label: "Vikram Samvat", value: data.elements?.vikram_samvat },
                    { label: "Shaka Samvat", value: data.elements?.shaka_samvat },
                    { label: "Ritu (Season)", value: data.elements?.ritu },
                    { label: "Ayanam", value: data.elements?.ayanam },
                    { label: "Today's Festival", value: data.festivals?.join(", ") },
                    { label: "Active Vrat/Fasting", value: data.vrats?.join(", ") }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2.5 border-b border-stone-100 last:border-0">
                      <span className="font-bold text-stone-500">{item.label}</span>
                      <span className="font-serif text-[#3C2A21] font-bold text-xs bg-white border border-[#E5E1D8] px-3.5 py-1.5 rounded-xl shadow-sm">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {data.summary && (
                  <div className="mt-6 bg-[#FAF6EE] border border-[#B38B36]/15 p-4 rounded-2xl text-xs text-[#725D46] font-light leading-relaxed">
                    <span className="font-bold text-[#3C2A21] uppercase tracking-wider block mb-1 text-[9px]">Panchangam Summary</span>
                    {data.summary}
                  </div>
                )}
              </div>

              {/* SECTION 4: MUHURAT DETAILS */}
              <div className="bg-white/60 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#B38B36]" />
                    Daily Muhurat Slots (Vedic Hours)
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Specific daily hours mapped to auspicious starts and caution gates.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { name: "Abhijit Muhurat", data: data.abhijit, status: "auspicious", desc: "Best period of the day for starting new businesses or journeys.", tag: "Recommended" },
                    { name: "Rahu Kalam", data: data.rahu_kaal, status: "inauspicious", desc: "Caution: Period of malefic solar energy. Avoid financial deals.", tag: "Avoid" },
                    { name: "Yama Gandha", data: data.yama_gandha, status: "inauspicious", desc: "Inauspicious hour. Delay crucial project signoffs.", tag: "Avoid" },
                    { name: "Gulika Kalam", data: data.gulika_kaal, status: "neutral", desc: "Obstruction window. Operations are delayed or stalled.", tag: "Routine Tasks Only" },
                    { name: "Brahma Muhurat", data: data.brahma_muhurat, status: "auspicious", desc: "Highly auspicious hour before dawn. Optimal for study & yoga.", tag: "Recommended" },
                    { name: "Dur Muhurat", data: data.dur_muhurat, status: "inauspicious", desc: "Inauspicious alignment. Restrict key ceremonies.", tag: "Avoid" },
                    { name: "Amrit Kalam", data: data.amrit_kalam, status: "auspicious", desc: "Excellent period for spiritual practice or meeting mentors.", tag: "Recommended" },
                    { name: "Varjyam", data: data.varjyam, status: "inauspicious", desc: "Caution: Avoid core operations during this energy cycle.", tag: "Avoid" },
                    { name: "Nishita Muhurta", data: data.nishita_muhurta, status: "neutral", desc: "Midnight sandhya hour. Recommended for meditation and silent contemplation.", tag: "Spiritual Tasks" }
                  ].map((muh, idx) => {
                    let indicatorBg = "bg-amber-50/60 border-amber-200/50 hover:border-amber-300";
                    let tagStyle = "bg-amber-100/70 text-amber-700 border-amber-200/30";
                    
                    if (muh.status === "auspicious") {
                      indicatorBg = "bg-green-50/60 border-green-200/50 hover:border-green-300";
                      tagStyle = "bg-green-100/70 text-green-700 border-green-200/30";
                    } else if (muh.status === "inauspicious") {
                      indicatorBg = "bg-red-50/60 border-red-200/50 hover:border-red-300";
                      tagStyle = "bg-red-100/70 text-red-700 border-red-200/30";
                    }

                    return (
                      <div key={idx} className={`border p-5 rounded-2xl flex flex-col justify-between shadow-sm transition-all duration-300 bg-white ${indicatorBg}`}>
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <span className="font-serif text-sm font-extrabold text-[#3C2A21] flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-[#B38B36]" />
                              {muh.name}
                            </span>
                            <span className={`text-[8px] uppercase tracking-wider px-2 py-0.5 rounded font-extrabold border ${tagStyle}`}>
                              {muh.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 font-light leading-relaxed mb-4">{muh.desc}</p>
                        </div>
                        <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                          <span className="text-stone-400 font-medium text-[9px] uppercase tracking-wider">Time Slot</span>
                          <span className="font-serif font-extrabold text-[#3C2A21] bg-white border border-stone-200/50 px-2.5 py-1 rounded-lg shadow-sm">
                            {muh.data?.start || "N/A"} - {muh.data?.end || "N/A"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 5: CHOGHADIYA */}
              <div className="bg-white/60 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#B38B36]" />
                      Chaughadiya (Time Periods)
                    </h4>
                    <p className="text-xs text-stone-500 font-light mt-1">
                      Eight dynamic divisions of the day/night for planning business activities.
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

              {/* SECTION 6: AUSPICIOUS MUHURAT 2026 */}
              <div className="bg-white/60 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
                  <div>
                    <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-[#B38B36]" />
                      Auspicious Muhurats (2026)
                    </h4>
                    <p className="text-xs text-stone-500 font-light mt-1">
                      Explore shubh dates for significant milestones and life transitions.
                    </p>
                  </div>
                  
                  {/* Category Tabs */}
                  <div className="flex gap-2 p-1 bg-stone-100 rounded-xl border border-stone-200/50 self-start sm:self-auto">
                    {[
                      { id: "marriage", label: "Marriage" },
                      { id: "vehicle", label: "Vehicle" },
                      { id: "property", label: "Property" }
                    ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => setMuhuratCategoryTab(tab.id)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all cursor-pointer ${
                          muhuratCategoryTab === tab.id 
                            ? "bg-[#B38B36] text-white shadow-sm" 
                            : "text-stone-500 hover:text-[#3C2A21]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {auspMuhurats[muhuratCategoryTab].slice(0, muhuratMonthsLimit).map((item, index) => (
                    <div key={index} className="bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-sm hover:border-[#B38B36]/30 transition-all duration-300">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-2">{item.month}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.dates.map((d, dIdx) => (
                          <span key={dIdx} className="text-[10px] text-[#3C2A21] bg-[#FBF6EC] border border-[#B38B36]/15 px-2 py-1 rounded-md font-semibold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setMuhuratMonthsLimit(prev => prev === 4 ? 12 : 4)}
                    className="border border-[#B38B36]/30 hover:border-[#B38B36] text-[#B38B36] px-8 py-3 rounded-full text-[10px] tracking-widest uppercase font-extrabold shadow-sm transition-all hover:bg-[#FBF6EC] active:scale-95 cursor-pointer"
                  >
                    {muhuratMonthsLimit === 4 ? "Show More Months ↓" : "Show Less Months ↑"}
                  </button>
                </div>
              </div>

              {/* SECTION 7: SACRED FASTING */}
              <div className="bg-white/60 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#B38B36]" />
                    Sacred Fasting & Ekadashi (2026)
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Monthly observances including Purnima, Amavasya, Sankashti, and Ekadashi timings.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {fastingCalendar.slice(0, fastingMonthsLimit).map((item, index) => (
                    <div key={index} className="bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-sm hover:border-[#B38B36]/30 transition-all duration-300">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-2">{item.month}</span>
                      <div className="space-y-1.5">
                        {item.items.map((fast, fIdx) => (
                          <div key={fIdx} className="text-xs text-[#3C2A21] font-medium flex items-start gap-1.5">
                            <span className="text-[#B38B36] mt-0.5">✦</span>
                            <span>{fast}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setFastingMonthsLimit(prev => prev === 4 ? 12 : 4)}
                    className="border border-[#B38B36]/30 hover:border-[#B38B36] text-[#B38B36] px-8 py-3 rounded-full text-[10px] tracking-widest uppercase font-extrabold shadow-sm transition-all hover:bg-[#FBF6EC] active:scale-95 cursor-pointer"
                  >
                    {fastingMonthsLimit === 4 ? "Show More Months ↓" : "Show Less Months ↑"}
                  </button>
                </div>
              </div>

              {/* SECTION 8: NEW BEGINNINGS */}
              <div className="bg-[#FAF6EE]/50 border border-[#B38B36]/15 rounded-[28px] p-8 shadow-sm space-y-6">
                <div>
                  <h4 className="font-serif text-lg uppercase tracking-wider text-[#8E6B23] font-bold border-b border-stone-200 pb-2 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#B38B36]" />
                    New Beginnings & Work Muhurats
                  </h4>
                  <p className="text-xs text-stone-500 font-light mt-1">
                    Auspicious monthly slots for house warming, jobs, businesses, and education.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {newBeginnings.slice(0, beginningsMonthsLimit).map((item, index) => (
                    <div key={index} className="bg-white border border-[#E5E1D8] p-5 rounded-2xl shadow-sm hover:border-[#B38B36]/30 transition-all duration-300">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 font-extrabold block mb-2">{item.month}</span>
                      <div className="space-y-1.5">
                        {item.items.map((beg, bIdx) => (
                          <div key={bIdx} className="text-xs text-[#3C2A21] font-medium flex items-start gap-1.5">
                            <span className="text-[#E67E22] mt-0.5">✦</span>
                            <span>{beg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setBeginningsMonthsLimit(prev => prev === 4 ? 12 : 4)}
                    className="border border-[#B38B36]/30 hover:border-[#B38B36] text-[#B38B36] px-8 py-3 rounded-full text-[10px] tracking-widest uppercase font-extrabold shadow-sm transition-all hover:bg-[#FBF6EC] active:scale-95 cursor-pointer"
                  >
                    {beginningsMonthsLimit === 4 ? "Show More Months ↓" : "Show Less Months ↑"}
                  </button>
                </div>
              </div>

            </div>

            {/* SECTION 9: STICKY RIGHT SIDEBAR */}
            <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-6">
              
              <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FAF6EE] border-2 border-[#B38B36]/30 rounded-[28px] p-6 shadow-md space-y-5">
                <div className="text-center pb-3 border-b border-[#B38B36]/15">
                  <Compass className="w-7 h-7 text-[#B38B36] mx-auto mb-2" />
                  <h4 className="font-serif text-base font-extrabold text-[#3C2A21]">Celestial Pulse</h4>
                  <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{city.split(',')[0]}</p>
                         <div className="space-y-3.5 text-xs text-[#3C2A21]">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Moon Sign</span>
                    <span className="font-serif font-extrabold text-[#B38B36]">{data.elements?.moon_sign?.split(" ")[0] || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Sun Sign</span>
                    <span className="font-serif font-extrabold text-[#B38B36]">{data.elements?.sun_sign?.split(" ")[0] || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Hora Ruler</span>
                    <span className="font-serif font-extrabold text-[#B38B36]">{data.elements?.hora || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Tithi</span>
                    <span className="font-serif font-extrabold text-[#B38B36] text-right truncate max-w-[120px]">{data.elements?.tithi?.split(" ")[0] || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Nakshatra</span>
                    <span className="font-serif font-extrabold text-[#B38B36]">{data.elements?.nakshatra || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Rahu Kalam</span>
                    <span className="font-mono font-extrabold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-100">{data.rahu_kaal?.start || "N/A"} - {data.rahu_kaal?.end || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Shubh Muhurat</span>
                    <span className="font-mono font-extrabold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">{data.abhijit?.start || "N/A"} - {data.abhijit?.end || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Sunrise</span>
                    <span className="font-serif font-extrabold text-[#3C2A21]">{data.sunrise || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-500 font-bold">Sunset</span>
                    <span className="font-serif font-extrabold text-[#3C2A21]">{data.sunset || "N/A"}</span>
                  </div>
                </div>          </div>

                <div className="pt-4 border-t border-[#B38B36]/15 text-center">
                  <div className="bg-[#FAF6EE] border border-[#B38B36]/15 rounded-xl p-3 text-[10px] text-[#725D46] font-light italic">
                    Astrological metrics calculated in real-time via Swiss Ephemeris data blocks.
                  </div>
                </div>
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
