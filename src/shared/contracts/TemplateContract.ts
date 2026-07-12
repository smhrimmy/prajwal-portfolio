import { PortfolioData, TemplateManifest } from "../types";
import React from "react";

export interface ValidationResult {
  passed: boolean;
  score: number;
  details: {
    sections: { passed: boolean; missing: string[] };
    fonts: { passed: boolean; missing: string[] };
    icons: { passed: boolean };
    images: { passed: boolean };
    responsive: { passed: boolean };
    seo: { passed: boolean };
    accessibility: { passed: boolean };
    animation: { passed: boolean };
    github: { passed: boolean };
    blog: { passed: boolean };
    projects: { passed: boolean };
    contract: { passed: boolean };
    performance: number;
  }
}

export interface SectionRegistry {
  id: string; // e.g. "hero", "projects", "experience"
  component: React.ComponentType<any>;
}

export interface TemplateContract {
  metadata(): TemplateManifest;
  navigation(): any;
  layout(): SectionRegistry[]; // Defines the order of sections on the homepage
  theme(): any; // Tokens/Variables
  animations(): any;
  pages(): Record<string, React.ComponentType<any>>; // Mapping of routes to page components (e.g. "/projects": ProjectsPage)
  components(): Record<string, React.ComponentType<any>>; // Exported template-specific components
  capabilities(): string[];
  render(data: PortfolioData): React.ReactNode; // Optional/Fallback for full manual rendering
  validate(): ValidationResult; // Runtime heuristic check
}
