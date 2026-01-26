import { Response, Request, NextFunction } from "express";
import { config } from "../config.js";
import { deleteUsers } from "../lib/db/queries/users.js";
import { ForbiddenError } from "../middleware/mw_error_defs.js";

export async function handlerMetricsReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (config.apiConfig.platform === "dev") {
        try {
            config.apiConfig.fileserverHits = 0;
            await deleteUsers();
            res.set("Content-Type", "text/plain; charset=utf-8");
            res.send("Metics reset.");
        } catch (err) {
            next(err);
        }
    } else {
        throw new ForbiddenError("Dev mode only")
    }
}