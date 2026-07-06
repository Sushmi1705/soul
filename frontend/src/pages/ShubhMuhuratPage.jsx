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

  // Personalized finder form states
  const [formData, setFormData] = useState({ name: "", dob: "", tob: "", pob: "" });
  const [loading, setLoading] = useState(false);
  const [personalResult, setPersonalResult] = useState(null);

  // Synchronize category change in tabs
  const handleTabChange = (id) => {
    navigate(`/shubh-muhurat-2026/${id}`);
    setSearchTerm("");
    setPersonalResult(null);
  };

  // Filter dates
  const filteredDates = activeData.dates.filter(
    (d) =>
      d.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tithi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nakshatra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Personalized calculation handler
  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) {
      return;
    }
    setLoading(true);
    setPersonalResult(null);

    // Mock celestial calculations delay
    setTimeout(() => {
      // Pick a random nakshatra from list
      const nakshatras = ["Rohini", "Pushya", "Revati", "Hasta", "Mrigashira", "Uttarabhadrapada", "Shravana", "Swati"];
      const birthNak = nakshatras[Math.floor(Math.random() * nakshatras.length)];
      const randomTithi = ["Prathama", "Tritiya", "Panchami", "Saptami", "Dashami", "Ekadashi"][Math.floor(Math.random() * 6)];

      setPersonalResult({
        name: formData.name,
        birthNak,
        rasi: ["Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)", "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrischika)", "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"][Math.floor(Math.random() * 12)],
        ruler: ["Moon", "Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"][Math.floor(Math.random() * 7)],
        bestDay: ["Wednesday", "Thursday", "Friday"][Math.floor(Math.random() * 3)],
        months: ["March / April 2026", "May / June 2026", "November 2026"][Math.floor(Math.random() * 3)],
        reason: `Based on the planetary positions at the time of your birth, the Moon occupies the highly auspicious star ${birthNak}. For your ${activeData.title.split(" ")[0]} ceremony, days ruled by your planetary benefactor are optimal. Performing the rites during the specified periods ensures positive energy flow, health, and cosmic alignment.`
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#FDFBF7]">
      {/* Banner Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[250px] md:h-[320px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20"
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

            {/* Personalized Muhurat Finder Form */}
            <div className="bg-white p-8 md:p-12 shadow-xl border border-[#E5E1D8] rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] pointer-events-none">
                <Sparkles className="w-full h-full text-[#B38B36]" />
              </div>

              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[#B38B36] text-white text-xs font-medium flex items-center justify-center">
                    ✦
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#3C2A21]">
                    Personalized Muhurat Finder
                  </h3>
                </div>
                <p className="text-[#3C2A21] text-xs font-medium leading-relaxed mb-8">
                  General Muhurats are stellar guideposts. However, for a perfect alignment, we calculate Muhurats according to your birth nakshatra and horoscope chart nodes. Enter your birth details to generate your mock celestial compatibility.
                </p>

                <form onSubmit={handlePersonalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#B38B36] font-bold">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#E5E1D8] pl-9 pb-2 focus:outline-none focus:border-[#B38B36] transition-colors text-sm text-[#3C2A21]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#B38B36] font-bold">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full bg-transparent border-b border-[#E5E1D8] pl-9 pb-2 focus:outline-none focus:border-[#B38B36] transition-colors text-sm text-[#3C2A21] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#B38B36] font-bold">Time of Birth</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="time"
                        value={formData.tob}
                        onChange={(e) => setFormData({ ...formData, tob: e.target.value })}
                        className="w-full bg-transparent border-b border-[#E5E1D8] pl-9 pb-2 focus:outline-none focus:border-[#B38B36] transition-colors text-sm text-[#3C2A21] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#B38B36] font-bold">Place of Birth</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, India"
                        value={formData.pob}
                        onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                        className="w-full bg-transparent border-b border-[#E5E1D8] pl-9 pb-2 focus:outline-none focus:border-[#B38B36] transition-colors text-sm text-[#3C2A21]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-3 bg-[#B38B36] text-white px-8 py-3.5 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-[#9A752B] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Calculating Orbits...
                        </>
                      ) : (
                        <>
                          Find Auspicious Timing
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Display Personalized Result Box */}
                <AnimatePresence>
                  {personalResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-10 overflow-hidden"
                    >
                      <div className="p-6 md:p-8 bg-[#FDFBF7] border border-[#B38B36]/30 rounded-2xl relative">
                        <div className="absolute top-4 right-4 text-[#B38B36] opacity-20">
                          <Award className="w-12 h-12" />
                        </div>
                        
                        <div className="text-[10px] tracking-[0.3em] uppercase text-[#B38B36] font-bold mb-2">
                          Personal Alignment Calculation
                        </div>
                        <h4 className="font-serif text-xl text-[#3C2A21] mb-5">
                          Cosmic Blueprint for <span className="text-[#B38B36] font-medium">{personalResult.name}</span>
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 text-xs border-b border-[#E5E1D8] pb-6">
                          <div>
                            <span className="text-stone-400 block mb-1">Birth Star (Nakshatra)</span>
                            <span className="font-serif font-bold text-[#3C2A21]">{personalResult.birthNak}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block mb-1">Rising Sign (Lagna)</span>
                            <span className="font-serif font-bold text-[#3C2A21]">{personalResult.rasi}</span>
                          </div>
                          <div>
                            <span className="text-stone-400 block mb-1">Beneficial Weekday</span>
                            <span className="font-semibold text-[#B38B36]">{personalResult.bestDay}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1 font-bold">Auspicious Months (2026)</span>
                            <span className="font-serif text-[#3C2A21] font-semibold text-sm">{personalResult.months}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1 font-bold">Astrological Insight</span>
                            <p className="text-stone-600 font-light leading-relaxed text-xs">
                              {personalResult.reason}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-[#B38B36]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <p className="text-[10px] text-stone-400 leading-relaxed font-light text-center sm:text-left max-w-sm">
                            ✦ Get a precise, custom micro-calculated date based on parent/child charts. Book a consultation now.
                          </p>
                          <Link 
                            to="/contact" 
                            className="bg-[#3C2A21] text-[#E5C06A] px-6 py-2.5 rounded-full text-[10px] tracking-widest uppercase font-bold hover:bg-[#B38B36] hover:text-white transition-colors duration-300 shrink-0"
                          >
                            Book Detailed Reading
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ShubhMuhuratPage;
