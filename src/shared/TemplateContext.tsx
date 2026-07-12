import { createContext, useContext } from "react";
import { PortfolioData } from "./types";

const TemplateContext = createContext<PortfolioData | null>(null);

export function TemplateProvider({ data, children }: { data: PortfolioData, children: React.ReactNode }) {
  return (
    <TemplateContext.Provider value={data}>
      {children}
    </TemplateContext.Provider>
  );
}

export function useTemplateData() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error("useTemplateData must be used within a TemplateProvider");
  }
  return context;
}
