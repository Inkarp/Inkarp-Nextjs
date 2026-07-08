"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ThemeContext = createContext(null);

const PRODUCT_ROUTE_PATTERN = /^\/products(\/|$)/;

// Dark mode is scoped to the products pages only — never applied on first paint
// anywhere else, so other pages can never flash/stay dark.
export const themeInitScript = `(function(){try{if(!/^\\/products(\\/|$)/.test(window.location.pathname))return;if(localStorage.getItem("theme")==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const pathname = usePathname();
  const isProductRoute = PRODUCT_ROUTE_PATTERN.test(pathname ?? "");

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    setTheme(stored === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    // Only ever apply the dark class while on a /products route — leaving it
    // removes the class immediately regardless of the stored preference.
    document.documentElement.classList.toggle("dark", isProductRoute && theme === "dark");
  }, [theme, isProductRoute]);

  useEffect(() => {
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isProductRoute }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
