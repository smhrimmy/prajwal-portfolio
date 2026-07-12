export const glassTokens = {
  colors: {
    bg: "bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-zinc-950 dark:via-[#0a0a0c] dark:to-[#111118]",
    surface: "bg-white/40 dark:bg-black/20 backdrop-blur-2xl backdrop-saturate-[1.2]",
    text: "text-zinc-900 dark:text-zinc-100",
    textMuted: "text-zinc-600 dark:text-zinc-400",
    border: "border-white/40 dark:border-white/10",
    accents: {
      primary: "text-indigo-500 dark:text-indigo-400",
      secondary: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300"
    }
  },
  typography: {
    sans: "font-sans tracking-tight",
    heading: "font-sans font-medium tracking-tight",
    mono: "font-mono text-sm tracking-widest",
  },
  layout: {
    radius: "rounded-3xl",
    padding: "p-8 md:p-12",
  },
  utils: {
    panel: "shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] ring-1 ring-white/50 dark:ring-white/10",
  },
  motion: {
    float: "motion-safe:transition-transform motion-safe:duration-700 hover:-translate-y-2",
  }
};
