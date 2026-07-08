import { useState, useEffect, useRef } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const timelineData = [
  {
    year: "2026",
    title: "Global Vastu Summit & Tech Conclave",
    shortDesc: "Leading digital astrology innovations and hosting the national Astro-Vastu conclave.",
    achievements: [
      {
        title: "Launched Astro Power 24 Mobile App",
        description: "Introduced a state-of-the-art app delivering real-time Panchang, personalized Kundali analyses, and automated Vastu suggestions to users worldwide.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80",
        location: "Mumbai, India",
        date: "January 2026",
        category: "Technology",
        award: "Best Astro-Tech Innovation of the Year"
      },
      {
        title: "Keynote at Global Vastu Summit",
        description: "Delivered a masterclass on 'Blending Ancient Architectural Principles with Modern High-Rise Designs' to over 500 architects and interior designers.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        location: "Delhi, India",
        date: "March 2026",
        category: "Public Speaking",
        award: "Guest of Honor Certificate"
      }
    ]
  },
  {
    year: "2025",
    title: "Vedic Excellence Award & Global Reach",
    shortDesc: "Honored with the national Vedic Excellence Award and crossing 250k consultations.",
    achievements: [
      {
        title: "Vedic Excellence Award 2025",
        description: "Recognized for exceptional contributions to Vastu Shastra and Vedic Astrology at the International Astrological Association Meet.",
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80",
        location: "Bangalore, India",
        date: "September 2025",
        category: "Honor & Award",
        award: "Vedic Excellence Trophy"
      },
      {
        title: "Featured in National Media",
        description: "Appeared in lead print editions and digital media programs explaining Vastu corrections without demolition.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
        location: "Online / National Press",
        date: "November 2025",
        category: "Media Coverage",
        award: "Featured Columnist"
      }
    ]
  },
  {
    year: "2024",
    title: "150k Community & Academic Milestones",
    shortDesc: "Expanding the digital community to 150k followers and publishing vastu booklets.",
    achievements: [
      {
        title: "Published 'Vastu for Modern Spaces'",
        description: "Authored an easy-to-read guide helping families design layouts in alignment with cardinal directions for prosperity.",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80",
        location: "Online Bookstores",
        date: "June 2024",
        category: "Publication",
        award: "Self-Published Bestseller"
      },
      {
        title: "Community Expansion",
        description: "Reached over 150k followers across social media channels, engaging daily with cosmic wisdom and vastu tips.",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80",
        location: "Global",
        date: "December 2024",
        category: "Social Reach",
        award: "Milestone Badge"
      }
    ]
  },
  {
    year: "2023",
    title: "Corporate Consultancy Initiative",
    shortDesc: "Guiding major corporate groups through energy alignments in commercial spaces.",
    achievements: [
      {
        title: "Corporate Vastu Advisory",
        description: "Assisted major IT offices and retail brands in optimizing workstation alignments to boost employee efficiency and stress relief.",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80",
        location: "Gurugram, India",
        date: "August 2023",
        category: "Consultancy",
        award: "Corporate Harmony Partner Certificate"
      }
    ]
  },
  {
    year: "2022",
    title: "Vedic Astrology Deep-Dive Programs",
    shortDesc: "Launching online certification courses to train the next generation of astrologers.",
    achievements: [
      {
        title: "Certified Astro-Vastu Course Launch",
        description: "Successfully trained over 200 students worldwide in Vedic Astrology fundamentals and spatial energy correction techniques.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80",
        location: "Virtual Classroom",
        date: "March 2022",
        category: "Education",
        award: "Educator of the Year Nominee"
      }
    ]
  }
];

