import { useTemplateData } from "@/shared/TemplateContext";
import { glassTokens as t } from "../tokens";

export function GlassHUD() {
  const { profile } = useTemplateData();

  return (
    <nav data-portfolio-component="glasshud" className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 rounded-full ${t.colors.surface} ${t.utils.panel}`}>
      <div className="flex items-center gap-4 px-4 font-medium text-sm">
        <a href="#about" className="hover:text-indigo-500 transition-colors">Vision</a>
        <a href="#projects" className="hover:text-indigo-500 transition-colors">Canvas</a>
        <a href="#writing" className="hover:text-indigo-500 transition-colors">Thoughts</a>
      </div>
      <a href="#contact" className="ml-4 px-6 py-2 rounded-full bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
        Connect
      </a>
    </nav>
  );
}
