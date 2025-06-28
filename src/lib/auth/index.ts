import { SvelteKitAuth, type DefaultSession } from "@auth/sveltekit"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { urDb } from "$lib/server/db"
import { accounts, sessions, users, verificationTokens } from "$lib/server/db/schema/user_roles"
import Resend from "@auth/sveltekit/providers/resend"
import { AUTH_RESEND_KEY } from '$env/static/private';

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
                return session;
            },
        },
        trustHost: true,
    }
});