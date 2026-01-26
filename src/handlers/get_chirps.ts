import { Response, Request, NextFunction } from "express";
import { selectChirps } from "../lib/db/queries/chirps.js";

export async function handlerGetChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const chirps = await selectChirps();
        res.status(200).send(JSON.stringify(chirps));
    } catch (err) {
        next(err);
    }
}