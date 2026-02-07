import { Request, Response, NextFunction } from "express";
import { selectUserById, upgradeUser } from "../lib/db/queries/users.js";
import { getAPIKey } from "../lib/auth/auth.js";
import { NotAuthorizedError } from "../middleware/mw_error_defs.js";
import { config } from "../config.js";

export async function postPolkaWebhooks(req: Request, res: Response, next: NextFunction) {
    try {
        const apiKey = getAPIKey(req);
        if (apiKey !== config.apiConfig.polkaKey) {
            throw new NotAuthorizedError("Invalid API key.");
        }

        const { event, data } = req.body;

        // Log the received event and data for debugging purposes
        console.log(`Received Polka Webhook Event: ${event}`);
        console.log(`Data: ${JSON.stringify(data)}`);

        // Process the webhook event based on its type
        switch (event) {
            case "user.upgraded":
                // Handle transaction events
                console.log("Processing user upgraded event...");
                if (data && data.userId) {
                    const userResult = await selectUserById(data.userId);
                    if (userResult) {
                        await upgradeUser(data.userId);
                        res.status(204).send(); // No content response for successful upgrade
                    } else {
                        res.status(404).send(`User with ID ${data.userId} not found.`);
                    }
                } else {
                    res.status(400).send("Invalid payload: userId is required.");
                }
                break;
            default:
                res.status(204).send(); // No content for unhandled events
                break;
        }
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
}