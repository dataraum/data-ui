<script lang="ts">
	import { List } from 'lucide-svelte';

	import { onMount } from 'svelte';
	let textarea: HTMLTextAreaElement | null = null;

	function autoResize() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	}

	async function handleSend(value: string) {
		if (!value.trim()) return;
		await fetch('/api/your-endpoint', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: value })
		});
		if (textarea) {
			textarea.value = '';
			autoResize();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			if (textarea) {
				handleSend(textarea.value);
			}
		}
	}

	onMount(() => {
		autoResize();
	});
</script>

<!-- This is the main content area -->
<div class="flex-grow overflow-y-auto p-4">
	<!-- Main content goes here -->
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
</div>
<!-- This is the chat input area -->
<!-- It contains a textarea for user input -->
<!-- The textarea automatically resizes based on content -->
<div class="items-top flex p-2">
	<!-- List icon from lucide-svelte -->
	<List class="mt-1.5 mr-2 h-5 w-5" />
	<textarea
		class="border-primary/30 bg-primary/10 flex-1 resize-none overflow-y-hidden rounded border p-2"
		rows="1"
		bind:this={textarea}
		placeholder="Type and press Enter to send"
		on:keydown={handleKeyDown}
		on:input={autoResize}
	></textarea>
</div>
