import { useState } from "react";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { NAV_LINKS } from "@/data/content";
import { Link } from "react-router-dom";

const Header = () => {
  const { count, setIsOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 lg:px-12 flex items-center justify-between h-20 md:h-24">
        
        {/* Logo */}
        <Link to="/" className="flex items-center h-full group -ml-4 md:-ml-8 lg:-ml-16">
            <img 
              src="/astropower-logo.png" 
              alt="AstroPower 24" 
              className="h-full w-auto object-contain transition-transform duration-300 origin-left transform scale-[1.3] md:scale-[1.7] group-hover:scale-[1.35] md:group-hover:scale-[1.75]" 
            />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 h-full">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative group h-full flex items-center">
              <Link
                to={link.href}
                className="flex items-center gap-1 text-[11px] xl:text-xs tracking-wider uppercase transition-colors font-bold text-[#3C2A21] hover:text-[#e63946]"
              >
                {link.label}
                {link.subLinks && <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#e63946] transition-transform duration-300 group-hover:-rotate-180" />}
              </Link>
              
              {/* Dropdown Menu */}
              {link.subLinks && (
                <div className="absolute top-full left-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left group-hover:translate-y-0 z-50">
                  <div className="bg-white border-t-2 border-[#e63946] shadow-xl py-2 flex flex-col mt-[-2px]">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="px-5 py-3 text-xs tracking-wider text-[#725D46] hover:text-[#e63946] hover:bg-gray-50 transition-colors font-medium border-b border-gray-50 last:border-0"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          {/* Cart Icon */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative text-[#3C2A21] hover:text-[#e63946] transition-colors"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#e63946] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {count}
              </span>
            )}
          </button>

          {/* Connect Now Button */}
          <Link
            to="/contact"
            className="hidden md:flex items-center justify-center px-6 py-2.5 bg-[#e63946] text-white text-[11px] tracking-widest uppercase font-bold hover:bg-[#d62828] transition-colors"
          >
            Connect Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#3C2A21]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto absolute w-full left-0 top-full">
          <nav className="flex flex-col py-4 px-6">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="border-b border-gray-100 last:border-0">
                <Link
                  to={link.href}
                  className="py-4 text-xs tracking-wider uppercase font-bold text-[#3C2A21] flex justify-between items-center w-full"
                  onClick={() => !link.subLinks && setMobileMenuOpen(false)}
                >
                  {link.label}
                  {link.subLinks && <ChevronDown className="w-4 h-4 text-gray-400" />}
                </Link>
                {link.subLinks && (
                  <div className="flex flex-col pl-4 pb-4 space-y-3 border-l-2 border-[#E5D5B5] ml-2 mt-[-8px]">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.href}
                        className="text-xs text-[#725D46]"
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
              className="mt-6 block text-center py-3 bg-[#e63946] text-white text-xs tracking-widest uppercase font-bold"
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
