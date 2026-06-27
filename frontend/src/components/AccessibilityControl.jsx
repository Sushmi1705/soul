import React, { useState, useEffect, useRef } from "react";
import { Type, ChevronDown } from "lucide-react";

const AccessibilityControl = () => {
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem("font-family-option");
    return saved ? parseInt(saved, 10) : 1; // Option 1 (Default Astro) is default
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Update HTML class and persist state when family changes
  useEffect(() => {
    localStorage.setItem("font-family-option", family);
    const html = document.documentElement;
    // Clean up old classes
    html.classList.remove("font-family-1", "font-family-2", "font-family-3", "font-family-4", "font-family-5", "font-family-6", "font-family-7", "font-family-8", "font-family-9", "font-family-10");
    
    // Add current class
    html.classList.add(`font-family-${family}`);
  }, [family]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = [
    { value: 1, name: "Astro Theme (Default)", fontFamily: "Outfit, sans-serif" },
    { value: 6, name: "Celestial Classic (Cinzel)", fontFamily: "Cinzel, serif" },
    { value: 2, name: "Georgia (Elegant Serif)", fontFamily: "Georgia, serif" },
    { value: 3, name: "Garamond (Classic Serif)", fontFamily: "Garamond, Baskerville, serif" },
    { value: 4, name: "Arial (Clean Sans-Serif)", fontFamily: "Arial, Helvetica, sans-serif" },
    { value: 5, name: "Verdana (Highly Legible)", fontFamily: "Verdana, Geneva, sans-serif" },
  ];

  const activeOption = options.find((opt) => opt.value === family) || options[0];

  return (
    <div 
      ref={containerRef}
      className="fixed z-[9999] font-[Outfit,sans-serif]
                 bottom-24 right-4 md:bottom-auto md:top-[120px] md:left-6 md:right-auto"
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#FAF9F6]/95 dark:bg-[#1E1711]/95 backdrop-blur-md border border-[#D4AF37]/35 flex items-center justify-center shadow-lg hover:border-[#D4AF37]/75 transition-all duration-300 text-[#4A0E1B] dark:text-[#D4AF37] cursor-pointer group"
        aria-label="Accessibility Settings"
        title="Accessibility Settings"
      >
        <Type className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-[10000] w-56 max-h-[300px] bg-[#FAF9F6]/98 dark:bg-[#1E1711]/98 backdrop-blur-lg border border-[#D4AF37]/35 rounded-xl shadow-2xl p-3 transition-all duration-300
                     right-0 bottom-full mb-2.5 origin-bottom-right
                     md:right-auto md:left-0 md:bottom-auto md:top-full md:mt-2.5 md:origin-top-left"
        >
          {/* Section 1: Font Family */}
          <div className="py-1 px-1 text-[9px] text-[#4A0E1B]/50 dark:text-[#D4AF37]/50 font-bold uppercase tracking-[0.12em] border-b border-[#D4AF37]/10 mb-2 select-none">
            Choose Font Family
          </div>
          <div className="flex flex-col gap-0.5 max-h-[220px] overflow-y-auto mb-1 scrollbar-thin">
            {options.map((item) => {
              const isActive = family === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => setFamily(item.value)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isActive
                      ? "bg-gradient-to-r from-[#D4AF37]/10 to-[#BF953F]/15 text-[#B38B36] font-bold border-l-2 border-[#D4AF37]"
                      : "text-[#3C2A21]/80 dark:text-[#FAF9F6]/80 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] dark:hover:text-[#D4AF37]"
                  }`}
                >
                  <span style={{ fontFamily: item.fontFamily }}>{item.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControl;
