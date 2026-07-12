export const bentoTokens = {
  colors: {
    bg: "bg-[#f4f4f5] dark:bg-[#18181b]",
    surface: "bg-white dark:bg-[#27272a]",
    border: "border-black/5 dark:border-white/10 border",
    text: "text-zinc-900 dark:text-zinc-100",
    textMuted: "text-zinc-500 dark:text-zinc-400",
    accents: {
      status: "bg-emerald-500 text-white",
      statusSoft: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
      featured: "bg-amber-500 text-white",
      featuredSoft: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
      link: "bg-blue-500 text-white",
      linkSoft: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20",
    }
  },
  layout: {
    gap: "gap-4", // 16px
    radius: "rounded-[16px]",
    padding: "p-6 md:p-8",
  },
  motion: {
    slow: "motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-in-out",
    medium: "motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out",
    fast: "motion-safe:transition-all motion-safe:duration-150 motion-safe:ease-out",
    cardHover: "motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out motion-reduce:transition-none hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)]",
    pulse: "motion-safe:animate-pulse motion-reduce:animate-none"
  },
  grid: {
    container: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    span1x1: "col-span-1 row-span-1",
    span2x1: "md:col-span-2 row-span-1",
    span1x2: "col-span-1 md:row-span-2",
    span2x2: "md:col-span-2 md:row-span-2",
  },
  utils: {
    card: "relative overflow-hidden flex flex-col",
  }
};
