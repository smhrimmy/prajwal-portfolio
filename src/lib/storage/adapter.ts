export interface StorageAdapter {
  // Site Config (Profile, Settings)
  getSite(): Promise<any>;
  updateSite(data: any): Promise<void>;

  // Collections
  getProjects(): Promise<any[]>;
  updateProjects(data: any[]): Promise<void>;

  getSkills(): Promise<any[]>;
  updateSkills(data: any[]): Promise<void>;

  getArticles(): Promise<any[]>;
  saveArticle(data: any): Promise<void>;
  deleteArticle(id: string): Promise<void>;

  // Media
  uploadImage(file: File): Promise<string>;

  // Theme
  getTheme(): Promise<any>;
  saveTheme(data: any): Promise<void>;

  // Analytics
  getAnalytics(): Promise<any>;

  // Version Control
  createRevision(message: string, snapshot: any): Promise<void>;
  restoreRevision(id: string): Promise<any>;

  // Utilities
  search(query: string): Promise<any[]>;
  backup(): Promise<string>;
  restore(backupData: string): Promise<void>;
  export(): Promise<string>;
  import(data: string): Promise<void>;
}
