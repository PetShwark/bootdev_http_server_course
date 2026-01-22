const badWords = ["kerfuffle", "sharbert", "fornax"];
function isRequestData(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    const obj = data;
    return typeof obj.body === 'string';
}
function stripBadWords(input, badWordsList) {
    const words = input.split(" ").map((word) => {
        return badWordsList.includes(word.toLowerCase()) ? "****" : word;
    });
    return words.join(" ");
}
const maxChirpLength = 140;
export async function handlerValidateChirp(req, res) {
    if (isRequestData(req.body)) {
        if (req.body.body.length <= maxChirpLength) {
            res.status(200).send(JSON.stringify({ "cleanedBody": stripBadWords(req.body.body, badWords) }));
        }
        else {
            res.status(400).send(JSON.stringify({ "error": "Chirp is too long" }));
        }
    }
    else {
        res.status(400).send(JSON.stringify({ "error": "Invalid Chirp format" }));
    }
}
