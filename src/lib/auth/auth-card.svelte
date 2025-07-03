<script lang="ts">
	let { children, title } = $props();
</script>

<!-- This component is used to display a card with a gradient background and a title -->
<!-- It is typically used for authentication-related pages like login or registration -->
<!-- The card is centered on the screen and has a shadow effect -->
<!-- The card body contains a title and the content passed as children -->
<div
	class="from-primary/10 to-secondary/10 flex h-screen flex-col items-center justify-center bg-gradient-to-b"
>
	<div class="card bg-secondary/10 w-96 shadow-lg items-center">
		<div class="card-body">
			<h2 class="card-title">{title}</h2>
			{@render children()}
		</div>
	</div>
</div>
