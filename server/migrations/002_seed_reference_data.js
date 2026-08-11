export async function up(pgm) {

    pgm.sql(`
        INSERT INTO roles (name)
        VALUES
            ('ADMIN'),
            ('MANAGER'),
            ('EMPLOYEE');
    `);

    pgm.sql(`
        INSERT INTO lead_statuses (name, sort_order, is_terminal)
        VALUES
            ('NEW', 1, false),
            ('CONTACTED', 2, false),
            ('QUALIFIED', 3, false),
            ('CONVERTED', 4, true),
            ('LOST', 5, true);
    `);

    pgm.sql(`
        INSERT INTO lead_sources (name)
        VALUES
            ('Website'),
            ('Referral'),
            ('LinkedIn'),
            ('Google Ads'),
            ('Facebook'),
            ('Manual'),
            ('CSV Import');
    `);
}

export async function down(pgm) {

    pgm.sql(`
        DELETE FROM lead_sources
        WHERE name IN (
            'Website',
            'Referral',
            'LinkedIn',
            'Google Ads',
            'Facebook',
            'Manual',
            'CSV Import'
        );
    `);

    pgm.sql(`
        DELETE FROM lead_statuses
        WHERE name IN (
            'NEW',
            'CONTACTED',
            'QUALIFIED',
            'CONVERTED',
            'LOST'
        );
    `);

    pgm.sql(`
        DELETE FROM roles
        WHERE name IN (
            'ADMIN',
            'MANAGER',
            'EMPLOYEE'
        );
    `);
}