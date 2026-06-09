import { ArrowUpRight } from "lucide-react";

const About = () => {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="relative py-24 md:py-36 bg-[#FDFBF7] overflow-hidden"
    >
      {/* Constellation Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" className="text-[#B38B36]">
          <pattern id="constellations" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="currentColor" />
            <circle cx="150" cy="120" r="1.5" fill="currentColor" />
            <circle cx="280" cy="80" r="1" fill="currentColor" />
            <circle cx="320" cy="250" r="1.2" fill="currentColor" />
            <circle cx="100" cy="300" r="1" fill="currentColor" />
            <line x1="50" y1="50" x2="150" y2="120" stroke="currentColor" strokeWidth="0.2" />
            <line x1="150" y1="120" x2="280" y2="80" stroke="currentColor" strokeWidth="0.2" />
            <line x1="280" y1="80" x2="320" y2="250" stroke="currentColor" strokeWidth="0.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#constellations)" />
        </svg>
      </div>
      {/* Background Decorative Text */}
      <div className="absolute top-0 right-0 z-0 pointer-events-none select-none">
        <span className="font-serif text-[30vw] text-brand-dark/[0.02] leading-none uppercase translate-x-1/4 -translate-y-1/4">
          Wisdom
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 items-start">
          
          {/* Asymmetric Image Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] overflow-hidden shadow-2xl">
              <img 
                src="https://gitikasharma.in/wp-content/uploads/2024/02/about-img-1.png" 
                alt="Oracle" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-[#B38B36]/10 mix-blend-overlay" />
            </div>
            {/* Overlapping Floating Card */}
            <div className="absolute -bottom-10 -right-10 w-64 p-10 bg-white shadow-[20px_20px_60px_rgba(60,42,33,0.05)] border border-brand-dark/[0.02] animate-float">
               <div className="font-serif text-6xl text-[#B38B36] mb-4">24+</div>
               <div className="text-[9px] tracking-[0.4em] uppercase font-black text-[#3C2A21]">Years of Cosmic Mastery</div>
            </div>
          </div>

          <div className="lg:col-span-7 pt-12 lg:pt-24 lg:pl-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-[#B38B36]" />
              <span className="text-[10px] tracking-[0.6em] uppercase text-[#B38B36] font-black">Our Philosophy</span>
            </div>
            
            <h2 className="font-serif text-5xl md:text-7xl text-[#3C2A21] mb-12 leading-[1] tracking-tighter">
              Decoding the <br />
              <span className="italic font-light text-[#B38B36]">Unseen.</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-12 text-left">
              <div className="space-y-8">
                <p className="text-stone-500 leading-relaxed font-light first-letter:text-5xl first-letter:font-serif first-letter:text-[#B38B36] first-letter:mr-3 first-letter:float-left">
                  Gitika Sharma is a seasoned astrologer and IT professional with 24 years of experience 
                  dedicated to unraveling the intricate threads of pending karma woven within the fabric of existence. 
                  Our reports are individualized and meticulously researched to provide profound insights.
                </p>
                <button className="group flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase font-black text-[#3C2A21] border-b-2 border-[#B38B36] pb-2 hover:gap-6 transition-all">
                  Our Story <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-[#3C2A21] uppercase tracking-tight mb-8">Sacred Realms</h3>
                {[
                  { name: "Vedic Astrology", desc: "The science of light" },
                  { name: "Vastu Shastra", desc: "Sacred spatial alchemy" },
                  { name: "Numerology", desc: "The language of numbers" }
                ].map((item, i) => (
                  <div key={i} className="group border-l border-brand-dark/5 pl-6 py-2 hover:border-[#B38B36] transition-all">
                    <div className="text-[10px] tracking-[0.2em] uppercase font-black text-stone-400 group-hover:text-[#B38B36] transition-colors">{item.name}</div>
                    <div className="text-xs text-stone-400 font-light italic mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
