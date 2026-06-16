import React, { createContext, useContext, useState, useCallback } from "react";

const DesignContext = createContext(null);

export const DesignProvider = ({ children }) => {
  const [bgDesign, setBgDesignState] = useState(() => {
    return localStorage.getItem("selected_bg_design") || "design1";
  });

  const setBgDesign = useCallback((design) => {
    setBgDesignState(design);
    localStorage.setItem("selected_bg_design", design);
  }, []);

  const value = {
    bgDesign,
    setBgDesign,
  };

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>;
};

export const useDesign = () => {
  const ctx = useContext(DesignContext);
  if (!ctx) throw new Error("useDesign must be used within DesignProvider");
  return ctx;
};
