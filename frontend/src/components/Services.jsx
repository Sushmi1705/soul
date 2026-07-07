import { useState } from "react";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import { SERVICES, formatINR } from "@/data/content";
import BookingModal from "@/components/BookingModal";

const Services = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="services"
      data-testid="services-section"
      className="relative py-24 md:py-36 bg-[#FDFBF7] overflow-hidden"
    >
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <span className="absolute top-1/4 left-0 font-serif text-[25vw] text-brand-dark/[0.01] uppercase -translate-x-1/2">
          Service
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-32 gap-8">
          <div className="max-w-2xl text-left">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-12 bg-[#B38B36]" />
              <span className="text-[10px] tracking-[0.6em] uppercase text-[#B38B36] font-black">Sacred Offerings</span>
            </div>
            <h2 className="font-serif text-6xl md:text-8xl text-[#3C2A21] leading-[0.9] tracking-tighter">
              The Path to <br />
              <span className="italic font-light text-[#B38B36]">Self Mastery.</span>
            </h2>
          </div>
          <p className="max-w-xs text-stone-700 text-xs leading-loose font-medium italic mb-6">
            We provide a curated gallery of celestial services designed to align your earthly path with the stars.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 relative z-10">
          {SERVICES.map((item, i) => (
            <div 
              key={item.id}
              className="group relative bg-[#FAF9F6] border border-[#E5E0D8] rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(179,139,54,0.15)] hover:border-[#B38B36]/30"
            >
              {/* Image banner (similar to Courses) */}
              <div className="relative aspect-square overflow-hidden bg-[#F9F7F2]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform scale-[1.0] transition-transform duration-700 group-hover:scale-[1.10]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80" }}
                  />
                <div className="absolute top-4 left-4 text-[10px] tracking-[0.25em] uppercase bg-white/80 backdrop-blur px-3 py-1.5 rounded-full text-[#B38B36] border border-[#B38B36]/20 font-bold flex items-center gap-1 z-20">
                   <CalendarClock className="w-3.5 h-3.5" />
                   <span>{item.duration}</span>
                </div>
              </div>

              {/* Content Body (no description shown initially) */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <h4 className="font-serif text-[#3C2A21] text-2xl lg:text-3xl mb-6 group-hover:text-[#B38B36] transition-colors duration-500">
                  {item.title}
                </h4>
                
                {/* Footer: Price & Action */}
                <div className="flex items-end justify-between pt-6 border-t border-[#E5E0D8] mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[9px] tracking-[0.2em] uppercase text-stone-600 font-semibold mb-1">Starting From</span>
                       <span className="font-serif text-xl text-[#3C2A21]">{formatINR(item.price)}</span>
                    </div>
                    
                    <button 
                       onClick={() => setSelected(item)}
                       className="group/btn flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold text-[#3C2A21] hover:text-[#B38B36] transition-colors"
                    >
                      Book Session
                      <span className="w-8 h-8 rounded-full bg-[#FDFBF7] border border-[#E5E0D8] flex items-center justify-center group-hover/btn:bg-[#B38B36] group-hover/btn:border-[#B38B36] transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#3C2A21] group-hover/btn:text-white transition-colors" />
                      </span>
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BookingModal
        service={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
};

export default Services;
