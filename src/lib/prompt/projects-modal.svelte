<script lang="ts">
	// This component is used to display a modal for history
	// It uses the FileStack icon from lucide-svelte
	// The modal can be triggered by clicking the button
	// The modal can be closed by pressing the ESC key or clicking the close button
	import { FileStack } from 'lucide-svelte';

	function showModal() {
		(document.getElementById('historyModal') as HTMLDialogElement)!.showModal();
	}
</script>

<button
	class="btn btn-square bg-accent/50 border-secondary tooltip tooltip-top mr-1.5 h-10 w-10 border rounded-sm"
	data-tip="Projects"
	onclick={showModal}
>
	<FileStack class="h-5 w-5" /></button
>
<dialog id="historyModal" class="modal modal-bottom sm:modal-middle">
	<div class="modal-box rounded-lg bg-primary">
		<h3 class="text-lg font-bold">Future project list</h3>
		<p class="py-4">Press ESC key or click the button below to close</p>
		<div class="modal-action">
			<form method="dialog">
				<!-- if there is a button in form, it will close the modal -->
				<button class="btn">Close</button>
			</form>
		</div>
	</div>
</dialog>
