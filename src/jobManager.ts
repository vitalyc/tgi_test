import path from "path";
import {spawn} from "child_process";
import {v4 as uuidv4} from "uuid";
import {Job, JobStatus} from "./types";

class LimitedBuffer {
    private buffer: string[] = [];
    private limit: number;

    constructor(limit: number) {
        this.limit = limit;
    }

    get size() {
        return this.buffer.length;
    }
    add(data: string) {
        this.buffer.push(data);
        if (this.buffer.length > this.limit) {
            this.buffer.shift();
        }
    }

    getBuffer() {
        return this.buffer.join("");
    }
}

const jobStore= new Map<string, Job>();


export function getAllJobs(): Job[] {
    return [...jobStore.values()];
}

export function startJob(jobName: string, process:string, args: string[], retryCountMax:number, timeoutMs:number): Job {
    const id = uuidv4();
    const job: Job = {
        id,
        process,
        jobName,
        args,
        startTime: new Date(),
        status: "created",
        timeoutMs,
        retryCount:0,
        retryCountMax,
    };
    jobStore.set(job.id, job);
    runJobProcess(job);
    return job;
}

function runJobProcess(job: Job) {
    if(!job.process)
        return;

    let proc;

    if(job.process === 'dummy-job.bat' || job.process === 'dummy-job') {
        const scriptPath = path.resolve(__dirname, "../dummy-job.bat");
        proc = spawn("cmd.exe", ["/c", scriptPath, ...job.args]);
        //const proc = spawn("cmd.exe", ["/c", "dummy-job.bat", ...job.args]);

    }
    else{
        proc = spawn(job.process, job.args);
    }
    console.log(`Starting job: ${job.jobName} with PID: ${proc.pid}`);

    job.status = "running";
    jobStore.set(job.id, job);

    const out = new LimitedBuffer(10);
    const err = new LimitedBuffer(10);
    proc.stdout.on("data", data => {
        out.add(data);
        console.log(`stdout: ${data}`);
    });
    proc.stderr.on("data", data => {
        err.add(data);
        console.log(`stderr: ${data}`)
    });

    // Set up timeout
    let timeout = null;
    if(job.timeoutMs && Number.isSafeInteger(job.timeoutMs) && job.timeoutMs > 0) {
        timeout = setTimeout(() => {
            if (proc && !proc.killed) {
                proc.kill('SIGTERM'); // Attempt graceful termination
                setTimeout(() => {
                    if (!proc.killed) {
                        proc.kill('SIGKILL'); // Force kill if still running
                    }
                }, 1000); // Wait 1 second for graceful termination

                job.endTime = new Date();
                job.exitCode = 1;
                job.status = "timeout";
                job.errorStr = (job.errorStr || '') + '\nProcess terminated due to timeout';
                jobStore.set(job.id, job);

                if (job.retryCountMax && job.retryCount < job.retryCountMax) {
                    retryJob(job);
                }
            }
        }, job.timeoutMs);

    }

    proc.on("exit", (code) => {
        if(timeout) clearTimeout(timeout); // Clear timeout on normal exit

        job.endTime = new Date();
        job.exitCode = code ?? 1;
        job.status = (code == 0) ? "completed" : "crashed";
        if(out.size > 0)  job.outputStr = out.getBuffer();
        if(err.size > 0)  job.errorStr = err.getBuffer();
        jobStore.set(job.id, job);

        if (code !== 0 && job.retryCountMax && job.retryCount < job.retryCountMax) {
            retryJob(job);
        }
    });
}

function retryJob(originalJob: Job) {
    const retryJob: Job = {
        ...originalJob,
        id: uuidv4(),
        retryCount: (originalJob.retryCount || 0) + 1,
        papaId: originalJob.id,
        startTime: new Date(),
        endTime: undefined,
        status: "retried",
    };
    jobStore.set(retryJob.id, retryJob);
    runJobProcess(retryJob);
}
