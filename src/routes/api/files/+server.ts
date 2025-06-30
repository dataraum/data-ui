import type { RequestHandler } from './$types';
import { mdDb } from '$lib/server/db';
import { files } from '$lib/server/db/schema/meta_data';
import { fileUploadSchema } from '$lib/files';

async function digestFile(file: File, salt: string): Promise<string> {
    const MAX_F_SIZE = 8e6; // 8MB
    const fileArrayBuffer = await file.arrayBuffer();
    const saltedBuffer = new TextEncoder().encode(salt + fileArrayBuffer.byteLength);
    if (fileArrayBuffer.byteLength < MAX_F_SIZE) {
        const finalBuffer = new ArrayBuffer(fileArrayBuffer.byteLength + saltedBuffer.length);
        const finalArray = new Uint8Array(finalBuffer);
        finalArray.set(new Uint8Array(fileArrayBuffer), 0);
        finalArray.set(new Uint8Array(saltedBuffer), fileArrayBuffer.byteLength);
        return quickHashToString(finalBuffer); // if file is smaller than 8MB, hash the whole file
    } else {
        const noSlices = Math.ceil(fileArrayBuffer.byteLength / MAX_F_SIZE);
        const arrBoundaries = Array.from({ length: noSlices }, (_, i) => i * MAX_F_SIZE);
        const DIGEST_LENGTH = 160; // length of SHA-1 digest in bytes
        const totalLength = noSlices * DIGEST_LENGTH;
        const flattBuffer = new ArrayBuffer(totalLength + saltedBuffer.length);
        const flattArray = new Uint8Array(flattBuffer);
        arrBoundaries.map(async (boundary, i, arr) => {
            const byteSlice =
                i < noSlices
                    ? fileArrayBuffer.slice(boundary, arr[i + 1])
                    : fileArrayBuffer.slice(boundary, fileArrayBuffer.byteLength);
            const digBuff = await quickHash(byteSlice);
            flattArray.set(new Uint8Array(digBuff), i * DIGEST_LENGTH);
        });

        flattArray.set(new Uint8Array(saltedBuffer), totalLength);
        return quickHashToString(flattBuffer);
    }
}

async function quickHash(value: ArrayBuffer): Promise<Uint8Array> {
    const hashBuffer = await crypto.subtle.digest('SHA-1', value); // quickly hash the value
    return new Uint8Array(hashBuffer); // convert buffer to byte array
}

async function quickHashToString(value: ArrayBuffer): Promise<string> {
    const hashArray = Array.from(await quickHash(value)); // convert buffer to byte array
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
}

export const PUT: RequestHandler = async ({ locals, request, platform }) => {
    const session = await locals.auth();

    if (!session?.user?.email || !session?.user?.id || !session?.user?.workspaceId) {
        return new Response(null, {
            status: 401,
            statusText: "Unauthorized",
        });
    }

    const formData = await request.formData();
    const keys = [];
    if (!platform?.env?.free_test) {
        return new Response(null, {
            status: 500,
            statusText: "File storage not available",
        });
    }
    if (!mdDb || !files) {
        return new Response(null, {
            status: 500,
            statusText: "Database not available",
        });
    }

    const result = fileUploadSchema.safeParse({ files: formData.getAll('file') });
    if (result.error) {
        return new Response(null, {
            status: 412,
            statusText: result.error.issues[0].message,
        });
    }

    for (const file of result.data.files) {
        if (file instanceof File) {
            // TODO: Store file with salted hash
            const key = await digestFile(file, session.user.workspaceId); // create a unique key for the file
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