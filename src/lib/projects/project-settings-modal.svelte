<script lang="ts">
	import BaseModal from '$lib/components/modal/base-modal.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();

	const {
		form: projectForm,
		errors: projectErrors,
		enhance: projectEnhance,
		message: projectMessage,
		reset: resetProjectForm
	} = superForm(data.projectForm, {
		resetForm: true,
		invalidateAll: 'pessimistic'
	});
</script>

<BaseModal id="projectSettingsModal" onclose={() => resetProjectForm()}>
	<form method="POST" action="?/projects" use:projectEnhance>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
			<legend class="fieldset-legend text-lg">{$projectMessage || "Project settings"}</legend>
			<label class="label" for="projectName">Project name</label>
			<input
				id="projectName"
				type="text"
				class="input w-full"
				name="projectName"
				aria-invalid={$projectErrors.projectName ? 'true' : undefined}
				bind:value={$projectForm.projectName}
			/>
			{#if $projectErrors.projectName}
				<p class="label text-error">{$projectErrors.projectName}</p>
			{/if}
			<label class="label mt-2" for="projectDescription">Project description</label>
			<textarea
				id="projectDescription"
				class="textarea h-24 w-full"
				name="projectDescription"
				aria-invalid={$projectErrors.projectDescription ? 'true' : undefined}
				bind:value={$projectForm.projectDescription}
			></textarea>
			{#if $projectErrors.projectDescription}
				<p class="label text-error">{$projectErrors.projectDescription}</p>
			{/if}
			<input type="hidden" name="projectOwner" value={data.session.user.email} />
			<input type="hidden" name="id" value={$projectForm.id} />
			<button type="submit" class="btn btn-neutral mt-4">Save project settings</button>
		</fieldset>
	</form>
</BaseModal>
