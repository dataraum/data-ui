ALTER TABLE "meta_data"."table_columns" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meta_data"."table_comments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meta_data"."table_constraints" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meta_data"."table_indexes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meta_data"."table_relationships" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "meta_data"."table_sampled_rows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "meta_data"."table_columns" CASCADE;--> statement-breakpoint
DROP TABLE "meta_data"."table_comments" CASCADE;--> statement-breakpoint
DROP TABLE "meta_data"."table_constraints" CASCADE;--> statement-breakpoint
DROP TABLE "meta_data"."table_indexes" CASCADE;--> statement-breakpoint
DROP TABLE "meta_data"."table_relationships" CASCADE;--> statement-breakpoint
DROP TABLE "meta_data"."table_sampled_rows" CASCADE;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME TO "files";--> statement-breakpoint
ALTER TABLE "meta_data"."files" DROP CONSTRAINT "tables_id_unique";--> statement-breakpoint
ALTER TABLE "meta_data"."files" DROP CONSTRAINT "tables_workspace_id_workspace_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."files" DROP CONSTRAINT "tables_owner_user_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."files" ADD CONSTRAINT "files_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "meta_data"."workspace"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."files" ADD CONSTRAINT "files_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "user_roles"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."files" ADD CONSTRAINT "files_id_unique" UNIQUE("id");