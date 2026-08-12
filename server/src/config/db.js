import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();

        const result = await client.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                inet_server_addr() AS host,
                inet_server_port() AS port
        `);

        console.log("📊 Database Connection Details:");
        console.log(result.rows[0]);

        console.log("✅ PostgreSQL Connected");

        client.release();
    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err);
        process.exit(1);
    }
};

export { pool };
export default connectDB;