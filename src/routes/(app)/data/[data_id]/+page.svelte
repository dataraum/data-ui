<script lang="ts">
	import CenterHeader from '$lib/components/nav/center-header.svelte';
	import TopRightNavDetail from '$lib/components/nav/top-right-nav-detail.svelte';
	import TopRightNav from '$lib/components/nav/top-right-nav.svelte';
	import MdList from '$lib/markdown/md-list.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
	import { writable } from 'svelte/store';

	const { data } = $props();
	let markdown = writable<string | null>(null);
</script>

<div class="flex-1 overflow-hidden">
	<div class="flex h-full flex-col">
		<!-- Header -->
		<div class="flex flex-row justify-between">
			<CenterHeader {markdown} file={data.file} />
		</div>
		<!-- Content Area -->
		<div class="bg-base-100 rounded-box flex-1 overflow-y-auto px-4 py-2">
			<MdList {markdown} />
		</div>
	</div>
</div>
<div class="flex w-1/5 flex-col">
	<TopRightNavDetail />
	<SidePrompt />
</div>
