// @ts-ignore
import { createAuthClient } from "better-auth/svelte"

const authClient = createAuthClient({
    fetchOptions: {
        onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token") // get the token from the response headers
            // Store the token securely (e.g., in localStorage)
            if(authToken){
              localStorage.setItem("bearer_token", authToken);
            }
        },
        auth: {
           type:"Bearer",
           token: () => localStorage.getItem("bearer_token") || "" // get the token from localStorage
        }
    }
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
    localStorage.removeItem("bearer_token");
    return await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                location.href = "/goodbye";
            },
        },
    });
}

export const getAuthToken = async () => {
    // const token = localStorage.getItem("authToken") as any;
    // if (token && !(Date.now() >= token.exp * 1000)) {
    //     return token;
    // }
    // let authToken: string | null = null;
    // const session = await authClient.getSession({
    //     fetchOptions: {
    //         onSuccess: (ctx) => {
    //             authToken = ctx.response.headers.get("set-auth-jwt");
    //             // if (jwt) {
    //             //     localStorage.setItem("authToken", jwt);
    //             // }
    //         },
    //     },
    // });

    // if (!session) {
    //     throw new Error("No session found");
    // }

    return localStorage.getItem("bearer_token") || "";
    //return authToken;
}