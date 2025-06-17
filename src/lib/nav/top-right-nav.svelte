<script>
	import { SignOut } from '@auth/sveltekit/components';
	import { LogOut, SlidersHorizontal } from 'lucide-svelte';
</script>

<div class="flex flex-col items-end justify-end px-4 py-4">
	<ul class="menu bg-primary/20 rounded-box">
		<li>
			<a href="/settings" class="tooltip tooltip-left" data-tip="Settings">
				<SlidersHorizontal class="h-5 w-5" />
			</a>
		</li>
		<li>
			<div class="tooltip tooltip-left" data-tip="Sign Out">
				<!-- SignOut component handles the sign out process -->
				<!-- The LogOut icon is displayed as the button -->
				<SignOut signOutPage="signout" options={{ redirectTo: '/' }}>
					<div slot="submitButton">
						<LogOut class="h-5 w-5" />
					</div>
				</SignOut>
			</div>
		</li>
	</ul>
</div>
