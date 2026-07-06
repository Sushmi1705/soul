import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ZODIAC_SIGNS = [
  { name: "Aries", icon: "♈︎", dates: "Mar 21 - Apr 19", element: "Fire", traits: "Courageous, determined, confident" },
  { name: "Taurus", icon: "♉︎", dates: "Apr 20 - May 20", element: "Earth", traits: "Reliable, patient, practical" },
  { name: "Gemini", icon: "♊︎", dates: "May 21 - Jun 20", element: "Air", traits: "Adaptable, outgoing, intelligent" },
  { name: "Cancer", icon: "♋︎", dates: "Jun 21 - Jul 22", element: "Water", traits: "Compassionate, intuitive, protective" },
  { name: "Leo", icon: "♌︎", dates: "Jul 23 - Aug 22", element: "Fire", traits: "Charismatic, loyal, passionate" },
  { name: "Virgo", icon: "♍︎", dates: "Aug 23 - Sep 22", element: "Earth", traits: "Analytical, kind, hardworking" },
  { name: "Libra", icon: "♎︎", dates: "Sep 23 - Oct 22", element: "Air", traits: "Diplomatic, fair-minded, social" },
  { name: "Scorpio", icon: "♏︎", dates: "Oct 23 - Nov 21", element: "Water", traits: "Brave, passionate, resourceful" },
  { name: "Sagittarius", icon: "♐︎", dates: "Nov 22 - Dec 21", element: "Fire", traits: "Optimistic, independent, adventurous" },
  { name: "Capricorn", icon: "♑︎", dates: "Dec 22 - Jan 19", element: "Earth", traits: "Disciplined, responsible, ambitious" },
  { name: "Aquarius", icon: "♒︎", dates: "Jan 20 - Feb 18", element: "Air", traits: "Progressive, original, independent" },
  { name: "Pisces", icon: "♓︎", dates: "Feb 19 - Mar 20", element: "Water", traits: "Empathetic, artistic, intuitive" },
];

