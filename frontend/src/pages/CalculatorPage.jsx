import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Calendar, Clock, MapPin, User } from "lucide-react";

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

const CalculatorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const calc = CALCULATOR_DETAILS[id] || { title: "Astrology Calculator", desc: "Discover cosmic insights." };
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult("Based on the celestial alignments and the details provided, your cosmic energy is currently peaking in areas of inner growth and harmony. The planetary positions suggest a favorable time to trust your intuition and embrace new opportunities.");
    }, 2000);
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
    <div className="pt-[160px] pb-24 min-h-screen bg-[#FDFBF7] relative overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute top-20 left-1/4 w-[50%] h-[50%] bg-[#B38B36]/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[50%] h-[50%] bg-[#725D46]/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <button onClick={handleGoBack} className="inline-flex items-center text-stone-500 hover:text-[#B38B36] transition-colors mb-8 group cursor-pointer text-xs font-bold tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Calculators
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl md:text-5xl text-[#3C2A21] mb-4 font-bold tracking-tight">{calc.title}</h1>
          <p className="text-stone-500 max-w-xl mx-auto text-sm leading-relaxed font-light">{calc.desc}</p>
        </motion.div>

        {!result ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-[#E5E1D8]"
          >
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                    <User className="w-4 h-4 text-[#B38B36]" /> Full Name
                  </label>
                  <input required type="text" className="w-full bg-[#FDFBF7]/50 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B38B36]" /> Date of Birth
                  </label>
                  <input required type="date" className="w-full bg-[#FDFBF7]/50 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B38B36]" /> Time of Birth
                  </label>
                  <input required type="time" className="w-full bg-[#FDFBF7]/50 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#3C2A21] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B38B36]" /> Place of Birth
                  </label>
                  <input required type="text" className="w-full bg-[#FDFBF7]/50 border border-[#E5E1D8] rounded-xl px-4 py-3 outline-none focus:border-[#B38B36] focus:ring-1 focus:ring-[#B38B36]/30 transition-all text-sm text-[#3C2A21]" placeholder="City, Country" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-[#B38B36] text-white rounded-full py-4 font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-[#9A752B] transition-all duration-300 disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#3C2A21] p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-[#B38B36]/30 text-center relative overflow-hidden"
          >
            {/* Background Orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '40s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto bg-[#B38B36]/10 rounded-full flex items-center justify-center mb-6 border border-[#B38B36]/30">
                <Sparkles className="w-10 h-10 text-[#B38B36] animate-pulse" />
              </div>
              <h3 className="font-serif text-3xl text-white mb-4">Your Cosmic Result</h3>
              <p className="text-base text-stone-300 leading-relaxed mb-8 max-w-xl mx-auto font-light">
                {result}
              </p>
              <button 
                onClick={() => setResult(null)}
                className="text-xs uppercase tracking-widest font-bold text-white bg-[#B38B36] px-8 py-4 rounded-full hover:bg-[#9A752B] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 transform"
              >
                Recalculate
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalculatorPage;
