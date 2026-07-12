import { useState, useRef, useEffect } from "react";
import { useTemplateData } from "@/shared/TemplateContext";
import { terminalTokens as t } from "../tokens";

export function TerminalLayout({ initialCommand = "" }: { initialCommand?: string }) {
  const data = useTemplateData();
  
  const executeCommand = (cmdStr: string): React.ReactNode => {
    const cmd = cmdStr.trim().toLowerCase();
    
    if (cmd === "clear") return null;
    if (cmd === "help") return <div>Available commands: whoami, about, skills, projects, experience, certs, blog, contact, clear</div>;
    if (cmd === "whoami") return <div>{data.profile?.name || "admin"}</div>;
    if (cmd === "about") return <div className="max-w-2xl text-justify">{data.profile?.short_bio || data.profile?.full_bio}</div>;
    if (cmd === "skills") return (
      <div data-portfolio-component="terminallayout" className="flex flex-col gap-2">
        {data.skills?.map((group: any, i: number) => (
          <div key={i}>
            <span className={t.colors.accents.secondary}>[{group.category}]</span> 
            <span> {group.items?.join(", ")}</span>
          </div>
        ))}
      </div>
    );
    if (cmd.startsWith("projects")) {
      const isNext = cmd.includes("next");
      const isAll = cmd.includes("all");
      const page = isNext ? 2 : 1;
      const start = (page - 1) * 3;
      const end = isAll ? data.projects?.length : start + 3;
      const sliced = data.projects?.slice(start, end);
      const hasMore = !isAll && data.projects?.length > end;

      return (
        <div className="flex flex-col gap-4 mt-2">
          {sliced?.map((p: any, i: number) => (
            <div key={i} className={`flex flex-col ${t.utils.panel} pl-4 py-2`}>
              <div className="flex items-center gap-2">
                <span className={`${t.colors.accents.primary} font-bold`}>{p.title}</span>
                <span className={t.colors.textMuted}>[{p.category}]</span>
              </div>
              <div className="text-sm mt-1 mb-2">{p.description}</div>
              <div className="flex gap-4 text-xs">
                {p.url && <a href={p.url} className="underline hover:text-white">--live</a>}
                {p.githubUrl && <a href={p.githubUrl} className="underline hover:text-white">--source</a>}
              </div>
            </div>
          ))}
          {hasMore && <div className={t.colors.accents.warning}>Type 'projects --next' to view more</div>}
        </div>
      );
    }
    if (cmd === "experience") {
      return (
        <div className="flex flex-col gap-4 mt-2">
          {data.experience?.map((exp: any, i: number) => (
            <div key={i} className={`flex flex-col ${t.utils.panel} pl-4 py-2`}>
              <div className="flex items-center justify-between max-w-xl">
                <span className={`${t.colors.accents.success} font-bold`}>{exp.role}</span>
                <span className={t.colors.textMuted}>{exp.period || exp.startDate}</span>
              </div>
              <div className={t.colors.accents.secondary}>{exp.company}</div>
              <div className="text-sm mt-2">{exp.description}</div>
            </div>
          ))}
        </div>
      );
    }
    if (cmd === "certs") {
      return (
        <div className="flex flex-col gap-2 mt-2">
          {data.certifications?.map((c: any, i: number) => (
            <div key={i}>
              <span className={t.colors.accents.warning}>{c.name}</span>
              <span className={t.colors.textMuted}> - {c.issuer}</span>
            </div>
          ))}
        </div>
      );
    }
    if (cmd.startsWith("blog") || cmd.startsWith("ls blog")) {
      const isNext = cmd.includes("next");
      const isAll = cmd.includes("all");
      const page = isNext ? 2 : 1;
      const start = (page - 1) * 3;
      const end = isAll ? data.blog?.length : start + 3;
      const sliced = data.blog?.slice(start, end);
      const hasMore = !isAll && data.blog?.length > end;

      return (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex text-xs font-bold mb-2 pb-1 border-b border-white/10">
            <div className="w-24">DATE</div>
            <div className="flex-1">TITLE</div>
            <div className="w-16">LINK</div>
          </div>
          {sliced?.map((post: any, i: number) => (
            <div key={i} className="flex text-sm hover:bg-white/5 py-1">
              <div className={`w-24 ${t.colors.textMuted}`}>{post.date}</div>
              <div className="flex-1 text-white">{post.title}</div>
              <a href={`/blog/${post.slug || post.id}`} className="w-16 underline hover:text-white">read</a>
            </div>
          ))}
          {hasMore && <div className={t.colors.accents.warning}>Type 'blog --next' to view more</div>}
        </div>
      );
    }
    if (cmd === "contact") {
      return (
        <div className="flex flex-col gap-2 mt-2">
          {data.contact?.email && (
            <div><span className={t.colors.accents.secondary}>email:</span> {data.contact.email}</div>
          )}
          {data.contact?.github && (
            <div><span className={t.colors.accents.secondary}>github:</span> {data.contact.github}</div>
          )}
          {data.contact?.twitter && (
            <div><span className={t.colors.accents.secondary}>twitter:</span> {data.contact.twitter}</div>
          )}
        </div>
      );
    }
    
    return <div className={t.colors.accents.error}>command not found: {cmd}</div>;
  };

  const initialHistory = initialCommand 
    ? [{ cmd: initialCommand, output: executeCommand(initialCommand) }]
    : [
      { cmd: "systemctl status portfolio", output: <div className={t.colors.accents.success}>● portfolio.service - active (running)</div> },
      { cmd: "whoami", output: <div>{data.profile?.name || "admin"}</div> },
      { cmd: "help", output: <div>Available commands: whoami, about, skills, projects, experience, certs, blog, contact, clear</div> }
    ];

  const [history, setHistory] = useState<{cmd: string, output: React.ReactNode}[]>(initialHistory);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    if (cmd.toLowerCase() === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const output = executeCommand(cmd);

    setHistory([...history, { cmd: input, output }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-4 mb-4">
        {history.map((h, i) => (
          <div key={i} className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className={t.colors.accents.success}>guest@portfolio</span>
              <span className={t.colors.textMuted}>:</span>
              <span className={t.colors.accents.secondary}>~</span>
              <span className={t.colors.textMuted}>$</span>
              <span>{h.cmd}</span>
            </div>
            <div className="ml-4">{h.output}</div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleCommand} className="flex items-center gap-2 mt-auto">
        <span className={t.colors.accents.success}>guest@portfolio</span>
        <span className={t.colors.textMuted}>:</span>
        <span className={t.colors.accents.secondary}>~</span>
        <span className={t.colors.textMuted}>$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 bg-transparent border-none outline-none ${t.colors.text} ${t.typography.mono}`}
          autoFocus
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
}
