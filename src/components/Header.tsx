import { Moon, Sun, Laptop } from "lucide-react";

interface HeaderProps {
  theme: "light" | "dark" | "system";
  onChangeTheme: (theme: "light" | "dark" | "system") => void;
}

export function Header({ theme, onChangeTheme }: HeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/70 py-4 px-6 md:px-8 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title Logo with high-end typography */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 text-white rounded dark:bg-zinc-100 dark:text-zinc-950 flex items-center justify-center font-bold">
            <div className="w-3.5 h-3.5 bg-current rotate-45 select-none" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-sm tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
              LeetCode Solution Explainer
            </h1>
            <p className="text-[9px] text-zinc-400 font-bold tracking-[0.2em] uppercase">
              AI DSA Tutor
            </p>
          </div>
        </div>

        {/* Minimalist Theme Swapper with system sync */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <button
            onClick={() => onChangeTheme("light")}
            className={`flex h-7 px-3.5 items-center gap-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
              theme === "light"
                ? "bg-white text-zinc-955 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            title="Light mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Light</span>
          </button>
          
          <button
            onClick={() => onChangeTheme("dark")}
            className={`flex h-7 px-3.5 items-center gap-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
              theme === "dark"
                ? "bg-white text-zinc-955 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            title="Dark mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dark</span>
          </button>

          <button
            onClick={() => onChangeTheme("system")}
            className={`flex h-7 px-3.5 items-center gap-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
              theme === "system"
                ? "bg-white text-zinc-955 shadow-xs dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
            title="Sync with system preference"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auto</span>
          </button>
        </div>
      </div>
    </header>
  );
}
