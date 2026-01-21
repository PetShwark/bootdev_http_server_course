function isRequestData(data) {
    if (typeof data !== 'object' || data === null)
        return false;
    const obj = data;
    return typeof obj.body === 'string';
}
const maxChirpLength = 140;
export async function handlerValidateChirp(req, res) {
    let body = ""; // 1. Initialize
    // 2. Listen for data events
    req.on("data", (chunk) => {
        body += chunk;
    });
    // 3. Listen for end events
    req.on("end", () => {
        try {
            const parsedBody = JSON.parse(body);
            if (isRequestData(parsedBody)) {
                if (parsedBody.body.length <= maxChirpLength) {
                    const validChirpResponse = {
                        valid: true
                    };
                    res.status(200).send(JSON.stringify(validChirpResponse));
                }
                else {
                    const errorResponse = {
                        error: "Chirp is too long"
                    };
                    res.status(400).send(JSON.stringify(errorResponse));
                }
            }
            else {
                const errorResponse = {
                    error: "Invalid Chirp Format"
                };
                res.status(400).send(JSON.stringify(errorResponse));
            }
        }
        catch (error) {
            const errorResponse = {
                error: "Invalid JSON"
            };
            res.status(400).send(JSON.stringify(errorResponse));
        }
    });
}
