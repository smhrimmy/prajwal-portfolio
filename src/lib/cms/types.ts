export type JobStatus = 'pending' | 'running' | 'success' | 'error';

export interface BuildJob {
  id: string;
  name: string;
  status: JobStatus;
  progress: number;
  message: string;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export interface PublishSession {
  id: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  jobs: BuildJob[];
  createdAt: number;
}

export interface BuilderContext {
  releaseDir: string;      // The current release directory e.g., public/generated/releases/v1
  symlinkDir: string;      // The active directory e.g., public/generated/
  dbData: any;             // Data fetched from Supabase
  reportProgress: (progress: number, msg: string) => void;
}

export interface CMSPluginWorker {
  id: string;
  name: string;
  description: string;
  
  // Return true if this worker needs to run based on what changed
  shouldRun: (changes: { type: string; id?: string }[]) => boolean;
  
  // The actual build logic
  execute: (context: BuilderContext) => Promise<void>;
}
