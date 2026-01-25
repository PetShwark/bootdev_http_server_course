import { Request, Response } from "express";
import { config } from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: Function) {
    res.on('finish', () => {
        config.apiConfig.fileserverHits++;
    });
    next();
}