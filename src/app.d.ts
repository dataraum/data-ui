// Workaround for Wrangler types not being compatible with Svelte's types
declare global {
	namespace App {
        interface Platform {
            env?: Cloudflare.Env;
        }
    }
}

export {};