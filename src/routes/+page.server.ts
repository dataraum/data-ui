import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
 
export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()
  console.log("Session:", session);
 
  if (!session?.user?.email) {
    redirect(303, `/signin`)
  }
 
  return {
    session,
  }
}