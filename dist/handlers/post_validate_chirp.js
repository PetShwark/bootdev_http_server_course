function isRequestData(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    const obj = data;
    return typeof obj.body === 'string';
}
const maxChirpLength = 140;
export async function handlerValidateChirp(req, res) {
    if (isRequestData(req.body)) {
        if (req.body.body.length <= 140) {
            res.status(200).send(JSON.stringify({ "valid": true }));
        }
        else {
            res.status(400).send(JSON.stringify({ "error": "Chirp is too long" }));
        }
    }
    else {
        res.status(400).send(JSON.stringify({ "error": "Invalid Chirp format" }));
    }
}
