<script lang="ts">
	import SuccessAlert from '$lib/components/alerts/success-alert.svelte';
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
		resetForm: true
	});
</script>

<BaseModal id="projectSettingsModal" onclose={() => resetProjectForm()}>
	<form method="POST" action="?/projects" use:projectEnhance>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
			<legend class="fieldset-legend text-lg">Project settings</legend>

			<label class="label" for="project-name">Project same</label>
			<input
				id="project-name"
				type="text"
				class="input w-full"
				name="name"
				aria-invalid={$projectErrors.name ? 'true' : undefined}
				bind:value={$projectForm.name}
			/>
			{#if $projectErrors.name}<p class="label text-red-300">{$projectErrors.name}</p>{/if}
			<label class="label mt-2" for="project-description">Project description</label>
			<textarea
				id="project-description"
				class="textarea h-24 w-full"
				name="description"
				aria-invalid={$projectErrors.description ? 'true' : undefined}
				bind:value={$projectForm.description}
			></textarea>
			{#if $projectErrors.description}
				<p class="label text-red-300">{$projectErrors.description}</p>
			{/if}
			<input type="hidden" name="owner" value={data.session.user.email} />
			<button type="submit" class="btn btn-neutral mt-4">Save</button>
		</fieldset>
	</form>
	<SuccessAlert msg={projectMessage} />
</BaseModal>
