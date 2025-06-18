<script lang="ts">
	import { writable } from 'svelte/store';
	import FileUpload from './file-upload.svelte';
	import ErrorAlert from '$lib/components/error/error-alert.svelte';
	import BaseModal from '$lib/components/modal/base-modal.svelte';

	const error = writable<string | null>(null);
</script>

<BaseModal id="dataUploadModal" onclose={() => error.set(null)}>
	<h3 class="ml-2 text-lg font-bold">Drag & drop CSV, Parquet, or Arrow files</h3>
	<div class="mx-2 mt-4"><FileUpload {error} /></div>
	<div class="mx-2 mt-4"><ErrorAlert {error} /></div>
</BaseModal>
