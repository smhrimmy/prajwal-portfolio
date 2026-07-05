import { StorageAdapter } from "./adapter";
import {
  getSiteFn, updateSiteFn,
  getProjectsFn, updateProjectsFn,
  getSkillsFn, updateSkillsFn,
  getThemeFn, updateThemeFn
} from "../../actions/storage";

export class LocalJSONAdapter implements StorageAdapter {
  async getSite() { return await getSiteFn(); }
  async updateSite(data: any) { await updateSiteFn({ data }); }

  async getProjects() { return await getProjectsFn(); }
  async updateProjects(data: any[]) { await updateProjectsFn({ data }); }

  async getSkills() { return await getSkillsFn(); }
  async updateSkills(data: any[]) { await updateSkillsFn({ data }); }

  async getArticles() { return []; } // TODO: connect to supabase/local blog
  async saveArticle(data: any) {}
  async deleteArticle(id: string) {}

  async uploadImage(file: File) {
    // Mock local upload
    return URL.createObjectURL(file);
  }

  async getTheme() { return await getThemeFn(); }
  async updateTheme(data: any) { await updateThemeFn({ data }); } // renamed to saveTheme below
  async saveTheme(data: any) { await updateThemeFn({ data }); }

  async getAnalytics() { return { visitors: 0, views: 0 }; }

  async createRevision(message: string, snapshot: any) {
    // Local revision system omitted for brevity, but implemented in Zustand state
  }
  async restoreRevision(id: string) { return null; }

  async search(query: string) { return []; }
  async backup() { return "backup-data"; }
  async restore(data: string) {}
  async export() { return "exported-json"; }
  async import(data: string) {}
}
