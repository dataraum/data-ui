import { json } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export async function GET({ request, url }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });

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

    const file = await prisma.files.findFirst({
        where: {
            id: fileId,
            workspaceId: session.user.workspaceId,
        },
    });

    if (!file) {
        return new Response(null, {status: 400,  statusText: "File not found" });
    }
    return json(file);

}