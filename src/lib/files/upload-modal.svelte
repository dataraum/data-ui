<script lang="ts">
	import { writable } from 'svelte/store';
	import ErrorAlert from '$lib/components/alerts/error-alert.svelte';
	import BaseModal from '$lib/components/modal/base-modal.svelte';

	import { CloudUpload } from 'lucide-svelte';
	import { allowed, fileUploadSchema } from ".";

	const { lastAddedKey = undefined } = $props();

	const error = writable<string | null>(null);

	let fileInput: HTMLInputElement | null = null;
	let uploading = $state(0);
	let uploaded = $state(false);

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
		try {
			for (const file of validFiles) {
				uploading += 1;
				if (file.size === 0) {
					error.set('File is empty');
					continue;
				}
				const formData = new FormData();
				formData.append('file', file);
				fetch('/api/files', {
					method: 'PUT',
					body: formData
				}).then((response) => {
					uploading -= 1;
					if (!response.ok) {
						error.set(`Upload failed: ${response.statusText}`);
					} else if (lastAddedKey) {
						const key = response.headers.get('X-Uploaded-Keys');
						lastAddedKey?.update((currentKey: string) => {
							return key ?? currentKey;
						});
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
		lastAddedKey.set(undefined);
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
