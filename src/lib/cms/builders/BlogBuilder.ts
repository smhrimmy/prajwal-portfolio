import { CMSPluginWorker, BuilderContext } from '../types';
import fs from 'fs';
import path from 'path';

export const BlogBuilderWorker: CMSPluginWorker = {
  id: 'blog-builder',
  name: 'Blog Builder',
  description: 'Generates static blog pages and index',
  shouldRun: () => true,
  execute: async (context: BuilderContext) => {
    const { releaseDir, dbData, reportProgress } = context;
    const { articles } = dbData;
    
    if (!articles) return;

    const blogDir = path.join(releaseDir, 'blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    reportProgress(10, 'Writing blog index...');
    // Create an index without full content for fast listing
    const index = articles.map((a: any) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      description: a.description,
      status: a.status,
      created_at: a.created_at
    }));
    fs.writeFileSync(path.join(blogDir, 'index.json'), JSON.stringify(index, null, 2));

    reportProgress(50, 'Writing individual pages...');
    articles.forEach((a: any) => {
      fs.writeFileSync(path.join(blogDir, `${a.slug || a.id}.json`), JSON.stringify(a, null, 2));
    });

    reportProgress(100, 'Blog artifacts generated');
  }
};
