import React, { useState, useEffect, useRef } from "react";
import { Type } from "lucide-react";

const AccessibilityControl = () => {
  const [size, setSize] = useState(() => {
    return localStorage.getItem("font-size-option") || "normal";
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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
          className="absolute z-[10000] w-56 bg-[#FAF9F6] dark:bg-[#1E1711] border border-[#D4AF37]/35 rounded-xl shadow-2xl p-3 transition-all duration-300
                     right-0 bottom-full mb-2.5 origin-bottom-right
                     md:right-auto md:left-0 md:bottom-auto md:top-full md:mt-2.5 md:origin-top-left"
        >
          {/* Section: Font Size */}
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
