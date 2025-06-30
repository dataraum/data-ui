<script lang="ts">
	let { data } = $props();
</script>

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
				{#each data.files as file}
					<tr>
						<td>{file.name}</td>
						<td>{file.description}</td>
						<td>{JSON.stringify(file.schema)}</td>
						<td>{(file.size! / 1024).toFixed(2)} KB</td>
						<td>{file.type}</td>
						<td>
							<a class="link link-primary" href="/api/files/{file.id}" download="{file.name}" target="_blank" rel="noopener"
								>Download</a
							>
						</td>
						<td>{new Date(file.createdAt).toLocaleString()}</td>
						<td>{new Date(file.updatedAt).toLocaleString()}</td>
					</tr>
				{/each}
				{#if !data.files || data.files.length === 0}
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
