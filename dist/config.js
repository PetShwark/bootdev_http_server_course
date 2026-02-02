import { NotFoundError } from "./middleware/mw_error_defs.js";
export const migrationConfig = {
    migrationsFolder: "./src/lib/db",
};
function envOrThrow(key) {
    try {
        return process.env[key];
    }
    catch (err) {
        throw new NotFoundError(`${key} environment variable not found`);
    }
}
process.loadEnvFile();
export const config = {
    apiConfig: { fileserverHits: 0, platform: envOrThrow('PLATFORM'), jwtSecret: envOrThrow('JWT_SECRET') },
    dbConfig: { dbURL: envOrThrow('DB_URL'), migrationConfig: migrationConfig }
};
