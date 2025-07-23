import {iRequestJobCreate} from "./types";
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import logger from "./logger";

// Middleware to validate request data
export const validateRequest = <T>(schema: Joi.ObjectSchema<T>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            logger.error('Request validation failed:', error.details);
            return res.status(400).json({
                error: 'Request validation failed',
                details: error.details.map((detail) => detail.message),
            });
        }
        // Assign validated data to req.body with correct type
        req.body = value as T;
        next();
    };
};

// Define Joi schema for Job creation request
export const schemaJob = Joi.object<iRequestJobCreate>({
    jobName:Joi.string().min(3).max(50).required(),
    process:Joi.string().min(3).max(2048).required(),//in case of a path to a script or executable
    arguments: Joi.array().items(Joi.string().min(1).max(2048)).optional(), // Array of strings for arguments
    retryCountMax:Joi.number().integer().min(0).max(10).optional(),
    timeoutMs: Joi.number().integer().min(0).max(60*60*1000).optional(),//1 hour max

});