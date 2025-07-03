import prisma from '$lib/prisma';
import type { Session } from 'better-auth';
import { message } from 'sveltekit-superforms';
import { z } from 'zod/v4';

export const WorkspaceSchema = z.object({
    id: z.string().nonempty(),
    workspaceDescription: z.string().min(12).max(512).nullable(),
    workspaceOwner: z.string().nonoptional(),
});

export async function getWorkspaceData(session: Session) {
    const workspaceData = await prisma.workspace.findFirst({
        where: {
            workspaceOwner: session.userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    const workspace = workspaceData ?? {};
    return workspace;
}

export async function updateWorkspace(wspForm: any, session: Session) {
    await prisma.workspace.update({
        where: {
            id: wspForm.data.id,
            workspaceOwner: session.userId,
        },
        data: {
            workspaceDescription: wspForm.data.workspaceDescription,
        },
    });
    return message(wspForm, 'Workspace updated successfully');
}