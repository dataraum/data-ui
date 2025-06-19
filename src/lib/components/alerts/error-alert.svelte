<script lang="ts">
	import { CircleAlert } from 'lucide-svelte';
	let { error } = $props();
</script>

{#if $error}
	<div role="alert" class="alert alert-error">
		<CircleAlert class="h-5 w-5" />
		<span>{$error}</span>
		<button class="btn btn-sm btn-circle btn-ghost hover:btn-error" onclick={() => error.set(null)}>
			✕
		</button>
	</div>
{/if}
