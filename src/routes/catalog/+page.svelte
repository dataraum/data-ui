<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	type ColumnMeta = {
		name: string;
		description: string;
		type: string;
		createdAt: string;
		updatedAt: string;
	};

	type TableMeta = {
		name: string;
		description: string;
		uri: string;
		size: number;
		type: string;
		columns: ColumnMeta[];
		createdAt: string;
		updatedAt: string;
	};

	const dataFiles = writable<TableMeta[]>([]);
	const error = writable<string | null>(null);

	// Replace with your backend endpoints
	const API_LIST = '/api/files';

	async function fetchFiles() {
		try {
			const res = await fetch(API_LIST);
			if (!res.ok) throw new Error('Failed to fetch files');
			const files = await res.json();
			// Ensure files is an array of FileMeta
			dataFiles.set(files as TableMeta[]);
		} catch (e) {
			error.set('Could not load files');
		}
	}

	onMount(() => {
		fetchFiles();
	});
</script>

<div class="flex flex-col p-4">
	<h2 class="mb-4 text-2xl font-semibold">Data tables</h2>
	<div class="overflow-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Columns</th>
					<th>Size</th>
					<th>Type</th>
					<th>Link</th>
					<th>Created At</th>
					<th>Updated At</th>
				</tr>
			</thead>
			<tbody>
				{#each $dataFiles as file}
					<tr>
						<td>{file.name}</td>
						<td>{file.description}</td>
						<td>{file.columns}</td>
						<td>{(file.size / 1024).toFixed(2)} KB</td>
						<td>{file.type}</td>
						<td>
							<a class="link link-primary" href={file.uri} target="_blank" rel="noopener"
								>Download</a
							>
						</td>
						<td>{new Date(file.createdAt).toLocaleString()}</td>
						<td>{new Date(file.updatedAt).toLocaleString()}</td>
					</tr>
				{/each}
				{#if $dataFiles.length === 0}
					<tr>
						<td colspan="8" class="text-base-content/60 text-center"
							>No data yet. <a href="/catalog/upload" class="link">Upload some data!</a></td
						>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
