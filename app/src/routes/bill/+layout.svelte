<script>
	import '../../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';

	let { children, data } = $props();

	const { categories } = data;
	const selectedCategory = $derived(page.url.searchParams.get('category'));
</script>

<div class="flex flex-wrap gap-2 p-4">
	<Button as="a" href="/bill" variant={!selectedCategory ? 'default' : 'outline'}> All </Button>
	{#each categories as category}
		<Button as="a" href={`/bill?category=${category}`} variant={selectedCategory === category ? 'default' : 'outline'}>
			{category}
		</Button>
	{/each}
</div>

{@render children()}