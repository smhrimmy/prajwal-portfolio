// Minimal Engine Tokens
// Focus: Heavy typography, immense whitespace, deep contrast, asymmetric structure

export const minimalTokens = {
  colors: {
    bg: "bg-[#FAFAFA] dark:bg-[#0A0A0A]",
    text: "text-zinc-900 dark:text-zinc-50",
    textMuted: "text-zinc-500 dark:text-zinc-400",
    border: "border-zinc-200 dark:border-zinc-800",
    surface: "bg-white dark:bg-zinc-900",
  },
  typography: {
    display: "font-serif text-6xl md:text-8xl lg:text-9xl tracking-tighter leading-[0.9]",
    heading: "font-serif text-3xl md:text-5xl tracking-tight leading-tight",
    body: "font-sans text-base md:text-lg leading-relaxed font-light",
    mono: "font-mono text-xs md:text-sm tracking-widest uppercase",
  },
  spacing: {
    section: "py-24 md:py-40",
    container: "max-w-6xl mx-auto px-6 md:px-12",
  },
  motion: {
    fadeUp: "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out",
  }
};
