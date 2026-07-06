import { PublishSession, BuildJob, CMSPluginWorker, BuilderContext } from '../types';
import fs from 'fs';
import path from 'path';

// Simplified singleton manager for handling build queues locally in Node.js
export class QueueManager {
  private static instance: QueueManager;
  private currentSession: PublishSession | null = null;
  private workers: CMSPluginWorker[] = [];
  
  private constructor() {}

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  registerWorker(worker: CMSPluginWorker) {
    if (!this.workers.find(w => w.id === worker.id)) {
      this.workers.push(worker);
    }
  }

  getCurrentSession(): PublishSession | null {
    return this.currentSession;
  }

  async startPipeline(changes: { type: string; id?: string }[], dbData: any) {
    if (this.currentSession && this.currentSession.status === 'running') {
      throw new Error('A build is already in progress');
    }

    const version = Date.now().toString();
    const releaseDir = path.join(process.cwd(), 'public', 'generated', 'releases', `v${version}`);
    const symlinkDir = path.join(process.cwd(), 'public', 'generated');

    // Create release dir
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir, { recursive: true });
    }

    // Determine which workers need to run
    const activeWorkers = this.workers.filter(w => w.shouldRun(changes));

    this.currentSession = {
      id: version,
      createdAt: Date.now(),
      status: 'running',
      jobs: activeWorkers.map(w => ({
        id: w.id,
        name: w.name,
        status: 'pending',
        progress: 0,
        message: 'Waiting in queue'
      }))
    };

    // We do NOT await the execution here, we run it in background
    this.executeJobs(activeWorkers, { releaseDir, symlinkDir, dbData, reportProgress: () => {} }).catch(err => {
      console.error("Pipeline failed", err);
    });

    return this.currentSession.id;
  }

  private async executeJobs(workers: CMSPluginWorker[], context: BuilderContext) {
    if (!this.currentSession) return;

    for (const worker of workers) {
      const job = this.currentSession.jobs.find(j => j.id === worker.id);
      if (!job) continue;

      job.status = 'running';
      job.startTime = Date.now();
      job.message = 'Processing...';

      // Attach progress reporter scoped to this job
      const scopedContext = {
        ...context,
        reportProgress: (progress: number, msg: string) => {
          job.progress = progress;
          job.message = msg;
        }
      };

      try {
        await worker.execute(scopedContext);
        job.status = 'success';
        job.progress = 100;
        job.message = 'Done';
      } catch (err: any) {
        job.status = 'error';
        job.error = err.message || 'Unknown error';
        job.message = 'Failed';
        this.currentSession.status = 'failed';
        return; // Halt pipeline on first error
      } finally {
        job.endTime = Date.now();
      }
    }

    // If all successful, swap symlinks or just copy everything to public/generated root
    if (this.currentSession.status !== 'failed') {
      try {
        // Since cross-platform symlinks can be problematic on Windows without admin,
        // we'll recursively copy the release contents to the root of /generated/
        this.copyDirSync(context.releaseDir, context.symlinkDir);
        this.currentSession.status = 'success';
      } catch (e: any) {
        this.currentSession.status = 'failed';
        const job = this.currentSession.jobs[this.currentSession.jobs.length - 1];
        if (job) { job.status = 'error'; job.error = e.message; }
      }
    }
  }

  private copyDirSync(src: string, dest: string) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        this.copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}
