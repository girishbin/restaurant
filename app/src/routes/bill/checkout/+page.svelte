<script>
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
	{#if form?.success}
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
	{:else if form?.items}
		<!-- Confirmation screen -->
		<div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<h1 class="text-3xl font-bold tracking-tight mb-4">Confirm Your Order</h1>
			<ul class="divide-y divide-gray-200 dark:divide-gray-700 mb-4 text-left">
				{#each form.items as item}
					<li class="py-3 flex justify-between items-center">
						<div>
							<p class="font-semibold">{item.name}</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{item.quantity} x ₹{item.price}
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
				<span>₹{form.total}</span>
			</div>
			<form method="POST" action="?/confirm" class="mt-6">
				<input type="hidden" name="items" value={form.rawItems} />
				<button
					type="submit"
					class="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
				>
					Confirm and Place Order
				</button>
			</form>
		</div>
	{:else if form?.message}
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
			Return to Cart
		</a>
	{:else}
		<div class="space-y-4">
			<h1 class="text-3xl font-bold tracking-tight">Processing Your Order</h1>
			<p class="text-muted-foreground">Please wait, we're finalizing your bill.</p>
			<div class="flex justify-center items-center pt-4">
				<svg
					class="animate-spin h-8 w-8 text-primary"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		</div>
	{/if}
</div>
