ALTER TABLE "meta_data"."project_members" DROP CONSTRAINT "project_members_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."projects" DROP CONSTRAINT "projects_project_owner_user_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."workspace" DROP CONSTRAINT "workspace_workspace_owner_user_id_fk";
--> statement-breakpoint
ALTER TABLE "meta_data"."project_members" ADD CONSTRAINT "project_members_user_id_user_email_fk" FOREIGN KEY ("user_id") REFERENCES "user_roles"."user"("email") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."projects" ADD CONSTRAINT "projects_project_owner_user_email_fk" FOREIGN KEY ("project_owner") REFERENCES "user_roles"."user"("email") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meta_data"."workspace" ADD CONSTRAINT "workspace_workspace_owner_user_email_fk" FOREIGN KEY ("workspace_owner") REFERENCES "user_roles"."user"("email") ON DELETE set null ON UPDATE no action;