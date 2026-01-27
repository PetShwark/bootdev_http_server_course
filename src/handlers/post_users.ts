import { Request, Response, NextFunction } from "express";
import { hash, verify } from "argon2";
import { NewUser } from "../lib/db/schema.js";
import { createUser, selectUserByEmail } from "../lib/db/queries/users.js";
import { NotAuthorizedError } from "../middleware/mw_error_defs.js";

type ResponseNewUser = Omit<NewUser, "hashed_password">;

export async function handlerUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const emailAddress = req.body.email as string;
        const password = req.body.password as string;
        const hashedPassword = await hash(password);
        const userToCreate: NewUser = {
            email: emailAddress,
            hashedPassword: hashedPassword
        }
        const newUser = await createUser(userToCreate);
        const responseUser: ResponseNewUser = {
            id: newUser.id,
            createdAt: newUser.createdAt,
            email: newUser.email,
            updatedAt: newUser.updatedAt
        }
        res.status(201).send(JSON.stringify(responseUser));
    } catch (err) {
        next(err);
    }
}

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const emailAddress = req.body.email as string;
        const password = req.body.password as string;
        const selectedUser = await selectUserByEmail(emailAddress);
        let authorized = true;
        if (typeof selectedUser !== "object") {
            authorized = false;
        } else if (!("id" in selectedUser)) {
            authorized = false;
        } else {
            const userHashedPassword = selectedUser.hashedPassword ?? "";
            const passwordMatch = await verify(userHashedPassword, password)
            if (!passwordMatch) {
                authorized = false;
            }
        }
        if (authorized) {
            const responseUser: ResponseNewUser = {
                id: selectedUser.id,
                createdAt: selectedUser.createdAt,
                updatedAt: selectedUser.updatedAt,
                email: selectedUser.email
            }
            res.status(200).send(JSON.stringify(responseUser));
        } else {
            throw new NotAuthorizedError("Incorrect email or password.");
        }
    } catch (err) {
        next(err);
    }
}