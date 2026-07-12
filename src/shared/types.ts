export interface ThemeSettings {
  animations: boolean;
  particles?: boolean;
  music?: boolean;
  [key: string]: any;
}

export type TemplateFeature = "blog" | "terminal" | "animations" | "particles" | "gallery" | "timeline" | "storytelling" | "ai" | "pwa" | "cms";

export interface TemplateManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  thumbnail: string;
  preview?: {
    desktop: string;
    mobile?: string;
    tablet?: string;
    dark?: string;
    light?: string;
  };
  performance?: number; // 0-100 baseline
  supportedFeatures: TemplateFeature[];
  supportedSections: string[];
  dependencies?: Record<string, string>;
  minimumCMSVersion?: string;
  updatedAt?: string;
  settings: ThemeSettings;
}

export interface PortfolioData {
  profile: any;
  projects: any[];
  experience: any[];
  certifications?: any[];
  skills: any[];
  blog: any[];
  gallery?: any[];
  contact: any;
  social: any[];
  resume?: any;
  seo?: any;
  timeline?: any[];
  testimonials?: any[];
  faq?: any[];
  theme: TemplateManifest;
}
