import { SvelteKitAuth, type DefaultSession } from "@auth/sveltekit"

// Extend the SessionUser type to include workspaceId
declare module "@auth/sveltekit" {
    interface Session {
        user: DefaultSession["user"] & {
            workspaceId?: string | null;
        }
    }
}
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { mdDb, urDb } from "$lib/server/db"
import { accounts, sessions, users, verificationTokens } from "$lib/server/db/schema/user_roles"
import Resend from "@auth/sveltekit/providers/resend"
import { AUTH_RESEND_KEY } from '$env/static/private';
import { workspaceTable } from "$lib/server/db/schema/meta_data"
import { eq } from "drizzle-orm"

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
    return {
        adapter: DrizzleAdapter(urDb, {
            usersTable: users,
            accountsTable: accounts,
            sessionsTable: sessions,
            verificationTokensTable: verificationTokens,
        }),
        providers: [
            Resend({
                apiKey: AUTH_RESEND_KEY,
                from: "no-reply@dataraum.com",
            })
        ],
        session: {
            strategy: "database"
        },
        callbacks: {
            // also returning the user id
            async session({ session }) {
                //console.log("Session Callback:", session);
                if (session.user) {
                    session.user.id = session.user.id || session.userId;
                    const wsId = await mdDb
                        .select({ id: workspaceTable.id })
                        .from(workspaceTable)
                        .where(eq(workspaceTable.workspaceOwner, session.user.id))
                    session.user.workspaceId = wsId[0]?.id || null;
                }
                return session;
            },
        },
        trustHost: true,
    }
});