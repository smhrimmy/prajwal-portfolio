export const cyberpunkTokens = {
  colors: {
    bg: "bg-[#0a0a0a]",
    surface: "bg-black",
    border: "border-[#00ff41]/30",
    borderGlow: "border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.2)]",
    text: "text-[#00ff41]",
    textMuted: "text-[#008f11]",
    accents: {
      primary: "text-[#00ff41] bg-[#00ff41]/10",
      secondary: "text-[#0df] bg-[#0df]/10",
      alert: "text-[#ff003c] bg-[#ff003c]/10"
    }
  },
  typography: {
    mono: "font-mono tracking-tight",
  },
  layout: {
    padding: "p-4 md:p-6",
    radius: "rounded-none", // Cyberpunk is sharp
  },
  motion: {
    instant: "motion-safe:transition-none",
    glitchHover: "hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_#00ff41] transition-transform duration-75",
    blink: "animate-pulse"
  },
  utils: {
    panel: "relative overflow-hidden flex flex-col border border-dashed",
  }
};
