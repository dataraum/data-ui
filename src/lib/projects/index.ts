import { mdDb } from '$lib/server/db';
import { projectsTable } from '$lib/server/db/schema/meta_data';
import type { Session } from '@auth/sveltekit';
import { and, desc, eq } from 'drizzle-orm';
import { message } from 'sveltekit-superforms';
import { z } from 'zod/v4';

export const projectSchema = z.object({
    id: z.uuid().optional(),
    projectName: z.string().min(4).max(128).nullable(),
    projectDescription: z.string().min(12).max(512).nullable(),
    projectOwner: z.email(),
});

export async function getLatestProject(session: Session) {
    const projectData = await mdDb.query.projectsTable.findFirst({
        where: eq(projectsTable.projectOwner, session.user?.email!),
        orderBy: desc(projectsTable.createdAt),
    });
    const project = projectData ?? {};
    console.log("Project Data:", project);
    return project;
}

export async function saveProject(projectForm: any, session: Session) {
    if (projectForm.data.id) {
        await mdDb.update(projectsTable)
            .set({
                projectName: projectForm.data.projectName,
                projectDescription: projectForm.data.projectDescription,
                projectOwner: projectForm.data.projectOwner,
            })
            .where(
                and(
                    eq(projectsTable.id, projectForm.data.id), 
                    eq(projectsTable.projectOwner, session.user?.email!)
                ));
        return message(projectForm, 'Project updated successfully');
    } else if (projectForm.data.projectName || projectForm.data.projectDescription) {
        const result = await mdDb.insert(projectsTable).values({
            projectName: projectForm.data.projectName,
            projectDescription: projectForm.data.projectDescription,
            projectOwner: projectForm.data.projectOwner,
        }).returning({ insertedId: projectsTable.id });
        projectForm.data.id = result[0].insertedId;
        return message(projectForm, 'Project created successfully');
    }
}