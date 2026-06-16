import { useState } from "react";
import {
  Home,
  Calendar,
  Menu,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  Clock,
  ShoppingBag,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { NAV_LINKS, BRAND } from "@/data/content";

const MobileBottomNav = () => {
  const { count, setIsOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        data-testid="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 pb-[env(safe-area-inset-bottom)] pointer-events-none"
      >
        <div className="mx-3 mb-3 pointer-events-auto rounded-[22px] bg-white/95 backdrop-blur-xl border border-[#E5E1D8] shadow-[0_12px_32px_-8px_rgba(60,42,33,0.15)]">
          <div className="grid grid-cols-5 h-[64px] relative">
            {/* 1. Home */}
            <NavBtn
              testid="mobile-nav-home"
              icon={<Home className="w-[18px] h-[18px]" strokeWidth={1.7} />}
              label="Home"
              onClick={() => scrollTo("home")}
            />

            {/* 2. Services */}
            <NavBtn
              testid="mobile-nav-services"
              icon={<Sparkles className="w-[18px] h-[18px]" strokeWidth={1.7} />}
              label="Services"
              onClick={() => scrollTo("services")}
            />

            {/* 3. CENTER FAB - Book */}
            <button
              data-testid="mobile-nav-book"
              onClick={() => scrollTo("services")}
              className="relative flex flex-col items-center justify-center group"
            >
              <span className="absolute -top-7 flex items-center justify-center">
                <span className="absolute inset-0 w-14 h-14 rounded-full bg-[#B38B36]/30 blur-md group-active:scale-90 transition-transform" />
                <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#D4A646] to-[#9A752B] text-white shadow-[0_8px_18px_-3px_rgba(179,139,54,0.6)] border-[3px] border-white">
                  <Calendar className="w-[22px] h-[22px]" strokeWidth={2} />
                </span>
              </span>
              <span className="mt-7 text-[9px] tracking-[0.18em] uppercase text-[#B38B36] font-semibold">
                Book
              </span>
            </button>

            {/* 4. Courses */}
            <NavBtn
              testid="mobile-nav-courses"
              icon={<GraduationCap className="w-[18px] h-[18px]" strokeWidth={1.7} />}
              label="Courses"
              onClick={() => scrollTo("courses")}
            />

            {/* 5. Menu */}
            <NavBtn
              testid="mobile-nav-menu"
              icon={<Menu className="w-[18px] h-[18px]" strokeWidth={1.7} />}
              label="Menu"
              onClick={() => setMenuOpen(true)}
            />
          </div>
        </div>
      </nav>

      {/* Hamburger Sheet */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent
          side="right"
          data-testid="mobile-menu-sheet"
          className="w-full sm:max-w-sm bg-[#FDFBF7] border-l border-[#E5E1D8] p-0 flex flex-col"
        >
          <SheetHeader className="p-6 border-b border-[#E5E1D8] text-left">
            <SheetTitle className="font-serif text-2xl text-[#3C2A21] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B38B36]" />
              {BRAND.name}
            </SheetTitle>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#B38B36]">
              by {BRAND.author}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                data-testid={`mobile-menu-link-${l.label.toLowerCase()}`}
                onClick={() => scrollTo(l.href.replace("#", ""))}
                className="w-full text-left flex items-center justify-between py-4 border-b border-[#E5E1D8]/60 group"
              >
                <span className="font-serif text-2xl text-[#3C2A21] group-hover:text-[#B38B36] transition-colors">
                  {l.label}
                </span>
                <span className="text-[#B38B36] text-xl group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            ))}

            <div className="pt-8 space-y-3">
              <button
                onClick={() => scrollTo("services")}
                className="w-full bg-[#3C2A21] text-white text-xs tracking-[0.25em] uppercase py-4 rounded-full flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book a Session
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsOpen(true);
                }}
                className="w-full border border-[#3C2A21]/20 text-[#3C2A21] text-xs tracking-[0.25em] uppercase py-4 rounded-full flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                View Cart {count > 0 && `(${count})`}
              </button>
            </div>

            <div className="pt-10 space-y-3 text-sm text-[#725D46]">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#B38B36]" />
                +91 98XXX XXXXX
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#B38B36]" />
                hello@astropower24.in
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#B38B36]" />
                Mon – Sat · 9 AM – 7 PM
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

const NavBtn = ({ testid, icon, label, onClick }) => (
  <button
    data-testid={testid}
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-1 text-[#3C2A21] active:scale-95 transition-transform"
  >
    {icon}
    <span className="text-[9px] tracking-[0.15em] uppercase text-[#725D46]">
      {label}
    </span>
  </button>
);

export default MobileBottomNav;
