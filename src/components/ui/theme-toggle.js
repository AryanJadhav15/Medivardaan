"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative inline-flex h-8 w-[60px] items-center rounded-full bg-medivardaan-teal/10 border border-medivardaan-teal/20 opacity-50">
        <span className="absolute left-1 h-6 w-6 rounded-full bg-white shadow-sm" />
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`group relative inline-flex h-8 w-[60px] items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-medivardaan-teal focus-visible:ring-offset-2 border shadow-inner
        ${
          theme === "dark"
            ? "bg-[#393053] border-[#635985]/50"
            : "bg-medivardaan-teal/10 border-medivardaan-teal/30"
        }
      `}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>

      {/* Track Icons */}
      <span
        className={`absolute left-2 transition-opacity duration-300 ${
          theme === "dark" ? "opacity-100" : "opacity-0"
        }`}
      >
        <Sun className="h-4 w-4 text-white/70" />
      </span>
      <span
        className={`absolute right-2 transition-opacity duration-300 ${
          theme === "dark" ? "opacity-0" : "opacity-100"
        }`}
      >
        <Moon className="h-4 w-4 text-medivardaan-blue/70" />
      </span>

      {/* Thumb */}
      <span
        className={`z-10 flex h-6 w-6 transform items-center justify-center rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] transition-all duration-500 ease-[cubic-bezier(0.5,2,0.5,0.8)] group-hover:scale-105 group-hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)] group-active:w-10 group-active:scale-95 ${
          theme === "dark"
            ? "translate-x-8 group-active:translate-x-4 bg-white rotate-[360deg]"
            : "translate-x-1 bg-white rotate-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-3.5 w-3.5 text-[#18122B] transition-transform duration-500 -rotate-[360deg]" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-[#18122B] transition-transform duration-500 rotate-0" />
        )}
      </span>
    </button>
  );
}
