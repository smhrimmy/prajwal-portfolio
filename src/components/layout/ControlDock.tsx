import { Moon, Sun, TerminalSquare, Command } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function ControlDock() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setCommandOpen = useAppStore((s) => s.setCommandOpen);
  const setTerminalOpen = useAppStore((s) => s.setTerminalOpen);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-row gap-2 lg:bottom-auto lg:left-6 lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-0 lg:flex-col shadow-xl lg:shadow-none p-2 lg:p-0 rounded-2xl glass lg:bg-transparent lg:border-none lg:backdrop-blur-none">
      <button

        onClick={toggleTheme}
        data-cursor="hover"
        title="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-xl glass transition-colors hover:text-secondary hover:border-secondary/50"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
      <button
        onClick={() => setCommandOpen(true)}
        data-cursor="hover"
        title="Command palette (⌘K)"
        className="flex h-10 w-10 items-center justify-center rounded-xl glass transition-colors hover:text-secondary hover:border-secondary/50"
      >
        <Command className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTerminalOpen(true)}
        data-cursor="hover"
        title="Terminal (T)"
        className="flex h-10 w-10 items-center justify-center rounded-xl glass transition-colors hover:text-secondary hover:border-secondary/50"
      >
        <TerminalSquare className="h-4 w-4" />
      </button>
    </div>
  );
}
