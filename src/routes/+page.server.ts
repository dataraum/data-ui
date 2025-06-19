import { redirect } from "@sveltejs/kit"
import type { Actions, PageServerLoad } from "./$types"
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { z } from 'zod/v4';
import { mdDb } from "$lib/server/db";
import { projects } from "$lib/server/db/schema/meta_data";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

const projectSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(4).max(128),
  description: z.string().min(12).max(512),
  owner: z.email(),
});

const workspaceSchema = z.object({
  companyName: z.string().max(128).default('My Company'),
  companyDescription: z.string().max(512).default('This is a company description'),
  teamName: z.string().max(128).default('My Team'),
  teamDescription: z.string().max(512).default('This is a team description'),
  workspacePurpose: z.string().max(512).default('This is the purpose of the workspace'),
  workspaceOwner: z.email(),
});

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()
  console.log("Session:", session);

  if (!session?.user?.email) {
    redirect(303, `/signin`)
  }

  const projectData = await mdDb
    .select({
      id: projects.id,
      name: projects.projectName,
      description: projects.projectDescription,
      owner: projects.projectOwner,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(1);

  const project = projectData ? projectData[0] : {};
  console.log("Project Data:", project);

  const projectForm = await superValidate(project, zod4(projectSchema));
  const workspaceForm = await superValidate(zod4(workspaceSchema));

  return {
    session, projectForm, workspaceForm
  }
}

export const actions = {
  projects: async ({ request }) => {
    const projectForm = await superValidate(request, zod4(projectSchema));

    if (!projectForm.valid) return fail(400, { projectForm });

    if (projectForm.data.id) {
      await mdDb.update(projects)
        .set({
          projectName: projectForm.data.name,
          projectDescription: projectForm.data.description,
          projectOwner: projectForm.data.owner,
        })
        .where(eq(projects.id, projectForm.data.id));
      return message(projectForm, 'Project updated successfully');
    } else if (!projectForm.data.id) {
      const result = await mdDb.insert(projects).values({
        projectName: projectForm.data.name,
        projectDescription: projectForm.data.description,
        projectOwner: projectForm.data.owner,
      }).returning({ insertedId: projects.id });
      projectForm.data.id = result[0].insertedId;
      return message(projectForm, 'Project created successfully');
    }
  },

  workspace: async ({ request }) => {
    const workspaceForm = await superValidate(request, zod4(workspaceSchema));

    if (!workspaceForm.valid) return fail(400, { workspaceForm });

    // TODO: Register user
    return message(workspaceForm, 'Workspace form submitted');
  }
} satisfies Actions;