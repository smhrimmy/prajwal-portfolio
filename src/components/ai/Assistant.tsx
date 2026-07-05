import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { skills } from "@/data/skills";

interface Msg { role: "user" | "bot"; text: string }

function answer(q: string): string {
  const s = q.toLowerCase();
  if (/hello|hi|hey/.test(s)) return `Hey! I'm ${profile.name}'s AI assistant. Ask me about projects, skills, experience, resume or contact.`;
  if (/project|work|build|portfolio/.test(s)) return `I've shipped ${projects.length}+ projects including ${projects.slice(0, 3).map((p) => p.title).join(", ")}. Check the Work section for details.`;
  if (/experience|job|career|role/.test(s)) return `Currently ${experiences[0].role} at ${experiences[0].company}. Previously worked at ${experiences.slice(1).map((e) => e.company).join(", ")}.`;
  if (/skill|tech|stack|language/.test(s)) return `Top skills: ${skills.slice(0, 5).map((k) => k.name).join(", ")}. Frontend, support engineering and UI/UX are my strengths.`;
  if (/resume|cv/.test(s)) return `You can grab the resume from the Resume button in the hero, or I can point you to the Contact section to request it.`;
  if (/contact|email|reach|hire|available/.test(s)) return `${profile.available ? "I'm available for work!" : "Currently busy but open to chat."} Reach out at ${profile.email} or use the Contact section.`;
  if (/location|where/.test(s)) return `Based in ${profile.location}, working with clients globally.`;
  return `Great question! Try asking about my projects, experience, skills, resume, or how to get in touch.`;
}

const SUGGEST = ["Tell me about projects", "What's your experience?", "Your tech stack?", "Are you available?"];

export function Assistant() {
  const open = useAppStore((s) => s.assistantOpen);
  const setOpen = useAppStore((s) => s.setAssistantOpen);
  const unlock = useAppStore((s) => s.unlock);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: `Hi! I'm ${profile.name}'s AI assistant. How can I help?` }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    unlock("ai-chat");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "bot", text: answer(text) }]);
      setTyping(false);
    }, 800);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(!open)}
        data-cursor="hover"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent neon-glow"
        aria-label="AI Assistant"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <X className="h-6 w-6 text-primary-foreground" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <Bot className="h-6 w-6 text-primary-foreground" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="glass-strong fixed bottom-24 right-6 z-50 flex h-[28rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <div>
                <div className="text-sm font-semibold">AI Assistant</div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> online
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "glass"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 px-2">
                  {[0, 1, 2].map((i) => (
                    <motion.span key={i} className="h-2 w-2 rounded-full bg-secondary" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-border p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {SUGGEST.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full glass px-2 py-1 text-[10px] text-muted-foreground hover:text-secondary">
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 rounded-full glass px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-secondary/50"
                />
                <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
