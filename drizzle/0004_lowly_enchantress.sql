ALTER TABLE "user_roles"."user" ADD COLUMN "api_token" text;--> statement-breakpoint
ALTER TABLE "user_roles"."user" ADD CONSTRAINT "user_api_token_unique" UNIQUE("api_token");