<script lang="ts">
	import TopRightNavCatalog from '$lib/components/nav/top-right-nav-catalog.svelte';
	import UploadModal from '$lib/files/upload-modal.svelte';
	import { writable } from 'svelte/store';

	let { data } = $props();

	const files = $state(data.files || []);

	const lastAddedKey = writable<string[]>([]);

	lastAddedKey.subscribe((value) => {
		if (value && value.length > 0) {
			fetch(`${location.pathname}?file_id=${value}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(async (response) => {
				if (response.ok) {
					const newFile = (await response.json()) as any;
					const index = files.findIndex((file) => file.id === newFile.id);
					if (index === -1) {
						files.push(newFile);
					} else {
						// Update the existing file in the array
						files[index] = newFile;
					}
				}
			});
		}
	});
</script>

<section>
	<UploadModal {lastAddedKey} />
</section>
<section class="flex flex-col justify-between">
	<div class="bg-base-200 flex w-full flex-col">
		<div class="flex flex-row justify-between">
			<div class="mt-2 flex items-center justify-start pl-4">
				<h1 class="mb-2 text-2xl font-bold">Data tables</h1>
			</div>
			<!-- TopRightNavCatalog is used to display the navigation for the catalog section -->
			<TopRightNavCatalog />
		</div>
	</div>
	<div class="overflow-y-auto">
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
						<td colspan="8" class="text-base-content/60 text-center text-sm">
							<p>No data tables found. Newly added files will appear here after upload.</p>
							<p>
								<button
									onclick={() =>
										(document.getElementById('dataUploadModal') as HTMLDialogElement).showModal()}
									class="btn btn-primary mt-2"
									aria-label="Upload Data">Upload Data</button
								>
							</p>
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</section>
