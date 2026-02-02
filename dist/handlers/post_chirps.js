import { BadRequestError, NotAuthorizedError } from "../middleware/mw_error_defs.js";
import { createChirp } from "../lib/db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../lib/auth/auth.js";
import { config } from "../config.js";
import { selectUserById } from "../lib/db/queries/users.js";
const badWords = ["kerfuffle", "sharbert", "fornax"];
function stripBadWords(input, badWordsList) {
    const words = input.split(" ").map((word) => {
        return badWordsList.includes(word.toLowerCase()) ? "****" : word;
    });
    return words.join(" ");
}
const maxChirpLength = 140;
export async function handlerChirps(req, res, next) {
    try {
        const bearerToken = getBearerToken(req);
        const tokenUserId = validateJWT(bearerToken, config.apiConfig.jwtSecret);
        const selectedUser = await selectUserById(tokenUserId);
        if (!selectedUser) {
            throw new NotAuthorizedError("User not found for provided token.");
        }
        if (req.body.body.length <= maxChirpLength) {
            const createdChirp = await createChirp({
                body: stripBadWords(req.body.body, badWords),
                userId: tokenUserId
            });
            res.status(201).send(JSON.stringify(createdChirp));
        }
        else {
            throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
        }
    }
    catch (err) {
        next(err);
    }
}
