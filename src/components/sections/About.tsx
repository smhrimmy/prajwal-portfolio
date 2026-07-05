import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { profile, stats } from "@/data/profile";
import { experiences } from "@/data/experience";
import { Reveal, RevealGroup, RevealItem, SectionHeading } from "@/components/ui/reveal";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <div ref={ref} className="text-4xl font-black text-gradient sm:text-5xl">
      {n}
      {suffix}
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      <SectionHeading kicker="// whoami" title="About Me" subtitle={profile.bio} />

      <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <RevealItem key={s.label}>
            <div className="glass corner-brackets relative rounded-2xl p-6 text-center transition-transform hover:-translate-y-1">
              <Counter value={s.value} suffix={s.suffix} />
              <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal className="mt-16">
        <h3 className="mb-8 text-center font-mono text-sm uppercase tracking-[0.3em] text-secondary">
          Career Timeline
        </h3>
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-3 top-0 h-full w-px bg-gradient-to-b from-secondary via-primary to-transparent md:left-1/2" />
          {experiences.map((e, i) => (
            <motion.div
              key={e.company}
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className={`relative mb-8 pl-10 md:w-1/2 md:pl-0 ${
                i % 2 ? "md:ml-auto md:pl-10" : "md:pr-10 md:text-right"
              }`}
            >
              <span className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-secondary ring-4 ring-secondary/20 md:left-auto md:right-[-6px] md:translate-x-1/2" style={i % 2 ? { left: -6 } : undefined} />
              <div className="font-mono text-xs text-secondary">{e.period}</div>
              <div className="mt-1 font-semibold">{e.role}</div>
              <div className="text-sm text-muted-foreground">{e.company}</div>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
