import { redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getLatestProject, projectSchema, saveProject } from "$lib/projects";
import { getWorkspaceData, workspaceSchema } from "$lib/workspace";
import { updateWorkspace } from "$lib/workspace";

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth();

  if (!session?.user?.email) {
    redirect(303, `/signin`);
  }

  const projectData = await getLatestProject(session);
  const workspaceData = await getWorkspaceData(session);

  const projectForm = await superValidate(projectData, zod4(projectSchema));
  const workspaceForm = await superValidate(workspaceData, zod4(workspaceSchema));

  return {
    user: session.user, projectForm, workspaceForm
  }
}

export const actions = {
  projects: async ({ request, locals }) => {
    const projectForm = await superValidate(request, zod4(projectSchema));

    console.log("Project Form Data:", projectForm.data);

    if (!projectForm.valid) return fail(400, { projectForm });

    return saveProject(projectForm, (await locals.auth())!);
  },

  workspace: async ({ request, locals }) => {
    const workspaceForm = await superValidate(request, zod4(workspaceSchema));

    if (!workspaceForm.valid) return fail(400, { workspaceForm });

    return updateWorkspace(workspaceForm, (await locals.auth())!);
  }
} satisfies Actions;