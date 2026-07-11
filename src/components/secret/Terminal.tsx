import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2, Minus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useCmsStore } from "@/store/useCmsStore";
import { VirtualFileSystem, buildDynamicVFS } from "@/lib/terminal/vfs";
import { defaultRegistry } from "@/lib/terminal/registry";

function parseANSI(text: string) {
  const parts = text.split(/(\x1b\[[0-9;]*m)/g);
  let currentColor = "";
  
  return parts.map((part, i) => {
    if (part.startsWith("\x1b[")) {
      if (part === "\x1b[0m") currentColor = ""; 
      else if (part === "\x1b[1;34m") currentColor = "text-blue-400 font-bold"; 
      else if (part === "\x1b[1;32m") currentColor = "text-success font-bold"; 
      else if (part === "\x1b[1;31m") currentColor = "text-destructive font-bold"; 
      else if (part === "\x1b[1;33m") currentColor = "text-warning font-bold"; 
      return null;
    }
    return <span key={i} className={currentColor}>{part}</span>;
  }).filter(Boolean);
}

export function Terminal() {
  const open = useAppStore((s) => s.terminalOpen);
  const setOpen = useAppStore((s) => s.setTerminalOpen);
  const store = useCmsStore();
  
  const [history, setHistory] = useState<{cwd: string, text: string}[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [input, setInput] = useState("");
  
  const [isMaximized, setIsMaximized] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  
  const vfs = useMemo(() => new VirtualFileSystem(buildDynamicVFS(store)), [store]);

  // Load persistent history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("devos_cmd_history");
      if (saved) {
        setCmdHistory(JSON.parse(saved));
      }
    } catch(e) {}
  }, []);

  // Save history on change
  useEffect(() => {
    try {
      if (cmdHistory.length > 0) {
        // Keep last 500 commands
        const toSave = cmdHistory.slice(-500);
        localStorage.setItem("devos_cmd_history", JSON.stringify(toSave));
      }
    } catch(e) {}
  }, [cmdHistory]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (history.length === 0) {
        setHistory([{ cwd: vfs.getPwd(), text: "Welcome to devOS.\nType 'help' to see available commands." }]);
      }
    }
  }, [open]);
  
  useEffect(() => { 
    // Scrollback limit (1000 items)
    if (history.length > 1000) {
      setHistory(h => h.slice(history.length - 1000));
    }
    endRef.current?.scrollIntoView(); 
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIdx < cmdHistory.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const cmds = defaultRegistry.getAll().map(c => c.name);
      const match = cmds.find(c => c.startsWith(input));
      if (match) setInput(match);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const currentPwd = vfs.getPwd();
    setHistory(h => [...h, { cwd: currentPwd, text: `$ ${cmd}` }]);
    setCmdHistory(h => [...h, cmd]);
    setHistoryIdx(-1);
    setInput("");

    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    if (cmd === "exit") {
      setOpen(false);
      return;
    }

    const out = await defaultRegistry.execute(cmd, {
      args: [], 
      vfs,
      setTheme: (t) => console.log("Set theme:", t), 
      navigate: (p) => { window.location.hash = p; }
    });

    if (out) {
      setHistory(h => [...h, { cwd: vfs.getPwd(), text: out }]);
    }
  };

  const getWidth = () => typeof window !== 'undefined' ? Math.min(800, window.innerWidth - 32) : 800;
  
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          drag={!isMaximized}
          dragMomentum={false}
          dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ 
            opacity: 1, y: 0, scale: 1,
            ...(isMaximized ? { width: '100vw', height: '100vh', left: 0, bottom: 0, right: 0, top: 0, borderRadius: 0 } : { width: getWidth(), height: 500 })
          }}
          exit={{ opacity: 0, y: 40, scale: 0.97 }}
          className={`fixed z-50 flex flex-col overflow-hidden shadow-2xl bg-[#0a0a0a] text-white border border-white/10 ${!isMaximized ? 'bottom-6 right-6 lg:right-6 sm:right-6 max-w-[calc(100vw-32px)] rounded-xl' : ''}`}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title Bar */}
          <div className="flex cursor-grab items-center justify-between border-b border-border bg-[#1a1a1a] px-4 py-2 font-mono text-xs active:cursor-grabbing" onDoubleClick={() => setIsMaximized(!isMaximized)}>
            <div className="flex gap-1.5">
              <button onClick={() => setOpen(false)} className="h-3 w-3 rounded-full bg-destructive flex items-center justify-center hover:opacity-80 transition-opacity"><X className="h-2 w-2 opacity-0 hover:opacity-100"/></button>
              <button onClick={() => setIsMaximized(!isMaximized)} className="h-3 w-3 rounded-full bg-warning flex items-center justify-center hover:opacity-80 transition-opacity"><Minus className="h-2 w-2 opacity-0 hover:opacity-100"/></button>
              <button onClick={() => setIsMaximized(!isMaximized)} className="h-3 w-3 rounded-full bg-success flex items-center justify-center hover:opacity-80 transition-opacity"><Maximize2 className="h-2 w-2 opacity-0 hover:opacity-100"/></button>
            </div>
            <span className="text-gray-400 select-none">guest@portfolio: ~</span>
            <div className="w-10"></div> 
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-gray-300">
            {history.map((item, i) => (
              <div key={i} className="mb-1">
                {item.text.startsWith('$') ? (
                  <div className="flex gap-2">
                    <span className="text-success font-bold">guest@portfolio</span>
                    <span className="text-white">:</span>
                    <span className="text-blue-400 font-bold">{item.cwd.replace('/home/guest', '~')}</span>
                    <span>{item.text.replace('$', '$ ')}</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{parseANSI(item.text)}</div>
                )}
              </div>
            ))}
            
            <form onSubmit={submit} className="flex items-start gap-2 mt-1">
              <div className="flex gap-2 shrink-0 pt-0.5">
                <span className="text-success font-bold">guest@portfolio</span>
                <span className="text-white">:</span>
                <span className="text-blue-400 font-bold">{vfs.getPwd().replace('/home/guest', '~')}</span>
                <span className="text-white">$</span>
              </div>
              <div className="relative flex-1 flex flex-col items-start min-h-[20px]">
                <textarea
                  ref={inputRef as any}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      submit(e as any);
                    } else {
                      handleKeyDown(e as any);
                    }
                  }}
                  className="w-full bg-transparent text-white outline-none resize-none overflow-hidden h-[20px]"
                  spellCheck={false}
                  rows={1}
                  style={{ minHeight: '20px', height: 'auto' }}
                  onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                  }}
                />
              </div>
            </form>
            <div ref={endRef} className="h-4" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
