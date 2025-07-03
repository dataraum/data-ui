import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import prisma from "./prisma";
import { createAuthMiddleware } from "better-auth/api";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        github: {
            clientId: GITHUB_CLIENT_ID as string,
            clientSecret: GITHUB_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            workspaceId: {
                type: "string",
                required: true,
            },
        }
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            console.log("Auth middleware triggered for path:", ctx.path);
            if (ctx.path.startsWith("/get-session")) {
                const session = ctx.context.session;
                if (session) {
                    const workspaceId = await prisma.workspace.findFirst({
                        where: {
                            workspaceOwner: session.user.id,
                        },
                        select: {
                            id: true,
                        },
                        cacheStrategy: {
                            ttl: 600, // Cache for 10 minutes
                            tags: ["findWorkspaceOwner"],
                        },
                    });
                    if (workspaceId) {
                        session.user.workspaceId = workspaceId.id;
                    } else {
                        session.user.workspaceId = "missing-workspace-id";
                    }
                }
            }
        }),
    },
    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => {
                    return {
                        ...user,
                        workspaceId: user.workspaceId || "missing-workspace-id",
                    }
                }
            }
        })]
});