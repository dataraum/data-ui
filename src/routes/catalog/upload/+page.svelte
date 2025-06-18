<script lang="ts">
	import ErrorAlert from '$lib/components/error/error-alert.svelte';
	import FileUpload from '$lib/files/file-upload.svelte';
	import { writable } from 'svelte/store';
	const error = writable<string | null>(null);
</script>

<div class="flex flex-col items-center justify-center p-4">
	<h3 class="text-lg font-bold mb-2">Drag & drop CSV, Parquet, or Arrow files</h3>
	<FileUpload {error} />
	<div class="mt-4">
		<ErrorAlert {error} />
	</div>
</div>
