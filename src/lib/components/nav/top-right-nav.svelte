<script lang="ts">
	import { signOut } from '$lib/auth-client';
	import { House, LogOut, Share2, SlidersHorizontal, SquareLibrary } from 'lucide-svelte';
</script>

<div class="flex flex-col items-end justify-end px-2 py-2">
	<ul class="menu menu-horizontal rounded-box">
		<li>
			<a href="/" class="tooltip tooltip-right lg:tooltip-bottom" data-tip="Data Raum">
				<House class="h-5 w-5" />
			</a>
		</li>
		<li>
			<a href="/catalog" class="tooltip tooltip-right lg:tooltip-bottom" data-tip="Data Catalog">
				<SquareLibrary class="h-5 w-5" />
			</a>
		</li>
		<li>
			<button
				onclick={() =>
					(document.getElementById('noYetImplementedModal') as HTMLDialogElement).showModal()}
				class="tooltip tooltip-right lg:tooltip-bottom"
				data-tip="Shared Data"
			>
				<Share2 class="h-5 w-5" />
			</button>
		</li>
		<li>
			<button
				onclick={() =>
					(document.getElementById('workspaceSettingsModal') as HTMLDialogElement).showModal()}
					 class="tooltip tooltip-bottom" data-tip="Settings">
				<SlidersHorizontal class="h-5 w-5" />
			</button>
		</li>
		<li>
			<div class="tooltip tooltip-bottom" data-tip="Sign Out">
				<button onclick={() => signOut()} class="tooltip tooltip-bottom" data-tip="Log Out">
					<LogOut class="h-5 w-5" />
				</button>
			</div>
		</li>
	</ul>
</div>
