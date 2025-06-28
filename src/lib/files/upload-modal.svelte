<script lang="ts">
	import { writable } from 'svelte/store';
	import FileUpload from './file-upload.svelte';
	import ErrorAlert from '$lib/components/alerts/error-alert.svelte';
	import BaseModal from '$lib/components/modal/base-modal.svelte';

	const error = writable<string | null>(null);
	const init = writable(true);
</script>

<BaseModal id="dataUploadModal" onclose={() => {error.set(null); init.set(true);}}>
	<h3 class="ml-2 text-lg font-bold">Drag & drop CSV, Parquet, or Arrow files</h3>
	<div class="mx-2 mt-4"><FileUpload {error} {init} /></div>
	<div class="mx-2 mt-4"><ErrorAlert {error} /></div>
</BaseModal>
