import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Search, 
  Loader2, 
  CalendarCheck,
  ChevronDown,
  Star,
  Globe
} from "lucide-react";

const API_BASE = (process.env.REACT_APP_API_URL || "http://127.0.0.1:8005") + "/api";

const ShubhMuhuratPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  // Categories definition
  const categories = [
    { id: "yagyopavit", label: "Yagyopavit / Upanayana" },
    { id: "annaprashana", label: "Annaprashana" },
    { id: "vidyarambh", label: "Vidyarambh" },
    { id: "namkaran", label: "Namkaran" },
    { id: "vivah", label: "Vivah (Marriage)" },
    { id: "mundan", label: "Mundan" },
    { id: "karnavedha", label: "Karnavedha" }
  ];

  const activeId = type || "yagyopavit";
  const [year, setYear] = useState(2026);
  const [searchTerm, setSearchTerm] = useState("");
  const [muhuratData, setMuhuratData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);

  // Fetch muhurat data from API
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/muhurat/${year}/${activeId}`
        );
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setMuhuratData(data);
          // Auto-expand first month with data
          if (data.months) {
            const firstMonth = Object.keys(data.months)[0];
            setExpandedMonth(firstMonth);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [activeId, year]);

  // Handle category tab change
  const handleTabChange = (id) => {
    navigate(`/shubh-muhurat-2026/${id}`);
    setSearchTerm("");
  };

  // Flatten all dates for search
  const allDates = useMemo(() => {
    if (!muhuratData?.months) return [];
    const dates = [];
    Object.entries(muhuratData.months).forEach(([month, monthDates]) => {
      monthDates.forEach(d => dates.push({ ...d, month }));
    });
    return dates;
  }, [muhuratData]);

  // Filter dates by search term
  const filteredDates = useMemo(() => {
    if (!searchTerm.trim()) return null; // null = show month-grouped view
    const term = searchTerm.toLowerCase();
    return allDates.filter(
      (d) =>
        d.date.toLowerCase().includes(term) ||
        d.day.toLowerCase().includes(term) ||
        d.tithi.toLowerCase().includes(term) ||
        d.nakshatra.toLowerCase().includes(term) ||
        d.month.toLowerCase().includes(term) ||
        d.time_display.toLowerCase().includes(term)
    );
  }, [allDates, searchTerm]);

  const MONTH_ORDER = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#FDFBF7]">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[180px] md:h-[220px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
      >
        <div className="absolute inset-0 bg-black/45 z-10" />
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80" 
          alt="Shubh Muhurats" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
        />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center"
        >
          <div className="text-[#B38B36] text-[10px] tracking-[0.4em] uppercase font-black mb-3">Auspicious Timings</div>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-wide">Shubh Muhurats {year}</h1>
        </motion.div>
      </motion.div>

      {/* Main Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Sidebar Tabs */}
          <aside className="lg:sticky lg:top-28 space-y-2 z-20">
            <div className="p-4 bg-[#3C2A21] rounded-2xl border border-[#B38B36]/30 text-white mb-6">
              <h3 className="font-serif text-lg text-[#E5C06A] mb-1 font-bold">Ceremonies {year}</h3>
              <p className="text-[10px] text-white/50 leading-relaxed font-light uppercase tracking-wider">Select a ceremony type below to view auspicious muhurats</p>
            </div>
            
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 scrollbar-none shrink-0">
              {categories.map((cat) => {
                const isSelected = activeId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleTabChange(cat.id)}
                    className={`px-5 py-3.5 text-xs tracking-wider uppercase font-bold text-left rounded-xl transition-all duration-300 border shrink-0 ${
                      isSelected
                        ? "bg-[#3C2A21] text-[#E5C06A] border-[#B38B36]/40 shadow-md translate-x-1"
                        : "bg-white text-[#725D46] border-[#E5E1D8] hover:border-[#B38B36]/40 hover:text-[#3C2A21]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>



            {/* Data Source Badge */}
            {muhuratData && (
              <div className="mt-4 p-3 bg-[#F3F1EC] rounded-xl border border-[#E5E1D8]">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-3 h-3 text-[#B38B36]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#725D46]">Data Source</span>
                </div>
                <p className="text-[10px] text-stone-500 leading-relaxed">{muhuratData.source}</p>
                <p className="text-[10px] text-[#B38B36] font-semibold mt-1">{muhuratData.total_dates} auspicious dates found</p>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <div className="space-y-8">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeId}-${year}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Title */}
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-6 h-6 text-[#B38B36]" />
                  <h2 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-bold">
                    {muhuratData?.title || `${categories.find(c => c.id === activeId)?.label || activeId} ${year}`}
                  </h2>
                </div>
                {muhuratData?.desc && (
                  <p className="text-[#3C2A21] font-medium leading-relaxed text-sm max-w-3xl">
                    {muhuratData.desc}
                  </p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-[#3C2A21] text-[#E5C06A] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Calendar className="w-3 h-3" />
                    {year}
                  </div>
                  {muhuratData && (
                    <div className="flex items-center gap-1.5 bg-[#F3F1EC] text-[#725D46] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      <Star className="w-3 h-3 text-[#B38B36]" />
                      {muhuratData.total_dates} dates
                    </div>
                  )}
                </div>

                {/* Search filter */}
                <div className="flex items-center gap-3 max-w-md bg-white border border-[#E5E1D8] px-4 py-2.5 rounded-xl">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Filter by month, day, tithi, nakshatra..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full focus:outline-none text-xs text-[#3C2A21] bg-transparent font-sans"
                  />
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Loader2 className="w-10 h-10 text-[#B38B36] animate-spin" />
                    <div className="text-center">
                      <p className="text-sm font-serif text-[#3C2A21] font-semibold">Computing Auspicious Dates...</p>
                      <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">Swiss Ephemeris · Lahiri Ayanamsa</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="py-12 text-center">
                    <p className="text-red-600 font-medium text-sm">Failed to load muhurat data</p>
                    <p className="text-stone-400 text-xs mt-1">{error}</p>
                  </div>
                )}

                {/* Data Display */}
                {!loading && !error && muhuratData && (
                  <>
                    {/* Search results (flat table) */}
                    {filteredDates !== null ? (
                      <div className="overflow-hidden border border-[#E5E1D8] rounded-2xl bg-white shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-[#3C2A21] text-[#E5C06A] font-serif uppercase tracking-widest text-[9px] border-b border-[#B38B36]/20">
                                <th className="py-4 px-6">Date</th>
                                <th className="py-4 px-6">Day</th>
                                <th className="py-4 px-6">Tithi</th>
                                <th className="py-4 px-6">Nakshatra</th>
                                <th className="py-4 px-6">Auspicious Timing</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E5E1D8] text-[#3C2A21]">
                              {filteredDates.length > 0 ? (
                                filteredDates.map((item, idx) => (
                                  <tr key={idx} className="hover:bg-[#FDFBF7] transition-colors group">
                                    <td className="py-4 px-6 font-bold group-hover:text-[#B38B36] transition-colors">{item.date}</td>
                                    <td className="py-4 px-6 font-light">{item.day}</td>
                                    <td className="py-4 px-6 font-light text-stone-500">{item.tithi}</td>
                                    <td className="py-4 px-6 font-serif italic text-[#B38B36]">{item.nakshatra}</td>
                                    <td className="py-4 px-6">
                                      <div className="flex flex-wrap gap-1.5">
                                        {item.time_windows.map((tw, ti) => (
                                          <span key={ti} className="inline-flex items-center gap-1 bg-[#F3F1EC] px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-stone-700">
                                            <Clock className="w-2.5 h-2.5 text-[#B38B36]" />
                                            {tw}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="5" className="py-8 text-center text-[#3C2A21] italic font-medium">
                                    No dates match your filter. Try a different keyword.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      /* Month-grouped accordion view */
                      <div className="space-y-4">
                        {MONTH_ORDER.filter(m => muhuratData.months[m]?.length > 0).map((month) => {
                          const monthDates = muhuratData.months[month];
                          const isExpanded = expandedMonth === month;

                          return (
                            <div 
                              key={month} 
                              className="overflow-hidden border border-[#E5E1D8] rounded-2xl bg-white shadow-sm"
                            >
                              {/* Month Header */}
                              <button
                                onClick={() => setExpandedMonth(isExpanded ? null : month)}
                                className="w-full flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#3C2A21] to-[#4A3527] text-white hover:from-[#4A3527] hover:to-[#5A4537] transition-all duration-300"
                              >
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5 text-[#E5C06A]" />
                                  <h3 className="font-serif text-lg font-bold tracking-wide">{month} {year}</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="bg-[#B38B36]/30 text-[#E5C06A] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                    {monthDates.length} {monthDates.length === 1 ? 'date' : 'dates'}
                                  </span>
                                  <ChevronDown className={`w-4 h-4 text-[#E5C06A] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </div>
                              </button>

                              {/* Month Content */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-left border-collapse text-xs">
                                        <thead>
                                          <tr className="bg-[#F3F1EC] text-[#725D46] font-serif uppercase tracking-widest text-[9px] border-b border-[#E5E1D8]">
                                            <th className="py-3 px-6">Date</th>
                                            <th className="py-3 px-6">Day</th>
                                            <th className="py-3 px-6">Tithi</th>
                                            <th className="py-3 px-6">Nakshatra</th>
                                            <th className="py-3 px-6">Auspicious Timing</th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E5E1D8] text-[#3C2A21]">
                                          {monthDates.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-[#FDFBF7] transition-colors group">
                                              <td className="py-4 px-6 font-bold group-hover:text-[#B38B36] transition-colors whitespace-nowrap">{item.date_display}</td>
                                              <td className="py-4 px-6 font-light">{item.day}</td>
                                              <td className="py-4 px-6 font-light text-stone-500">{item.tithi}</td>
                                              <td className="py-4 px-6 font-serif italic text-[#B38B36]">{item.nakshatra}</td>
                                              <td className="py-4 px-6">
                                                <div className="flex flex-wrap gap-1.5">
                                                  {item.time_windows.map((tw, ti) => (
                                                    <span key={ti} className="inline-flex items-center gap-1 bg-[#F3F1EC] px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider text-stone-700">
                                                      <Clock className="w-2.5 h-2.5 text-[#B38B36]" />
                                                      {tw}
                                                    </span>
                                                  ))}
                                                </div>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShubhMuhuratPage;
