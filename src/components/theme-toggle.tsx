import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
      const root = document.documentElement;
      if (nextTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch {}
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      className="relative h-8 w-8 p-0 hover:bg-transparent active:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:active:bg-transparent dark:focus:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300 ease-in-out motion-reduce:transition-none"
      onClick={handleToggle}
   >
      <Sun className="h-4 w-4 origin-center rotate-0 scale-100 transition-transform transition-opacity duration-300 ease-in-out dark:-rotate-90 dark:scale-0 dark:opacity-0 motion-reduce:transition-none" />
      <Moon className="absolute h-4 w-4 origin-center rotate-90 scale-0 opacity-0 transition-transform transition-opacity duration-300 ease-in-out dark:rotate-0 dark:scale-100 dark:opacity-100 motion-reduce:transition-none" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;

