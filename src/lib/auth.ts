import { betterAuth } from "better-auth";
import { bearer, jwt } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "$env/static/private";
import prisma from "./prisma";
import { createAuthMiddleware } from "better-auth/api";

async function getWorkspaceId(userId: string) {
    const workspaceIdResult = await prisma.workspace.findFirst({
        where: {
            workspaceOwner: userId,
        },
        select: {
            id: true,
        },
        cacheStrategy: {
            ttl: 600, // Cache for 10 minutes
            tags: ["findWorkspaceOwner"],
        },
    });
    return workspaceIdResult?.id || "missing-workspace-id";
}

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
            console.log(`Processing request for path: ${ctx.path}`);
            if (ctx.path.startsWith("/get-session")) {
                const session = ctx.context.session;
                if (session) {
                    session.user.workspaceId = await getWorkspaceId(session.user.id);
                }
                console.log(`Session user after processing: ${JSON.stringify(session?.user)}`);
            }
        }),
    },
    plugins: [
        bearer(),
        jwt({
            jwt: {
                definePayload: async ({ user }) => {
                    console.log(`Defining JWT payload for user: ${user.id}`);
                    if (!user.workspaceId) {
                        user.workspaceId = await getWorkspaceId(user.id);
                    }
                    return {
                        uid: user.id,
                        wid: user.workspaceId || "missing-workspace-id",
                    }
                }
            }
        })]
});