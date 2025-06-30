ALTER TABLE "meta_data"."tables" ADD COLUMN "workspace_id" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD COLUMN "project_id" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD COLUMN "table_owner" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD COLUMN "table_schema" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD COLUMN "table_size" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD COLUMN "table_row_count" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD COLUMN "table_sampled_rows" text;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD CONSTRAINT "tables_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "meta_data"."workspace"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD CONSTRAINT "tables_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "meta_data"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD CONSTRAINT "tables_table_owner_user_id_fk" FOREIGN KEY ("table_owner") REFERENCES "user_roles"."user"("id") ON DELETE set null ON UPDATE no action;