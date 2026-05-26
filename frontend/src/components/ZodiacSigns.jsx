import React from 'react';

const ZODIAC_SIGNS = [
  { name: "Aries", icon: "♈\uFE0E", dates: "Mar 21 - Apr 19", element: "Fire", traits: "Courageous, determined, confident" },
  { name: "Taurus", icon: "♉\uFE0E", dates: "Apr 20 - May 20", element: "Earth", traits: "Reliable, patient, practical" },
  { name: "Gemini", icon: "♊\uFE0E", dates: "May 21 - Jun 20", element: "Air", traits: "Adaptable, outgoing, intelligent" },
  { name: "Cancer", icon: "♋\uFE0E", dates: "Jun 21 - Jul 22", element: "Water", traits: "Compassionate, intuitive, protective" },
  { name: "Leo", icon: "♌\uFE0E", dates: "Jul 23 - Aug 22", element: "Fire", traits: "Charismatic, loyal, passionate" },
  { name: "Virgo", icon: "♍\uFE0E", dates: "Aug 23 - Sep 22", element: "Earth", traits: "Analytical, kind, hardworking" },
  { name: "Libra", icon: "♎\uFE0E", dates: "Sep 23 - Oct 22", element: "Air", traits: "Diplomatic, fair-minded, social" },
  { name: "Scorpio", icon: "♏\uFE0E", dates: "Oct 23 - Nov 21", element: "Water", traits: "Brave, passionate, resourceful" },
  { name: "Sagittarius", icon: "♐\uFE0E", dates: "Nov 22 - Dec 21", element: "Fire", traits: "Optimistic, independent, adventurous" },
  { name: "Capricorn", icon: "♑\uFE0E", dates: "Dec 22 - Jan 19", element: "Earth", traits: "Disciplined, responsible, ambitious" },
  { name: "Aquarius", icon: "♒\uFE0E", dates: "Jan 20 - Feb 18", element: "Air", traits: "Progressive, original, independent" },
  { name: "Pisces", icon: "♓\uFE0E", dates: "Feb 19 - Mar 20", element: "Water", traits: "Empathetic, artistic, intuitive" },
];

const ZodiacSigns = () => {
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
           <p className="max-w-xs text-stone-400 text-xs leading-loose font-light italic mb-4">
             Each symbol is a gateway to a unique cosmic frequency. Click to decode your celestial signature.
           </p>
        </div>
        
        {/* Zodiac Luxury Cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
          {ZODIAC_SIGNS.map((sign, i) => (
            <div 
              key={i} 
              className={`group relative bg-gradient-to-br from-white to-[#F9F5EC] border border-[#D4AF37]/30 rounded-[1.25rem] p-6 md:p-8 transition-all duration-700 shadow-sm hover:shadow-[0_30px_70px_rgba(212,175,55,0.2)] hover:-translate-y-3 overflow-hidden animate-reveal opacity-0`}
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
                <p className="text-xs text-[#3C2A21]/80 leading-relaxed font-light italic relative z-10">
                  "{sign.traits}"
                </p>
                
                {/* Decorative Bottom Line */}
                <div className="w-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto group-hover:w-[80%] transition-all duration-700 mt-6 opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZodiacSigns;
