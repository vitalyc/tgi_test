import express from "express";
import {startJob, getAllJobs} from "./jobManager";
import { analyzeProcessLog } from "./stats";


const asyncHandler = (fn: any) => (req: any, res:any, next:any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


const app = express();
app.use(express.json());

app.post("/jobs", (req, res) => {
  const { jobName, process, arguments: args, retryCountMax, timeoutMs } = req.body;
  if (!jobName || !process || (args && !Array.isArray(args))) {
    return res.status(400).json({ error: `Invalid request format.`, sample:{jobName: 'my-task-42', process:'dummy-job', arguments: ['17', '7']}});
  }
  const job = startJob(jobName, process, args, retryCountMax || 0, timeoutMs || 0);
  res.status(201).json({ id: job.id, status: job.status });
});

app.get("/jobs", (req, res) => {
  res.json(getAllJobs());
});

/*
I can use try catch without asyncHandler, but it is more verbose.
*/
app.get("/stats", asyncHandler(async (req: express.Request, res: express.Response) => {
  const jobs = getAllJobs();
  const stats = await analyzeProcessLog(jobs);
  res.json(stats);
}));

app.use((err: Error, req: express.Request, res: express.Response) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong" });
});

export default app;
