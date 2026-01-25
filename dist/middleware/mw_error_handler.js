import { BadRequestError, NotAuthorizedError, ForbiddenError, NotFoundError } from "./mw_error_defs.js";
export function handlerError(err, req, res, next) {
    console.error("Uh oh, spaghetti-o");
    if (err instanceof BadRequestError) {
        res.status(400).json({
            error: err.message,
        });
    }
    else if (err instanceof NotAuthorizedError) {
        res.status(401).json({
            error: err.message,
        });
    }
    else if (err instanceof ForbiddenError) {
        res.status(403).json({
            error: err.message,
        });
    }
    else if (err instanceof NotFoundError) {
        res.status(404).json({
            error: err.message,
        });
    }
    else {
        res.status(500).json({
            error: "Something went wrong on our end",
        });
    }
}
