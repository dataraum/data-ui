<script lang="ts">
	import UploadModal from '$lib/files/upload-modal.svelte';
	import { writable } from 'svelte/store';

	let { data } = $props();

	const files = $state(data.files || []);

	const addedKeys = writable<string[]>([]);

	addedKeys.subscribe((value) => {
		console.log('Keys updated:', value);
		if (value.length > 0) {
			fetch(`${location.pathname}?file_id=${value[value.length - 1]}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(async (response) => {
				if (response.ok) {
					files.push(await response.json());
				}
			});
		}
	});
</script>

<UploadModal {addedKeys} />
<div class="flex flex-col p-4">
	<h2 class="mb-4 text-2xl font-semibold">Data tables</h2>
	<div class="overflow-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Schema</th>
					<th>Size</th>
					<th>Type</th>
					<th>Link</th>
					<th>Created At</th>
					<th>Updated At</th>
				</tr>
			</thead>
			<tbody>
				{#each files as file}
					<tr>
						<td>{file.name}</td>
						<td>{file.description}</td>
						<td>{JSON.stringify(file.schema)}</td>
						<td>{(file.size! / 1024).toFixed(2)} KB</td>
						<td>{file.type}</td>
						<td>
							<a
								class="link link-primary"
								href="/api/files/{file.id}"
								download={file.name}
								target="_blank"
								rel="noopener">Download</a
							>
						</td>
						<td>{new Date(file.createdAt).toLocaleString()}</td>
						<td>{new Date(file.updatedAt).toLocaleString()}</td>
					</tr>
				{/each}
				{#if files.length === 0}
					<tr>
						<td colspan="8" class="text-base-content/60 text-center">No data tables found.</td>
					</tr>
					<tr>
						<td colspan="8" class="text-base-content/60 text-center">
							<p class="text-sm">Newly added files will appear here after upload.</p>
						</td>
					</tr>
				{/if}
				<tr>
					<td colspan="8" class="text-base-content/60 text-center"
						><button
							class="btn btn-primary"
							onclick={() =>
								(document.getElementById('dataUploadModal') as HTMLDialogElement).showModal()}
							>Upload some data</button
						></td
					>
				</tr>
			</tbody>
		</table>
	</div>
</div>
