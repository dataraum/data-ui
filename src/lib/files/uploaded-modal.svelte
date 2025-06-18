<script>
	import BaseModal from '$lib/components/modal/base-modal.svelte';
</script>

<BaseModal id="dataUploadedModal">
	<h3 class="ml-2 text-lg font-bold">Data successfully uploaded!</h3>
	<p class="mt-2 ml-2 text-sm">
		You can now use the uploaded data in your queries.
	</p>
	<p class="mt-2 ml-2 text-sm">
		Or edit the data metadata in the <a href="/catalog" class="link">Data Catalog</a>.
	</p>
</BaseModal>
