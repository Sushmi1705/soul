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
    <div className="pt-[200px] pb-24 min-h-screen bg-white relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-20 left-1/4 w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <button onClick={handleGoBack} className="inline-flex items-center text-foreground/60 hover:text-primary transition-colors mb-12 group cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Calculators
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">{calc.title}</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">{calc.desc}</p>
        </motion.div>

        {!result ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/5 border border-black/5"
          >
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> Full Name
                  </label>
                  <input required type="text" className="w-full bg-white/50 border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Date of Birth
                  </label>
                  <input required type="date" className="w-full bg-white/50 border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Time of Birth
                  </label>
                  <input required type="time" className="w-full bg-white/50 border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Place of Birth
                  </label>
                  <input required type="text" className="w-full bg-white/50 border border-black/5 rounded-xl px-4 py-3 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" placeholder="City, Country" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-8 bg-primary text-white rounded-xl py-4 font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" /> Calculating Cosmos...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Reveal Insights
                  </span>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 md:p-14 rounded-[2.5rem] shadow-2xl border border-primary/20 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-serif text-3xl text-foreground mb-4">Your Cosmic Result</h3>
              <p className="text-lg text-foreground/70 leading-relaxed mb-8">
                {result}
              </p>
              <button 
                onClick={() => setResult(null)}
                className="text-sm uppercase tracking-widest font-bold text-primary border border-primary/30 px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-colors"
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
