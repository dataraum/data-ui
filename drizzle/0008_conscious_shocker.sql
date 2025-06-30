ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_name" TO "name";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_type" TO "type";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_description" TO "description";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_owner" TO "owner";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_schema" TO "schema";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_size" TO "size";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_row_count" TO "row_count";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" RENAME COLUMN "table_sampled_rows" TO "sampled_rows";--> statement-breakpoint
ALTER TABLE "meta_data"."tables" DROP CONSTRAINT "tables_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."tables" DROP CONSTRAINT "tables_table_owner_user_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."tables" ADD CONSTRAINT "tables_owner_user_id_fk" FOREIGN KEY ("owner") REFERENCES "user_roles"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."tables" DROP COLUMN "project_id";