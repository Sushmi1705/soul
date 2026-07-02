import React, { useState, useEffect, useRef } from "react";
import { Type } from "lucide-react";

const AccessibilityControl = () => {
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem("font-family-option");
    return saved ? parseInt(saved, 10) : 1; // Option 1 (Default Astro) is default
  });

  const [size, setSize] = useState(() => {
    return localStorage.getItem("font-size-option") || "normal";
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

  // Update HTML class and persist state when size changes
  useEffect(() => {
    localStorage.setItem("font-size-option", size);
    const html = document.documentElement;
    // Clean up old classes
    html.classList.remove("font-size-normal", "font-size-medium", "font-size-large");
    
    // Add current class
    html.classList.add(`font-size-${size}`);
  }, [size]);

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
    { value: 8, name: "Poppins (Modern Sans)", fontFamily: "'Poppins', sans-serif" },
    { value: 9, name: "Montserrat (Clean Geometric)", fontFamily: "'Montserrat', sans-serif" },
    { value: 6, name: "Celestial Classic (Cinzel)", fontFamily: "Cinzel, serif" },
    { value: 2, name: "Georgia (Elegant Serif)", fontFamily: "Georgia, serif" },
    { value: 3, name: "Garamond (Classic Serif)", fontFamily: "Garamond, Baskerville, serif" },
    { value: 4, name: "Arial (Clean Sans-Serif)", fontFamily: "Arial, Helvetica, sans-serif" },
    { value: 7, name: "Arial Nova (Modern Sans)", fontFamily: "'Arial Nova', Arial, sans-serif" },
    { value: 5, name: "Verdana (Highly Legible)", fontFamily: "Verdana, Geneva, sans-serif" },
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed z-[9999] font-sans
                 bottom-24 right-4 md:bottom-auto md:top-[120px] md:left-6 md:right-auto"
    >
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#FAF9F6] dark:bg-[#1E1711] border border-[#D4AF37]/35 flex items-center justify-center shadow-lg hover:border-[#D4AF37]/75 transition-all duration-300 text-[#4A0E1B] dark:text-[#D4AF37] cursor-pointer group"
        aria-label="Accessibility Settings"
        title="Accessibility Settings"
      >
        <Type className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute z-[10000] w-56 max-h-[380px] bg-[#FAF9F6] dark:bg-[#1E1711] border border-[#D4AF37]/35 rounded-xl shadow-2xl p-3 transition-all duration-300
                     right-0 bottom-full mb-2.5 origin-bottom-right
                     md:right-auto md:left-0 md:bottom-auto md:top-full md:mt-2.5 md:origin-top-left"
        >
          {/* Section 1: Font Family */}
          <div className="py-1 px-1 text-[9px] text-[#4A0E1B] dark:text-[#D4AF37] font-bold uppercase tracking-[0.12em] border-b border-[#D4AF37]/20 mb-2 select-none">
            Choose Font Family
          </div>
          <div className="flex flex-col gap-0.5 max-h-[160px] overflow-y-auto mb-3 scrollbar-thin">
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

          {/* Section 2: Font Size */}
          <div className="py-1 px-1 text-[9px] text-[#4A0E1B] dark:text-[#D4AF37] font-bold uppercase tracking-[0.12em] border-b border-[#D4AF37]/20 mb-2 select-none">
            Choose Font Size
          </div>
          <div className="flex gap-1.5 justify-between">
            {[
              { id: "normal", label: "Default" },
              { id: "medium", label: "Medium" },
              { id: "large", label: "Large" },
            ].map((s) => {
              const isActive = size === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={`flex-1 py-2 px-1 rounded-lg text-center cursor-pointer transition-all duration-200 border text-[11px] font-medium ${
                    isActive
                      ? "bg-gradient-to-r from-[#D4AF37]/10 to-[#BF953F]/15 border-[#D4AF37] text-[#B38B36] font-bold"
                      : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-[#3C2A21]/80 dark:text-[#FAF9F6]/80 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  }`}
                >
                  {s.label}
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
