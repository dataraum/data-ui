import { SvelteKitAuth, type DefaultSession } from "@auth/sveltekit"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { urDb } from "$lib/server/db"
import { accounts, sessions, users, verificationTokens } from "$lib/server/db/schema/user_roles"
import Resend from "@auth/sveltekit/providers/resend"
import { API_SECRET, AUTH_RESEND_KEY } from '$env/static/private';
import { eq } from "drizzle-orm"

// as in https://authjs.dev/getting-started/typescript
declare module "@auth/sveltekit" {
    interface Session {
        user: {
            apiToken: string
        } & DefaultSession["user"]
    }
}

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
                console.log("Session Callback:", session);
                return session;
            },
            async signIn({ user }) {
                console.log("Sign In Callback:", user);
                const signingKey = await crypto.subtle.importKey(
                    "raw",
                    Buffer.from(API_SECRET, 'base64'),
                    { name: "HMAC", hash: "SHA-256" },
                    false,
                    ["sign"]
                );
                const token = await crypto.subtle.sign(
                    "HMAC",
                    signingKey,
                    new TextEncoder().encode(user.id)
                );
                await urDb.update(users)
                    .set({ apiToken: Buffer.from(token).toString('base64url') })
                    .where(eq(users.id, user.id!));
                return true;
            }
        },
        trustHost: true,
    }
});