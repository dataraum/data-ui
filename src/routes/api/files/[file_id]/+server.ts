import { mdDb } from "$lib/server/db";
import { files } from "$lib/server/db/schema/meta_data";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals, params, platform }) => {   
    const session = await locals.auth();

    if (!session?.user?.email) {
        return new Response(null, {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const key = params.file_id;

    if (!key) {
        return new Response("File id is required", { status: 400 });
    }

    try {
        const file = await (platform)?.env?.free_test.get(key);
        if (!file) {
            return new Response("File not found", { status: 404 });
        }
        console.log("Metadata for file:", file.httpMetadata);
        return new Response(file.body, {
            headers: { 'Content-Type': file.httpMetadata?.contentType || 'application/octet-stream' },
        });
    } catch (error) {
        console.error("Error retrieving file:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}


export const DELETE: RequestHandler = async ({ locals, url, platform }) => {
    const session = await locals.auth();

    if (!session?.user?.email) {
        return new Response(null, {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const key = url.searchParams.get('file_id');

    if (!key) {
        return new Response("File id is required", { status: 400 });
    }

    try {
        await mdDb.delete(files).where(eq(files.id, key));
        await (platform)?.env?.free_test.delete(key);
        return new Response(null, {
            status: 204,
            statusText: "File deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};