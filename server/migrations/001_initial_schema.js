export const shorthands = undefined;

export async function up(pgm) {

    // Enable UUID generation
    pgm.createExtension("pgcrypto", {
        ifNotExists: true
    });

    // =========================================================
    // ROLES
    // =========================================================

    pgm.createTable("roles", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        name: {
            type: "varchar(50)",
            notNull: true,
            unique: true
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });


    // =========================================================
    // USERS
    // =========================================================

    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        role_id: {
            type: "uuid",
            notNull: true,
            references: "roles(id)",
            onDelete: "RESTRICT"
        },

        name: {
            type: "varchar(120)",
            notNull: true
        },

        email: {
            type: "varchar(255)",
            notNull: true,
            unique: true
        },

        password_hash: {
            type: "text",
            notNull: true
        },

        is_active: {
            type: "boolean",
            notNull: true,
            default: true
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex("users", "role_id");


    // =========================================================
    // COMPANIES
    // =========================================================

    pgm.createTable("companies", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        name: {
            type: "varchar(255)",
            notNull: true
        },

        website: {
            type: "varchar(500)"
        },

        industry: {
            type: "varchar(150)"
        },

        size: {
            type: "varchar(50)"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex("companies", "name");


    // =========================================================
    // CONTACTS
    // =========================================================

    pgm.createTable("contacts", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        company_id: {
            type: "uuid",
            notNull: true,
            references: "companies(id)",
            onDelete: "RESTRICT"
        },

        first_name: {
            type: "varchar(100)",
            notNull: true
        },

        last_name: {
            type: "varchar(100)"
        },

        email: {
            type: "varchar(255)"
        },

        phone: {
            type: "varchar(30)"
        },

        job_title: {
            type: "varchar(150)"
        },

        is_active: {
            type: "boolean",
            notNull: true,
            default: true
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex("contacts", "company_id");
    pgm.createIndex("contacts", "email");
    pgm.createIndex("contacts", "phone");


    // =========================================================
    // LEAD STATUSES
    // =========================================================

    pgm.createTable("lead_statuses", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        name: {
            type: "varchar(50)",
            notNull: true,
            unique: true
        },

        sort_order: {
            type: "integer",
            notNull: true
        },

        is_terminal: {
            type: "boolean",
            notNull: true,
            default: false
        }
    });


    // =========================================================
    // LEAD SOURCES
    // =========================================================

    pgm.createTable("lead_sources", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        name: {
            type: "varchar(100)",
            notNull: true,
            unique: true
        },

        is_active: {
            type: "boolean",
            notNull: true,
            default: true
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });


    // =========================================================
    // LEADS
    // =========================================================

    pgm.createTable("leads", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        contact_id: {
            type: "uuid",
            notNull: true,
            references: "contacts(id)",
            onDelete: "RESTRICT"
        },

        status_id: {
            type: "uuid",
            notNull: true,
            references: "lead_statuses(id)",
            onDelete: "RESTRICT"
        },

        source_id: {
            type: "uuid",
            references: "lead_sources(id)",
            onDelete: "SET NULL"
        },

        assigned_to: {
            type: "uuid",
            references: "users(id)",
            onDelete: "SET NULL"
        },

        created_by: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "RESTRICT"
        },

        title: {
            type: "varchar(255)",
            notNull: true
        },

        description: {
            type: "text"
        },

        last_contacted_at: {
            type: "timestamptz"
        },

        last_verified_at: {
            type: "timestamptz"
        },

        merged_into: {
            type: "uuid",
            references: "leads(id)",
            onDelete: "SET NULL"
        },

        deleted_at: {
            type: "timestamptz"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex("leads", "contact_id");
    pgm.createIndex("leads", "status_id");
    pgm.createIndex("leads", "source_id");
    pgm.createIndex("leads", "assigned_to");
    pgm.createIndex("leads", "created_by");
    pgm.createIndex("leads", "created_at");
    pgm.createIndex("leads", "merged_into");


    // =========================================================
    // LEAD CONTEXT
    // =========================================================

    pgm.createTable("lead_context", {
        lead_id: {
            type: "uuid",
            primaryKey: true,
            references: "leads(id)",
            onDelete: "CASCADE"
        },

        business_need: {
            type: "text"
        },

        pain_point: {
            type: "text"
        },

        decision_maker: {
            type: "varchar(255)"
        },

        budget: {
            type: "numeric(15,2)"
        },

        objection: {
            type: "text"
        },

        next_action: {
            type: "text"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });


    // =========================================================
    // FOLLOW UPS
    // =========================================================

    pgm.createTable("follow_ups", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        lead_id: {
            type: "uuid",
            notNull: true,
            references: "leads(id)",
            onDelete: "CASCADE"
        },

        assigned_to: {
            type: "uuid",
            references: "users(id)",
            onDelete: "SET NULL"
        },

        due_at: {
            type: "timestamptz",
            notNull: true
        },

        completed_at: {
            type: "timestamptz"
        },

        status: {
            type: "varchar(20)",
            notNull: true,
            default: "PENDING"
        },

        notes: {
            type: "text"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex("follow_ups", "lead_id");
    pgm.createIndex("follow_ups", "assigned_to");
    pgm.createIndex("follow_ups", "due_at");


    // =========================================================
    // LEAD ACTIVITIES
    // =========================================================

    pgm.createTable("lead_activities", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        lead_id: {
            type: "uuid",
            notNull: true,
            references: "leads(id)",
            onDelete: "CASCADE"
        },

        user_id: {
            type: "uuid",
            references: "users(id)",
            onDelete: "SET NULL"
        },

        activity_type: {
            type: "varchar(50)",
            notNull: true
        },

        description: {
            type: "text"
        },

        metadata: {
            type: "jsonb"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex("lead_activities", "lead_id");
    pgm.createIndex("lead_activities", "user_id");
    pgm.createIndex("lead_activities", "created_at");


    // =========================================================
    // DUPLICATE CANDIDATES
    // =========================================================

    pgm.createTable("duplicate_candidates", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        lead_id: {
            type: "uuid",
            notNull: true,
            references: "leads(id)",
            onDelete: "CASCADE"
        },

        possible_duplicate_id: {
            type: "uuid",
            notNull: true,
            references: "leads(id)",
            onDelete: "CASCADE"
        },

        match_score: {
            type: "numeric(5,2)",
            notNull: true
        },

        match_reasons: {
            type: "jsonb",
            notNull: true,
            default: pgm.func("'[]'::jsonb")
        },

        status: {
            type: "varchar(20)",
            notNull: true,
            default: "PENDING"
        },

        reviewed_by: {
            type: "uuid",
            references: "users(id)",
            onDelete: "SET NULL"
        },

        reviewed_at: {
            type: "timestamptz"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex(
        "duplicate_candidates",
        ["lead_id", "possible_duplicate_id"],
        { unique: true }
    );


    // =========================================================
    // AUDIT LOGS
    // =========================================================

    pgm.createTable("audit_logs", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()")
        },

        user_id: {
            type: "uuid",
            references: "users(id)",
            onDelete: "SET NULL"
        },

        action: {
            type: "varchar(50)",
            notNull: true
        },

        entity_type: {
            type: "varchar(50)",
            notNull: true
        },

        entity_id: {
            type: "uuid",
            notNull: true
        },

        old_values: {
            type: "jsonb"
        },

        new_values: {
            type: "jsonb"
        },

        ip_address: {
            type: "inet"
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("CURRENT_TIMESTAMP")
        }
    });

    pgm.createIndex(
        "audit_logs",
        ["entity_type", "entity_id"]
    );

    pgm.createIndex(
        "audit_logs",
        "user_id"
    );
}


export async function down(pgm) {

    pgm.dropTable("audit_logs");

    pgm.dropTable("duplicate_candidates");

    pgm.dropTable("lead_activities");

    pgm.dropTable("follow_ups");

    pgm.dropTable("lead_context");

    pgm.dropTable("leads");

    pgm.dropTable("lead_sources");

    pgm.dropTable("lead_statuses");

    pgm.dropTable("contacts");

    pgm.dropTable("companies");

    pgm.dropTable("users");

    pgm.dropTable("roles");

    pgm.dropExtension("pgcrypto");
}