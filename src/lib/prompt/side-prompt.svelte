<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	let textarea: HTMLTextAreaElement | null = null;
	let mainContent: HTMLElement | null = null;

	const { user } = $props();
	let websocket: WebSocket;

	function autoResize() {
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = textarea.scrollHeight + 'px';
		}
	}

	async function handleSend(value: string) {
		if (!value.trim()) return;
		addTextBlock(value, 'bg-primary');
		if (websocket && websocket.readyState === WebSocket.OPEN) {
			const msg = JSON.stringify({ text: value, userId: user.id });
			websocket.send(msg);
		} else {
			console.error('WebSocket is not open. Cannot send message.');
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

	function addTextBlock(text:string, style = 'bg-primary/40') {
		mainContent?.insertAdjacentHTML('beforeend', `<p class="mt-1 ${style} text-primary-content text-sm p-2 rounded">${text}</p>`);
	}

	function connect(counter = 0) {
		websocket = new WebSocket(import.meta.env.VITE_API_URL + '/' + user.apiToken);
		websocket.onmessage = (event) => {
			if (!event.data) return;
			console.log('Received message:', event.data);
			const data = JSON.parse(event.data);
			console.log('Received data:', data);
			if (!data || !data.text || !data.text.trim()) return;
			addTextBlock(data.text.replace(/\n/g, '<br />'));
			mainContent?.scrollTo(0, mainContent?.scrollHeight || 0);
		};
		websocket.onopen = (event) => {
			websocket.send(JSON.stringify({ userId: user.id }));
			counter = 0; // Reset counter on successful connection
		};
		websocket.onerror = (event) => {
			console.log('ws error');
			websocket.close();
		};
		websocket.onclose = (event) => {
			console.log('ws over and out:', event);
			if (event.code === 1000) {
				console.log('WebSocket closed normally');
				return;
			} else {
				console.error('WebSocket closed with error:', event.reason);
			}
			if (event.code < 1007 && counter < 5) {
				setTimeout(function () {
					connect(counter + 1);
				}, 1000);
			}
		};
	}

	onMount(() => {
		connect();
		mainContent?.scrollTo(0, mainContent?.scrollHeight || 0);
		autoResize();
	});

	onDestroy(() => {
		websocket?.close();
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