const HOROSCOPES = {
  Aries: {
    prediction: "Today is a day of dynamic action and breakthrough. The alignment of Mars pushes you to take bold initiatives. You will feel a surge of physical energy, making it an excellent time to tackle challenging tasks. In your personal relationships, a display of courageous honesty will clear up a long-standing misunderstanding. Trust your instincts and push boundaries.",
    luckyNumber: "9",
    luckyColor: "Crimson Red",
    cosmicTip: "Channel your passion into productive avenues rather than defensive debates.",
    energyLevel: "92%"
  },
  Taurus: {
    prediction: "The Moon's gentle transit invites you to ground your energy and appreciate sensory delights. Today, focus on stability and slow progress. A financial opportunity may require careful, practical assessment. In romance, simple acts of patience and steady warmth will deepen connections. Take time to connect with nature or indulge in a relaxing ritual.",
    luckyNumber: "6",
    luckyColor: "Forest Green",
    cosmicTip: "Stubbornness might block a beautiful cosmic flow; be open to minor adjustments.",
    energyLevel: "78%"
  },
  Gemini: {
    prediction: "Mercury heightens your mental agility and communicational charm today. Ideas are flowing rapidly, making it the perfect day to write, pitch, or engage in deep dialogue. You might receive a surprising message from someone in your past. Embrace flexibility, but be mindful not to scatter your energy across too many projects.",
    luckyNumber: "5",
    luckyColor: "Bright Amber",
    cosmicTip: "Listen twice as much as you speak to harvest the hidden wisdom in conversations today.",
    energyLevel: "88%"
  },
  Cancer: {
    prediction: "Your intuition is your strongest compass today. Under the current lunar alignment, you are highly receptive to emotional undercurrents. Trust your gut feelings regarding a family or property matter. Creating a safe, warm sanctuary at home will recharge your spirit. Nourish your body and heart with self-care.",
    luckyNumber: "2",
    luckyColor: "Silver Grey",
    cosmicTip: "Protect your peace by setting gentle but firm boundaries with emotionally draining people.",
    energyLevel: "74%"
  },
  Leo: {
    prediction: "The Sun illuminates your self-expression and creative spark today. You radiate charisma, drawing positive attention and opportunities. It is an ideal day to showcase your talents or speak from the heart. In career, your natural leadership inspires those around you. Let your generosity shine brightly.",
    luckyNumber: "1",
    luckyColor: "Golden Yellow",
    cosmicTip: "True royalty is defined by humility and lift-as-you-climb leadership. Share the spotlight.",
    energyLevel: "95%"
  },
  Virgo: {
    prediction: "Mercury brings meticulous clarity to your thoughts today. You will find it easy to organize, analyze, and solve complex problems. A health or work-related puzzle can be resolved with your keen attention to detail. Remember to take deep breaths and avoid overthinking. Rest your mind tonight.",
    luckyNumber: "3",
    luckyColor: "Olive Green",
    cosmicTip: "Perfect is the enemy of done. Release the urge to control every minor detail.",
    energyLevel: "80%"
  },
  Libra: {
    prediction: "Venus encourages harmony and beauty in your social circle. Today is perfect for resolving conflicts and seeking balance. Collaborative projects run smoothly, and networking brings pleasant surprises. Art, music, or decorating your space will bring you deep satisfaction. Seek out beauty in all things.",
    luckyNumber: "7",
    luckyColor: "Rose Pink",
    cosmicTip: "Do not compromise your own values just to maintain a superficial external peace.",
    energyLevel: "84%"
  },
  Scorpio: {
    prediction: "Deep, transformative energies are at play for you today. You may feel a pull toward researching a mystery or looking beneath the surface of a situation. Your determination is unmatched, making it a great day for deep investigative work or intimate emotional breakthroughs. Trust the process of change.",
    luckyNumber: "8",
    luckyColor: "Burgundy",
    cosmicTip: "Vulnerability is not a weakness; it is the ultimate source of emotional strength.",
    energyLevel: "90%"
  },
  Sagittarius: {
    prediction: "Your ruler, Jupiter, expands your desire for exploration and truth today. Optimism runs high, and you are eager to learn something new or broaden your horizons. A philosophical discussion or plan for travel could ignite your enthusiasm. Step outside your comfort zone and welcome synchronicities.",
    luckyNumber: "4",
    luckyColor: "Royal Purple",
    cosmicTip: "Stay grounded in today's details while keeping your eyes on tomorrow's horizons.",
    energyLevel: "89%"
  },
  Capricorn: {
    prediction: "Saturn demands discipline and structured effort today, but promises enduring rewards. Your career focus is sharp, and authority figures notice your reliability and wisdom. A long-term project benefits from your patience and solid planning. Take charge of your financial goals with structured steps.",
    luckyNumber: "10",
    luckyColor: "Charcoal Black",
    cosmicTip: "A slow and steady pace is what reaches the mountain peak. Do not rush your growth.",
    energyLevel: "85%"
  },
  Aquarius: {
    prediction: "Your innovative and humanitarian spirit is highly active today. You will have unique, original insights that challenge conventional methods. It is a great day to brainstorm progressive ideas or collaborate on community projects. Embrace your individuality and let your visionary ideals guide you.",
    luckyNumber: "11",
    luckyColor: "Electric Blue",
    cosmicTip: "Connect with like-minded souls to amplify your message and expand your vision.",
    energyLevel: "87%"
  },
  Pisces: {
    prediction: "Neptune heightens your dream state and artistic sensitivity today. Your imagination is incredibly vivid, making it a wonderful day for creative expression, meditation, or card readings. You feel a deep spiritual connection to the cosmos. Pay attention to your dreams and synchronistic events.",
    luckyNumber: "12",
    luckyColor: "Sea Green",
    cosmicTip: "Keep one foot anchored in reality to avoid getting lost in emotional illusions.",
    energyLevel: "82%"
  }
};

