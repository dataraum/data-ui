<script lang="ts">
	import { CircleAlert, CloudUpload } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let fileInput: HTMLInputElement | null = null;

	type FileMeta = {
		name: string;
		url: string;
		size: number;
		type: string;
		uploadedAt: string;
	};

	const uploadedFiles = writable<FileMeta[]>([]);
	const uploading = writable(false);
	const error = writable<string | null>(null);

	const allowed = [
		'text/csv',
		'application/vnd.apache.arrow.file',
		'application/vnd.apache.parquet',
		'.csv',
		'.parquet',
		'.arrow'
	];

	// Replace with your backend endpoints
	const API_LIST = '/api/files';
	const API_UPLOAD = '/api/upload';

	async function fetchFiles() {
		try {
			const res = await fetch(API_LIST);
			if (!res.ok) throw new Error('Failed to fetch files');
			const files = await res.json();
			// Ensure files is an array of FileMeta
			uploadedFiles.set(files as FileMeta[]);
		} catch (e) {
			error.set('Could not load files');
		}
	}

	onMount(() => {
		fetchFiles();
	});

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
			await fetchFiles();
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

<div class="flex flex-col items-center justify-center p-4">
	<button
		class="btn border-primary/30 bg-primary/10 flex h-full w-full max-w-md flex-col items-center justify-center"
		ondrop={handleDrop}
		ondragover={handleDragOver}
		onclick={() => fileInput?.click()}
		aria-label="File upload drop area"
	>
		<CloudUpload class="h-72 w-72" />
		<span class="text-primary/60 text-lg">Drag & drop CSV, Parquet, or Arrow files here</span>
		<span class="text-primary/60 text-sm">or click to select files</span>
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
	{#if $error}
		<div role="alert" class="alert alert-error">
			<CircleAlert class="h-6 w-6" />
			<span>{$error}</span>
			<button class="btn btn-sm btn-circle btn-ghost" onclick={() => error.set(null)}> ✕ </button>
		</div>
	{/if}

	<div class="mt-10">
		<h2 class="mb-4 text-2xl font-semibold">Uploaded Files</h2>
		<div class="overflow-x-auto">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Name</th>
						<th>Size</th>
						<th>Type</th>
						<th>Uploaded At</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>
					{#each $uploadedFiles as file}
						<tr>
							<td>{file.name}</td>
							<td>{(file.size / 1024).toFixed(2)} KB</td>
							<td>{file.type}</td>
							<td>{new Date(file.uploadedAt).toLocaleString()}</td>
							<td>
								<a class="link link-primary" href={file.url} target="_blank" rel="noopener"
									>Download</a
								>
							</td>
						</tr>
					{/each}
					{#if $uploadedFiles.length === 0}
						<tr>
							<td colspan="5" class="text-base-content/60 text-center">No files uploaded yet.</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
