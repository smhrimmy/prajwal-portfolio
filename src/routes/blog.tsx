import { createFileRoute } from '@tanstack/react-router'
import { useCmsStore } from "@/store/useCmsStore";
import { WebsiteRenderer } from "@/components/WebsiteRenderer";
import { PortfolioData } from "@/shared/types";
import { getArticlesFn } from "@/actions/cms";
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute("/blog")({
  component: BlogRoute,
});

function BlogRoute() {
  const cmsStore = useCmsStore();
  const { preview } = Route.useSearch() as any;

  // Auto-updating query for articles
  const { data: dbArticles } = useQuery({
    queryKey: ['articles'],
    queryFn: () => getArticlesFn(),
    refetchInterval: 10000, 
  });

  const portfolioData: PortfolioData = {
    profile: cmsStore.site,
    projects: cmsStore.projects,
    experience: (cmsStore as any).experience || [],
    certifications: (cmsStore as any).certifications || [],
    skills: cmsStore.skills,
    blog: dbArticles || [],
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

  return <WebsiteRenderer data={portfolioData} route="/blog" />;
}
