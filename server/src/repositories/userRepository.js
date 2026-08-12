import { pool } from "../config/db.js";

const findUserByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            u.password_hash,
            u.is_active,
            r.name AS role
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.email = $1
        `,
        [email]
    );

    return result.rows[0] || null;
};

const findUserById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            u.is_active,
            r.name AS role
        FROM users u
        INNER JOIN roles r ON r.id = u.role_id
        WHERE u.id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const findRoleByName = async (roleName) => {
    const result = await pool.query(
        `
        SELECT id, name
        FROM roles
        WHERE name = $1
        `,
        [roleName]
    );

    return result.rows[0] || null;
};

const createUser = async ({
    roleId,
    name,
    email,
    passwordHash
}) => {
    const result = await pool.query(
        `
        INSERT INTO users (
            role_id,
            name,
            email,
            password_hash
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            name,
            email,
            is_active,
            created_at
        `,
        [roleId, name, email, passwordHash]
    );

    return result.rows[0];
};

export {
    findUserByEmail,
    findUserById,
    findRoleByName,
    createUser
};