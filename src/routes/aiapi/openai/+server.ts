import OpenAI from "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import type { RequestHandler } from './$types';
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ locals }) => {
    const session = await locals.auth()

    if (!session?.user?.email) {
        redirect(303, `/signin`)
    }
    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });

    // Create a TransformStream to handle streaming data
    let { readable, writable } = new TransformStream();
    let writer = writable.getWriter();
    const textEncoder = new TextEncoder();

    (async () => {
        // TODO move this to a separate library
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Tell me a story" }],
            stream: true,
        });

        // loop over the data as it is streamed and write to the writeable
        for await (const part of stream) {
            writer.write(
                textEncoder.encode(part.choices[0]?.delta?.content || ""),
            );
        }
        writer.close();
    })();

    // Send the readable back to the browser
    return new Response(readable);
};