import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../middleware/mw_error_defs.js";
import { NewUser } from "../lib/db/schema.js";
import { createUser } from "../lib/db/queries/users.js";
import { config } from "../config.js";

export async function handlerUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const emailAddress = req.body.email as string;
        const userToCreate: NewUser = {
            email: emailAddress
        }
        const newUser = await createUser(userToCreate);
        res.status(201).send(JSON.stringify(newUser));
    } catch (err) {
        next(err);
    }
}