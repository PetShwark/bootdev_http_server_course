import { Request, Response, NextFunction } from "express";
import { NewUser } from "../lib/db/schema.js";
import { createUser } from "../lib/db/queries/users.js";

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