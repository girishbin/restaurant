<script>
	import { getContext } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Minus, Plus } from 'lucide-svelte';

	/** @type {{ id: number, name: string, description: string, price: string, category: string, imageUrl: string | null }} */
	let { item } = $props();

	const cart = getContext('cart');

	// This derived value is now safe because `cart` is guaranteed to be defined.
	// During SSR, it will be an empty, non-reactive map.
	const cartItem = $derived(cart.items.get(item.id));
	const quantity = $derived(cartItem?.quantity ?? 0);

	function addToCart() {
		cart.addItem(item);
	}

	function increment() {
		cart.updateItemQuantity(item, quantity + 1);
	}

	function decrement() {
		cart.updateItemQuantity(item, quantity - 1);
	}
</script>

<Card class="flex flex-col">
	{#if item.imageUrl}
		<div class="aspect-video overflow-hidden rounded-t-lg">
			<img
				src={item.imageUrl}
				alt={item.name}
				class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
			/>
		</div>
	{/if}
	<CardHeader class="p-3">
		<CardTitle class="text-base">{item.name}</CardTitle>
	</CardHeader>
	<CardContent class="flex-grow p-3 text-sm">
		<p class="text-muted-foreground leading-snug">{item.description || 'No description available.'}</p>
		<p class="font-bold mt-2 text-base">₹{Number(item.price).toFixed(2)}</p>
	</CardContent>
	<CardFooter class="p-3">
		{#if quantity > 0}
			<div class="flex items-center gap-2 w-full justify-center">
				<Button variant="outline" size="icon" class="h-7 w-7" onclick={decrement}>
					<Minus class="h-3.5 w-3.5" />
				</Button>
				<span class="font-bold text-base w-7 text-center">{quantity}</span>
				<Button variant="outline" size="icon" class="h-7 w-7" onclick={increment}>
					<Plus class="h-3.5 w-3.5" />
				</Button>
			</div>
		{:else}
			<Button onclick={addToCart} class="w-full h-9 text-sm">Add to Cart</Button>
		{/if}
	</CardFooter>
</Card>