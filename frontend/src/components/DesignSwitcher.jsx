import React, { useState } from "react";
import { useDesign } from "@/context/DesignContext";
import { Lock, Unlock } from "lucide-react";

const DesignSwitcher = () => {
  const { bgDesign, setBgDesign } = useDesign();
  const [isLocked, setIsLocked] = useState(() => {
    return localStorage.getItem("selected_bg_design_fixed") === "true";
  });

  const designs = [
    { id: "design1", label: "Current Design", shortcut: "1" },
    { id: "design2", label: "Design 2 (Vedic)", shortcut: "2" },
    { id: "design3", label: "Design 3 (Cosmic)", shortcut: "3" },
    { id: "design4", label: "Design 4 (Stellar)", shortcut: "4" },
  ];

  const handleSelect = (id) => {
    if (isLocked) return;
    setBgDesign(id);
  };

  const toggleLock = () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    localStorage.setItem("selected_bg_design_fixed", nextLocked ? "true" : "false");
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] bg-[#FDFBF7]/90 dark:bg-stone-900/90 backdrop-blur-md border border-[#B38B36]/30 py-4 px-2 rounded-full shadow-2xl flex flex-col items-center gap-3 animate-fade-in font-[Outfit,sans-serif] hover:border-[#B38B36]/60 transition-all duration-300">
      <span className="text-[8px] text-[#B38B36] font-bold tracking-wider uppercase select-none opacity-80">
        BG
      </span>
      
      <div className="w-4 h-[1px] bg-[#B38B36]/20" />

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {designs.map((d) => {
          const isActive = bgDesign === d.id;
          return (
            <div key={d.id} className="relative group flex items-center justify-center">
              {/* Tooltip to the left */}
              <div className="absolute right-full mr-3 px-2 py-1 rounded bg-[#3C2A21] text-white text-[9px] tracking-wider uppercase font-semibold pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md whitespace-nowrap translate-x-2 group-hover:translate-x-0">
                {d.label}
              </div>

              <button
                disabled={isLocked && !isActive}
                onClick={() => handleSelect(d.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#3C2A21] text-white dark:bg-[#B38B36] dark:text-stone-950 shadow-md scale-110 border border-[#B38B36]/50"
                    : isLocked
                    ? "opacity-30 cursor-not-allowed text-stone-400"
                    : "text-[#3C2A21]/70 dark:text-[#FDFBF7]/70 hover:bg-[#B38B36]/20 hover:text-[#3C2A21] dark:hover:text-[#FDFBF7] border border-stone-200 dark:border-stone-850"
                }`}
              >
                {d.shortcut}
              </button>
            </div>
          );
        })}
      </div>

      <div className="w-4 h-[1px] bg-[#B38B36]/20" />

      {/* Lock Button */}
      <button
        onClick={toggleLock}
        className={`p-1.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
          isLocked
            ? "bg-[#B38B36]/20 border-[#B38B36] text-[#B38B36] hover:bg-[#B38B36]/30"
            : "border-stone-200 dark:border-stone-800 text-stone-400 hover:text-[#3C2A21] dark:hover:text-[#FDFBF7]"
        }`}
        title={isLocked ? "Unlock background" : "Lock background"}
      >
        {isLocked ? <Lock className="w-3.5 h-3.5 animate-pulse" /> : <Unlock className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
};

export default DesignSwitcher;
