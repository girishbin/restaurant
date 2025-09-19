<script>
	import '../../app.css';
	import { Button } from '$lib/components/ui/button/index.js';
	import { page } from '$app/state';
	import FloatingCart from '$lib/components/FloatingCart/FloatingCart.svelte';
	import { setContext } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import { browser } from '$app/environment';

	/** @type {import('./$types').LayoutData} */
	let { children, data } = $props();

	const { categories } = data;
	const selectedCategory = $derived(page.url.searchParams.get('category'));

	let cart;

	if (browser) {
		// --- Client-side Cart Store Logic ---
		const CART_STORAGE_KEY = 'restaurant_cart';

		// Load initial state from localStorage
		let initialData = [];
		try {
			const storedCart = localStorage.getItem(CART_STORAGE_KEY);
			if (storedCart) {
				const parsedData = JSON.parse(storedCart);
				if (Array.isArray(parsedData)) {
					initialData = parsedData;
				}
			}
		} catch (error) {
			console.error('Failed to parse cart from localStorage, resetting cart.', error);
			localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted data
		}
		const items = new SvelteMap(initialData);

		// Derived values for total items and price
		const totalItems = $derived(
			Array.from(items.values()).reduce((sum, item) => sum + item.quantity, 0)
		);

		const totalPrice = $derived(
			Array.from(items.values()).reduce((sum, item) => sum + item.total, 0)
		);

		// Effect to persist cart to localStorage on any change
		$effect(() => {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(Array.from(items.entries())));
		});

		function updateItemQuantity(item, quantity) {
			if (quantity <= 0) {
				items.delete(item.id);
			} else {
				items.set(item.id, {
					...item,
					quantity,
					total: Number(item.price) * quantity
				});
			}
		}

		function addItem(item) {
			const existingItem = items.get(item.id);
			const addQuantity = item.quantity || 1;
			const newQuantity = (existingItem ? existingItem.quantity : 0) + addQuantity;
			updateItemQuantity(item, newQuantity);
		}

		function clearCart() {
			items.clear();
		}

		cart = {
			get items() { return items; },
			get totalItems() { return totalItems; },
			get totalPrice() { return totalPrice; },
			addItem,
			updateItemQuantity,
			clearCart
		};
	} else {
		// --- Server-side Dummy Cart ---
		// Provide a non-reactive, empty cart during SSR to prevent errors.
		cart = {
			items: new Map(),
			totalItems: 0,
			totalPrice: 0,
			addItem: () => {},
			updateItemQuantity: () => {},
			clearCart: () => {}
		};
	}

	setContext('cart', cart);
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

{#if page.route.id !== '/bill/checkout'}
	<FloatingCart />
{/if}