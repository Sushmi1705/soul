import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, Sparkles, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Welcome to AstroPower24! You have subscribed to our cosmic insights. ✦");
    setEmail("");
  };

  return (
    <footer
      id="contact"
      data-testid="site-footer"
      className="relative bg-gradient-to-b from-[#FAF8F5] via-[#F9F7F2] to-[#FAF8F5] text-[#3C2A21] pt-24 pb-12 overflow-hidden border-t-4 border-[#B38B36]"
    >
      {/* Subtle background ambient celestial glows */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#B38B36]/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-[#4A0E1B]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Section: Brand Story & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-[#3C2A21]/10">
          
          {/* Logo & About Info (7 cols on large screens) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-start h-20 md:h-24 mb-10 md:mb-14 -ml-2">
              <img 
                src="/astropower-logo.png" 
                alt="AstroPower 24" 
                className="h-full w-auto object-contain origin-left transform scale-[1.65] translate-y-[10px] md:scale-[1.8] md:translate-y-[16px]" 
              />
            </div>
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-xl font-serif text-[#4A0E1B] tracking-wide">AstroPower24 — Decoding Karma, Aligning Destiny</h3>
              <p className="text-[#725D46] text-sm leading-relaxed font-light">
                AstroPower24 is a leading global sanctuary for spiritual and celestial guidance. Grounded in the absolute principles of ancient Vedic Astrology, Vastu Shastra, and cosmic Numerology, we decode birth charts to reveal hidden patterns. Our mission is to empower individuals to overcome karmic blockages, harmonize relationship dynamics, maximize business growth, and live in alignment with their highest cosmic potential.
              </p>
            </div>
          </div>
          
          {/* Newsletter Box (5 cols on large screens) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-white to-[#FDFBF7] p-8 rounded-2xl border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(179,139,54,0.06)] flex flex-col justify-between relative overflow-hidden group">
            <Sparkles className="w-5 h-5 text-[#B38B36]/20 absolute top-4 right-4 animate-pulse" />
            <div>
              <span className="text-[#B38B36] text-[10px] tracking-[0.25em] uppercase font-bold block mb-2">Cosmic Connections</span>
              <h4 className="text-lg font-serif text-[#4A0E1B] mb-3">Subscribe to the Cosmic Bulletin</h4>
              <p className="text-[#725D46] text-xs leading-relaxed font-light mb-6">
                Receive weekly transit reports, astrological updates, and exclusive cosmic guidance from Gitika Sharma, delivered straight to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex border-b border-[#3C2A21]/15 pb-2.5">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-sm w-full focus:outline-none placeholder:text-stone-400 text-[#3C2A21] font-light py-1"
              />
              <button type="submit" className="text-[#B38B36] hover:text-[#4A0E1B] transition-colors flex items-center gap-1.5 font-bold text-xs tracking-widest uppercase ml-2 cursor-pointer group/btn">
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </form>
          </div>
          
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 border-b border-[#3C2A21]/10 text-[#725D46]">
          
          {/* Column 1: Astro Solutions */}
          <div className="space-y-6">
            <h4 className="text-[#4A0E1B] text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold relative pb-3 border-b border-[#B38B36]/20 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#B38B36]">
              Astro Solutions
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Health & Vitality Solutions", href: "/astro-solutions/health-solutions" },
                { label: "Wealth & Business Growth", href: "/astro-solutions/business-growth" },
                { label: "Career & Professional Growth", href: "/astro-solutions/professional-growth" },
                { label: "Education & Academic Success", href: "/astro-solutions/education-career" },
                { label: "Mental Peace & Stress Relief", href: "/astro-solutions/stress-depression" },
                { label: "Marriage & Relationship Harmony", href: "/astro-solutions/marriage-relationship" },
              ].map((item) => (
                <li key={item.label} className="group/item flex items-start gap-2.5 py-0.5">
                  <span className="text-[#B38B36] group-hover/item:rotate-90 transition-transform duration-500 shrink-0 select-none mt-0.5">✦</span>
                  <Link to={item.href} className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#725D46] group-hover/item:text-[#B38B36] inline-block transform group-hover/item:translate-x-1 transition-all duration-300 font-semibold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Astrology Services */}
          <div className="space-y-6">
            <h4 className="text-[#4A0E1B] text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold relative pb-3 border-b border-[#B38B36]/20 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#B38B36]">
              Astrology Services
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Kundali Analysis & Charting", href: "/services/kundali-analysis" },
                { label: "Kundali Making & Generation", href: "/services/kundali-making" },
                { label: "Match Making & Compatibility", href: "/services/match-making" },
                { label: "Vastu Residential & Commercial", href: "/services/vastu-consultation" },
                { label: "Numerology Name Analysis", href: "/services/numerology-analysis" },
                { label: "Brand Name & Logo Astrological", href: "/services/business-name-logo" },
              ].map((item) => (
                <li key={item.label} className="group/item flex items-start gap-2.5 py-0.5">
                  <span className="text-[#B38B36] group-hover/item:rotate-90 transition-transform duration-500 shrink-0 select-none mt-0.5">✦</span>
                  <Link to={item.href} className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#725D46] group-hover/item:text-[#B38B36] inline-block transform group-hover/item:translate-x-1 transition-all duration-300 font-semibold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Free Calculators */}
          <div className="space-y-6">
            <h4 className="text-[#4A0E1B] text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold relative pb-3 border-b border-[#B38B36]/20 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#B38B36]">
              Free Calculators
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Moon Sign Calculator", href: "/calculator/moon-sign" },
                { label: "Lagna Rising Sign Calculator", href: "/calculator/lagna" },
                { label: "Numerology Life Path Number", href: "/calculator/numerology" },
                { label: "Kundli Matching & Guna Milan", href: "/calculator/kundli-matching" },
                { label: "Nakshatra (Birth Star) Finder", href: "/calculator/nakshatra" },
                { label: "Rahu Ketu Placements Finder", href: "/calculator/rahu-ketu" },
                { label: "Shubh Muhurats 2026", href: "/shubh-muhurat-2026" },
              ].map((item) => (
                <li key={item.label} className="group/item flex items-start gap-2.5 py-0.5">
                  <span className="text-[#B38B36] group-hover/item:rotate-90 transition-transform duration-500 shrink-0 select-none mt-0.5">✦</span>
                  <Link to={item.href} className="text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[#725D46] group-hover/item:text-[#B38B36] inline-block transform group-hover/item:translate-x-1 transition-all duration-300 font-semibold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office Info */}
          <div className="space-y-6">
            <h4 className="text-[#4A0E1B] text-[11px] sm:text-xs tracking-[0.25em] uppercase font-bold relative pb-3 border-b border-[#B38B36]/20 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#B38B36]">
              Cosmic Contact & Hours
            </h4>
            <div className="space-y-4 text-xs font-light">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#B38B36]/10 border border-[#B38B36]/20 flex items-center justify-center text-[#B38B36] shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-[#725D46] text-xs leading-relaxed font-light mt-0.5">
                  AstroPower24 HQ, 12th Floor, Solitaire Corporate Park, Andheri Kurla Road, Mumbai, India.
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#B38B36]/10 border border-[#B38B36]/20 flex items-center justify-center text-[#B38B36] shrink-0 shadow-sm">
                  <Phone className="w-4 h-4" />
                </div>
                <a href="tel:+918005552787" className="text-[#725D46] hover:text-[#B38B36] font-semibold text-xs tracking-wider transition-colors">
                  +91 800 555 ASTRO (2787)
                </a>
              </div>
              <div className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-[#B38B36]/10 border border-[#B38B36]/20 flex items-center justify-center text-[#B38B36] shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:guidance@astropower24.com" className="text-[#725D46] hover:text-[#B38B36] underline italic text-xs transition-colors">
                  guidance@astropower24.com
                </a>
              </div>
              <div className="flex items-start gap-3.5 pt-3 border-t border-[#3C2A21]/5">
                <div className="w-8 h-8 rounded-lg bg-[#B38B36]/10 border border-[#B38B36]/20 flex items-center justify-center text-[#B38B36] shrink-0 shadow-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-[#725D46] tracking-wider uppercase leading-snug">
                  <p className="font-semibold text-[#4A0E1B]">Office Hours</p>
                  <p className="mt-0.5 font-light">Mon – Sat: 10:00 AM – 7:00 PM (IST)</p>
                  <p className="text-[#B38B36] font-semibold">Sun: Closed for Reflection</p>
                </div>
              </div>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#3C2A21]/5">
              <a href="https://www.instagram.com/soulkarmabygitikasharma?igsh=amRibjNrMWU2ZWlq" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-[#D4AF37]/25 shadow-sm text-[#3C2A21] hover:bg-[#B38B36] hover:text-white hover:border-[#B38B36] flex items-center justify-center hover:scale-110 transition-all duration-300" title="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://youtube.com/@soulkarmabygitikasharma?si=C64wWc7B6Imj0Ql-" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white border border-[#D4AF37]/25 shadow-sm text-[#3C2A21] hover:bg-[#B38B36] hover:text-white hover:border-[#B38B36] flex items-center justify-center hover:scale-110 transition-all duration-300" title="Youtube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Disclaimer & Trust Statement */}
        <div className="py-6 border-b border-[#3C2A21]/10 text-stone-500 text-[10px] leading-relaxed text-justify font-light select-none">
          <p>
            <span className="font-bold text-[#B38B36] uppercase tracking-wider block mb-1 font-sans">Vedic Guidance & Spiritual Disclaimer:</span>
            Astrology, Vastu Shastra, and Numerology are spiritual pathways designed for self-discovery, guidance, and intuitive cosmic reflection. The insights, calculations, and predictions offered on AstroPower24 (astropower24.com) are based on traditional Vedic texts and astrological systems. AstroPower24 does not guarantee specific results or life events. Astrological readings should not be taken as absolute, and should never replace professional medical, legal, psychological, or financial counsel. Seekers are encouraged to exercise personal judgment and discretion in applying these insights to their lives.
          </p>
        </div>

        {/* Footer Sub-Bar: Navigation & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] text-stone-500 uppercase relative z-10 font-bold">
          <p className="text-center md:text-left select-none text-stone-500/80">
            Copyright © {new Date().getFullYear()} AstroPower24. All rights reserved. Designed for Cosmic Alignment.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            <Link to="/about-us" className="hover:text-[#B38B36] transition-colors text-stone-500">About Us</Link>
            <span className="text-[#B38B36] select-none opacity-40">•</span>
            <Link to="/blog" className="hover:text-[#B38B36] transition-colors text-stone-500">Blog</Link>
            <span className="text-[#B38B36] select-none opacity-40">•</span>
            <Link to="/contact" className="hover:text-[#B38B36] transition-colors text-stone-500">Contact</Link>
            <span className="text-[#B38B36] select-none opacity-40">•</span>
            <a href="#" className="hover:text-[#B38B36] transition-colors text-stone-500">Privacy Policy</a>
            <span className="text-[#B38B36] select-none opacity-40">•</span>
            <a href="#" className="hover:text-[#B38B36] transition-colors text-stone-500">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
