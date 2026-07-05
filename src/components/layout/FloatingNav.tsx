import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Home, FolderGit2, Activity, Mail, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Work", icon: FolderGit2 },
  { id: "github", label: "Logs", icon: Activity },
  { id: "contact", label: "Connect", icon: Mail },
];

export function FloatingNav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState("home");

  useEffect(() => {
    let last = 0;
    const unsub = scrollY.on("change", (y) => {
      setVisible(y < 120 || y < last);
      last = y;
    });
    return () => unsub();
  }, [scrollY]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
    >
      <div className="glass-strong relative flex items-center gap-1 rounded-full px-2 py-1.5 shadow-lg">
        {links.map((l) => {
          const Icon = l.icon;
          const isActive = active === l.id;
          return (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-cursor="hover"
              className={cn(
                "group relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-colors",
                isActive ? "text-secondary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-secondary/15 ring-1 ring-secondary/40"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10 hidden sm:inline">{l.label}</span>
            </a>
          );
        })}
      </div>
      <motion.div
        className="mx-auto mt-1.5 h-0.5 rounded-full bg-gradient-to-r from-secondary via-primary to-accent"
        style={{ scaleX: progress, transformOrigin: "left" }}
      />
    </motion.nav>
  );
}
