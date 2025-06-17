<script>
	import { SignOut } from '@auth/sveltekit/components';
	import { LogOut, Share2, SlidersHorizontal } from 'lucide-svelte';
</script>

<div class="flex flex-col items-end justify-end px-4 py-4">
	<ul class="menu menu-horizontal rounded-box">
		<li>
			<a href="/shared" class="tooltip tooltip-right lg:tooltip-bottom" data-tip="Shared Data">
				<Share2 class="h-5 w-5" />
			</a>
		</li>
		<li>
			<a href="/settings" class="tooltip tooltip-bottom" data-tip="Settings">
				<SlidersHorizontal class="h-5 w-5" />
			</a>
		</li>
		<li>
			<div class="tooltip tooltip-bottom" data-tip="Sign Out">
				<!-- SignOut component handles the sign out process -->
				<!-- The LogOut icon is displayed as the button -->
				<SignOut className="h-5" signOutPage="signout" options={{ redirectTo: '/auth/goodbye' }}>
					<div slot="submitButton">
						<LogOut class="h-5 w-5" />
					</div>
				</SignOut>
			</div>
		</li>
	</ul>
</div>
