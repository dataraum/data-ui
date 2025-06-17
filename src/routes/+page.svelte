<script lang="ts">
	import MdList from '$lib/markdown/md-list.svelte';
	import TopLeftNav from '$lib/nav/top-left-nav.svelte';
	import TopRightNav from '$lib/nav/top-right-nav.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
</script>

<div class="flex h-screen">
	<div class="bg-base-100 flex w-1/4 flex-col">
		<TopLeftNav />
		<SidePrompt />
	</div>
	<div class="bg-base-300 overflow-hidden flex-1">
		<div class="flex flex-col h-full">
			<!-- Header -->
			<div class="flex flex-row justify-between">
				<div class="mt-2 flex items-center justify-start pl-4">
					<h1 class="mb-4 text-2xl font-bold">----</h1>
				</div>
				<div>
					<TopRightNav />
				</div>
			</div>
			<!-- Content Area -->
			<div class="flex-1 overflow-y-auto p-4">
				<MdList />
			</div>
		</div>
	</div>
</div>
