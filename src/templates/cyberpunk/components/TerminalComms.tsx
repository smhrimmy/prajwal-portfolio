import { useTemplateData } from "@/shared/TemplateContext";
import { cyberpunkTokens as t } from "../tokens";

export function TerminalComms() {
  const { contact } = useTemplateData();

  if (!contact) return null;

  return (
    <div data-portfolio-component="terminalcomms" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <section className={`${t.colors.surface} ${t.utils.panel} ${t.colors.border} p-6 ${t.motion.glitchHover}`}>
        <div className="border-b border-[#00ff41]/30 pb-2 mb-4 flex justify-between">
          <h3 className="text-xl font-bold uppercase tracking-widest">COMM_LINK</h3>
          <span className="text-xs bg-[#00ff41]/20 px-2 py-1">[ ENCRYPTED ]</span>
        </div>
        
        <form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-[#0df] mb-1">TARGET_ID (EMAIL)</label>
            <input type="email" placeholder="user@node.net" className={`bg-black/50 border border-[#00ff41]/30 p-2 text-sm text-[#00ff41] focus:outline-none focus:border-[#00ff41] placeholder:text-[#00ff41]/30 ${t.typography.mono}`} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-[#0df] mb-1">PAYLOAD (MESSAGE)</label>
            <textarea rows={4} placeholder="Enter encrypted transmission..." className={`bg-black/50 border border-[#00ff41]/30 p-2 text-sm text-[#00ff41] focus:outline-none focus:border-[#00ff41] placeholder:text-[#00ff41]/30 ${t.typography.mono} resize-none`} />
          </div>
          <button type="button" className="mt-2 border border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] hover:bg-[#00ff41]/30 font-mono text-sm py-2 transition-colors">
            [ INITIALIZE_UPLOAD ]
          </button>
        </form>
      </section>
      
      <section className={`${t.colors.surface} ${t.utils.panel} ${t.colors.border} p-6 ${t.motion.glitchHover}`}>
        <div className="border-b border-[#00ff41]/30 pb-2 mb-4">
          <h3 className="text-xl font-bold uppercase tracking-widest">NETWORK_NODES</h3>
        </div>
        <div className="flex flex-col gap-4">
          <a href={contact.github || "#"} className="border border-[#00ff41]/20 p-3 hover:bg-[#00ff41]/10 transition-colors flex justify-between items-center">
            <span className="text-sm font-bold uppercase">GITHUB_REPO</span>
            <span className="text-xs text-[#0df]">[ CONNECT ]</span>
          </a>
          <a href={contact.twitter || "#"} className="border border-[#00ff41]/20 p-3 hover:bg-[#00ff41]/10 transition-colors flex justify-between items-center">
            <span className="text-sm font-bold uppercase">TWITTER_FEED</span>
            <span className="text-xs text-[#0df]">[ CONNECT ]</span>
          </a>
          <a href={contact.linkedin || "#"} className="border border-[#00ff41]/20 p-3 hover:bg-[#00ff41]/10 transition-colors flex justify-between items-center">
            <span className="text-sm font-bold uppercase">LINKEDIN_PROF</span>
            <span className="text-xs text-[#0df]">[ CONNECT ]</span>
          </a>
        </div>
      </section>
    </div>
  );
}
