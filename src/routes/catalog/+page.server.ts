import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { mdDb } from "$lib/server/db";

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.auth()

  if (!session?.user?.email) {
    redirect(303, `/signin`)
  }

  if (!session.user.workspaceId) {
    throw new Error("User workspaceId is missing");
  }

  const files = await mdDb.query.files.findMany({
    where: (files, { eq }) => eq(files.workspaceId, session.user.workspaceId!),
    orderBy: (files, { desc }) => desc(files.createdAt),
  });
  if (!files || files.length === 0) {
    return { error: "No files found" };
  }
  return {
    files: files,
  }
}

