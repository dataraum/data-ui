<script lang="ts">
	import MdList from '$lib/markdown/md-list.svelte';
	import TopLeftNav from '$lib/components/nav/top-left-nav.svelte';
	import TopRightNav from '$lib/components/nav/top-right-nav.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
	import UploadModal from '$lib/files/upload-modal.svelte';
	import NoYetModal from '$lib/components/nyi/no-yet-modal.svelte';
	import UploadedModal from '$lib/files/uploaded-modal.svelte';
	import ProjectSettingsModal from '$lib/projects/project-settings-modal.svelte';
</script>

<!-- This is the main layout for the application, combining navigation and content areas -->
<!-- The layout is responsive and adapts to different screen sizes -->
<!-- The left side contains navigation and prompt input, while the right side displays the main content -->
<!-- The header contains the project name and navigation links -->
<!-- The content area displays a list of markdown files -->
<section>
	<UploadModal />
	<UploadedModal />
	<NoYetModal />
	<ProjectSettingsModal />
</section>
<section class="flex h-screen">
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
			<div class="dark:bg-base-300 bg-base-100 flex-1 overflow-y-auto px-4 py-2">
				<MdList />
			</div>
		</div>
	</div>
</section>
