export type JobStatus = "created" | "running" | "completed" | "crashed" | "retried" | "timeout";

export interface iJob {
  id: string;
  process?: string;
  papaId?: string;
  jobName: string;
  args: string[];
  startTime: Date;
  endTime?: Date;
  status: JobStatus;
  exitCode?: number;
  outputStr?: string;
  errorStr?: string;
  timeoutMs?: number;
  retryCount: number;
  retryCountMax?: number;
}



export interface iRequestJobCreate {
    jobName:string;
    process:string;
    arguments?: string[];
    retryCountMax?:number;
    timeoutMs?: number;
}