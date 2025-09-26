<script>
	// Use the new runes-based cart store
	import { getContext } from 'svelte';
	import { enhance, applyAction } from '$app/forms';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Minus, Plus, Trash2 } from 'lucide-svelte';

	/** @type {import('./$types').ActionData} */
	let { form } = $props();

	let submitting = $state(false);

	const cart = getContext('cart');

	// With Svelte 5 runes, we can create derived state for the form
	// Create a "lean" version of the cart items for the form submission,
	// sending only the data required by the server. This reduces payload size.
	const rawItems = $derived(
		JSON.stringify(
			Array.from(cart.items.values()).map((item) => ({ id: item.id, quantity: item.quantity }))
		)
	);
	// Calculate subtotal and GST from the final price.
	const subtotal = $derived(cart.totalPrice * 0.95);
	const gstAmount = $derived(cart.totalPrice * 0.05);
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
	{#if false && form?.success && form.bill}
		<!-- Printable Bill screen -->
		<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 text-left font-mono printable-bill">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold">INVOICE</h2>
				<p class="text-sm">Bill No: {form.bill.billNumber}</p>
				<p class="text-sm">Date: {new Date(form.bill.createdAt).toLocaleString()}</p>
				<p class="text-sm capitalize">Payment: {form.bill.paymentMethod}</p>
			</div>

			{#if form.bill.customerName || form.bill.customerPhone}
				<div class="mb-4">
					<h3 class="font-bold border-b border-dashed border-gray-400 pb-1 mb-2">Customer Details</h3>
					{#if form.bill.customerName}<p>Name: {form.bill.customerName}</p>{/if}
					{#if form.bill.customerPhone}<p>Phone: {form.bill.customerPhone}</p>{/if}
				</div>
			{/if}

			<table class="w-full text-sm mb-4">
				<thead>
					<tr class="border-b border-dashed border-gray-400">
						<th class="pb-1 text-left">Item</th>
						<th class="pb-1 text-center">Qty</th>
						<th class="pb-1 text-right">Price</th>
						<th class="pb-1 text-right">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each form.bill.items as item}
						<tr>
							<td class="py-1">{item.name}</td>
							<td class="py-1 text-center">{item.quantity}</td>
							<td class="py-1 text-right">₹{Number(item.price).toFixed(2)}</td>
							<td class="py-1 text-right">₹{item.total.toFixed(2)}</td>
						</tr>
					{/each}
				</tbody>
			</table>

			<div class="border-t border-dashed border-gray-400 pt-2">
				<div class="flex justify-between">
					<span>Subtotal</span>
					<span>₹{form.bill.totalAmount}</span>
				</div>
				<div class="flex justify-between">
					<span>GST (5%)</span>
					<span>₹{form.bill.taxAmount}</span>
				</div>
				<div class="flex justify-between font-bold text-lg border-t border-gray-400 mt-2 pt-2">
					<span>TOTAL</span>
					<span>₹{form.bill.finalAmount}</span>
				</div>
			</div>

			<div class="mt-8 flex justify-center gap-4 no-print">
				<Button onclick={() => window.print()}>Print Bill</Button>
				<Button href="/bill" variant="outline">New Order</Button>
			</div>
		</div>
	{:else if cart.items.size > 0 || submitting}
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
			<form
				method="POST"
				action="?/confirm"
				class="space-y-6"
				use:enhance={() => {
					submitting = true;
					return async ({ result }) => {
						if (result.type === 'redirect') {
							cart.clearCart();
							// SvelteKit will handle the navigation automatically.
							// We don't need to set submitting = false here.
						} else {
							// On failure, allow the user to try again.
							submitting = false;
						}
						// applyAction is needed to update the `form` prop with any validation errors.
						await applyAction(result);
					};
				}}
			>
				<div class="grid grid-cols-1 gap-6 text-left">
					<div class="space-y-1">
						<label for="customerName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
						<input
							type="text"
							name="customerName"
							id="customerName"
							class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
							placeholder="Optional"
						/>
					</div>
					<div class="space-y-1">
						<label for="customerPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Phone</label>
						<input
							type="tel"
							name="customerPhone"
							id="customerPhone"
							class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
							placeholder="Optional"
						/>
					</div>
				</div>

				<ul class="divide-y divide-gray-200 dark:divide-gray-700 text-left">
					{#each cart.items.values() as item}
						<li class="py-3 grid grid-cols-[1fr_auto_auto] items-center gap-4">
							<div class="min-w-0">
								<p class="font-semibold">{item.name}</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">
									{item.quantity} x ₹{(Number(item.price) * 0.95).toFixed(2)}
								</p>
							</div>
							<div class="flex items-center gap-2">
								<Button
									variant="outline"
									size="icon"
									class="h-8 w-8"
									onclick={() => cart.updateItemQuantity(item, item.quantity - 1)}
								>
									{#if item.quantity > 1}
										<Minus class="h-4 w-4" />
									{:else}
										<Trash2 class="h-4 w-4" />
									{/if}
									<span class="sr-only">Remove one</span>
								</Button>
								<span class="font-bold text-lg w-8 text-center">{item.quantity}</span>
								<Button
									variant="outline"
									size="icon"
									class="h-8 w-8"
									onclick={() => cart.updateItemQuantity(item, item.quantity + 1)}
								>
									<Plus class="h-4 w-4" />
									<span class="sr-only">Add one</span>
								</Button>
							</div>
							<p class="font-semibold text-right w-24">₹{(item.total * 0.95).toFixed(2)}</p>
						</li>
					{/each}
				</ul>
				<div class="pt-4 text-left">
					<h3 class="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h3>
					<div class="mt-2 flex items-center gap-6">
						<label class="flex items-center cursor-pointer">
							<input type="radio" name="paymentMethod" value="cash" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" checked />
							<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Cash</span>
						</label>
						<label class="flex items-center cursor-pointer">
							<input type="radio" name="paymentMethod" value="card" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
							<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Card</span>
						</label>
						<label class="flex items-center cursor-pointer">
							<input type="radio" name="paymentMethod" value="upi" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" />
							<span class="ml-2 text-sm text-gray-700 dark:text-gray-300">UPI</span>
						</label>
					</div>
				</div>
				<div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-1 text-right">
					<div class="flex justify-between text-md">
						<span>Subtotal</span>
						<span>₹{subtotal.toFixed(2)}</span>
					</div>
					<div class="flex justify-between text-md">
						<span>GST (5%)</span>
						<span>₹{gstAmount.toFixed(2)}</span>
					</div>
					<div class="flex justify-between font-bold text-lg pt-2 mt-1 border-t border-gray-300 dark:border-gray-600">
						<span>Total</span>
						<span>₹{cart.totalPrice.toFixed(2)}</span>
					</div>
				</div>
				<input type="hidden" name="items" value={rawItems} />
				<button
					type="submit"
					disabled={submitting}
					class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
				>
					{#if submitting}
						<svg
							class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Processing...
					{:else}
						Confirm and Place Order
					{/if}
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
				Start Adding
			</a>
		</div>
	{/if}
</div>

<style>
	@media print {
		/* 2. Then, make the printable section and all its children visible */
		.printable-bill,
		.printable-bill * {
			visibility: visible;
		}
		/* 3. Position the printable section to take up the whole page */
		.printable-bill {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
		}
		/* 4. Finally, hide any elements inside the printable section that shouldn't be printed */
		.no-print {
			display: none;
		}
	}
</style>
