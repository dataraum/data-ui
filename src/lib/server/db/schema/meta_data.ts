import { sql } from "drizzle-orm";
import {
    timestamp,
    text,
    pgSchema,
} from "drizzle-orm/pg-core"
import { users } from "./user_roles";

export const mdSchema = pgSchema("meta_data");

export const projects = mdSchema.table("projects", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectName: text("project_name").unique(),
    projectDescription: text("project_description"),
    projectOwner: text("project_owner")
        .references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const projectMembers = mdSchema.table("project_members", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
        .references(() => projects.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "set null" }),
    role: text("role").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

// TODO: This could be split into multiple tables 
// e.g. personal, team, company, etc.
export const workspace = mdSchema.table("workspace", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    companyName: text("company_name").unique(),
    companyDescription: text("company_description"),
    teamName: text("team_name"),
    teamDescription: text("team_description"),
    workspacePurpose: text("workspace_purpose"),
    workspaceOwner: text("workspace_owner")
        .references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

// TODO: Tables could bbe linked to projects or workspaces, or teams
export const tables = mdSchema.table("tables", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tableName: text("table_name").notNull(),
    tableType: text("table_type").notNull(),
    tableDescription: text("table_description"),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const tableColumns = mdSchema.table("table_columns", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tableId: text("table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    columnName: text("column_name").notNull(),
    columnType: text("column_type").notNull(),
    columnDescription: text("column_description"),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const tableSampledRows = mdSchema.table("table_sampled_rows", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tableId: text("table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    rowData: text("row_data").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const tableRelationships = mdSchema.table("table_relationships", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    sourceTableId: text("source_table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    targetTableId: text("target_table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    relationshipType: text("relationship_type").notNull(),
    relationshipDescription: text("relationship_description"),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const tableIndexes = mdSchema.table("table_indexes", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tableId: text("table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    indexName: text("index_name").notNull(),
    indexColumns: text("index_columns").notNull(),
    isUnique: text("is_unique").notNull(),
    indexType: text("index_type").notNull(),
    indexDescription: text("index_description"),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const tableConstraints = mdSchema.table("table_constraints", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tableId: text("table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    constraintName: text("constraint_name").notNull(),
    constraintType: text("constraint_type").notNull(),
    constraintDefinition: text("constraint_definition").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
});

export const tableComments = mdSchema.table("table_comments", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    tableId: text("table_id")
        .references(() => tables.id, { onDelete: "cascade" }),
    commentText: text("comment_text").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => sql`now()`),
}); 