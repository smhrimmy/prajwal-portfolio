import React, { lazy, Suspense } from "react";
import { PortfolioData } from "../shared/types";

// A dynamic loader that fetches the root of the specified template folder
const loadTemplate = (templateId: string) => {
  return lazy(() => 
    import(`../templates/${templateId}/index.tsx`)
      .catch(() => import(`../templates/classic/index.tsx`)) // Safe fallback to classic
  );
};

// Custom Error Boundary to catch template crashes at runtime
class TemplateErrorBoundary extends React.Component<{ fallbackData: PortfolioData; route?: string; children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Template Rendering Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const ClassicFallback = loadTemplate("classic");
      return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <ClassicFallback data={this.props.fallbackData} route={this.props.route} />
        </Suspense>
      );
    }
    return this.props.children;
  }
}

export function WebsiteRenderer({ data, route = "/" }: { data: PortfolioData; route?: string }) {
  if (!data || !data.theme || !data.theme.id) {
    return null;
  }

  // Support ?preview=templateId for Website Builder
  let activeThemeId = data.theme.id;
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("preview");
    if (preview) activeThemeId = preview;
  }

  const TemplateComponent = loadTemplate(activeThemeId);

  return (
    <TemplateErrorBoundary fallbackData={data} route={route}>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-foreground">Loading Template Engine...</div>}>
        <TemplateComponent data={data} route={route} />
      </Suspense>
    </TemplateErrorBoundary>
  );
}
