import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="pt-24 pb-0 relative z-10 bg-white">
      {/* Banner Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-[#B38B36] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80" 
          alt="Astrology Banner" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full flex justify-between items-center">
          <div className="text-white">
            <h1 className="font-serif text-5xl md:text-6xl mb-4 font-bold">About Us</h1>
            <p className="text-white/80 text-lg font-light tracking-widest uppercase text-sm">Life is full of possibilities</p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-[#E5D5B5] flex items-center justify-center p-8 group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515940175183-6798529cb860?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-multiply group-hover:scale-105 transition-transform duration-700"></div>
            <div className="relative z-10 text-center">
               <h2 className="font-black text-6xl text-[#3C2A21] leading-none mb-2">DONT<br/>THINK<br/>TOO<br/>MUCH!</h2>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#B38B36] font-black">About Us</span>
              <span className="h-px w-12 bg-[#B38B36]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3C2A21] leading-tight">
              Welcome To <span className="text-[#B38B36] italic">Soul Karma</span>
            </h2>
            <div className="space-y-4 text-[#725D46] font-light leading-relaxed">
              <p>Welcome to soul karma, your trusted source for Vedic Astrology and Vastu solutions. At soul karma, we blend ancient wisdom with modern techniques to provide comprehensive guidance and remedies for a harmonious and prosperous life.</p>
              <p>With a deep-seated understanding of Vedic principles and years of experience, our team of expert astrologers and Vastu consultants is dedicated to assisting you on your journey towards self-discovery, personal growth, and holistic well-being.</p>
              <p>Our approach is rooted in authenticity, integrity, and compassion. We believe that every individual has a unique cosmic blueprint, and through the precise analysis of planetary positions and energy flows, we offer insightful interpretations and practical remedies tailored to your specific needs.</p>
            </div>
            <Link to="/contact" className="inline-flex items-center gap-3 bg-[#B38B36] text-white px-8 py-4 rounded-full text-xs tracking-widest uppercase font-bold hover:bg-[#B38B36]/90 transition-all mt-4">
              Connect Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Mission Band */}
      <section className="bg-[#B38B36] text-white py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
         <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
           <div className="grid md:grid-cols-2 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/20">
              <div className="space-y-6 md:pr-12 text-center md:text-left">
                <h3 className="font-serif text-3xl font-bold">Our Vision</h3>
                <p className="text-white/80 font-light leading-relaxed text-sm md:text-base">
                  My vision is to create a sacred space where the mysteries of the universe converge with the intricacies of the human experience. Through the lens of astrology, I offer a profound exploration of the soul's journey, unlocking the hidden truths and untapped potentials that reside within each birth chart.
                </p>
              </div>
              <div className="space-y-6 pt-12 md:pt-0 md:pl-12 text-center md:text-left">
                <h3 className="font-serif text-3xl font-bold">Our Mission</h3>
                <p className="text-white/80 font-light leading-relaxed text-sm md:text-base">
                  I envision a world where astrology serves as a compass, guiding souls towards alignment with their true purpose, inner wisdom, and authentic self-expression. My mission is to empower my clients to embrace their cosmic blueprint, navigate life's challenges with grace, and embrace the infinite possibilities that await them in the stars.
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
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#B38B36] font-black">About</span>
              <span className="h-px w-12 bg-[#B38B36]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3C2A21] leading-tight">
              Gitika Sharma
            </h2>
            <div className="space-y-4 text-[#725D46] font-light leading-relaxed">
              <p>I am Gitika Sharma, a seasoned astrologer and IT Professional with 15 years of enriching experience, dedicated to unraveling the intricate threads of pending karma woven within the fabric of existence.</p>
              <p>My journey into the cosmic realms began at a young age, fueled by an insatiable curiosity and a deep-seated reverence for the celestial wonders that adorn our universe. As I delved deeper into the ancient wisdom of astrology, I found myself drawn to the profound mysteries of pending karma—the unseen forces that shape our destinies and guide our souls along the journey of life.</p>
              <p>With over a decade of devoted study and practice, I have honed my craft and cultivated a deep understanding of the karmic energies that influence our experiences and choices. Through the alignment of planets and the analysis of birth charts, I offer profound insights into the karmic patterns that govern our lives, illuminating the pathways to healing, growth, and spiritual evolution.</p>
            </div>
          </div>
          <div className="relative order-1 lg:order-2 group">
            <div className="absolute -inset-4 bg-[#B38B36]/10 blur-2xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
              alt="Gitika Sharma Reading"
              className="relative w-full h-[400px] md:h-[500px] object-cover rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
