<script>
	import '../../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import FloatingCart from '$lib/components/FloatingCart/FloatingCart.svelte';

	/** @type {import('./$types').LayoutData} */
	let { children, data } = $props();

	const { categories } = data;
	const selectedCategory = $derived(page.url.searchParams.get('category'));
</script>

<div class="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
	<div class="flex flex-wrap gap-2">
		<Button as="a" href="/bill" variant={!selectedCategory ? 'default' : 'outline'}> All </Button>
		{#each categories as category}
			<Button
				as="a"
				href={`/bill?category=${category}`}
				variant={selectedCategory === category ? 'default' : 'outline'}
			>
				{category}
			</Button>
		{/each}
	</div>
</div>

{@render children()}

<FloatingCart />