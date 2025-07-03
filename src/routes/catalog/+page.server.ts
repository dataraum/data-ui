import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const load: PageServerLoad = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user.email) {
        redirect(303, `/signin`)
    }

    if (!session.user.workspaceId || session.user.workspaceId === "missing-workspace-id") {
        redirect(303, `/howdidyougethere`);
    }

    const files = await prisma.files.findMany({
        where: {
            workspaceId: session.user.workspaceId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (!files || files.length === 0) {
        return { error: "No files found" };
    }
    return {
        files: files,
    }
}

