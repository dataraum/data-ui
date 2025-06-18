<script lang="ts">
	import MdList from '$lib/markdown/md-list.svelte';
	import TopLeftNav from '$lib/components/nav/top-left-nav.svelte';
	import TopRightNav from '$lib/components/nav/top-right-nav.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
</script>

<div class="flex h-screen">
	<div class="dark:bg-base-100 bg-base-200 flex w-1/4 flex-col">
		<TopLeftNav />
		<SidePrompt />
	</div>
	<div class="flex-1 overflow-hidden">
		<div class="dark:bg-base-100 bg-base-200 flex h-full flex-col">
			<!-- Header -->
			<div class="flex flex-row justify-between">
				<div class="mt-2 flex items-center justify-start pl-4">
					<h1 class="mb-2 text-2xl font-bold">[PROJECT-NAME]</h1>
				</div>
				<div>
					<TopRightNav />
				</div>
			</div>
			<!-- Content Area -->
			<div class="dark:bg-base-300 bg-base-100 flex-1 overflow-y-auto py-2 px-4">
				<MdList />
			</div>
		</div>
	</div>
</div>
