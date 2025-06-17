<script>
	import { FolderSync, House, SquareLibrary, Upload } from 'lucide-svelte';
</script>

<div class="flex flex-col items-start justify-start px-4 py-4">
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
			<a href="/upload" class="tooltip tooltip-right lg:tooltip-bottom" data-tip="Upload Data">
				<Upload class="h-5 w-5" />
			</a>
		</li>
		<li>
			<a href="/upload" class="tooltip tooltip-right lg:tooltip-bottom" data-tip="Connect Data">
				<FolderSync class="h-5 w-5" />
			</a>
		</li>
	</ul>
</div>