// @ts-ignore
import { createAuthClient } from "better-auth/svelte"

// TODO allow sign up
const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:5173",
});

export const signIn = async () => {
    const data = await authClient.signIn.social({
        provider: "github",
    });

    if (data.error) {
        console.error("Sign in error:", data.error);
        throw new Error(data.error.message || "Sign in failed");
    }

    return data;
}

export const signOut = async () => {
    return await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                location.href = "/goodbye";
            },
        },
    });
}