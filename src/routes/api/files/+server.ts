import type { RequestHandler } from './$types';
import { mdDb } from '$lib/server/db';
import { files } from '$lib/server/db/schema/meta_data';

async function digestFile(file: File): Promise<string> {
    const MAX_F_SIZE = 8e6; // 8MB
    const fileArrayBuffer = await file.arrayBuffer();
    if (fileArrayBuffer.byteLength < MAX_F_SIZE) {
        return quickHashToString(fileArrayBuffer);
    } else {
        const noSlices = Math.ceil(fileArrayBuffer.byteLength / MAX_F_SIZE);
        const arrBoundaries = Array.from({ length: noSlices }, (_, i) => i * MAX_F_SIZE);
        const DIGEST_LENGTH = 256; // length of SHA-256 digest in bytes
        const flattArray = new ArrayBuffer(noSlices * DIGEST_LENGTH);
        const flattView = new Uint8Array(flattArray);
        arrBoundaries.map(async (boundary, i, arr) => {
            const byteSlice =
                i < noSlices
                    ? fileArrayBuffer.slice(boundary, arr[i + 1])
                    : fileArrayBuffer.slice(boundary, fileArrayBuffer.byteLength);
            const digBuff = await quickHash(byteSlice);
            flattView.set(new Uint8Array(digBuff), i * DIGEST_LENGTH);
        });
        return quickHashToString(flattArray);
    }
}

async function quickHash(value: ArrayBuffer): Promise<Uint8Array> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', value); // quickly hash the value
    return new Uint8Array(hashBuffer); // convert buffer to byte array
}

async function quickHashToString(value: ArrayBuffer): Promise<string> {
    const hashArray = Array.from(await quickHash(value)); // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
}

export const PUT: RequestHandler = async ({ locals, request, platform }) => {
    const session = await locals.auth();

    if (!session?.user?.email) {
        return new Response(null, {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const formData = await request.formData();
    const keys = [];
    for (const [_, file] of formData.entries()) {
        if (file instanceof File) {
            const key = await digestFile(file); // create a unique key for the file
            console.log(`Key for file: ${key}`);
            await mdDb.insert(files).values({
                id: key,
                name: file.name,
                type: file.type,
                description: file.name,
                workspaceId: session.user.workspaceId,
                owner: session.user.id,
                schema: {}, // Placeholder for schema, can be updated later
                size: file.size,
                rowCount: 0, // Placeholder for row count, can be updated later
                sampledRows: {}, // Placeholder for sampled rows, can be updated later
            }).onConflictDoUpdate({
                target: files.id,
                set: {
                    name: file.name, 
                    type: file.type,
                    description: file.name,
                    workspaceId: session.user.workspaceId,
                    owner: session.user.id,
                    schema: {}, // Placeholder for schema, can be updated later
                    size: file.size,
                    rowCount: 0, // Placeholder for row count, can be updated later
                    sampledRows: {}, // Placeholder for sampled rows, can be updated later
                },
            });
            await (platform)?.env?.free_test.put(key, file);
            keys.push(key);
        }
    }

    return new Response(null, {
        status: 201,
        statusText: "File uploaded successfully",
        headers: {
            'Content-Type': 'application/json',
            'X-Uploaded-Keys': keys[0] || '',
        },
    });
}