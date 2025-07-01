<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import '../app.css';
	import { closeConnection } from '$lib/sql-engine';

	let { children } = $props();

	onMount(async () => {
		// Initialize any necessary resources or connections here
		try {
			await (await import('$lib/sql-engine')).initSqlEngine(); // Call the function to initialize the SQL engine
		} catch (error) {
			console.error('Failed to initialize SQL engine:', error);
		}
	});

	onDestroy(async () => {
		await closeConnection();
	});
</script>

{@render children()}
