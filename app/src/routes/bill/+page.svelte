<script>
	import MenuItem from '../../lib/components/dishcard/dishcard.svelte';

	let { data } = $props();
	let cartItems = $state([]);

	function handleQuantityChange(event) {
		const { item, quantity, total } = event.detail;

		// Update cart logic here
		const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

		if (existingItemIndex !== -1) {
			if (quantity === 0) {
				// Remove item from cart
				cartItems.splice(existingItemIndex, 1);
			} else {
				// Update quantity
				const existingItem = cartItems[existingItemIndex];
				existingItem.quantity = quantity;
				existingItem.total = total;
			}
		} else if (quantity > 0) {
			// Add new item to cart
			cartItems.push({ ...item, quantity, total });
		}

		console.log('Cart updated:', cartItems);
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
	{#each data.menuItems as item}
		<MenuItem {item} on:quantityChange={handleQuantityChange} />
	{/each}
</div>