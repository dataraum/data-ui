<script lang="ts">
	import { getAuthToken } from '$lib/auth-client';
	import { Folder, File, FileUp, FilePlus2 } from 'lucide-svelte';

	let { files, projects } = $props();

	let loadedFiles = $state(files || []);
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

<div class="mt-0 flex-grow overflow-y-auto px-4 py-0">
	<ul class="menu menu-xs bg-base-200 rounded-box w-full max-w-xs">
		<li>
			<details open>
				<summary>
					<Folder class="h-4 w-4" /><span class="text-xs font-semibold uppercase opacity-60"
						>Data Sources</span
					>
				</summary>
				<ul>
                    <li>
                        <button
                            onclick={() => (document.getElementById('dataUploadModal') as HTMLDialogElement).showModal()}
                        >
                            <FileUp class="h-4 w-4" /> <span class="font-semibold">Upload Data</span>
                        </button>
                    </li>
					{#each files as file}
						<li>
                            <button><File class="h-4 w-4" />{file.name}</button>
							<!--details>
								<summary>
									<File class="h-4 w-4" /><a>{file.name}</a>
								</summary>
								<ul>
									<li>
										<div class="text-xs lowercase opacity-80">
											updated: {new Date(file.updatedAt).toLocaleDateString(undefined, {
												year: 'numeric',
												month: '2-digit',
												day: '2-digit'
											})}
										</div>
										<div class="text-xs lowercase opacity-80">
											<a
												class="link link-hover"
												href="{filesUrl}/{file.id}/data"
												onclick={(e) => downloadAuthenticated(e, file.name)}
												download={file.name}
												target="_blank"
												rel="noopener">download</a
											><FileDown class="h-4 w-4" />
										</div>
									</li>
								</ul>
							</details-->
						</li>
					{/each}
				</ul>
			</details>
		</li>
        <li>
			<details open>
				<summary>
					<Folder class="h-4 w-4" /><span class="text-xs font-semibold uppercase opacity-60"
						>Projects</span
					>
				</summary>
				<ul>
                    <li>
                        <button
                            onclick={() => (document.getElementById('noYetImplementedModal') as HTMLDialogElement).showModal()}
                        >
                            <FilePlus2 class="h-4 w-4" /> <span class="font-semibold">New Project</span>
                        </button>
                    </li>
					{#each projects as project}
						<li>
                            <button><File class="h-4 w-4" />{project.projectName}</button>
						</li>
					{/each}
				</ul>
			</details>
		</li>

	</ul>
</div>
