<script lang="ts">
	import { onMount } from 'svelte';
	let textarea: HTMLTextAreaElement | null = null;
	let mainContent: HTMLElement | null = null;

	function autoResize() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	}

	async function handleSend(value: string) {
		if (!value.trim()) return;
		addTextBlock(value, 'bg-primary');

		const response = await fetch('/api/ai', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		let reader = response.body?.getReader();
		let result;
		let decoder = new TextDecoder('utf8');
		let paragraph = addTextBlock('');
		while (!result?.done) {
			result = await reader?.read();
			let chunk = decoder.decode(result?.value);
			paragraph.innerText += chunk;
			mainContent?.scrollTo(0, mainContent?.scrollHeight || 0);
		}

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

	function addTextBlock(text: string, style = 'bg-primary/40') {
		mainContent?.insertAdjacentHTML(
			'beforeend',
			`<p class="mt-1 ${style} text-primary-content text-sm p-2 rounded">${text}</p>`
		);
		return mainContent?.childNodes[mainContent?.childNodes.length - 1] as HTMLParagraphElement;
	}

	onMount(() => {
		mainContent?.scrollTo(0, mainContent?.scrollHeight || 0);
		autoResize();
	});
</script>

<!-- This is the main content area -->
<div class="mt-0.5 flex-grow overflow-y-auto px-4 py-2" bind:this={mainContent}></div>
<!-- This is the chat input area -->
<!-- It contains a textarea for user input -->
<!-- The textarea automatically resizes based on content -->
<div class="items-top flex p-2">
	<!-- List icon from lucide-svelte -->
	<textarea
		class="bg-primary/60 text-primary-content focus:border-primary-focus mx-1.5 flex-1 resize-none overflow-y-hidden rounded-sm p-2 text-sm text-shadow-none focus:outline-none"
		rows="1"
		name="chat-input"
		bind:this={textarea}
		placeholder="Type and press Enter to send"
		onkeydown={handleKeyDown}
		oninput={autoResize}
	></textarea>
</div>
