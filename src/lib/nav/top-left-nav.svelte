<script>
	import { House, Share2, SquareLibrary } from 'lucide-svelte';
</script>

<div class="flex flex-col items-start justify-start px-4 py-4">
	<ul class="menu bg-primary/20 lg:menu-horizontal rounded-box">
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
			<a href="/shared" class="tooltip tooltip-right lg:tooltip-bottom" data-tip="Shared Data">
				<Share2 class="h-5 w-5" />
			</a>
		</li>
	</ul>
</div>