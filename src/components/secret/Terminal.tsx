import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { profile } from "@/data/profile";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";

const HELP = `Available commands:
  help        show this message
  about       who am i
  skills      list top skills
  projects    list projects
  contact     get in touch
  social      social links
  clear       clear terminal
  exit        close terminal`;

function run(cmd: string): string {
  const c = cmd.trim().toLowerCase();
  switch (c) {
    case "help": return HELP;
    case "about": return `${profile.name} — ${profile.role}\n${profile.bio}`;
    case "skills": return skills.slice(0, 8).map((s) => `${s.name.padEnd(20)} ${s.level}%`).join("\n");
    case "projects": return projects.map((p) => `• ${p.title} [${p.category}]`).join("\n");
    case "contact": return `email: ${profile.email}\nlocation: ${profile.location}`;
    case "social": return "github · linkedin · twitter — see Contact section";
    case "": return "";
    default: return `command not found: ${c}. type 'help'`;
  }
}

export function Terminal() {
  const open = useAppStore((s) => s.terminalOpen);
  const setOpen = useAppStore((s) => s.setTerminalOpen);
  const unlock = useAppStore((s) => s.unlock);
  const [history, setHistory] = useState<string[]>(["Welcome to devOS terminal. Type 'help' to begin.", ""]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) { unlock("terminal"); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [open, unlock]);
  useEffect(() => { endRef.current?.scrollIntoView(); }, [history]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === "clear") { setHistory([]); setInput(""); return; }
    if (input.trim().toLowerCase() === "exit") { setOpen(false); setInput(""); return; }
    const out = run(input);
    setHistory((h) => [...h, `$ ${input}`, ...(out ? [out] : []), ""]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          className="glass-strong fixed bottom-6 left-6 z-50 flex h-80 w-[calc(100vw-3rem)] max-w-lg flex-col overflow-hidden rounded-xl shadow-2xl"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning" />
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </div>
            <span className="text-muted-foreground">devOS — terminal</span>
            <button onClick={() => setOpen(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-secondary">
            {history.map((line, i) => (
              <pre key={i} className="whitespace-pre-wrap">{line}</pre>
            ))}
            <form onSubmit={submit} className="flex items-center gap-2">
              <span className="text-primary">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-foreground outline-none"
                spellCheck={false}
              />
            </form>
            <div ref={endRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
