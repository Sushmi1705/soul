import { useState } from "react";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { NAV_LINKS } from "@/data/content";
import { Link } from "react-router-dom";

const Header = () => {
  const { count, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-500 border-b-2 border-[#D4AF37]">
      {/* Decorative Gold Top Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#4A0E1B] via-[#D4AF37] to-[#4A0E1B]"></div>
      
      <div className="max-w-[1600px] mx-auto px-5 lg:px-10 flex items-center justify-between h-20 md:h-24 relative">
        
        {/* Left: Logo */}
        <div className="flex-1 flex justify-start">
          <Link to="/" className="flex items-center h-12 md:h-16 group -ml-2">
              <img 
                src="/astropower-logo.png" 
                alt="AstroPower 24" 
                className="h-full w-auto object-contain transition-transform duration-500 origin-left transform scale-[1.3] md:scale-[1.5] group-hover:scale-[1.35] md:group-hover:scale-[1.55]" 
              />
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <div className="flex-none hidden lg:flex justify-center h-full">
          <nav className="flex items-center gap-8 xl:gap-12 h-full">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative group h-full flex items-center">
                <Link
                  to={link.href}
                  className="relative flex items-center gap-1.5 text-[11px] xl:text-xs tracking-[0.2em] uppercase transition-all duration-500 font-bold text-[#3C2A21] hover:text-[#D4AF37] after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-[#D4AF37] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-500 after:origin-center"
                >
                  {link.label}
                  {link.subLinks && <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]/80 group-hover:text-[#D4AF37] transition-transform duration-500 group-hover:-rotate-180" />}
                </Link>
                {/* Full-Width Luxury Mega Menu */}
                {link.subLinks && (
                  <div className="fixed top-[80px] md:top-[96px] left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-40 bg-[#FAF9F6]/95 backdrop-blur-3xl shadow-[0_40px_100px_rgba(74,14,27,0.15)] border-b border-[#D4AF37]/20 transform -translate-y-2 group-hover:translate-y-0">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent"></div>
                    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 xl:py-14 flex gap-12 xl:gap-20 relative">
                      
                      {/* Decorative Background for Left Panel */}
                      <div className="absolute top-0 left-0 w-1/3 h-full opacity-[0.03] pointer-events-none mix-blend-multiply overflow-hidden">
                         <img src="https://gitikasharma.in/wp-content/uploads/2024/02/Kundali-Making.png" alt="decorative" className="w-full h-full object-cover scale-150 transform -translate-y-10" />
                      </div>

                      {/* Left: Featured Highlight */}
                      <div className="w-1/3 border-r border-[#D4AF37]/20 pr-12 xl:pr-20 flex flex-col justify-center relative">
                        <div className="absolute -left-6 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-[#D4AF37]/10 to-transparent"></div>
                        <span className="text-[#D4AF37] text-[10px] tracking-[0.3em] uppercase font-bold mb-4">Discover</span>
                        <h3 className="text-3xl xl:text-4xl font-serif text-[#4A0E1B] mb-5 tracking-wide">{link.label}</h3>
                        <p className="text-sm text-[#3C2A21]/70 leading-loose tracking-[0.05em]">
                          Elevate your journey with our exclusive offerings tailored for profound spiritual alignment, personal growth, and lasting success.
                        </p>
                        <div className="mt-8 w-16 h-[2px] bg-gradient-to-r from-[#D4AF37] to-transparent"></div>
                      </div>

                      {/* Right: Links Grid */}
                      <div className="w-2/3 grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 relative z-10">
                        {link.subLinks.map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.href}
                            className="group/sub flex items-center gap-4 py-4 px-4 transition-all duration-300 rounded-lg hover:bg-gradient-to-r hover:from-transparent hover:via-[#D4AF37]/10 hover:to-transparent"
                          >
                            <span className="w-1.5 h-1.5 rounded-full border border-[#D4AF37] group-hover/sub:bg-[#D4AF37] transition-colors duration-300 shrink-0"></span>
                            <span className="text-[10px] xl:text-[11px] tracking-[0.2em] uppercase font-bold text-[#3C2A21] group-hover/sub:text-[#D4AF37] transition-colors">
                              {sub.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                      
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {/* Cart Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative text-[#3C2A21] hover:text-[#D4AF37] transition-all duration-300 p-2 rounded-full hover:bg-[#D4AF37]/5"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute 0 -top-0 -right-0 bg-gradient-to-r from-[#BF953F] to-[#B38728] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-[#FAF9F6]">
                {count}
              </span>
            )}
          </button>

          {/* Connect Now Button */}
          <Link
            to="/contact"
            className="hidden md:flex items-center justify-center px-8 py-2.5 bg-gradient-to-r from-[#1A050A] to-[#4A0E1B] text-[#D4AF37] border border-[#D4AF37]/50 text-[10px] xl:text-[11px] tracking-[0.25em] uppercase font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:border-[#D4AF37] transition-all duration-500 relative overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
              <span className="w-6 h-[1px] bg-[#D4AF37]/50 group-hover/btn:w-3 transition-all duration-500"></span>
              Connect Now
              <span className="w-6 h-[1px] bg-[#D4AF37]/50 group-hover/btn:w-3 transition-all duration-500"></span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A0E1B] to-[#1A050A] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#3C2A21] p-2 hover:bg-[#D4AF37]/5 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F6] border-t border-[#D4AF37]/20 shadow-2xl max-h-[85vh] overflow-y-auto absolute w-full left-0 top-full">
          <nav className="flex flex-col py-6 px-8">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="border-b border-[#D4AF37]/10 last:border-0 py-2">
                <Link
                  to={link.href}
                  className="py-3 text-xs tracking-[0.2em] uppercase font-semibold text-[#3C2A21] flex justify-between items-center w-full"
                  onClick={() => !link.subLinks && setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.subLinks && <ChevronDown className="w-4 h-4 text-[#D4AF37]" />}
                </Link>
                {link.subLinks && (
                  <div className="flex flex-col pl-5 pb-4 space-y-4 border-l border-[#D4AF37]/30 ml-2 mt-1">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="text-[11px] tracking-widest uppercase text-[#3C2A21]/70 hover:text-[#D4AF37] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              to="/contact"
              className="mt-8 block text-center py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#3C2A21] shadow-xl text-xs tracking-[0.2em] uppercase font-bold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connect Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
