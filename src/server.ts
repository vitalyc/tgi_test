import express from "express";
import helmet from "helmet";
import compression from "compression";

import {startJob, getAllJobs} from "./jobManager";
import { analyzeProcessLog } from "./stats";
import logger from "./logger";
import {schemaJob, validateRequest} from "./validators";
import {iRequestJobCreate} from "./types";

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';


//I can use express-async-handler library, but I try to show how to do it manually.ipm i
const asyncHandler = (fn: any) => (req: any, res:any, next:any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


const app = express();
app.use(express.json());
app.use(helmet());// Adds security headers to the response
app.use(compression());// Adds response compression

if (process.env.NODE_ENV === 'development') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    logger.info(`Swagger docs at /api-docs`);
}


/**
 * @openapi
 * /jobs:
 *   post:
 *     summary: Start a new job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobName
 *               - process
 *             properties:
 *               jobName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 description: A unique name for the job.
 *               process:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 2048
 *                 description: Path or name of the script/executable to run.
 *               arguments:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional array of arguments.
 *               retryCountMax:
 *                 type: integer
 *               timeoutMs:
 *                 type: integer
 *           examples:
 *             basicJob:
 *               summary: Minimal valid job
 *               value:
 *                 jobName: "simple-task"
 *                 process: "dummy-job.bat"
 *             dummyJobSuccess:
 *               summary: Run dummy-job.bat with success result (first argument < 10)
 *               value:
 *                 jobName: "dummyJob-success"
 *                 process: "dummy-job.bat"
 *                 arguments: ["8", "--log"]
 *             dummyJobFailure:
 *               summary: Run dummy-job.bat with failure (first argument >= 10)
 *               value:
 *                 jobName: "dummyJob-fail"
 *                 process: "dummy-job.bat"
 *                 arguments: ["18", "--log"]
 *                 retryCountMax: 2
 *             notepadRun:
 *               summary: Run notepad with retry and timeout
 *               value:
 *                 jobName: "notepad-run"
 *                 process: "notepad"
 *                 retryCountMax: 2
 *                 timeoutMs: 10000
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *             examples:
 *               success:
 *                 summary: A job was successfully created
 *                 value:
 *                   id: "c14e12d0-1111-4567-9999-deadbeef1234"
 *                   status: "running"
 */
app.post("/jobs", validateRequest<iRequestJobCreate>(schemaJob), (req, res) => {
  const { jobName, process, arguments: args, retryCountMax, timeoutMs } = req.body as iRequestJobCreate;
  const job = startJob(jobName, process, args||[], retryCountMax || 0, timeoutMs || 0);
  res.status(201).json({ id: job.id, status: job.status });
});


/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     responses:
 *       200:
 *         description: List of jobs
 */
app.get("/jobs", (req, res) => {
  res.json(getAllJobs());
});


/**
 * @openapi
 * /stats:
 *   get:
 *     summary: Get all jobs analysis
 *     responses:
 *       200:
 *         description: json with analysis of all jobs
 */
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
