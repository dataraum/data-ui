<script lang="ts">
	import { getAuthToken } from '$lib/auth-client';
	import { File, FileDown, FilePlus2, Folder } from 'lucide-svelte';
	let { files, selectedData } = $props();

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

	function setSelectedData(file: any) {
        //console.log('Setting selected data:', $inspect(file));
		if (selectedData) {
            selectedData.set(file);
        };
	}
</script>

<details open>
	<summary>
		<Folder class="h-4 w-4" /><span class="text-xs font-semibold uppercase opacity-60"
			>Data Sources</span
		>
	</summary>
	<ul>
		<li>
			<button class="flex items-center gap-1 text-left"
				onclick={() =>
					(document.getElementById('dataUploadModal') as HTMLDialogElement).showModal()}
			>
				<FilePlus2 class="h-4 w-4" /><span class="hidden lg:inline font-semibold">Add Data</span>
			</button>
		</li>
		{#each files as file}
			<li>
				<details>
					<summary>
						<button
							class="flex cursor-pointer items-center gap-1 text-left hover:underline"
							onclick={() => setSelectedData(file)}
						>
							<File class="h-4 w-4" />
							<span class="hidden lg:inline">{file.name}</span>
						</button>
					</summary>
					<ul>
						<li>
							<!--div class="text-xs lowercase opacity-80">
											updated: {new Date(file.updatedAt).toLocaleDateString(undefined, {
												year: 'numeric',
												month: '2-digit',
												day: '2-digit'
											})}
										</div-->
							<div class="text-xs lowercase opacity-80">
								<FileDown class="h-4 w-4" /><a
									class="link link-hover"
									href="{filesUrl}/{file.id}/data"
									onclick={(e) => downloadAuthenticated(e, file.name)}
									download={file.name}
									target="_blank"
									rel="noopener">download</a
								>
							</div>
						</li>
					</ul>
				</details>
			</li>
		{/each}
	</ul>
</details>
