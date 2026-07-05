import { create } from "zustand";
import initialSite from "../data/cms/site.json";
import initialProjects from "../data/cms/projects.json";
import initialSkills from "../data/cms/skills.json";
import initialTheme from "../data/cms/theme.json";

interface CmsState {
  site: any;
  projects: any[];
  skills: any[];
  theme: any;
  snapshots: { id: string; timestamp: number; message: string; data: any }[];
  setSite: (site: any) => void;
  setProjects: (projects: any[]) => void;
  setSkills: (skills: any[]) => void;
  setTheme: (theme: any) => void;
  createSnapshot: (message: string) => void;
  restoreSnapshot: (id: string) => void;
}

export const useCmsStore = create<CmsState>((set, get) => ({
  site: initialSite,
  projects: initialProjects,
  skills: initialSkills,
  theme: initialTheme,
  snapshots: [],
  setSite: (site) => set({ site }),
  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
  setTheme: (theme) => set({ theme }),
  createSnapshot: (message) => {
    const state = get();
    const data = {
      site: state.site,
      projects: state.projects,
      skills: state.skills,
      theme: state.theme,
    };
    const newSnapshot = {
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      message,
      data: JSON.parse(JSON.stringify(data)),
    };
    set((s) => ({ snapshots: [newSnapshot, ...s.snapshots] }));
  },
  restoreSnapshot: (id) => {
    const snap = get().snapshots.find((s) => s.id === id);
    if (snap) {
      set({
        site: snap.data.site,
        projects: snap.data.projects,
        skills: snap.data.skills,
        theme: snap.data.theme,
      });
    }
  },
}));
