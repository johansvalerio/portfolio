"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <a
      onClick={toggleTheme}
      className="cursor-pointer px-3 py-2 flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
      aria-label={`Cambiar a modo ${isDark ? "claro" : "oscuro"}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
      {showLabel && (
        <span className="ml-3 text-foreground">
          {isDark ? "Light mode" : "Dark mode"}
        </span>
      )}
    </a>
  );
}
