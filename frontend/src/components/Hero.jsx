import { ArrowRight, MoveRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#FBF6EC]"
    >
      {/* Warm sunrise gradient base */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FBF6EC] via-[#F6E9D0] to-[#F0DCB4]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(229,192,106,0.45),transparent_60%)]" />
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(255,196,87,0.35),transparent_70%)]" />
        <div className="absolute -bottom-60 -left-40 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(179,139,54,0.25),transparent_70%)]" />
      </div>

      {/* Sacred geometry – Sri Yantra (right) */}
      <svg
        className="absolute top-1/2 right-[-6%] -translate-y-1/2 w-[820px] h-[820px] opacity-[0.18] pointer-events-none animate-[spinSlow_120s_linear_infinite]"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#8A5A1B" strokeWidth="0.6" fill="none">
          <circle cx="200" cy="200" r="195" />
          <circle cx="200" cy="200" r="170" />
          <circle cx="200" cy="200" r="150" strokeWidth="0.8" />
          {/* Lotus petals (16) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 16;
            const x1 = 200 + Math.cos(a) * 150;
            const y1 = 200 + Math.sin(a) * 150;
            const x2 = 200 + Math.cos(a) * 195;
            const y2 = 200 + Math.sin(a) * 195;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          {/* Outer triangles (upward) */}
          <polygon points="200,40 360,300 40,300" />
          <polygon points="200,360 40,100 360,100" />
          {/* Nested triangles */}
          <polygon points="200,80 320,280 80,280" />
          <polygon points="200,320 80,120 320,120" />
          <polygon points="200,120 290,260 110,260" />
          <polygon points="200,280 110,140 290,140" />
          <polygon points="200,150 270,240 130,240" />
          <polygon points="200,250 130,160 270,160" />
          {/* Bindu */}
          <circle cx="200" cy="200" r="3" fill="#8A5A1B" />
          <circle cx="200" cy="200" r="14" />
          <circle cx="200" cy="200" r="28" />
        </g>
      </svg>

      {/* Mandala (left, smaller, faster) */}
      <svg
        className="absolute -bottom-32 -left-32 w-[460px] h-[460px] opacity-[0.14] pointer-events-none animate-[spinSlowReverse_180s_linear_infinite]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden="true"
      >
        <g stroke="#B38B36" strokeWidth="0.5" fill="none">
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + Math.cos((i * Math.PI * 2) / 24) * 95}
              y2={100 + Math.sin((i * Math.PI * 2) / 24) * 95}
            />
          ))}
          {[20, 35, 50, 65, 80, 95].map((r) => (
            <circle key={r} cx="100" cy="100" r={r} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            return (
              <path
                key={i}
                d={`M100,100 Q ${100 + Math.cos(a - 0.2) * 60},${100 + Math.sin(a - 0.2) * 60} ${100 + Math.cos(a) * 80},${100 + Math.sin(a) * 80}`}
              />
            );
          })}
        </g>
      </svg>

      {/* Floating Om / sparkles */}
      <div className="absolute top-[18%] right-[14%] text-[#B38B36]/30 animate-[float_8s_ease-in-out_infinite]">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
          <text
            x="50"
            y="72"
            textAnchor="middle"
            fontSize="80"
            fontFamily="Cormorant Garamond, serif"
          >
            ॐ
          </text>
        </svg>
      </div>
      <div className="absolute bottom-[22%] right-[40%] animate-[float_11s_ease-in-out_infinite_reverse]">
        <Sparkles className="w-4 h-4 text-[#B38B36]/50" />
      </div>
      <div className="absolute top-[30%] left-[8%] animate-[float_9s_ease-in-out_infinite]">
        <Sparkles className="w-3 h-3 text-[#B38B36]/40" />
      </div>

      {/* Soft grain */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E\")",
        }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-32 w-full">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-8 animate-[fadeIn_1s_ease]">
            <span className="h-px w-16 bg-[#B38B36]" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-[#8A5A1B]">
              Vedic Astrology · Vastu · Numerology
            </span>
          </div>

          <h1
            data-testid="hero-headline"
            className="font-serif text-[#1F1A12] text-5xl sm:text-6xl lg:text-8xl leading-[0.95] tracking-tight mb-10"
          >
            Where the universe
            <br />
            <em className="italic font-light text-[#B38B36]">whispers</em>{" "}
            its secrets.
          </h1>

          <p className="text-[#3A2F22] text-lg max-w-2xl leading-relaxed mb-12 font-light">
            Astro Power 24 blends ancient Vedic wisdom with modern intuition —
            guiding you home to yourself through chart readings, vastu harmony,
            and soul-purpose sessions curated by Gitika Sharma.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <a
              href="#services"
              data-testid="hero-book-cta"
              className="group inline-flex items-center gap-3 bg-[#B38B36] hover:bg-[#9A752B] text-white px-8 py-4 rounded-full tracking-[0.15em] uppercase text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-[#B38B36]/30"
            >
              Book a Session
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#courses"
              data-testid="hero-courses-cta"
              className="group inline-flex items-center gap-3 text-[#1F1A12] border border-[#1F1A12]/20 hover:border-[#B38B36] hover:text-[#B38B36] hover:bg-white/40 backdrop-blur px-8 py-4 rounded-full tracking-[0.15em] uppercase text-xs font-medium transition-all duration-300"
            >
              Explore Courses
              <MoveRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Stats strip */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl border-t border-[#B38B36]/25 pt-8">
            {[
              { k: "15+", v: "Years of Practice" },
              { k: "5,200+", v: "Souls Guided" },
              { k: "4.9★", v: "Client Rating" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-serif text-3xl text-[#8A5A1B]">{s.k}</div>
                <div className="text-[10px] tracking-[0.25em] uppercase text-[#5A4A30] mt-2">
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade for smooth transition */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#F3F1EC] pointer-events-none" />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinSlow {
          from { transform: translateY(-50%) rotate(0deg); }
          to { transform: translateY(-50%) rotate(360deg); }
        }
        @keyframes spinSlowReverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(8deg); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
