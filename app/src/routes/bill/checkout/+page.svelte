<script>
	// Use the new runes-based cart store
	import { getContext } from 'svelte';
	import { enhance, applyAction } from '$app/forms';

	/** @type {import('./$types').ActionData} */
	let { form } = $props();

	const cart = getContext('cart');

	// With Svelte 5 runes, we can create derived state for the form
	const rawItems = $derived(JSON.stringify(Array.from(cart.items.values())));
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
	{#if form?.success}
		<!-- Success screen -->
		<div
			class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
			role="alert"
		>
			<h2 class="font-bold text-lg mb-2">Checkout Successful</h2>
			<p>{form.message}</p>
		</div>
		<a
			href="/bill"
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			Continue Shopping
		</a>
	{:else if cart.items.size > 0}
		<!-- Confirmation screen -->
		<div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
			{#if form?.message}
				<div
					class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
					role="alert"
				>
					<h2 class="font-bold text-lg mb-2">Checkout Failed</h2>
					<p>{form.message}</p>
				</div>
			{/if}
			<h1 class="text-3xl font-bold tracking-tight mb-4">Confirm Your Order</h1>
			<ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4 text-left">
				{#each cart.items.values() as item}
					<li class="py-3 flex justify-between items-center">
						<div>
							<p class="font-semibold">{item.name}</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{item.quantity} x ₹{Number(item.price).toFixed(2)}
							</p>
						</div>
						<p class="font-semibold">₹{item.total.toFixed(2)}</p>
					</li>
				{/each}
			</ul>
			<div
				class="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg"
			>
				<span>Total</span>
				<span>₹{cart.totalPrice.toFixed(2)}</span>
			</div>
			<form
				method="POST"
				action="?/confirm"
				class="mt-6"
				use:enhance={() => {
					// This callback runs after the server responds
					return async ({ result }) => {
						// On successful confirmation, clear the cart store
						if (result.type === 'success' && result.data?.success) {
							cart.clearCart();
						}
						// Update the `form` prop with the action result
						await applyAction(result);
					};
				}}
			>
				<input type="hidden" name="items" value={rawItems} />
				<button
					type="submit"
					class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
				>
					Confirm and Place Order
				</button>
			</form>
		</div>
	{:else if form?.message}
		<!-- Failure screen (e.g. from a failed confirm action) -->
		<div
			class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
			role="alert"
		>
			<h2 class="font-bold text-lg mb-2">Checkout Failed</h2>
			<p>{form.message}</p>
		</div>
		<a
			href="/bill"
			class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			Return to Menu
		</a>
	{:else}
		<!-- Cart is empty screen -->
		<div class="space-y-4">
			<h1 class="text-3xl font-bold tracking-tight">Your Cart is Empty</h1>
			<p class="text-muted-foreground">Add some items to your cart to get started.</p>
			<a
				href="/bill"
				class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Start Shopping
			</a>
		</div>
	{/if}
</div>
