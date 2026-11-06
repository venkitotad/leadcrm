import { pool } from "../config/db.js";

const createCompany = async ({
    name,
    website,
    industry,
    size
}) => {
    const query = `
        INSERT INTO companies (
            name,
            website,
            industry,
            size
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const values = [
        name,
        website ?? null,
        industry ?? null,
        size ?? null
    ];

    const { rows } = await pool.query(query, values);

    return rows[0];
};

const findCompanyById = async (id) => {
    const query = `
        SELECT *
        FROM companies
        WHERE id = $1
    `;

    const { rows } = await pool.query(query, [id]);

    return rows[0] || null;
};

const findCompanyByName = async (name) => {
    const query = `
        SELECT *
        FROM companies
        WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
        LIMIT 1
    `;

    const { rows } = await pool.query(query, [name]);

    return rows[0] || null;
};

const getCompanies = async ({
    search = null,
    limit = 10,
    offset = 0
}) => {
    const query = `
        SELECT
            id,
            name,
            website,
            industry,
            size,
            created_at,
            updated_at,
            COUNT(*) OVER() AS total_count
        FROM companies
        WHERE (
            $1::text IS NULL
            OR name ILIKE '%' || $1 || '%'
        )
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3
    `;

    const values = [search, limit, offset];

    const { rows } = await pool.query(query, values);

    return {
        companies: rows,
        total: Number(rows[0]?.total_count || 0)
    };
};

const updateCompany = async ({ id, ...fields }) => {
    const allowedFields = ["name", "website", "industry", "size"];

    const updates = Object.entries(fields).filter(
        ([key, value]) =>
            allowedFields.includes(key) && value !== undefined
    );

    if (updates.length === 0) {
        return findCompanyById(id);
    }

    const setClauses = updates.map(
        ([key], index) => `${key} = $${index + 1}`
    );

    const values = updates.map(([, value]) => value);

    values.push(id);

    const query = `
        UPDATE companies
        SET ${setClauses.join(", ")},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $${values.length}
        RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    return rows[0] || null;
};