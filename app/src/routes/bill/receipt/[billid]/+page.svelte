<script>
	import { Button } from '$lib/components/ui/button/index.js';
	let { data } = $props();
	const { bill } = data;
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
	<div
		class="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 text-left font-mono printable-bill"
	>
		<div class="text-center mb-6">
			<h2 class="text-2xl font-bold">INVOICE</h2>
			<p class="text-sm">Bill No: {bill.billNumber}</p>
			<!-- D1 stores timestamps as seconds, JS Date needs milliseconds -->
			<p class="text-sm">Date: {new Date(bill.createdAt * 1000).toLocaleString()}</p>
			<p class="text-sm capitalize">Payment: {bill.paymentMethod}</p>
		</div>

		{#if bill.customerName || bill.customerPhone}
			<div class="mb-4">
				<h3 class="font-bold border-b border-dashed border-gray-400 pb-1 mb-2">
					Customer Details
				</h3>
				{#if bill.customerName}<p>Name: {bill.customerName}</p>{/if}
				{#if bill.customerPhone}<p>Phone: {bill.customerPhone}</p>{/if}
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
				{#each bill.billItems as item}
					<tr>
						<td class="py-1">{item.itemName}</td>
						<td class="py-1 text-center">{item.quantity}</td>
						<td class="py-1 text-right">₹{Number(item.itemPrice).toFixed(2)}</td>
						<td class="py-1 text-right">₹{item.subtotal.toFixed(2)}</td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="border-t border-dashed border-gray-400 pt-2">
			<div class="flex justify-between">
				<span>Subtotal</span>
				<span>₹{bill.totalAmount.toFixed(2)}</span>
			</div>
			<div class="flex justify-between">
				<span>Tax/GST</span>
				<span>₹{bill.taxAmount.toFixed(2)}</span>
			</div>
			<div class="flex justify-between font-bold text-lg border-t border-gray-400 mt-2 pt-2">
				<span>TOTAL</span>
				<span>₹{bill.finalAmount.toFixed(2)}</span>
			</div>
		</div>

		<div class="mt-8 flex justify-center gap-4 no-print">
			<Button onclick={() => window.print()}>Print Bill</Button>
			<Button href="/bill" variant="outline">New Order</Button>
		</div>
	</div>
</div>

<style>
	@media print {
		body * { visibility: hidden; }
		.printable-bill, .printable-bill * { visibility: visible; }
		.printable-bill { position: absolute; left: 0; top: 0; width: 100%; }
		.no-print { display: none; }
	}
</style>

