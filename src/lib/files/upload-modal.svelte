<script lang="ts">
	import { writable } from 'svelte/store';
	import FileUpload from './file-upload.svelte';
	import ErrorAlert from '$lib/components/error/error-alert.svelte';

	const error = writable<string | null>(null);
</script>

<dialog id="dataUploadModal" class="modal" onclose={() => error.set(null)}>
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		<h3 class="text-lg font-bold ml-2">Drag & drop CSV, Parquet, or Arrow files</h3>
		<div class="mx-2 mt-4"><FileUpload {error} /></div>
		<div class="mx-2 mt-4"><ErrorAlert {error} /></div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
