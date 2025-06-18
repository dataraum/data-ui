<script lang="ts">
    let { children, id, onclose = function(){} } = $props();
</script>

<dialog id="{id}" onclose={onclose} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>
		{@render children()}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
