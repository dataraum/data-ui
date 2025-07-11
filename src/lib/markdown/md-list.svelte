<script lang="ts">
	import { Marked } from 'marked';
	import { onMount } from 'svelte';
    const marked = new Marked({
        async: false,
        pedantic: false,
        gfm: true,
        breaks: true
    });

    const { markdown } = $props();
	
	let blockHtml = $state('');
    onMount(() => {
        markdown.subscribe((value: string) => {
            if (value) {
                blockHtml = marked.parse(value) as string;
            }
        });
    });
</script>

<div class="prose w-full max-w-none">
	{@html blockHtml}
</div>