const AboutUs = () => {
  const [expandedYear, setExpandedYear] = useState("2026");
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const totalHeight = rect.height;
      const scrolled = windowHeight / 2 - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
      setScrollProgress(progress * 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#timeline") {
      setTimeout(() => {
        const element = document.getElementById("timeline");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  }, []);

  const handleMouseEnter = (year) => {
    if (window.innerWidth >= 768) {
      setExpandedYear(year);
    }
  };

  const handleCardClick = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };
  return (
    <div className="pt-24 pb-0 relative z-10 bg-[#FDFBF7]">
      {/* Banner Section */}
      <div className="relative w-full h-[180px] md:h-[220px] bg-[#3C2A21] flex items-center overflow-hidden border-b border-[#B38B36]/20">
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
            <div className="space-y-4 text-[#3C2A21] font-medium leading-relaxed text-sm">
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
            <div className="space-y-4 text-[#3C2A21] font-medium leading-relaxed text-sm">
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
                  src="/about-img-1.jpg"
                  alt="Gitika Sharma – Founder and Astrologer"
                  loading="lazy"
                  className="w-full h-[450px] md:h-[520px] object-cover group-hover:scale-105 transition-transform duration-1000"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey & Achievements Timeline Section */}
      <section id="timeline" ref={timelineRef} className="py-24 bg-[#FDFBF7] relative overflow-hidden border-t border-[#B38B36]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <span className="h-px w-8 bg-[#B38B36]" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#B38B36] font-black">Our Milestone Story</span>
              <span className="h-px w-8 bg-[#B38B36]" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl text-[#3C2A21] leading-tight">
              Journey & <span className="text-[#B38B36] italic font-light">Achievements</span>
            </h2>
            <p className="text-sm text-[#3C2A21]/70 leading-relaxed font-medium">
              Explore the cosmic milestones, certifications, and honored achievements of Gitika Sharma through the years.
            </p>
          </div>

          <div className="relative mt-12">
            {/* Background line (muted) */}
            <div className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#B38B36]/15 pointer-events-none" />

            {/* Glowing scrolled line */}
            <div 
              className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-[#B38B36] to-[#9A752B] shadow-[0_0_10px_#B38B36] transition-all duration-300 ease-out pointer-events-none" 
              style={{ height: `${scrollProgress}%` }}
            />

            {/* Timeline Items */}
            <div className="space-y-16">
              {timelineData.map((item, index) => {
                const isEven = index % 2 === 0;
                const isExpanded = expandedYear === item.year;
                
                return (
                  <div 
                    key={item.year}
                    className="relative flex flex-col md:flex-row items-stretch justify-between w-full group transition-all duration-500"
                  >
                    {/* Glowing Milestone Circle on the line */}
                    <div className={`absolute left-5 md:left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full border-2 bg-[#3C2A21] flex items-center justify-center z-20 transition-all duration-500 ${
                      isExpanded 
                        ? 'border-[#B38B36] scale-125 shadow-[0_0_12px_#B38B36]' 
                        : 'border-[#B38B36]/50 group-hover:border-[#B38B36] group-hover:scale-110 shadow-[0_0_6px_rgba(179,139,54,0.3)]'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                        isExpanded ? 'bg-[#B38B36] scale-110 animate-pulse' : 'bg-[#B38B36]/40'
                      }`} />
                    </div>

                    {/* Left Spacer / Card Column (Desktop) */}
                    <div className={`hidden md:block w-[calc(50%-32px)] ${isEven ? 'order-1' : 'order-3 invisible pointer-events-none'}`} />

                    {/* Card container */}
                    <div className={`w-full md:w-[calc(50%-32px)] ml-12 md:ml-0 ${isEven ? 'order-3' : 'order-1'} transition-all duration-500`}>
                      <div 
                        onMouseEnter={() => handleMouseEnter(item.year)}
                        onClick={() => handleCardClick(item.year)}
                        className={`transition-all duration-500 rounded-[2rem] p-6 md:p-8 border bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl relative overflow-hidden ${
                          isExpanded 
                            ? 'border-[#B38B36] shadow-[0_10px_35px_rgba(179,139,54,0.12)] bg-gradient-to-br from-white via-white to-[#FDFBF7]' 
                            : 'border-[#E5E1D8] hover:border-[#B38B36]/50 hover:bg-white'
                        }`}
                        aria-expanded={isExpanded}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleCardClick(item.year);
                          }
                        }}
                      >
                        {/* Decorative background glows when active */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-[#B38B36]/5 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />
                        <div className={`absolute bottom-0 left-0 w-32 h-32 bg-[#B38B36]/5 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />

                        {/* Card Header */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className={`font-serif text-3xl md:text-4xl font-extrabold tracking-tight transition-colors duration-500 ${
                              isExpanded ? 'text-[#B38B36]' : 'text-[#3C2A21]'
                            }`}>
                              {item.year}
                            </span>
                            <div className="h-5 w-[1px] bg-[#B38B36]/30" />
                            <h4 className="font-serif text-base md:text-lg font-bold text-[#3C2A21] tracking-wide">
                              {item.title}
                            </h4>
                          </div>
                          
                          <div className={`p-2 rounded-full transition-all duration-500 ${
                            isExpanded ? 'bg-[#B38B36] text-[#FDFBF7]' : 'bg-[#E5E1D8]/40 text-[#3C2A21]/70'
                          }`}>
                            <Sparkles className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Short preview text */}
                        <p className="mt-3 text-xs md:text-sm text-[#3C2A21]/75 leading-relaxed font-medium">
                          {item.shortDesc}
                        </p>

                        {/* Expandable Accordion Body */}
                        <div className={`grid transition-all duration-500 ease-in-out ${
                          isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-[#B38B36]/10' : 'grid-rows-[0fr] opacity-0'
                        }`}>
                          <div className="overflow-hidden">
                            <div className="space-y-6">
                              {item.achievements.map((ach, idx) => (
                                <div key={idx} className="space-y-4">
                                  <div className="flex flex-wrap items-start justify-between gap-2 border-l-2 border-[#B38B36]/30 pl-4 py-0.5">
                                    <div>
                                      <span className="text-[10px] tracking-wider uppercase text-[#B38B36] font-bold block mb-0.5">
                                        {ach.category}
                                      </span>
                                      <h5 className="font-serif text-sm md:text-base font-bold text-[#3C2A21]">
                                        {ach.title}
                                      </h5>
                                    </div>
                                    <div className="text-right text-[10px] text-[#3C2A21]/50 font-bold uppercase tracking-wider">
                                      <div>{ach.date}</div>
                                      <div>{ach.location}</div>
                                    </div>
                                  </div>

                                  <p className="text-xs text-[#3C2A21]/80 leading-relaxed">
                                    {ach.description}
                                  </p>

                                  {ach.award && (
                                    <div className="inline-flex items-center gap-2 bg-[#B38B36]/5 px-3 py-1 rounded-full border border-[#B38B36]/20">
                                      <Sparkles className="w-3 h-3 text-[#B38B36]" />
                                      <span className="text-[10px] font-bold text-[#B38B36] uppercase tracking-wider">
                                        Award: {ach.award}
                                      </span>
                                    </div>
                                  )}

                                  {ach.image && (
                                    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-[#E5E1D8] shadow-sm">
                                      <img 
                                        src={ach.image} 
                                        alt={ach.title} 
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-[#3C2A21]/40 to-transparent pointer-events-none" />
                                    </div>
                                  )}
                                </div>
                              ))}

                              {/* Instagram / Social Spotlights Section */}
                              <div className="p-4 rounded-2xl bg-[#3C2A21]/5 border border-[#E5E1D8]/60 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-[#3C2A21]/70 font-bold uppercase tracking-wider">
                                  <svg className="w-3.5 h-3.5 text-[#B38B36]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                  Instagram Spotlight
                                </div>
                                <p className="text-[11px] text-[#3C2A21]/60 font-medium">
                                  Instagram post highlights and social media features will sync dynamically.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subtle decorative orbits in the section background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full border border-[#B38B36]/5 border-dashed pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#B38B36]/5 border-dotted pointer-events-none" />
      </section>
    </div>
  );
};

export default AboutUs;

