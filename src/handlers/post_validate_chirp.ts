import { Request, Response } from "express";

interface RequestData {
    body: string;
}

function isRequestData(data: unknown): data is RequestData {
    if (typeof data !== 'object' || data === null) return false;
    const obj = data as Record<string, unknown>;
    return typeof obj.body === 'string';
}

const maxChirpLength = 140

export async function handlerValidateChirp(req: Request, res: Response) {
    let body = ""; // 1. Initialize
    type ErrorResponseData = {
        error: string;
    }
    type ValidResponseData = {
        valid: boolean;
    }

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
                    const validChirpResponse: ValidResponseData = {
                        valid: true
                    }
                    res.status(200).send(JSON.stringify(validChirpResponse));
                } else {
                    const errorResponse: ErrorResponseData = {
                        error: "Chirp is too long"
                    }
                    res.status(400).send(JSON.stringify(errorResponse));
                }
            } else {
                const errorResponse: ErrorResponseData = {
                    error: "Invalid Chirp Format"
                }
                res.status(400).send(JSON.stringify(errorResponse));
            }
        } catch (error) {
            const errorResponse: ErrorResponseData = {
                error: "Invalid JSON"
            }
            res.status(400).send(JSON.stringify(errorResponse));
        }
    });
}