<script lang="ts">
	import BaseModal from '$lib/components/modal/base-modal.svelte';

	let name = '';
	let projectId = '';
	let description = '';
	let saving = false;
	let error = '';

	// Helper to count words
	function wordCount(text: string) {
		return text.trim().split(/\s+/).filter(Boolean).length;
	}

	async function saveProject() {
		if (!name.trim()) {
			error = 'Project name is required.';
			return;
		}
		if (name.length > 128) {
			error = 'Project name must be at most 128 characters.';
			return;
		}
		if (wordCount(description) > 400) {
			error = 'Description must be at most 400 words.';
			return;
		}
		saving = true;
		error = '';
		try {
			// Replace with your backend API endpoint
			const res = await fetch(`/api/projects/${projectId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, description })
			});
			if (!res.ok) {
				throw new Error('Failed to save project');
			}
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = 'Unknown error';
			}
		} finally {
			saving = false;
		}
	}
</script>

<BaseModal id="projectSettingsModal" onclose={() => {error = '';}}>
	<h3 class="mb-4 text-lg font-bold">Project Settings</h3>
	<form on:submit|preventDefault={saveProject}>
		<div class="form-control mb-4">
			<label class="label" for="project-name">
				<span class="label-text">Project Name</span>
			</label>
			<input
				id="project-name"
				class="input input-bordered"
				type="text"
				bind:value={name}
				maxlength="128"
				required
				placeholder="Enter project name"
			/>
			<div class="mt-1 text-xs">{name.length}/128</div>
		</div>
		<div class="form-control mb-4">
			<label class="label" for="project-description">
				<span class="label-text">Project Description</span>
			</label>
			<textarea
				id="project-description"
				class="textarea textarea-bordered"
				bind:value={description}
				rows="5"
				placeholder="Enter project description (max 400 words)"
			></textarea>
			<div class="mt-1 text-xs">{wordCount(description)}/400 words</div>
		</div>
		{#if error}
			<div class="text-error mb-2">{error}</div>
		{/if}
		<div class="modal-action">
			<button type="submit" class="btn btn-primary" disabled={saving}>
				{saving ? 'Saving...' : 'Save'}
			</button>
		</div>
	</form>
</BaseModal>
