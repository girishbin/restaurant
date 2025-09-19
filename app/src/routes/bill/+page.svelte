<script>
	import MenuItem from '../../lib/components/dishcard/dishcard.svelte';

	let { data } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
	{#each data.menuItems as item}
		<MenuItem {item} />
	{/each}
</div>