"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DashboardTheme = "light" | "dark";

type DashboardUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

type DashboardUiContextValue = {
  theme: DashboardTheme;
  setTheme: (theme: DashboardTheme) => void;
  toggleTheme: () => void;
  user: DashboardUser | null;
};

const THEME_KEY = "thewrker.theme";

const DashboardUiContext = createContext<DashboardUiContextValue | null>(null);

function readStoredTheme(): DashboardTheme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

export function DashboardUiProvider({
  user,
  children,
}: {
  user: DashboardUser | null;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<DashboardTheme>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.dataset.dsTheme = theme;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((next: DashboardTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, user }),
    [theme, setTheme, toggleTheme, user]
  );

  return (
    <DashboardUiContext.Provider value={value}>{children}</DashboardUiContext.Provider>
  );
}

export function useDashboardUi() {
  const ctx = useContext(DashboardUiContext);
  if (!ctx) {
    throw new Error("useDashboardUi must be used within DashboardUiProvider");
  }
  return ctx;
}

export function useDashboardUiOptional() {
  return useContext(DashboardUiContext);
}
