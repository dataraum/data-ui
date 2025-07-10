<script lang="ts">
	import MdList from '$lib/markdown/md-list.svelte';
	import TopRightNav from '$lib/components/nav/top-right-nav.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
	import WorkspaceSettingsModal from '$lib/workspace/workspace-settings-modal.svelte';
	import NotYetModal from '$lib/components/nyi/not-yet-modal.svelte';
	import FileProjectBrowser from '$lib/browse/file-project-browser.svelte';
	import { writable } from 'svelte/store';
	import CenterHeader from '$lib/components/nav/center-header.svelte';

	let { data } = $props();
	let selectedData = writable<any | null>(null);
	let markdown = writable<string | null>(null);
	let showHelpText = writable<boolean>(true);
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
		<FileProjectBrowser {data} {selectedData} />
	</div>
	<div class="flex-1 overflow-hidden">
		<div class="flex h-full flex-col">
			<!-- Header -->
			<div class="flex flex-row justify-between">
				<CenterHeader {selectedData} {markdown} />
			</div>
			<!-- Content Area -->
			<div class="bg-base-100 rounded-box flex-1 overflow-y-auto px-4 py-2">
				<MdList {markdown} {showHelpText} />
			</div>
		</div>
	</div>
	<div class="flex w-1/5 flex-col">
		<TopRightNav />
		<SidePrompt />
	</div>
</section>
