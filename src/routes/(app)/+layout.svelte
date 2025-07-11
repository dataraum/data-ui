<script lang="ts">
	import TopRightNav from '$lib/components/nav/top-right-nav.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
	import WorkspaceSettingsModal from '$lib/workspace/workspace-settings-modal.svelte';
	import NotYetModal from '$lib/components/nyi/not-yet-modal.svelte';
	import FileProjectBrowser from '$lib/browse/file-project-browser.svelte';
	import type { LayoutProps } from './$types';
	import '../../app.css';
	import { getAuthToken } from '$lib/auth-client';
	import { onMount } from 'svelte';

	let { data, children }: LayoutProps = $props();



	onMount(async () => {
		console.log("Token:", await getAuthToken());
	});
</script>

<section>
	<NotYetModal />
	<WorkspaceSettingsModal {data} />
</section>
<section class="bg-base-200 flex h-screen">
	<div class="flex flex-col">
		<div class="mt-2 ml-4 flex items-center justify-start pt-2 pl-4">
			<h1 class="mb-2 text-2xl font-bold">
				{data.projectForm?.data.projectName || '[PROJECT-NAME]'}
			</h1>
		</div>
		<FileProjectBrowser {data} />
	</div>
	<div class="flex-1 overflow-hidden">
		{@render children()}
	</div>
	<div class="flex w-1/5 flex-col">
		<TopRightNav />
		<SidePrompt />
	</div>
</section>
