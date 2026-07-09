import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Search, 
  Award, 
  Loader2, 
  ArrowRight,
  User,
  MapPin,
  CheckCircle2,
  CalendarCheck
} from "lucide-react";
import { MUHURAT_DATA } from "@/data/muhuratData";
import { formatINR } from "@/data/content";

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

  // Active category state
  const activeId = type && MUHURAT_DATA[type] ? type : "yagyopavit";
  const activeData = MUHURAT_DATA[activeId];

  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Synchronize category change in tabs
  const handleTabChange = (id) => {
    navigate(`/shubh-muhurat-2026/${id}`);
    setSearchTerm("");
  };

  // Filter dates
  const filteredDates = activeData.dates.filter(
    (d) =>
      d.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tithi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nakshatra.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
          alt="Shubh Muhurats 2026" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
        />
        {/* Decorative orbits */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center"
        >
          <div className="text-[#B38B36] text-[10px] tracking-[0.4em] uppercase font-black mb-3">Auspicious Timings</div>
          <h1 className="font-serif text-4xl md:text-6xl text-white font-bold tracking-wide">Shubh Muhurats 2026</h1>
        </motion.div>
      </motion.div>

      {/* Main Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          
          {/* Sidebar Tabs */}
          <aside className="lg:sticky lg:top-28 space-y-2 z-20">
            <div className="p-4 bg-[#3C2A21] rounded-2xl border border-[#B38B36]/30 text-white mb-6">
              <h3 className="font-serif text-lg text-[#E5C06A] mb-1 font-bold">Ceremonies 2026</h3>
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
          </aside>

          {/* Main Content Area */}
          <div className="space-y-12">
            
            {/* active category content */}
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-6 h-6 text-[#B38B36]" />
                <h2 className="font-serif text-3xl md:text-4xl text-[#3C2A21] font-bold">
                  {activeData.title}
                </h2>
              </div>
              <p className="text-[#3C2A21] font-medium leading-relaxed text-sm">
                {activeData.desc}
              </p>

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

              {/* Table of Muhurats */}
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
                          <tr 
                            key={idx} 
                            className="hover:bg-[#FDFBF7] transition-colors group"
                          >
                            <td className="py-4 px-6 font-bold group-hover:text-[#B38B36] transition-colors">{item.date}</td>
                            <td className="py-4 px-6 font-light">{item.day}</td>
                            <td className="py-4 px-6 font-light text-stone-500">{item.tithi}</td>
                            <td className="py-4 px-6 font-serif italic text-[#B38B36]">{item.nakshatra}</td>
                            <td className="py-4 px-6">
                              <div className="inline-flex items-center gap-1.5 bg-[#F3F1EC] px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider text-stone-700">
                                <Clock className="w-3 h-3 text-[#B38B36]" />
                                {item.time}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-[#3C2A21] italic font-medium">
                            No dates match your filter terms. Try searching for a different keyword.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShubhMuhuratPage;
