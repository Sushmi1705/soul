import { useState } from "react";
import { Instagram, Facebook, Youtube, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }
    toast.success("Welcome to the Soul Karma journal ✦");
    setEmail("");
  };

  return (
    <footer
      id="contact"
      data-testid="site-footer"
      className="relative bg-[#F9F7F2] text-[#3C2A21] pt-24 pb-12 overflow-hidden border-t border-brand-dark/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 relative z-10">
        <div className="space-y-6">
          <div className="flex items-start h-32 mb-2 -mt-8 -ml-8 lg:-ml-12">
            <img 
              src="/astropower-logo.png" 
              alt="AstroPower 24" 
              className="h-full w-auto object-contain object-left-top origin-top-left transform scale-[1.3]" 
            />
          </div>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs font-light">
            Your trusted source for professional astrological services and individual reports. 
            Guidance for your soul's journey through the stars.
          </p>
          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.2em] text-stone-500">8901 Marmora Road, Glasgow, D04 89GR.</p>
            <p className="text-[11px] tracking-[0.2em] text-[#B38B36] font-bold">+1 800 123 1234</p>
            <p className="text-[11px] tracking-[0.2em] text-stone-500 underline italic">mail@demosite.com</p>
            <div className="flex items-center gap-4 pt-4">
              <a href="https://www.instagram.com/soulkarmabygitikasharma?igsh=amRibjNrMWU2ZWlq" target="_blank" rel="noopener noreferrer" className="text-[#B38B36] hover:text-[#3C2A21] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@soulkarmabygitikasharma?si=C64wWc7B6Imj0Ql-" target="_blank" rel="noopener noreferrer" className="text-[#B38B36] hover:text-[#3C2A21] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-xl text-[#3C2A21] mb-10 uppercase tracking-tight">Services</h4>
          <ul className="space-y-4">
            {["Vedic Astrology", "Horoscope Matching", "Vastu Shastra", "Gemstone Therapy", "Numerology"].map((item) => (
              <li key={item}>
                <a href="#" className="text-[11px] tracking-[0.2em] uppercase text-stone-500 hover:text-[#B38B36] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#3C2A21] text-xs tracking-[0.3em] uppercase mb-10 font-bold">Popular Links</h4>
          <ul className="space-y-4">
            {["About Us", "Our Gallery", "Horoscopes", "Contact Us", "Privacy Policy"].map((item) => (
              <li key={item}>
                <a href="#" className="text-[11px] tracking-[0.2em] uppercase text-stone-500 hover:text-[#B38B36] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#3C2A21] text-xs tracking-[0.3em] uppercase mb-10 font-bold">Publications</h4>
          <div className="space-y-6">
            <p className="text-stone-500 text-sm leading-relaxed italic opacity-80">
              "The stars do not compel, they incline." Join our weekly newsletter to get 
              astrological updates directly to your inbox.
            </p>
            <form className="flex border-b border-brand-dark/10 pb-2">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-transparent text-sm w-full focus:outline-none placeholder:text-stone-400"
              />
              <button type="submit" className="text-[#B38B36] hover:text-[#3C2A21] transition-colors">
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8 border-t border-brand-dark/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] tracking-[0.2em] text-stone-500 uppercase relative z-10">
        <p>Copyright © {new Date().getFullYear()}. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#3C2A21] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#3C2A21] transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
