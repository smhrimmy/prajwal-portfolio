export const terminalTokens = {
  colors: {
    bg: "bg-[#0c0c0c]",
    surface: "bg-[#161616]",
    text: "text-[#cccccc]",
    textMuted: "text-[#888888]",
    border: "border-[#333333]",
    accents: {
      primary: "text-[#f9826c]", // red-ish
      secondary: "text-[#79c0ff]", // blue-ish
      success: "text-[#56d364]", // green-ish
      warning: "text-[#e3b341]", // yellow-ish
      keyword: "text-[#ff7b72]",
      string: "text-[#a5d6ff]",
    }
  },
  typography: {
    sans: "font-mono", // Terminal is 100% mono
    heading: "font-mono font-bold tracking-tight",
    mono: "font-mono text-sm",
  },
  layout: {
    radius: "rounded-none",
    padding: "p-4 md:p-6",
  },
  utils: {
    panel: "border-l-2 border-[#333333]",
  },
  motion: {
    cursorBlink: "animate-pulse",
  }
};
