import { mdDb } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export async function GET({ locals, url }) {
    const session = await locals.auth()

    if (!session?.user?.email) {
        redirect(303, `/signin`)
    }

    if (!session.user.workspaceId) {
        throw new Error("User workspaceId is missing");
    }

    const fileId = url.searchParams.get("file_id");

    if (!fileId || typeof fileId !== "string") {
        return new Response(null, { status: 400, statusText: "Missing or invalid file_id" });
    }

    const file = await mdDb.query.files.findFirst({
        where: (files, { eq, and }) =>
            and(
                eq(files.id, fileId),
                eq(files.workspaceId, session.user.workspaceId!)
            ),
    });

    if (!file) {
        return new Response(null, {status: 400,  statusText: "File not found" });
    }
    return json(file);

}