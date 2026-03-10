"use client";
import { useState, useEffect, useCallback } from "react";
import { Theme } from "@/types";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("pg_theme");
    if (stored) {
      setThemeState(stored as Theme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const effectiveTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme;

    root.classList.toggle("dark", effectiveTheme === "dark");
    localStorage.setItem("pg_theme", theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
  }, []);

  return { theme, setTheme };
}
