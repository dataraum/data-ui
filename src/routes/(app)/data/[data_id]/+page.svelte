<script lang="ts">
	import CenterHeader from "$lib/components/nav/center-header.svelte";
	import MdList from "$lib/markdown/md-list.svelte";
	import { writable } from "svelte/store";
	
	
	const { data } = $props();
	let markdown = writable<string | null>(null);
</script>
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