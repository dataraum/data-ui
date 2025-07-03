<script lang="ts">
	import { getAuthToken } from '$lib/auth-client';
	import TopRightNavCatalog from '$lib/components/nav/top-right-nav-catalog.svelte';
	import UploadModal from '$lib/files/upload-modal.svelte';

	let { data } = $props();

	const loadedFiles = $state(data.files || []);
	const filesUrl = `${import.meta.env.VITE_DATARAUM_API_URL}/files`;

	async function downloadAuthenticated(e: MouseEvent, name: string) {
		e.preventDefault();
		const token = await getAuthToken();
		const anchor = e.target as HTMLAnchorElement;
		const response = await fetch(anchor.href, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
</script>

<section>
	<UploadModal {loadedFiles} />
</section>
<section class="flex flex-col justify-between">
	<div class="bg-base-200 flex w-full flex-col">
		<div class="flex flex-row justify-between">
			<div class="mt-2 flex items-center justify-start pl-4">
				<h1 class="mb-2 text-2xl font-bold">Data tables</h1>
			</div>
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
				{#each loadedFiles as file}
					<tr>
						<td>{file.name}</td>
						<td>{file.description}</td>
						<td>{JSON.stringify(file.schema)}</td>
						<td>{(Number(file.size!) / 1024).toFixed(2)} KB</td>
						<td>{file.type}</td>
						<td>
							<a
								class="link link-primary"
								href="{filesUrl}/{file.id}/data"
								onclick={(e) => downloadAuthenticated(e, file.name)}
								download={file.name}
								target="_blank"
								rel="noopener">Download</a
							>
						</td>
						<td>{new Date(file.createdAt).toLocaleString()}</td>
						<td>{new Date(file.updatedAt).toLocaleString()}</td>
					</tr>
				{/each}
				{#if loadedFiles.length === 0}
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
