<script lang="ts">
	import { getAuthToken } from '$lib/auth-client';
	import { Ellipsis } from 'lucide-svelte';

	let { files } = $props();

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
	<ul class="list bg-base-100 rounded-box">
		<li class="p-4 pb-2 text-xs tracking-wide opacity-60">Available data sources</li>
		{#each files as file}
			<li class="list-row">
				<div class="list-col-grow">
					<div>
						<a
							class="link link-hover"
							href="{filesUrl}/{file.id}/data"
							onclick={(e) => downloadAuthenticated(e, file.name)}
							download={file.name}
							target="_blank"
							rel="noopener">{file.name}</a
						>
					</div>
					<div class="text-xs font-semibold uppercase opacity-60">
						updated: {new Date(file.updatedAt).toLocaleDateString('en-GB', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                              })}
					</div>
				</div>
				<button class="btn btn-square btn-ghost"><Ellipsis /></button>
			</li>
		{/each}
	</ul>
</div>
