<script>
	import { Button } from '$lib/components/ui/button/index.js';
	let { data } = $props();
	const { bill } = data;
	function handlePrint() {
		window.print();
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen p-4 text-center">
	<div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 text-left font-mono print-container">
		<!-- This is the printable invoice content -->
		<div class="invoice-content">
			<div class="text-center mb-6">
				<h2 class="text-2xl font-bold">INVOICE</h2>
				<p class="text-sm">Bill No: {bill.billNumber}</p>
				<p class="text-sm">Date: {new Date(bill.createdAt).toLocaleString()}</p>
				<p class="text-sm capitalize">Payment: {bill.paymentMethod}</p>
				{#if bill.tableNumber}<p class="text-sm">Table No: {bill.tableNumber}</p>{/if}
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
					<span>₹{Number(bill.totalAmount).toFixed(2)}</span>
				</div>
				<div class="flex justify-between">
					<span>Tax/GST(5%)</span>
					<span>₹{bill.taxAmount.toFixed(2)}</span>
				</div>
				<div class="flex justify-between font-bold text-lg border-t border-gray-400 mt-2 pt-2">
					<span>TOTAL</span>
					<span>₹{bill.finalAmount.toFixed(2)}</span>
				</div>
			</div>
		</div>
		
		<!-- Buttons that won't print -->
		<div class="mt-8 flex justify-center gap-4 no-print">
			<Button onclick={handlePrint}>Print Bill</Button>
			<Button href="/bill" variant="outline">New Order</Button>
		</div>
	</div>
</div>

<style>
	@media print {
		/* Hide everything by default */
		* {
			visibility: hidden;
		}
		
		/* Show only the invoice content */
		.invoice-content,
		.invoice-content * {
			visibility: visible;
		}
		
		/* Position the invoice content properly for printing */
		.invoice-content {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			background: white !important;
			color: black !important;
		}
		
		/* Ensure buttons and other elements don't print */
		.no-print,
		.print-container > *:not(.invoice-content) {
			display: none !important;
		}
		
		/* Remove shadows and backgrounds that don't print well */
		.print-container {
			box-shadow: none !important;
			background: white !important;
		}
		
		/* Ensure proper spacing and sizing for print */
		body {
			margin: 0;
			padding: 20px;
		}
	}
</style>