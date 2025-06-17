<script lang="ts">
	import { SignIn } from '@auth/sveltekit/components';
	import { Mail } from 'lucide-svelte';
	import AuthCard from '$lib/auth/auth-card.svelte';
</script>

<AuthCard title="Sign in with your registered email">
	<div class="card-actions justify-end">
		<SignIn
			provider="resend"
			signInPage="signin"
			className="w-full max-w-md"
			options={{ redirectTo: '/' }}
		>
			<div slot="email">
				<label class="input validator">
					<Mail class="h-5 w-5" />
					<input type="email" placeholder="mail@site.com" name="email" required />
				</label>
				<div class="validator-hint hidden">Enter valid email address</div>
			</div>
			<div slot="submitButton" class="mt-4 ml-0.5 text-right">
				<button class="btn btn-primary">Sign In</button>
			</div>
		</SignIn>
	</div>
</AuthCard>
