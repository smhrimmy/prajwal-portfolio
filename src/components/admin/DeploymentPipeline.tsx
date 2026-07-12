import { useState, useEffect } from "react";
import { runPublishPipelineFn, getPublishStatusFn } from "@/actions/pipeline";

export function DeploymentPipeline() {
  const [status, setStatus] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const fetchStatus = async () => {
    const res = await getPublishStatusFn();
    setStatus(res);
    if (res && res.status !== "completed" && res.status !== "failed") {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    await runPublishPipelineFn({ data: { changes: [{ type: "manual_trigger" }] } });
    fetchStatus();
  };

  const getStepStatus = (stepName: string) => {
    if (!status) return "pending";
    if (status.status === "completed") return "success";
    if (status.status === "failed") return "error";
    return "running";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-8 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Build Center</h1>
          <p className="text-muted-foreground">Professional deployment pipeline.</p>
        </div>
        <button 
          onClick={handleRunPipeline}
          disabled={isRunning}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {isRunning ? "Pipeline Running..." : "Deploy Now"}
        </button>
      </div>

      <div className="glass p-8 rounded-xl">
        <div className="flex flex-col gap-6 relative">
          <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border z-0"></div>

          <div className="flex items-start gap-4 relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${getStepStatus('preflight') === 'success' ? 'bg-green-500/20 text-green-500 border-green-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
              ✓
            </div>
            <div>
              <h3 className="font-bold">Generate Static JSON</h3>
              <p className="text-sm text-muted-foreground">Snapshot of CMS data created.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${getStepStatus('build') === 'success' ? 'bg-green-500/20 text-green-500 border-green-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
              ✓
            </div>
            <div>
              <h3 className="font-bold">Validate Pipeline</h3>
              <p className="text-sm text-muted-foreground">L1 and L2 Diagnostics passed.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isRunning ? 'bg-blue-500/20 text-blue-500 border-blue-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
              {isRunning ? <span className="animate-spin w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full"></span> : <span>3</span>}
            </div>
            <div>
              <h3 className="font-bold">Deploying via Git</h3>
              <p className="text-sm text-muted-foreground">Committing and pushing to main branch...</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${status?.status === 'completed' ? 'bg-green-500/20 text-green-500 border-green-500' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}>
              4
            </div>
            <div>
              <h3 className="font-bold text-zinc-500">Success</h3>
              <p className="text-sm text-muted-foreground">Site is live.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
