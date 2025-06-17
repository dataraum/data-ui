<script lang="ts">
	import TopLeftNav from '$lib/nav/top-left-nav.svelte';
	import TopRightNav from '$lib/nav/top-right-nav.svelte';
	import SidePrompt from '$lib/prompt/side-prompt.svelte';
</script>

<div class="flex h-screen">
	<div class="bg-base-200 flex w-1/4 flex-col">
		<TopLeftNav />
		<SidePrompt />
	</div>
	<div class="bg-base-100 flex-1">
		<TopRightNav />
		<h1>Welcome to SvelteKit</h1>
		<p>
			Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
		</p>
	</div>
</div>
