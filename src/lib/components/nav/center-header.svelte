<script lang="ts">
	import { getAuthToken } from '$lib/auth-client';
	import { ClipboardCheck, ClipboardList, ClipboardPenLine } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const { file, markdown } = $props();
	let fetching = $state(false);
	const tryReports = ['analysis_proposal', 'data_report', 'summary'];
	let found = false;

	async function getReport(type: string) {
		fetching = true;
		console.log(`Fetching report of type: ${type} for file: ${JSON.stringify(file)}`);
		if (!file) return;
		try {
			const res = await fetch(
				`${import.meta.env.VITE_DATARAUM_API_URL}/files/${file.id}/reports/${type}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${await getAuthToken()}`
					}
				}
			);
			if (!res.ok) throw new Error('Failed to fetch report');
			const data = (await res.json()) as any;
			markdown.set(JSON.parse(data.data.text) || '');
			found = true;
		} catch (err) {
			console.error('Error fetching report:', err);
		} finally {
			fetching = false;
		}
	}

	onMount(async () => {
		if (file && file.id) {
			for (const reportType of tryReports) {
				await getReport(reportType);
				if (found) {
					break;
				}
			}
		}
	});
</script>

<div class="mt-2 flex items-center justify-start pt-2 pl-4">
	<h1 class="mb-2 text-2xl font-bold">
		{file ? file.name : 'Data Report'}
		{#if file && file.updatedAt}
			<span class="text-sm text-gray-500">
				- {new Date(file.updatedAt).toLocaleDateString(undefined, {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				})}</span
			>
		{/if}
	</h1>
</div>
<div class="flex items-center justify-end">
	<ul class="menu menu-horizontal rounded-box">
		<li class="menu-disabled">
			<button>
				<ClipboardPenLine class="h-5 w-5" /><span class="hidden lg:inline">Data Report</span>
			</button>
		</li>
	</ul>
	<ul class="menu menu-horizontal rounded-box">
		<li class="menu-disabled">
			<button>
				<ClipboardList class="h-5 w-5" /><span class="hidden lg:inline">Analysis Proposal</span>
			</button>
		</li>
	</ul>
	<ul class="menu menu-horizontal rounded-box">
		<li class={fetching ? 'menu-disabled' : ''}>
			<button onclick={() => getReport('summary')} disabled={fetching}>
				<ClipboardCheck class="h-5 w-5" /><span class="hidden lg:inline">Quality Report</span>
				{#if fetching}
					<span class="badge badge-xs badge-info rounded-xl">fetching</span>
				{/if}
			</button>
		</li>
	</ul>
</div>
