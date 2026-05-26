import { Moon, Hash, Heart, Sun, Star, Baby, Flame, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const CALCULATORS = [
  {
    id: "moon-sign",
    title: "Moon Sign Calculator",
    desc: "Understand your emotional nature, instincts, and how you truly respond to life situations.",
    icon: <Moon className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "numerology",
    title: "Numerology Calculator",
    desc: "Discover your core personality, identity, and the deeper forces that influence your everyday actions.",
    icon: <Hash className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "kundli-matching",
    title: "Kundli Matching",
    desc: "Decode your life path, destiny, and hidden patterns through the power of numbers.",
    icon: <Heart className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "lagna",
    title: "Lagna Calculator",
    desc: "Check marriage compatibility with detailed Guna Milan and deeper relationship insights.",
    icon: <Zap className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "nakshatra",
    title: "Nakshatra Calculator",
    desc: "Find your rising sign and understand how you express yourself and appear to the world.",
    icon: <Star className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "baby-name",
    title: "Baby Name Calculator",
    desc: "Know your current Mahadasha and how planetary periods are shaping your life and decisions.",
    icon: <Baby className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "flames",
    title: "Flames Calculator",
    desc: "Explore your Chinese zodiac sign, personality traits, and the elements that influence your nature.",
    icon: <Flame className="w-6 h-6 text-[#B38B36]" />,
  },
  {
    id: "rahu-ketu",
    title: "Rahu Ketu Calculator",
    desc: "Reveal your personal lucky numbers to make better choices and attract positive opportunities.",
    icon: <Sun className="w-6 h-6 text-[#B38B36]" />,
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
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                {calc.icon}
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
