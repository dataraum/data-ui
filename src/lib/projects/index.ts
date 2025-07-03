import { message } from 'sveltekit-superforms';
import { z } from 'zod/v4';
import prisma from '$lib/prisma';
import type { Session } from 'better-auth';

export const ProjectSchema = z.object({
    id: z.uuid().optional(),
    projectName: z.string().min(4).max(128).nullable(),
    projectDescription: z.string().min(12).max(512).nullable(),
    projectOwner: z.string().nonoptional(),
});

export async function getLatestProject(session: Session) {
    const projectData = await prisma.project.findFirst({
        where: {
            projectOwner: session.userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const project = projectData ?? {};
    return project;
}

export async function saveProject(projectForm: any, session: Session) {
    if (projectForm.data.id) {
        await prisma.project.update({
            where: {
                id: projectForm.data.id,
                projectOwner: session.userId, 
            },
            data: {
                projectName: projectForm.data.projectName,
                projectDescription: projectForm.data.projectDescription,
                projectOwner: projectForm.data.projectOwner,
            },
        });
        return message(projectForm, 'Project updated successfully');
    } else if (projectForm.data.projectName || projectForm.data.projectDescription) {
        const project = await prisma.project.create({
            data: {
                projectName: projectForm.data.projectName,
                projectDescription: projectForm.data.projectDescription,
                projectOwner: session.userId,
            },
        });
        projectForm.data.id = project.id;
        return message(projectForm, 'Project created successfully');
    }
}