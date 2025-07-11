import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { VITE_DATARAUM_API_URL } from "$env/static/private";

export const load: PageServerLoad = async ({ fetch, request, params }) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });
    
    if (!session?.user.email) {
        redirect(303, `/signin`);
    }

    if (!session.user.workspaceId || session.user.workspaceId === "missing-workspace-id") {
        redirect(303, `/howdidyougethere`);
    }

    const token = await fetch('/api/auth/token', {
        method: 'GET',
        headers: request.headers,
    });

    const tokenData = await token.json() as any;

    const dataId = params.data_id;
    if (!dataId) {
        redirect(303, `/`);
    }

    const res = await fetch(`${VITE_DATARAUM_API_URL}/files/${dataId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenData.token}`
        }
    });
	const file = await res.json();

	return { file: file };
}