CREATE SCHEMA "meta_data";
--> statement-breakpoint
CREATE TABLE "meta_data"."project_members" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text,
	"user_id" text,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."projects" (
	"id" text PRIMARY KEY NOT NULL,
	"project_name" text,
	"project_description" text,
	"project_owner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_project_name_unique" UNIQUE("project_name")
);
--> statement-breakpoint
CREATE TABLE "meta_data"."table_columns" (
	"id" text PRIMARY KEY NOT NULL,
	"table_id" text,
	"column_name" text NOT NULL,
	"column_type" text NOT NULL,
	"column_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."table_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"table_id" text,
	"comment_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."table_constraints" (
	"id" text PRIMARY KEY NOT NULL,
	"table_id" text,
	"constraint_name" text NOT NULL,
	"constraint_type" text NOT NULL,
	"constraint_definition" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."table_indexes" (
	"id" text PRIMARY KEY NOT NULL,
	"table_id" text,
	"index_name" text NOT NULL,
	"index_columns" text NOT NULL,
	"is_unique" text NOT NULL,
	"index_type" text NOT NULL,
	"index_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."table_relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"source_table_id" text,
	"target_table_id" text,
	"relationship_type" text NOT NULL,
	"relationship_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."table_sampled_rows" (
	"id" text PRIMARY KEY NOT NULL,
	"table_id" text,
	"row_data" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."tables" (
	"id" text PRIMARY KEY NOT NULL,
	"table_name" text NOT NULL,
	"table_type" text NOT NULL,
	"table_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meta_data"."workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"company_name" text,
	"company_description" text,
	"team_name" text,
	"team_description" text,
	"workspace_purpose" text,
	"workspace_owner" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_company_name_unique" UNIQUE("company_name")
);
--> statement-breakpoint
ALTER TABLE "meta_data"."project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "meta_data"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."project_members" ADD CONSTRAINT "project_members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user_roles"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."projects" ADD CONSTRAINT "projects_project_owner_user_id_fk" FOREIGN KEY ("project_owner") REFERENCES "user_roles"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_columns" ADD CONSTRAINT "table_columns_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_comments" ADD CONSTRAINT "table_comments_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_constraints" ADD CONSTRAINT "table_constraints_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_indexes" ADD CONSTRAINT "table_indexes_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_relationships" ADD CONSTRAINT "table_relationships_source_table_id_tables_id_fk" FOREIGN KEY ("source_table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_relationships" ADD CONSTRAINT "table_relationships_target_table_id_tables_id_fk" FOREIGN KEY ("target_table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."table_sampled_rows" ADD CONSTRAINT "table_sampled_rows_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "meta_data"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."workspace" ADD CONSTRAINT "workspace_workspace_owner_user_id_fk" FOREIGN KEY ("workspace_owner") REFERENCES "user_roles"."user"("id") ON DELETE set null ON UPDATE no action;