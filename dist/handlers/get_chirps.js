import { selectChirps } from "../lib/db/queries/chirps.js";
export async function handlerGetChirps(req, res, next) {
    try {
        const chirps = await selectChirps();
        res.status(200).send(JSON.stringify(chirps));
    }
    catch (err) {
        next(err);
    }
}
