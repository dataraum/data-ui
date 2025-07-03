<script lang="ts">
	import { writable } from 'svelte/store';
	import ErrorAlert from '$lib/components/alerts/error-alert.svelte';
	import BaseModal from '$lib/components/modal/base-modal.svelte';

	import { CloudUpload } from 'lucide-svelte';
	import { allowed, fileUploadSchema } from '.';
	import { getAuthToken } from '$lib/auth-client';

	const { loadedFiles = undefined } = $props();

	const error = writable<string | null>(null);
	const filesUrl = `${import.meta.env.VITE_DATARAUM_API_URL}/files`;

	let fileInput: HTMLInputElement | null = null;
	let uploading = $state(0);
	let uploaded = $state(false);

	async function updateLoadedFiles(key: string, authToken: string | null) {
		fetch(`${filesUrl}/${key}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken ?? ''}`
			}
		}).then(async (response) => {
			if (response.ok) {
				const newFile = (await response.json()) as any;
				const index = loadedFiles.findIndex((file: any) => file.id === newFile.id);
				if (index === -1) {
					loadedFiles.push(newFile);
				} else {
					// Update the existing file in the array
					loadedFiles[index] = newFile;
				}
			}
		});
	}

	async function drop(event: DragEvent) {
		event.preventDefault();
		error.set(null);
		const uploadedFiles = event.dataTransfer?.files;
		if (!uploadedFiles) return;

		const result = fileUploadSchema.safeParse({ files: uploadedFiles });
		if (result.error) {
			error.set(result.error.issues[0].message);
			fileInput!.value = '';
			fileInput!.files = null;
			return;
		}
		const validFiles = result.data.files;
		uploading = 0;
		uploaded = false;

		const authToken = await getAuthToken();
		try {
			for (const file of validFiles) {
				uploading += 1;
				if (file.size === 0) {
					error.set('File is empty');
					continue;
				}
				const formData = new FormData();
				formData.append('file', file);
				fetch(filesUrl, {
					method: 'PUT',
					body: formData,
					headers: {
						Authorization: `Bearer ${authToken ?? ''}`
					}
				}).then(async (response) => {
					uploading -= 1;
					if (!response.ok) {
						error.set(`Upload failed: ${response.statusText}`);
					} else if (loadedFiles) {
						const keys = (await response.json()) as { keys: string[] };
						updateLoadedFiles(keys.keys[0], authToken);
					}
				});
			}
		} catch (e) {
			error.set('Upload failed');
		} finally {
			uploaded = true;
		}
	}

	function dragenter(e: DragEvent) {
		e.stopPropagation();
		e.preventDefault();
	}

	function dragover(e: DragEvent) {
		e.stopPropagation();
		e.preventDefault();
	}
</script>

<BaseModal
	id="dataUploadModal"
	onclose={() => {
		error.set(null);
		uploaded = false;
		uploading = 0;
		if (fileInput) {
			fileInput.value = '';
			fileInput.files = null;
		}
	}}
>
	<h3 class="ml-2 text-lg font-bold">Drag & drop CSV, Parquet, or Arrow files</h3>
	<div class="mx-2 mt-4">
		<button
			class="btn bg-primary/10 dark:bg-primary/70 hover:bg-primary/20 dark:hover:bg-primary flex h-full w-full max-w-md flex-col items-center justify-center rounded-md py-4"
			ondrop={drop}
			ondragover={dragover}
			ondragenter={dragenter}
			onclick={() => fileInput?.click()}
			aria-label="File upload drop area"
		>
			<CloudUpload class="h-40 w-40" />
			<span class="text-sm">[or click to select files]</span>
			{#if uploading > 0}
				<span class="loading loading-spinner loading-md mt-4"></span>
				<h3 class="mt-2 ml-2 text-lg font-bold">Uploading {uploading} file(s)...</h3>
			{/if}
			<input
				type="file"
				accept={allowed.join(',')}
				multiple
				class="hidden"
				bind:this={fileInput}
				onchange={async (e) => {
					const files = (e.target as HTMLInputElement).files;
					if (files) {
						await drop({ preventDefault: () => {}, dataTransfer: { files } } as DragEvent);
					}
				}}
			/>
		</button>
		{#if uploading === 0 && uploaded && location.pathname !== '/catalog'}
			<div class="mt-2 flex flex-col items-center">
				<h3 class="mt-2 ml-2 text-lg font-bold">Data successfully uploaded!</h3>
				<p class="mt-2 ml-2 text-sm">You can now use the uploaded data in your queries.</p>
				<p class="mt-2 ml-2 text-sm">
					Or edit the data metadata in the <a href="/catalog" class="link">Data Catalog</a>.
				</p>
			</div>
		{/if}
	</div>
	<div class="mx-2 mt-4"><ErrorAlert {error} /></div>
</BaseModal>
