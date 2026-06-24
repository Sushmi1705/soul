import { Moon, Hash, Heart, Sun, Star, Baby, Flame, Zap, CircleDashed, Sparkles, Hexagon, Compass, Asterisk } from "lucide-react";
import { Link } from "react-router-dom";

const SigilIcon = ({ Outer, Inner, Accent }) => (
  <div className="relative w-full h-full flex items-center justify-center">
    <Outer className="w-full h-full absolute text-[#D4AF37] opacity-20" strokeWidth={0.5} />
    {Accent && <Accent className="w-2/3 h-2/3 absolute text-[#D4AF37] opacity-40 animate-pulse" strokeWidth={1} />}
    <Inner className="w-1/2 h-1/2 relative z-10 text-[#B38B36] group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
  </div>
);

const CALCULATORS = [
  {
    id: "moon-sign",
    title: "Moon Sign Calculator",
    desc: "Understand your emotional nature, instincts, and how you truly respond to life situations.",
    icon: <SigilIcon Outer={CircleDashed} Inner={Moon} Accent={Sparkles} />,
  },
  {
    id: "numerology",
    title: "Numerology Calculator",
    desc: "Decode your life path, destiny, and hidden patterns through the power of numbers.",
    icon: <SigilIcon Outer={Hexagon} Inner={Hash} Accent={Asterisk} />,
  },
  {
    id: "kundli-matching",
    title: "Kundli Matching",
    desc: "Check marriage compatibility with detailed Guna Milan and deeper relationship insights.",
    icon: <SigilIcon Outer={CircleDashed} Inner={Heart} Accent={Sparkles} />,
  },
  {
    id: "lagna",
    title: "Lagna Calculator",
    desc: "Find your rising sign (Lagna) and understand how you express yourself and appear to the world.",
    icon: <SigilIcon Outer={Compass} Inner={Zap} Accent={Asterisk} />,
  },
  {
    id: "nakshatra",
    title: "Nakshatra Calculator",
    desc: "Understand your Nakshatra (birth star), lunar mansion, and its influence on your life path.",
    icon: <SigilIcon Outer={Hexagon} Inner={Star} Accent={Sparkles} />,
  },
  {
    id: "baby-name",
    title: "Baby Name Calculator",
    desc: "Find auspicious starting syllables and names for your baby based on their birth star (Nakshatra).",
    icon: <SigilIcon Outer={CircleDashed} Inner={Baby} Accent={Asterisk} />,
  },
  {
    id: "flames",
    title: "Flames Calculator",
    desc: "Find relationship compatibility using the classic FLAMES (Friend, Love, Affection, Marriage, Enemy, Sibling) algorithm.",
    icon: <SigilIcon Outer={Hexagon} Inner={Flame} Accent={Sparkles} />,
  },
  {
    id: "rahu-ketu",
    title: "Rahu Ketu Calculator",
    desc: "Discover the placements of Rahu & Ketu (Lunar Nodes) in your chart and their karmic lessons.",
    icon: <SigilIcon Outer={Compass} Inner={Sun} Accent={Moon} />,
  },
];

const Calculators = () => {
  return (
    <section className="py-24 bg-[#FDFBF7]" id="calculators">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl sm:text-5xl text-[#3C2A21] mb-4">
            Free <span className="text-[#B38B36]">Calculators</span>
          </h2>
          <p className="text-[#725D46] tracking-[0.05em] font-light">
            Understand your life better with our free Vedic astrology tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {CALCULATORS.map((calc) => (
            <Link
              to={`/calculator/${calc.id}`}
              key={calc.id}
              className="group bg-[#FBF6EC] border border-[#E5E1D8] p-6 rounded-xl flex items-start gap-6 hover:border-[#B38B36]/40 hover:shadow-xl hover:shadow-[#B38B36]/5 transition-all duration-300"
            >
              <div className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {/* Diamond Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#B38B36] transform rotate-45 rounded-[4px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                {/* Diamond Border */}
                <div className="absolute inset-1 border border-[#D4AF37]/50 transform rotate-45 rounded-[2px] group-hover:border-[#D4AF37] transition-colors duration-500"></div>
                {/* Icon */}
                <div className="relative z-10 w-10 h-10 text-[#B38B36] group-hover:text-[#D4AF37] transition-colors drop-shadow-md">
                  {calc.icon}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-serif text-xl text-[#3C2A21] mb-2">{calc.title}</h3>
                <p className="text-xs text-[#725D46] leading-relaxed mb-4 line-clamp-2">
                  {calc.desc}
                </p>
              </div>
              <button className="flex-shrink-0 text-[10px] tracking-[0.1em] uppercase font-bold text-[#3C2A21] border border-[#3C2A21]/10 px-4 py-2 rounded group-hover:bg-[#B38B36] group-hover:text-white group-hover:border-[#B38B36] transition-all duration-300 whitespace-nowrap">
                Calculate for Free →
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Calculators;
