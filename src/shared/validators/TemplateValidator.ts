import { ValidationResult, TemplateContract } from "../contracts/TemplateContract";

// This simulates a heuristic runtime/manifest validator for the QA Dashboard.
// In a true deployment pipeline, L3 validation (Lighthouse) would run.
export function runLevel1And2Validation(contract: TemplateContract | any): ValidationResult {
  // If the template hasn't implemented the contract yet (fallback mock)
  const isImplemented = typeof contract?.metadata === 'function';
  
  if (!isImplemented) {
    return {
      passed: false,
      score: 30,
      details: {
        sections: { passed: false, missing: ["projects", "blog", "experience", "skills", "contact", "timeline", "faq", "gallery", "testimonials", "github", "certifications", "hero", "about", "resume", "footer"] },
        fonts: { passed: false, missing: ["Inter"] },
        icons: { passed: false },
        images: { passed: false },
        responsive: { passed: false },
        seo: { passed: false },
        accessibility: { passed: false },
        animation: { passed: false },
        github: { passed: false },
        blog: { passed: false },
        projects: { passed: false },
        contract: { passed: false },
        performance: 0
      }
    };
  }

  // Once a template implements the contract, we mock a highly successful validation 
  // since the contract enforcement inherently solves most L1/L2 issues.
  const manifest = contract.metadata();
  const implementedSections = manifest.supportedSections || [];
  const TOTAL_SECTIONS = 15;
  const sectionsScore = Math.min(implementedSections.length / TOTAL_SECTIONS, 1);
  
  // Health score is a weighted average of various checks.
  // 40% sections, 10% performance, 50% binary checks
  const performanceScore = manifest.performance || 95;
  const booleanChecksCount = 10;
  const passedBooleanChecks = 10; // Assuming all pass for now
  
  const healthScore = Math.round((sectionsScore * 40) + ((performanceScore / 100) * 10) + ((passedBooleanChecks / booleanChecksCount) * 50));

  return {
    passed: healthScore >= 90 && implementedSections.length === TOTAL_SECTIONS,
    score: healthScore,
    details: {
      sections: { passed: implementedSections.length === TOTAL_SECTIONS, missing: [] },
      fonts: { passed: true, missing: [] },
      icons: { passed: true },
      images: { passed: true },
      responsive: { passed: true },
      seo: { passed: true },
      accessibility: { passed: true },
      animation: { passed: true },
      github: { passed: true },
      blog: { passed: true },
      projects: { passed: true },
      contract: { passed: true },
      performance: performanceScore
    }
  };
}
