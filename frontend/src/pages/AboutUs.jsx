import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#FDFBF7]">
      {/* Banner Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20">
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80" 
          alt="Astrology Banner" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 scale-105"
        />
        {/* Subtle decorative orbits in the banner background */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '100s' }} />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full border border-[#B38B36]/10 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '80s', animationDirection: 'reverse' }} />

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full flex justify-between items-center">
          <div className="text-white">
            <h1 className="font-serif text-5xl md:text-6xl mb-4 font-bold tracking-tight">About Us</h1>
            <p className="text-[#B38B36] text-xs font-bold tracking-[0.4em] uppercase">Life is full of possibilities</p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Enhanced Cosmic Welcome Card */}
          <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-[#3C2A21] flex flex-col items-center justify-center p-12 text-center group border border-[#B38B36]/20">
            {/* Cosmic background effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515940175183-6798529cb860?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
            
            {/* Rotating celestial rings */}
            <div className="absolute w-[360px] h-[360px] rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '40s' }} />
            <div className="absolute w-[280px] h-[280px] rounded-full border border-[#B38B36]/30 border-dotted animate-spin pointer-events-none" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
            <div className="absolute w-[200px] h-[200px] rounded-full border border-[#B38B36]/40 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '15s' }} />
            
            <div className="relative z-10 space-y-6">
              <Sparkles className="w-8 h-8 text-[#B38B36] mx-auto animate-pulse" />
              <h3 className="font-serif text-[#F3F1EC] text-2xl md:text-3xl tracking-wide font-light leading-relaxed">
                Where the universe <br /> whispers its secrets
              </h3>
              <div className="w-16 h-px bg-[#B38B36] mx-auto" />
              <p className="text-[#F3F1EC]/60 text-xs tracking-[0.3em] uppercase font-light">
                Astro Power 24 ✦ Vedic Vastu
              </p>
            </div>
            
            {/* Ambient corner glows */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#B38B36]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#B38B36]/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#B38B36] font-black">About Us</span>
              <span className="h-px w-12 bg-[#B38B36]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3C2A21] leading-tight">
              Welcome To <span className="text-[#B38B36] italic font-light">Astro Power 24</span>
            </h2>
            <div className="space-y-4 text-[#725D46] font-light leading-relaxed text-sm">
              <p>Welcome to Astro Power 24, your trusted source for Vedic Astrology and Vastu solutions. We blend ancient cosmic wisdom with modern life circumstances to provide comprehensive guidance and remedies for a harmonious, aligned, and prosperous life.</p>
              <p>With a deep-seated understanding of Vedic principles and years of experience, our team of expert astrologers and Vastu consultants is dedicated to assisting you on your journey towards self-discovery, personal growth, and holistic well-being.</p>
              <p>Our approach is rooted in authenticity, integrity, and compassion. We believe that every individual has a unique cosmic blueprint, and through the precise analysis of planetary positions and energy flows, we offer insightful interpretations and practical remedies tailored to your specific needs.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-[#B38B36] text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-[#9A752B] transition-all duration-300 mt-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
              Connect Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission Band */}
      <section className="bg-gradient-to-r from-[#3C2A21] via-[#725D46] to-[#3C2A21] text-white py-24 relative overflow-hidden border-y border-[#B38B36]/20">
         <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
         {/* Background Orbits */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 border-dashed pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
           <div className="grid md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-[#B38B36]/20">
              <div className="space-y-6 md:pr-12 text-center md:text-left">
                <h3 className="font-serif text-3xl font-bold tracking-wide text-[#FDFBF7]">Our Vision</h3>
                <p className="text-white/80 font-light leading-relaxed text-sm md:text-base">
                  Our vision is to create a sacred space where the mysteries of the universe converge with the intricacies of the human experience. Through the lens of astrology, we offer a profound exploration of the soul's journey, unlocking the hidden truths and untapped potentials that reside within each birth chart.
                </p>
              </div>
              <div className="space-y-6 pt-12 md:pt-0 md:pl-12 text-center md:text-left">
                <h3 className="font-serif text-3xl font-bold tracking-wide text-[#FDFBF7]">Our Mission</h3>
                <p className="text-white/80 font-light leading-relaxed text-sm md:text-base">
                  We envision a world where astrology serves as a compass, guiding souls towards alignment with their true purpose, inner wisdom, and authentic self-expression. Our mission is to empower our clients to embrace their cosmic blueprint, navigate life's challenges with grace, and embrace the infinite possibilities that await them in the stars.
                </p>
              </div>
           </div>
         </div>
      </section>

      {/* Gitika Sharma Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#B38B36] font-black">About the Founder</span>
              <span className="h-px w-12 bg-[#B38B36]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3C2A21] leading-tight">
              Gitika Sharma
            </h2>
            <div className="space-y-4 text-[#725D46] font-light leading-relaxed text-sm">
              <p>I am Gitika Sharma, a seasoned astrologer and IT Professional with 24 years of enriching experience, dedicated to unraveling the intricate threads of pending karma woven within the fabric of existence.</p>
              <p>My journey into the cosmic realms began at a young age, fueled by an insatiable curiosity and a deep-seated reverence for the celestial wonders that adorn our universe. As I delved deeper into the ancient wisdom of astrology, I found myself drawn to the profound mysteries of pending karma—the unseen forces that shape our destinies and guide our souls along the journey of life.</p>
              <p>With over a decade of devoted study and practice, I have honed my craft and cultivated a deep understanding of the karmic energies that influence our experiences and choices. Through the alignment of planets and the analysis of birth charts, I offer profound insights into the karmic patterns that govern our lives, illuminating the pathways to healing, growth, and spiritual evolution.</p>
            </div>
          </div>
          
          <div className="relative order-1 lg:order-2 group max-w-md mx-auto w-full">
            {/* Slowly rotating background rings behind image */}
            <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '60s' }} />
            <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full border border-[#B38B36]/20 border-dashed animate-spin pointer-events-none" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
            
            {/* Arched border overlay */}
            <div className="absolute -inset-2 rounded-t-[12rem] rounded-b-3xl border border-[#B38B36]/30 pointer-events-none z-20 group-hover:-inset-3 transition-all duration-500" />
            
            <div className="relative z-10 p-3 bg-white shadow-2xl rounded-t-[12rem] rounded-b-3xl border border-[#E5E1D8] overflow-hidden">
              <div className="overflow-hidden rounded-t-[12rem] rounded-b-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80"
                  alt="Gitika Sharma Reading"
                  className="w-full h-[450px] md:h-[520px] object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-[#B38B36]/5 mix-blend-overlay" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

