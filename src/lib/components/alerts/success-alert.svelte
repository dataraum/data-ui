<script>
	import { CircleCheck } from 'lucide-svelte';
	const { msg } = $props();
</script>

{#if $msg}
	<div role="alert" class="alert alert-success alert-dash mt-4 py-1 px-2">
		<CircleCheck class="h-5 w-5" />
		<span>{$msg}</span>
		<button class="btn btn-sm btn-circle btn-ghost hover:btn-success" onclick={() => msg.set(null)}>
			✕
		</button>
	</div>
{/if}
