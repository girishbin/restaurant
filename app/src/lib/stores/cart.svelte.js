import { SvelteMap } from 'svelte/reactivity';

function createCart() {
	const items = new SvelteMap();

	const totalItems = $derived(
		Array.from(items.values()).reduce((sum, item) => sum + item.quantity, 0)
	);

	const totalPrice = $derived(
		Array.from(items.values()).reduce((sum, item) => sum + item.total, 0)
	);

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

	function clearCart() {
		items.clear();
	}

	return {
		get items() { return items; },
		get totalItems() { return totalItems; },
		get totalPrice() { return totalPrice; },
		updateItemQuantity,
		clearCart
	};
}

export const cart = createCart();