<script lang="ts">
	import { getAuthToken } from '$lib/auth-client';
	import { ClipboardCheck, ClipboardList, ClipboardPenLine } from 'lucide-svelte';
	import { onMount } from 'svelte';
	const { selectedData, markdown } = $props();
    let fetching = $state(false);
    const tryReports = ['analysis_proposal', 'data_report', 'summary'];
    let found = false;

	async function getReport(type: string) {
        fetching = true;
		if (!$selectedData) return;
		const fileId = $selectedData.id;
		try {
			const res = await fetch(
				`${import.meta.env.VITE_DATARAUM_API_URL}/files/${fileId}/reports/${type}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${await getAuthToken()}`
					}
				}
			);
			if (!res.ok) throw new Error('Failed to fetch report');
			const data = await res.json() as any;
            markdown.set(JSON.parse(data.data.text) || '');
            found = true;
		} catch (err) {
			console.error('Error fetching report:', err);
		} finally {
            fetching = false;
        }
	}
    onMount(() => {
		selectedData.subscribe(async (data: any) => {
			if (data) {
				for (const reportType of tryReports) {
                    await getReport(reportType);
                    if (found) {
                        break;
                    }
                }
			}
		});
    });
</script>

<div class="mt-2 flex items-center justify-start pt-2 pl-4">
	<h1 class="mb-2 text-2xl font-bold">
		{$selectedData ? $selectedData.name : ''}
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
		<li class={!$selectedData || fetching ? 'menu-disabled' : ''}>
			<button onclick={() => getReport('summary')} disabled={!$selectedData}>
				<ClipboardCheck class="h-5 w-5" /><span class="hidden lg:inline">Quality Report</span>
                {#if fetching}
				    <span class="badge badge-xs badge-info rounded-xl">fetching</span>
                {/if}
			</button>
		</li>
	</ul>
</div>
