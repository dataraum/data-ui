import { mdDb } from '$lib/server/db';
import { workspaceTable } from '$lib/server/db/schema/meta_data';
import type { Session } from '@auth/sveltekit';
import { and, eq } from 'drizzle-orm';
import { message } from 'sveltekit-superforms';
import { z } from 'zod/v4';

export const workspaceSchema = z.object({
    id: z.uuid(),
    companyName: z.string().min(4).max(128).nullable(),
    companyDescription: z.string().min(12).max(512).nullable(),
    teamName: z.string().min(4).max(128).nullable(),
    teamDescription: z.string().min(12).max(512).nullable(),
    workspacePurpose: z.string().min(12).max(512).nullable(),
    workspaceOwner: z.email(),
});

export async function getWorkspaceData(session: Session) {
    const workspaceData = await mdDb.query.workspaceTable.findFirst({
        where: eq(workspaceTable.workspaceOwner, session.user?.email!),
    });
    const workspace = workspaceData ?? {};
    console.log("Workspace Data:", workspace);
    return workspace;
}

export async function updateWorkspace(wspForm: any, session: Session) {
    await mdDb.update(workspaceTable).set({
        companyName: wspForm.data.companyName,
        companyDescription: wspForm.data.companyDescription,
        teamName: wspForm.data.teamName,
        teamDescription: wspForm.data.teamDescription,
        workspacePurpose: wspForm.data.workspacePurpose,
    }).where(
        and(
            eq(workspaceTable.id, wspForm.data.id), 
            eq(workspaceTable.workspaceOwner, session.user?.email!)
        ));
    return message(wspForm, 'Workspace updated successfully');
}