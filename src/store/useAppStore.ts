import { create } from "zustand";

type Theme = "dark" | "light";

interface AppState {
  loaded: boolean;
  progress: number;
  theme: Theme;
  commandOpen: boolean;
  terminalOpen: boolean;
  assistantOpen: boolean;
  achievements: string[];
  konami: boolean;
  setProgress: (p: number) => void;
  setLoaded: (v: boolean) => void;
  toggleTheme: () => void;
  setCommandOpen: (v: boolean) => void;
  setTerminalOpen: (v: boolean) => void;
  setAssistantOpen: (v: boolean) => void;
  unlock: (id: string) => void;
  setKonami: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  loaded: false,
  progress: 0,
  theme: "dark",
  commandOpen: false,
  terminalOpen: false,
  assistantOpen: false,
  achievements: [],
  konami: false,
  setProgress: (p) => set({ progress: Math.min(100, Math.max(0, p)) }),
  setLoaded: (v) => set({ loaded: v }),
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light", next === "light");
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    set({ theme: next });
    get().unlock("theme-switcher");
  },
  setCommandOpen: (v) => set({ commandOpen: v }),
  setTerminalOpen: (v) => set({ terminalOpen: v }),
  setAssistantOpen: (v) => set({ assistantOpen: v }),
  unlock: (id) =>
    set((s) => (s.achievements.includes(id) ? s : { achievements: [...s.achievements, id] })),
  setKonami: (v) => set({ konami: v }),
}));
