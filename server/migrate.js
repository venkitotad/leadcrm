import "dotenv/config";
import { runner } from "node-pg-migrate";

const databaseUrl =
    `postgres://${encodeURIComponent(process.env.DB_USER)}:` +
    `${encodeURIComponent(process.env.DB_PASSWORD)}@` +
    `${process.env.DB_HOST}:` +
    `${process.env.DB_PORT}/` +
    `${process.env.DB_NAME}`;

await runner({
    databaseUrl,
    dir: "migrations",
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: true,
});