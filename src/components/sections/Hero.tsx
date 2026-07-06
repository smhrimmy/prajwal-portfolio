import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Download, Code2, Terminal, Cpu, Cloud, GitBranch } from "lucide-react";
import { useCmsStore } from "@/store/useCmsStore";
import { useMagnetic } from "@/lib/motion";

function useTyping(words: readonly string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const current = words[i % words.length];
    const speed = del ? 45 : 90;
    const t = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDel(true), 1400);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) {
          setDel(false);
          setI((v) => v + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return text;
}

const floatIcons = [
  { Icon: Code2, x: "8%", y: "22%", d: 0 },
  { Icon: Terminal, x: "86%", y: "18%", d: 1 },
  { Icon: Cpu, x: "14%", y: "72%", d: 2 },
  { Icon: Cloud, x: "82%", y: "68%", d: 1.5 },
  { Icon: GitBranch, x: "50%", y: "12%", d: 0.5 },
];

function UptimeCounter() {
  const [uptime, setUptime] = useState("0000");
  useEffect(() => {
    setUptime(String(Math.floor(Date.now() / 100000) % 9999));
  }, []);
  return <span>UPTIME: {uptime} HRS</span>;
}


export function Hero() {
  const site = useCmsStore((s) => s.site);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.4);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => {
      setTilt({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-6 pt-24">
      {floatIcons.map(({ Icon, x, y, d }, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute hidden text-secondary/30 md:block"
          style={{ left: x, top: y }}
          animate={{ y: [0, -18, 0], x: tilt.x * (i % 2 ? -1 : 1) * 0.4 }}
          transition={{ y: { duration: 5 + d, repeat: Infinity, ease: "easeInOut" } }}
        >
          <Icon className="h-8 w-8" />
        </motion.div>
      ))}

      <motion.div
        className="relative z-10 text-center"
        style={{ transform: `perspective(1000px) rotateY(${tilt.x * 0.15}deg) rotateX(${-tilt.y * 0.15}deg)` }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full border border-border glass px-4 py-1.5 font-mono text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-success">SYSTEM ONLINE</span>
          </div>
          <span className="h-3 w-[1px] bg-border" />
          <UptimeCounter />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-sm text-secondary"
        >
          {site.handle} // {site.location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-5xl font-black leading-none tracking-tighter sm:text-7xl md:text-8xl"
        >
          <span className="text-gradient animate-gradient-pan">{site.name}</span>
        </motion.h1>

        <div className="mt-5 flex h-8 items-center justify-center font-mono text-lg text-muted-foreground sm:text-2xl">
          <span className="text-secondary">$&gt;</span>
          <span className="ml-2 text-foreground">chmod +x build_web.sh</span>
          <span className="ml-0.5 animate-pulse text-secondary">_</span>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-sm text-muted-foreground sm:text-base leading-relaxed">
          {site.bio}
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            ref={ctaRef}
            href="#projects"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-bold transition-transform hover:scale-105"
          >
            Deployments
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={site.resumeUrl || "#"}
            data-cursor="hover"
            className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 text-sm font-semibold transition-colors hover:border-secondary/50 hover:text-secondary"
          >
            <Terminal className="h-4 w-4" />
            init_contact
          </a>
        </div>
      </motion.div>
    </section>
  );
}
