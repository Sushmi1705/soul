import React, { useState, useEffect } from "react";
import { Type } from "lucide-react";

const AccessibilityControl = () => {
  const [family, setFamily] = useState(() => {
    const saved = localStorage.getItem("font-family-option");
    return saved ? parseInt(saved, 10) : 1; // Option 1 (Default Astro) is default
  });

  // Update HTML class and persist state when family changes
  useEffect(() => {
    localStorage.setItem("font-family-option", family);
    const html = document.documentElement;
    // Clean up old classes
    html.classList.remove("font-size-1", "font-size-2", "font-size-3", "font-size-4", "font-size-5");
    html.classList.remove("font-family-1", "font-family-2", "font-family-3", "font-family-4", "font-family-5");
    
    // Add current class
    html.classList.add(`font-family-${family}`);
  }, [family]);

  const options = [
    { value: 1, label: "T", name: "Default (Astro)", fontFamily: "Outfit, sans-serif" },
    { value: 2, label: "A", name: "Arial", fontFamily: "Arial, Helvetica, sans-serif" },
    { value: 3, label: "G", name: "Georgia", fontFamily: "Georgia, serif" },
    { value: 4, label: "V", name: "Verdana", fontFamily: "Verdana, Geneva, sans-serif" },
    { value: 5, label: "C", name: "Courier", fontFamily: "'Courier New', Courier, monospace" },
  ];

  return (
    <div 
      className="fixed z-[9999] flex items-center bg-[#FAF9F6]/95 dark:bg-[#1E1711]/95 backdrop-blur-md border border-[#D4AF37]/35 shadow-2xl hover:border-[#D4AF37]/65 transition-all duration-300 font-[Outfit,sans-serif]
                 bottom-24 right-4 flex-row py-1 px-1.5 rounded-full
                 md:bottom-auto md:top-[120px] md:right-6 md:flex-col md:py-3.5 md:px-2"
    >
      {/* Icon header (Desktop only) */}
      <div className="hidden md:flex flex-col items-center text-[#4A0E1B] dark:text-[#D4AF37] select-none pb-0.5">
        <Type className="w-4 h-4" />
      </div>

      <div className="hidden md:block w-4 h-[1px] bg-[#D4AF37]/20 mb-0.5" />

      {/* Buttons */}
      <div className="flex flex-row md:flex-col items-center gap-1 md:gap-1.5">
        {options.map((item) => {
          const isActive = family === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setFamily(item.value)}
              title={`${item.name} Font Family`}
              className={`rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 relative group
                         w-7 h-7
                         md:w-8 md:h-8 ${
                isActive
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#BF953F] text-white shadow-md scale-105"
                  : "text-[#3C2A21]/75 dark:text-[#FAF9F6]/75 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] dark:hover:text-[#D4AF37]"
              }`}
            >
              <span className="font-bold" style={{ fontFamily: item.fontFamily }}>{item.label}</span>
              
              {/* Tooltip (above on mobile, to the left on desktop) */}
              <span className="absolute px-2.5 py-1 bg-[#3C2A21] dark:bg-[#FAF9F6] text-[#FAF9F6] dark:text-[#3C2A21] text-[9px] uppercase tracking-[0.15em] font-bold rounded shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-[10000] border border-[#D4AF37]/20
                               bottom-full mb-2.5 left-1/2 -translate-x-1/2 translate-y-1 group-hover:translate-y-0
                               md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-full md:left-auto md:mr-3 md:mb-0 md:translate-x-2 md:group-hover:translate-x-0 font-[Outfit,sans-serif]"
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccessibilityControl;
