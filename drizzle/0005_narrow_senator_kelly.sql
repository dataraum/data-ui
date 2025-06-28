ALTER TABLE "user_roles"."user" DROP CONSTRAINT "user_api_token_unique";--> statement-breakpoint
ALTER TABLE "user_roles"."user" DROP COLUMN "api_token";