const ZodiacSigns = () => {
  const [selectedZodiac, setSelectedZodiac] = useState(null);

  return (
    <section className="py-36 bg-gradient-to-b from-[#FAF9F6] to-white overflow-hidden relative">
      {/* Background Decorative Text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <span className="font-serif text-[30vw] text-brand-dark/[0.01] leading-none uppercase -rotate-12">
          Celestial
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
           <div className="max-w-2xl text-left">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-[#B38B36]" />
                <span className="text-[10px] tracking-[0.6em] uppercase text-[#B38B36] font-black">Sacred Symbols</span>
              </div>
              <h2 className="font-serif text-5xl md:text-7xl text-[#3C2A21] leading-tight tracking-tighter">
                Explore Your <br />
                <span className="italic font-light text-[#B38B36]">Zodiac Soul.</span>
              </h2>
           </div>
           <p className="max-w-xs text-stone-700 text-xs leading-loose font-medium italic mb-4">
             Each symbol is a gateway to a unique cosmic frequency. Click to decode your celestial signature.
           </p>
        </div>
        
        {/* Zodiac Luxury Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
          {ZODIAC_SIGNS.map((sign, i) => (
            <div 
              key={i} 
              onClick={() => setSelectedZodiac(sign)}
              className={`group relative bg-gradient-to-br from-white to-[#F9F5EC] border border-[#D4AF37]/30 rounded-[1.25rem] p-6 md:p-8 transition-all duration-700 shadow-sm hover:shadow-[0_30px_70px_rgba(212,175,55,0.2)] hover:-translate-y-3 overflow-hidden animate-reveal opacity-0 cursor-pointer`}
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                
                {/* Huge Watermark Icon */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] text-[#D4AF37]/[0.08] group-hover:text-[#D4AF37]/[0.15] pointer-events-none transition-all duration-700 group-hover:scale-110 ease-out">
                  {sign.icon}
                </span>
 
                {/* Header: Icon */}
                <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-3xl text-[#D4AF37] mb-6 bg-white shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 ease-out relative z-10">
                  {sign.icon}
                </div>
                
                {/* Name & Dates */}
                <h3 className="text-2xl font-serif text-[#4A0E1B] mb-1 tracking-wider relative z-10">{sign.name}</h3>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#B38B36] font-bold mb-6 relative z-10">
                  {sign.dates}
                </span>
 
                {/* Element Tag */}
                <div className="px-5 py-1.5 rounded-full bg-gradient-to-r from-[#1A050A] to-[#4A0E1B] text-[9px] tracking-widest uppercase text-[#D4AF37] mb-6 shadow-md border border-[#D4AF37]/30 group-hover:border-[#D4AF37]/60 transition-colors relative z-10 font-bold">
                  Element: <span className="text-white ml-1">{sign.element}</span>
                </div>
 
                {/* Traits */}
                <p className="text-xs text-[#3C2A21] leading-relaxed font-semibold italic relative z-10">
                  "{sign.traits}"
                </p>
                
                {/* Decorative Bottom Line */}
                <div className="w-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto group-hover:w-[80%] transition-all duration-700 mt-6 opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Zodiac Horoscope Modal */}
      <AnimatePresence>
        {selectedZodiac && (() => {
          const horoscope = HOROSCOPES[selectedZodiac.name] || {};
          const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
          
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedZodiac(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative z-10 bg-[#FDFBF7] text-[#3C2A21] max-w-xl w-full rounded-2xl border-2 border-[#D4AF37] shadow-2xl p-6 md:p-8 overflow-hidden"
              >
                {/* Decorative border accent */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#4A0E1B] via-[#D4AF37] to-[#4A0E1B]" />
                
                {/* Big watermark inside modal */}
                <span className="absolute -right-8 -bottom-8 text-[12rem] text-[#D4AF37]/[0.05] pointer-events-none select-none">
                  {selectedZodiac.icon}
                </span>
 
                {/* Close Button */}
                <button
                  onClick={() => setSelectedZodiac(null)}
                  className="absolute top-4 right-4 p-2 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37] text-stone-500 hover:text-stone-800 transition-all bg-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
 
                {/* Header */}
                <div className="flex items-center gap-4 mb-6 text-left">
                  <div className="w-14 h-14 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-2xl text-[#D4AF37] bg-white shadow-sm shrink-0">
                    {selectedZodiac.icon}
                  </div>
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#B38B36] font-bold">
                      Cosmic Alignment ✦ {todayStr}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#4A0E1B]">
                      {selectedZodiac.name} Guidance
                    </h3>
                  </div>
                </div>
 
                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6 border-y border-[#D4AF37]/20 py-4 text-center">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-600 font-medium">Element</span>
                    <span className="font-semibold text-xs text-[#3C2A21]">{selectedZodiac.element}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-600 font-medium">Lucky Color</span>
                    <span className="font-semibold text-xs text-[#3C2A21]">{horoscope.luckyColor}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider text-stone-600 font-medium">Lucky Number</span>
                    <span className="font-semibold text-xs text-[#3C2A21]">{horoscope.luckyNumber}</span>
                  </div>
                </div>
 
                {/* Prediction Text */}
                <div className="mb-6 text-left">
                  <h4 className="text-[10px] uppercase tracking-widest text-[#B38B36] font-bold mb-2">Today's Forecast</h4>
                  <p className="text-sm text-[#3C2A21] leading-relaxed font-normal">
                    {horoscope.prediction}
                  </p>
                </div>
 
                {/* Cosmic Tip */}
                <div className="mb-6 p-4 rounded-xl bg-[#F9F5EC] border border-[#D4AF37]/20 text-left">
                  <h4 className="text-[9px] uppercase tracking-widest text-[#B38B36] font-black mb-1">Cosmic Tip of the Day</h4>
                  <p className="text-xs text-[#725D46] font-medium leading-relaxed italic">
                    "{horoscope.cosmicTip}"
                  </p>
                </div>
 
                {/* Energy Indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-stone-600 font-medium">Cosmic Energy Flow</span>
                  <div className="flex items-center gap-3 w-2/3">
                    <div className="w-full bg-[#E5E1D8] h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: horoscope.energyLevel }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-gradient-to-r from-[#B38B36] to-[#D4AF37] h-full rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#B38B36] w-10 text-right">{horoscope.energyLevel}</span>
                  </div>
                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
};

export default ZodiacSigns;
