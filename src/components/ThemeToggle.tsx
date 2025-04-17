
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or saved preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <div className="theme-toggle flex items-center gap-2 bg-card p-2 rounded-full shadow-md border border-border">
      <Sun className={`h-5 w-5 ${isDarkMode ? 'text-muted-foreground' : 'text-yellow-500'}`} />
      <Switch 
        checked={isDarkMode} 
        onCheckedChange={toggleTheme} 
        aria-label="Toggle dark mode"
      />
      <Moon className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-muted-foreground'}`} />
    </div>
  );
}
