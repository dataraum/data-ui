import { redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getLatestProject, ProjectSchema, saveProject } from "$lib/projects";
import { getWorkspaceData, WorkspaceSchema } from "$lib/workspace";
import { updateWorkspace } from "$lib/workspace";
import { auth } from "$lib/auth";

export const load: PageServerLoad = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user.email) {
        redirect(303, `/signin`);
    }

    if (!session.user.workspaceId || session.user.workspaceId === "missing-workspace-id") {
        redirect(303, `/howdidyougethere`);
    }

    const projectData = await getLatestProject(session.session);
    const workspaceData = await getWorkspaceData(session.session);

    const projectForm = await superValidate(projectData, zod4(ProjectSchema));
    const workspaceForm = await superValidate(workspaceData, zod4(WorkspaceSchema));

    return {
        user: session.user, projectForm, workspaceForm
    }
}

export const actions = {

    projects: async ({ request, locals }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        });
        const projectForm = await superValidate(request, zod4(ProjectSchema));

        console.log("Project Form Data:", projectForm.data);

        if (!projectForm.valid) return fail(400, { projectForm });

        return saveProject(projectForm, session?.session!);
    },

    workspace: async ({ request, locals }) => {
        const session = await auth.api.getSession({
            headers: request.headers
        });
        const workspaceForm = await superValidate(request, zod4(WorkspaceSchema));

        if (!workspaceForm.valid) return fail(400, { workspaceForm });

        return updateWorkspace(workspaceForm, session?.session!);
    }
} satisfies Actions;