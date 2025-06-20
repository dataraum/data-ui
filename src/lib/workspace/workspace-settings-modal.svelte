<script lang="ts">
	import BaseModal from '$lib/components/modal/base-modal.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();

	const {
		form: wspForm,
		errors: wspErrors,
		enhance: wspEnhance,
		message: wspMessage,
		reset: resetWspForm
	} = superForm(data.workspaceForm, {
		resetForm: true,
		invalidateAll: 'pessimistic'
	});
</script>

<BaseModal id="workspaceSettingsModal" onclose={() => resetWspForm()}>
	<form method="POST" action="?/workspace" use:wspEnhance>
		<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
			<legend class="fieldset-legend text-lg">{$wspMessage || "Workspace settings"}</legend>
            <label class="label" for="wspPurpose">Workspace purpose</label>
			<textarea
				id="wspPurpose"
				class="textarea h-24 w-full"
				name="workspacePurpose"
				aria-invalid={$wspErrors.workspacePurpose ? 'true' : undefined}
				bind:value={$wspForm.workspacePurpose}
			></textarea>
			{#if $wspErrors.workspacePurpose}
                <p class="label text-error">{$wspErrors.workspacePurpose}</p>
            {/if}
			<label class="label" for="wspCompanyName">Company name</label>
			<input
				id="wspCompanyName"
				type="text"
				class="input w-full"
				name="companyName"
				aria-invalid={$wspErrors.companyName ? 'true' : undefined}
				bind:value={$wspForm.companyName}
			/>
			{#if $wspErrors.companyName}
                <p class="label text-error">{$wspErrors.companyName}</p>
            {/if}
			<label class="label mt-2" for="wspCompanyDescription">Company description</label>
			<textarea
				id="wspCompanyDescription"
				class="textarea h-24 w-full"
				name="companyDescription"
				aria-invalid={$wspErrors.companyDescription ? 'true' : undefined}
				bind:value={$wspForm.companyDescription}
			></textarea>
			{#if $wspErrors.companyDescription}
				<p class="label text-error">{$wspErrors.companyDescription}</p>
			{/if}
            <label class="label" for="wspTeamName">Team name</label>
			<input
				id="wspTeamName"
				type="text"
				class="input w-full"
				name="teamName"
				aria-invalid={$wspErrors.teamName ? 'true' : undefined}
				bind:value={$wspForm.teamName}
			/>
			{#if $wspErrors.teamName}
                <p class="label text-error">{$wspErrors.teamName}</p>
            {/if}
			<label class="label mt-2" for="wspTeamDescription">Team description</label>
			<textarea
				id="wspTeamDescription"
				class="textarea h-24 w-full"
				name="teamDescription"
				aria-invalid={$wspErrors.teamDescription ? 'true' : undefined}
				bind:value={$wspForm.teamDescription}
			></textarea>
			{#if $wspErrors.teamDescription}
				<p class="label text-error">{$wspErrors.teamDescription}</p>
			{/if}
			<input type="hidden" name="workspaceOwner" value={data.session.user.email} />
			<input type="hidden" name="id" value={$wspForm.id} />
			<button type="submit" class="btn btn-neutral mt-4">Update workspace settings</button>
		</fieldset>
	</form>
</BaseModal>
<!-- This is a modal for workspace settings, allowing users to configure workspace details --> 
<!-- The modal includes fields for workspace purpose, company name, company description, team name, and team description -->
<!-- The form uses superforms for handling form state and validation -->