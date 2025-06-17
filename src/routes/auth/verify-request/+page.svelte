<script>
	import AuthCard from '$lib/auth/auth-card.svelte';
</script>

<AuthCard title="Check your email">
	<p class="text-sm">
		We have sent a sign in link to your email address. Please check your inbox and click the link to
		log in.
	</p>
	<p class="text-sm">
		If you do not receive an email, please check your spam folder or try resending the verification
		email.
	</p>
	<p class="text-sm">
		<a href="/signin" class="link">Back to Login</a>
	</p>
</AuthCard>
