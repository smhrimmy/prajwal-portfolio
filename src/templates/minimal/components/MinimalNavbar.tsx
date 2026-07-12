import { useTemplateData } from "@/shared/TemplateContext";
import { minimalTokens as t } from "../tokens";

export function MinimalNavbar() {
  const { profile } = useTemplateData();
  
  return (
    <nav data-portfolio-component="minimalnavbar" className="fixed top-0 left-0 w-full p-6 md:px-12 flex justify-between items-center mix-blend-difference text-white z-50">
      <div className={`font-bold tracking-tight text-lg`}>
        {profile?.name || "Portfolio"}
      </div>
      <div className="flex gap-8 text-sm font-medium opacity-80">
        <a href="#about" className="hover:opacity-100 transition-opacity hidden md:block">Story</a>
        <a href="#work" className="hover:opacity-100 transition-opacity">Work</a>
        <a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a>
      </div>
    </nav>
  );
}
