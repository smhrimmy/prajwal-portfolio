import { createFileRoute } from '@tanstack/react-router'
import { useCmsStore } from "@/store/useCmsStore";
import { WebsiteRenderer } from "@/components/WebsiteRenderer";
import { PortfolioData } from "@/shared/types";

export const Route = createFileRoute("/gallery")({
  component: GalleryRoute,
});

function GalleryRoute() {
  const cmsStore = useCmsStore();
  const { preview } = Route.useSearch() as any;

  const portfolioData: PortfolioData = {
    profile: cmsStore.site,
    projects: cmsStore.projects,
    experience: (cmsStore as any).experience || [],
    certifications: (cmsStore as any).certifications || [],
    skills: cmsStore.skills,
    blog: [], // Mocking for now
    contact: cmsStore.site,
    social: cmsStore.site?.socialLinks || [],
    theme: {
      id: preview || cmsStore.theme?.activeTemplate || "bento",
      name: "Template",
      version: "1.0",
      author: "Admin",
      description: "",
      thumbnail: "",
      supports: [],
      supportedFeatures: [],
      supportedSections: [],
      settings: cmsStore.theme?.settings || { animations: true }
    }
  };

  return <WebsiteRenderer data={portfolioData} route="/gallery" />;
}
