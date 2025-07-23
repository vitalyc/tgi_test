import express from "express";
import helmet from "helmet";
import compression from "compression";

import {startJob, getAllJobs} from "./jobManager";
import { analyzeProcessLog } from "./stats";
import logger from "./logger";
import {schemaJob, validateRequest} from "./validators";
import {iRequestJobCreate} from "./types";


//I can use express-async-handler library, but I try to show how to do it manually.ipm i
const asyncHandler = (fn: any) => (req: any, res:any, next:any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


const app = express();
app.use(express.json());
app.use(helmet());// Adds security headers to the response
app.use(compression());// Adds response compression

app.post("/jobs", validateRequest<iRequestJobCreate>(schemaJob), (req, res) => {
  const { jobName, process, arguments: args, retryCountMax, timeoutMs } = req.body as iRequestJobCreate;
  const job = startJob(jobName, process, args||[], retryCountMax || 0, timeoutMs || 0);
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

interface CustomError extends Error {
    status?: number;
}
app.use((err: CustomError, req: express.Request, res: express.Response) => {
    logger.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || 'Internal Server Error',
    });
});


export default app;
