import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from "./$types"
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { getLatestProject, ProjectSchema } from "$lib/projects";
import { getWorkspaceData, WorkspaceSchema } from "$lib/workspace";
import { auth } from "$lib/auth";
import prisma from "$lib/prisma";

export const load: LayoutServerLoad = async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers
    });

    if (!session?.user.email) {
        redirect(303, `/signin`);
    }

    if (!session.user.workspaceId || session.user.workspaceId === "missing-workspace-id") {
        redirect(303, `/howdidyougethere`);
        // await prisma.workspace.create({
        //     data: {
        //         workspaceOwner: session.user.id,
        //     }
        // });
    }

    const [files, projects, projectForm, workspaceForm] = await Promise.all([
        prisma.files.findMany({
            where: {
                workspaceId: session.user.workspaceId,
            },
            orderBy: {
                updatedAt: 'desc',
            },
        }),
        prisma.project.findMany(),
        getLatestProject(session.session).then((projectData) => superValidate(projectData, zod4(ProjectSchema))),
        getWorkspaceData(session.session).then((workspaceData) => superValidate(workspaceData, zod4(WorkspaceSchema))),
    ]);

    return {
        user: session.user, files: files, projects: projects, projectForm, workspaceForm
    }
}

// TODO move this to API
// 
// export const actions = {

//     projects: async ({ request, locals }) => {
//         const session = await auth.api.getSession({
//             headers: request.headers
//         });
//         const projectForm = await superValidate(request, zod4(ProjectSchema));

//         console.log("Project Form Data:", projectForm.data);

//         if (!projectForm.valid) return fail(400, { projectForm });

//         return saveProject(projectForm, session?.session!);
//     },

//     workspace: async ({ request, locals }) => {
//         const session = await auth.api.getSession({
//             headers: request.headers
//         });
//         const workspaceForm = await superValidate(request, zod4(WorkspaceSchema));

//         if (!workspaceForm.valid) return fail(400, { workspaceForm });

//         return updateWorkspace(workspaceForm, session?.session!);
//     }
// } satisfies Actions;