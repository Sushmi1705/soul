import React, { useEffect, useRef } from "react";
import { ArrowRight, Sparkles, Moon, Star } from "lucide-react";

const HeroAstrology = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7; // Slightly slower for a more mystical feel
    }
  }, []);

  return (
    <>
      <section
        id="home"
        className="relative min-h-[110vh] flex items-center overflow-hidden bg-[#FDFBF7]"
      >
        {/* Light Refraction & Prism Effects */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[120%] bg-gradient-to-l from-[#B38B36]/10 to-transparent blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[100%] bg-gradient-to-tr from-[#B38B36]/5 to-transparent blur-[100px] rounded-full" />
        </div>

        {/* Video Background (Subtle & Ethereal) */}
        <div className="absolute inset-0 z-0 opacity-30">
          <iframe
            className="absolute top-1/2 left-1/2 w-[110vw] h-[62vw] min-h-[110vh] min-w-[195vh] -translate-x-1/2 -translate-y-1/2 scale-110 grayscale brightness-150"
            src="https://www.youtube.com/embed/ZXAoEal9pPQ?autoplay=1&mute=1&loop=1&playlist=ZXAoEal9pPQ&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0&hd=1"
            frameBorder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>

        {/* Massive Decorative Typography (Background Layer) */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none pointer-events-none">
          <span className="font-serif text-[40vw] text-brand-dark/[0.02] leading-none tracking-tighter uppercase translate-y-20">
            Oracle
          </span>
        </div>

        {/* Main Content (Asymmetric) */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-left">
            <div className="flex items-center gap-4 mb-8 animate-reveal opacity-0" style={{ animationDelay: '0.2s' }}>
              <span className="h-px w-12 bg-[#B38B36]" />
              <span className="text-[10px] tracking-[0.6em] uppercase text-[#B38B36] font-black">Celestial Wisdom</span>
            </div>

            <h1 className="font-serif text-[#3C2A21] text-7xl md:text-9xl lg:text-[10rem] leading-[0.85] tracking-tighter mb-12 animate-reveal opacity-0" style={{ animationDelay: '0.4s' }}>
              Divine <br />
              <span className="italic font-light text-[#B38B36] ml-[10%]">Guidance.</span>
            </h1>

            <div className="max-w-md ml-[5%] space-y-8 animate-reveal opacity-0" style={{ animationDelay: '0.6s' }}>
              <p className="text-lg text-stone-500 leading-relaxed font-light">
                We decode the cosmic blueprint of your soul. A high-concept journey 
                through ancient Vedic science and modern spiritual alchemy.
              </p>
              <div className="flex items-center gap-8">
                <button className="px-12 py-5 bg-[#3C2A21] text-white text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#B38B36] transition-all duration-700 shadow-2xl">
                  Explore The Oracle
                </button>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-brand-dark/5 flex items-center justify-center group-hover:border-[#B38B36] transition-all">
                    <div className="w-2 h-2 rounded-full bg-[#B38B36] animate-pulse" />
                  </div>
                  <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-stone-400 group-hover:text-[#3C2A21] transition-colors">Play Intro</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block animate-reveal opacity-0" style={{ animationDelay: '0.8s' }}>
            <div className="relative w-[120%] aspect-square translate-x-10 animate-float">
               <div className="absolute inset-0 bg-[#B38B36]/5 blur-[100px] rounded-full" />
               <svg viewBox="0 0 1000 1000" className="w-full h-full text-[#B38B36] fill-current opacity-20 animate-[spinSlow_120s_linear_infinite]">
                  <circle cx="500" cy="500" r="480" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="500" cy="500" r="300" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  {Array.from({ length: 12 }).map((_, i) => (
                    <line
                      key={i}
                      x1="500" y1="500"
                      x2={500 + Math.cos((i * Math.PI * 2) / 12) * 480}
                      y2={500 + Math.sin((i * Math.PI * 2) / 12) * 480}
                      stroke="currentColor" strokeWidth="0.5"
                    />
                  ))}
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-white shadow-[-20px_20px_60px_rgba(60,42,33,0.05)] border border-brand-dark/[0.02] flex items-center justify-center p-12">
                     <img 
                      src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=400" 
                      alt="Oracle" 
                      className="w-full h-full object-cover rounded-full"
                     />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default HeroAstrology;
