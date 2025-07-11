import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch, request, params }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    request.headers.forEach((value, key) => {
        console.log(`Header: ${key} = ${value}`);
    });
    if (!session?.user.email) {
        redirect(303, `/signin`);
    }

    if (!session.user.workspaceId || session.user.workspaceId === "missing-workspace-id") {
        redirect(303, `/howdidyougethere`);
    }

    console.log(`TOken: ${session.session.token}`);

    const dataId = params.data_id;
    if (!dataId) {
        redirect(303, `/`);
    }

    const res = await fetch(`/files/${dataId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.session.token}`
        }
    });
	const file = await res.json();

	return { file: file };
}