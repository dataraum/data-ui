<script lang="ts">
	import { CloudUpload } from 'lucide-svelte';
	import { writable } from 'svelte/store';

	let { error } = $props();

	let fileInput: HTMLInputElement | null = null;
	const uploading = writable(false);

	const allowed = [
		'text/csv',
		'application/vnd.apache.arrow.file',
		'application/vnd.apache.parquet',
		'.csv',
		'.parquet',
		'.arrow'
	];

	const API_UPLOAD = '/api/upload';

	function isValidFileType(file: File) {
		return allowed.includes(file.type) || allowed.some((ext) => file.name.endsWith(ext));
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		error.set(null);
		const files = event.dataTransfer?.files;
		if (!files) return;

		const validFiles = Array.from(files).filter(isValidFileType);
		if (validFiles.length === 0) {
			error.set('Only CSV, Parquet, and Arrow files are allowed.');
			return;
		}

		uploading.set(true);
		try {
			for (const file of validFiles) {
				const formData = new FormData();
				formData.append('file', file);
				const res = await fetch(API_UPLOAD, {
					method: 'POST',
					body: formData
				});
				if (!res.ok) throw new Error('Upload failed');
			}
		} catch (e) {
			error.set('Upload failed');
		} finally {
			uploading.set(false);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
	}
</script>

<button
	class="btn bg-primary/10 flex h-full w-full max-w-md flex-col items-center justify-center py-4 rounded-sm hover:bg-primary/20"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	onclick={() => fileInput?.click()}
	aria-label="File upload drop area"
>
	<CloudUpload class="h-40 w-40" />
	<span class="text-primary/90 text-sm">[or click to select files]</span>
	{#if $uploading}
		<span class="loading loading-spinner loading-md mt-4"></span>
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
				await handleDrop({ preventDefault: () => {}, dataTransfer: { files } } as DragEvent);
			}
		}}
	/>
</button>
