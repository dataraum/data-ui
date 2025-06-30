import { sql } from "drizzle-orm";
import {
    timestamp,
    text,
    pgSchema,
    bigint,
    json,
    integer,
} from "drizzle-orm/pg-core"
import { users } from "./user_roles";

export const mdSchema = pgSchema("meta_data");

export const projectsTable = mdSchema.table("projects", {
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
        .$onUpdate(() => new Date()),
});

export const projectMembers = mdSchema.table("project_members", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    projectId: text("project_id")
        .references(() => projectsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
        .references(() => users.id, { onDelete: "set null" }),
    role: text("role").notNull(),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => new Date()),
});

// TODO: This could be split into multiple tables 
// e.g. team, company, etc.
export const workspaceTable = mdSchema.table("workspace", {
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
        .$onUpdate(() => new Date()),
});

// TODO: Tables could bbe linked to projects or workspaces, or teams
export const files = mdSchema.table("files", {
    id: text("id")
        .primaryKey()
        .unique().notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    description: text("description"),
    workspaceId: text("workspace_id")
        .references(() => workspaceTable.id, { onDelete: "set null" }),
    owner: text("owner")
        .references(() => users.id, { onDelete: "set null" }),
    schema: json("schema"),
    size: bigint({ mode: 'number' }).default(0),
    rowCount: integer("row_count"),
    sampledRows: json("sampled_rows"),
    createdAt: timestamp("created_at", { mode: "date" })
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at", { mode: "date" })
        .notNull()
        .default(sql`now()`)
        .$onUpdate(() => new Date()),
});


