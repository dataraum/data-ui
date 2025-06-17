<script lang="ts">
	import { Marked } from 'marked';
    const marked = new Marked({
        async: false,
        pedantic: false,
        gfm: true,
        breaks: true
    });

	const block =
		'# Test Markdown rendering in the browser\n**This is bold text**\n**It works well** across paragaphs\n## This is a subheading\n### This is a sub-subheading\n> This is a blockquote\n\n- This is a list item\n- Another item in the list\n\n1. This is a numbered list item\n2. Another numbered item\n\n[This is a link](https://example.com)\n\n![This is an image](/favicon.png)\n\n`This is inline code`\n\n```\nThis is a code block\nwith multiple lines.\n```\n\n---\n\n* * *\n\n> This is a blockquote with a horizontal rule';

	let blockHtml = marked.parse(block) as string;
</script>

<div class="prose w-full max-w-none">
	{@html blockHtml}
</div>
