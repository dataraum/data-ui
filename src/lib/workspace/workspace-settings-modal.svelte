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
            <label class="label" for="wspDescription">Workspace description</label>
			<textarea
				id="wspDescription"
				class="textarea h-24 w-full"
				name="workspaceDescription"
				aria-invalid={$wspErrors.workspaceDescription ? 'true' : undefined}
				bind:value={$wspForm.workspaceDescription}
			></textarea>
			{#if $wspErrors.workspaceDescription}
                <p class="label text-error">{$wspErrors.workspaceDescription}</p>
            {/if}
			<input type="hidden" name="workspaceOwner" value={data.user.id} />
			<input type="hidden" name="id" value={$wspForm.id} />
			<button type="submit" class="btn btn-neutral mt-4">Update workspace settings</button>
		</fieldset>
	</form>
</BaseModal>