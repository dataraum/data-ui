<script lang="ts">
	import UploadModal from '$lib/files/upload-modal.svelte';
	import ProjectSettingsModal from '$lib/projects/project-settings-modal.svelte';
	import FilesList from './files-list.svelte';
	import ProjectsList from './projects-list.svelte';

	let { data } = $props();

	let loadedFiles = $state(data.files || []);
</script>

<UploadModal {loadedFiles} />
<ProjectSettingsModal {data} />
<div class="mt-0 flex-grow overflow-y-auto px-4 py-0">
	<ul class="menu menu-xs bg-base-200 rounded-box w-full max-w-xs">
		<li>
			<FilesList files={loadedFiles} />
		</li>
		<li>
			<ProjectsList projects={data.projects} />
		</li>
	</ul>
</div>
