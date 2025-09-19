<script>
	import DishCard from '$lib/components/dishcard/dishcard.svelte';

	let { data } = $props();
</script>

<div class="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each data.menuItems as item}
		<DishCard {item} />
	{/each}
</div>