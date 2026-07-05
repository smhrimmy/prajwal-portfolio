import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger, viewportOnce } from "@/lib/variants";

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mb-12 text-center">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">{kicker}</div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
