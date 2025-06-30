<script lang="ts">
	import { writable } from 'svelte/store';
	import ErrorAlert from '$lib/components/alerts/error-alert.svelte';
	import BaseModal from '$lib/components/modal/base-modal.svelte';

	import { CloudUpload } from 'lucide-svelte';

	const { addedKeys = undefined } = $props();

	const error = writable<string | null>(null);

	let fileInput: HTMLInputElement | null = null;
	let uploading = $state(0);
	let uploaded = $state(false);

	const allowed = [
		'text/csv',
		'application/vnd.apache.arrow.file',
		'application/vnd.apache.parquet',
		'.csv',
		'.parquet',
		'.arrow'
	];

	function isValidFileType(file: File) {
		return allowed.includes(file.type) || allowed.some((ext) => file.name.endsWith(ext));
	}

	async function drop(event: DragEvent) {
		event.preventDefault();
		error.set(null);
		const uploadedFiles = event.dataTransfer?.files;
		if (!uploadedFiles) return;
		const validFiles = Array.from(uploadedFiles).filter(isValidFileType);
		if (validFiles.length === 0) {
			error.set('Only CSV, Parquet, and Arrow files are allowed.');
			return;
		}
		uploading = 0;
		uploaded = false;
		try {
			for (const file of validFiles) {
				uploading += 1;
				const formData = new FormData();
				formData.append('file', file);
				fetch('/api/files', {
					method: 'PUT',
					body: formData
				}).then((response) => {
					uploading -= 1;
					if (!response.ok) {
						throw new Error(`Failed to upload ${file.name}`);
					} else if (addedKeys) {
						const key = response.headers.get('X-Uploaded-Keys');
						addedKeys?.update((currentKeys: string[]) => {
							if (key && !currentKeys.includes(key)) {
								return [...currentKeys, key];
							}
							return currentKeys;
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
		addedKeys.set([]);
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
			<div class="flex flex-col items-center mt-2">
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
