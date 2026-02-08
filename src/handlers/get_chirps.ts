import { Response, Request, NextFunction } from "express";
import { selectChirps, selectChirp, selectChirpsByAuthorId } from "../lib/db/queries/chirps.js";
import { NotFoundError } from "../middleware/mw_error_defs.js";


export async function handlerGetChirps(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const authorId = req.query.authorId as string | undefined;
        const sort = req.query.sort as string | undefined;
        const ascending = sort !== "desc";
        if (typeof authorId === "string") {
            const chirps = await selectChirpsByAuthorId(authorId, ascending);
            res.status(200).send(JSON.stringify(chirps));
            return;
        }
        const chirps = await selectChirps(ascending);
        res.status(200).send(JSON.stringify(chirps));
    } catch (err) {
        next(err);
    }
}

export async function handlerGetChirp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        let chirpId: string;
        if (Array.isArray(req.params.chirpId)) {
            chirpId = req.params.chirpId[0];
        } else {
            chirpId = req.params.chirpId;
        }
        const chirp = await selectChirp(chirpId);
        if (typeof chirp === "object" && "id" in chirp) {
            res.status(200).send(JSON.stringify(chirp));
        } else {
            throw new NotFoundError(`Chirp with id (${chirpId}) not found.`);
        }
    } catch (err) {
        next(err);
    }
}