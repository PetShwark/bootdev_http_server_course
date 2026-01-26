import { createUser } from "../lib/db/queries/users.js";
export async function handlerUsers(req, res, next) {
    try {
        const emailAddress = req.body.email;
        const userToCreate = {
            email: emailAddress
        };
        const newUser = await createUser(userToCreate);
        res.status(201).send(JSON.stringify(newUser));
    }
    catch (err) {
        next(err);
    }
}
