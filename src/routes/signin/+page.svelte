<script lang="ts">
	import { signIn } from '$lib/auth-client';
	import AuthCard from '$lib/auth/auth-card.svelte';
</script>

<AuthCard title="Sign in with so far only GitHub">
	<div class="card-actions justify-center mt-4">
		<!-- GitHub -->
		<button class="btn border-black bg-black text-white" onclick={() => signIn()}>
			<img
				src="/github-light.svg"
				alt="GitHub logo"
				width="20"
				height="20"
				class="mr-2"
			/>
			Login with GitHub
		</button>
	</div>
</AuthCard>
