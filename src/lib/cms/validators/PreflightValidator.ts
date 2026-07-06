import { CMSPluginWorker, BuilderContext } from '../types';

export const PreflightValidatorWorker: CMSPluginWorker = {
  id: 'preflight-validator',
  name: 'Pre-Flight Validator',
  description: 'Validates constraints before building',
  shouldRun: () => true, // Always run
  execute: async (context: BuilderContext) => {
    context.reportProgress(20, 'Checking constraints...');
    
    // Simulate validation
    const { projects, articles } = context.dbData;
    
    // Validate unique slugs for articles
    if (articles) {
      const slugs = new Set();
      for (const a of articles) {
        if (slugs.has(a.slug)) {
          throw new Error(`Duplicate slug detected: ${a.slug}`);
        }
        slugs.add(a.slug);
      }
    }

    context.reportProgress(100, 'Validation passed');
  }
};
