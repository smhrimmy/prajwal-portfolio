import React, { createContext, useContext } from 'react';
import { useCmsStore } from '@/store/useCmsStore';

interface PortfolioContextType {
  github: any;
  blog: any[];
  resume: any;
  gallery: any[];
  analytics: any;
  skills: any[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const cmsStore = useCmsStore();

  // In a real app, this would wrap tanstack/react-query hooks for fetching github, blog, etc.
  // For now, it proxies the CMS store and mocks external data providers
  const value: PortfolioContextType = {
    github: {
      username: cmsStore.site?.github_username || "O-FALLEN-ANGEL-O",
      repos: [],
      stats: {}
    },
    blog: cmsStore.site?.blog || [],
    resume: (cmsStore as any).resume || null,
    gallery: (cmsStore as any).gallery || [],
    analytics: {},
    skills: cmsStore.skills || []
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

export function useGitHub() {
  return usePortfolio().github;
}

export function useBlog() {
  return usePortfolio().blog;
}

export function useResume() {
  return usePortfolio().resume;
}

export function useGallery() {
  return usePortfolio().gallery;
}

export function useAnalytics() {
  return usePortfolio().analytics;
}

export function useSkills() {
  return usePortfolio().skills;
}
