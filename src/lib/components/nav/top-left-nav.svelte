<script lang="ts">
	import { FileStack, FolderOpenDot, FolderSync, FolderUp } from 'lucide-svelte';
</script>

<div class="flex flex-col items-start justify-start px-2 py-2">
	<ul class="menu menu-horizontal rounded-box">
		<li>
			<button
				onclick={() =>
					(document.getElementById('noYetImplementedModal') as HTMLDialogElement).showModal()}
				class="tooltip tooltip-right lg:tooltip-bottom"
				data-tip="Projects"
			>
				<FileStack class="h-5 w-5" />
			</button>
		</li>
		<li>
			<button
				onclick={() =>
					(document.getElementById('projectSettingsModal') as HTMLDialogElement).showModal()}
				class="tooltip tooltip-right lg:tooltip-bottom"
				data-tip="Project Settings"
			>
				<FolderOpenDot class="h-5 w-5" />
			</button>
		</li>
		<li>
			<button
				onclick={() =>
					(document.getElementById('dataUploadModal') as HTMLDialogElement).showModal()}
				class="tooltip tooltip-right lg:tooltip-bottom"
				data-tip="Upload Data"
			>
				<FolderUp class="h-5 w-5" />
			</button>
		</li>
		<li>
			<button
				onclick={() =>
					(document.getElementById('noYetImplementedModal') as HTMLDialogElement).showModal()}
				class="tooltip tooltip-right lg:tooltip-bottom"
				data-tip="Connect Data"
			>
				<FolderSync class="h-5 w-5" />
			</button>
		</li>
	</ul>
</div>
