import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../middleware/mw_error_defs.js";
import { createChirp } from "../lib/db/queries/chirps.js";

const badWords = ["kerfuffle", "sharbert", "fornax"];

function stripBadWords(input: string, badWordsList: string[]): string {
    const words = input.split(" ").map((word) => {
        return badWordsList.includes(word.toLowerCase()) ? "****" : word;
    });
    return words.join(" ");
}

const maxChirpLength = 140

export async function handlerChirps(req: Request, res: Response, next: NextFunction) {
    try {
        if (req.body.body.length <= maxChirpLength) {
            const createdChirp = await createChirp({
                body: stripBadWords(req.body.body, badWords),
                userId: req.body.userId
            });
            res.status(201).send(JSON.stringify(createdChirp));
        } else {
            throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
        }
    } catch (err) {
        next(err);
    }
    // if (isRequestData(req.body)) {
    //     if (req.body.body.length <= maxChirpLength) {
    //         res.status(200).send(JSON.stringify({ "cleanedBody": stripBadWords(req.body.body, badWords) }));
    //     } else {
    //         res.status(400).send(JSON.stringify({ "error": "Chirp is too long" }));
    //     }
    // } else {
    //     res.status(400).send(JSON.stringify({ "error": "Invalid Chirp format" }));
    // }
}