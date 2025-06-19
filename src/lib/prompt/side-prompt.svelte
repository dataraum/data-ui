<script lang="ts">
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
<div class="flex-grow overflow-y-auto px-4 py-2 mt-0.5">
	<!-- Main content goes here -->
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua.
	</p>
	<p class="mt-4">
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
	<textarea
		class="bg-primary/60 flex-1 resize-none overflow-y-hidden rounded-sm p-2 mx-1.5 text-shadow-none text-primary-content text-sm focus:border-primary-focus focus:outline-none"
		rows="1"
		name="chat-input"
		bind:this={textarea}
		placeholder="Type and press Enter to send"
		onkeydown={handleKeyDown}
		oninput={autoResize}
	></textarea>
</div>
