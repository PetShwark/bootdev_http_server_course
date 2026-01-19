export function middlewareLogResponses(req, res, next) {
    res.on('finish', () => {
        const statusCode = res.statusCode;
        if (!(statusCode >= 200 && statusCode <= 299)) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
    next();
}
