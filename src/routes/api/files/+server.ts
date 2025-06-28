import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const session = await locals.auth()

    if (!session?.user?.email) {
        return new Response(null, {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const formData = await request.formData();
    for (const [_, value] of formData.entries()) {
        if (value instanceof File) {
            // Here you can handle the file upload, e.g., save it to a database or cloud storage
            console.log(`Received file: ${value.name}`);
            // Example: await saveFileToStorage(value);
        }
    }

    return new Response(null, {
        status: 201,
        statusText: "File uploaded successfully",
    });
}