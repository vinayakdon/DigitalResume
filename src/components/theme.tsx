"use client";

import { ThemeProvider as NextThemes, useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore, type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemes>
  );
}

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // Theme is only known on the client; render a neutral button until then.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const isDark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle colour theme"}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
