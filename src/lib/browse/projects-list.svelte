<script lang="ts">
	import { FolderKanban, SquareKanban, SquarePlus } from 'lucide-svelte';
	const { projects } = $props();
</script>

<details open>
	<summary>
		<FolderKanban class="h-4 w-4" /><span class="text-xs font-semibold uppercase opacity-60"
			>Projects</span
		>
	</summary>
	<ul>
		<li>
			<button
				onclick={() =>
					(document.getElementById('noYetImplementedModal') as HTMLDialogElement).showModal()}
			>
				<SquarePlus class="h-4 w-4" /> <span class="font-semibold">New Project</span>
			</button>
		</li>
		{#each projects as project}
			<li>
				<button
					onclick={() =>
						(document.getElementById('projectSettingsModal') as HTMLDialogElement).showModal()}
					><SquareKanban class="h-4 w-4" />{project.projectName}</button
				>
			</li>
		{/each}
	</ul>
</details>
