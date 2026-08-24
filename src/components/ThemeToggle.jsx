import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getSystemTheme,
  resolveTheme,
} from "../theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    const current = document.documentElement.dataset.theme;
    return current === "dark" || current === "light" ? current : resolveTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setTheme(getSystemTheme());
      }
    };

    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const isDark = theme === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={isDark}
      title={isDark ? "Modo claro" : "Modo oscuro"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
