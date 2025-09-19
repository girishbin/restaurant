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

	/**
	 * Adds an item to the cart. If the item already exists, it increments the quantity.
	 * @param {{id: number, name: string, price: string, quantity?: number}} item - The item to add.
	 */
	function addItem(item) {
		const existingItem = items.get(item.id);
		const addQuantity = item.quantity || 1;
		const newQuantity = (existingItem ? existingItem.quantity : 0) + addQuantity;

		// We pass the base item details (id, name, price) to ensure they are up-to-date.
		updateItemQuantity(item, newQuantity);
	}

	function clearCart() {
		items.clear();
	}

	return {
		get items() { return items; },
		get totalItems() { return totalItems; },
		get totalPrice() { return totalPrice; },
		addItem,
		updateItemQuantity,
		clearCart
	};
}

export const cart = createCart();