<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { bill, settings } = data;

	// A reference to the on-screen invoice content div
	let invoiceContentEl;

	function handlePrint() {
		window.print();
	}

	// onMount runs only on the client-side after the component is rendered.
	// This is the perfect place to set up our print portal.
	onMount(() => {
		const printContainer = document.getElementById('print-container');
		if (printContainer && invoiceContentEl) {
			// Copy the on-screen receipt's HTML into the hidden print container.
			printContainer.innerHTML = invoiceContentEl.innerHTML;
		}
	});
</script>

<svelte:head>
	<style>
		@media print {
			@page {
				size: auto;
				margin: 0;
			}
			/* Add padding to the print container to prevent content from being cut off */
			#print-container {
				padding-left: 1.0rem;
				padding-right: 1.0rem;
			}
			/* Ensure the body and print container don't have a fixed height */
			body,
			#print-container {
				height: auto;
				min-height: 0;
			}
		}
	</style>
</svelte:head>

<!-- This is the on-screen view of the receipt -->
<div class="w-full max-w-md mx-auto">
	<div
		class="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 text-left font-mono"
	>
		<!-- This is the printable invoice content -->
		<div class="invoice-content" bind:this={invoiceContentEl}>
			<div class="text-center mb-6">
				<h1 class="text-2xl font-bold font-serif text-gray-900">{settings.cafeName}</h1>
				<p class="text-sm text-gray-600">{settings.cafeAddress}</p>
				<div class="text-xs text-gray-600">
					{#if settings.cafePhone}<span>Phone: {settings.cafePhone}</span>{/if}
					{#if settings.cafePhone && settings.cafeLicense}<span class="mx-1">|</span>{/if}
					{#if settings.cafeLicense}<span>FSSAI: {settings.cafeLicense}</span>{/if}
				</div>
			</div>
			<div class="text-xs mb-4">
				<div class="flex justify-between">
					<span>{bill.billNumber}</span>
					<span>Date: {new Date(bill.createdAt).toLocaleString()}</span>
				</div>
				<div class="flex justify-between">
					<span class="capitalize">Payment: {bill.paymentMethod}</span>
					{#if bill.tableNumber}<span>Table No: {bill.tableNumber}</span>{/if}
				</div>
			</div>
			<div class="border-t border-dashed border-gray-400 my-4"></div>
			{#if bill.customerName || bill.customerPhone}
				<div class="mb-4">
					<h3 class="font-bold border-b border-dashed border-gray-400 pb-1 mb-2">
						Customer Details
					</h3>
					{#if bill.customerName}<p>Name: {bill.customerName}</p>{/if}
					{#if bill.customerPhone}<p>Phone: {bill.customerPhone}</p>{/if}
				</div>
			{/if}

			<!-- Unified detailed view for both screen and print -->
			<table class="w-full text-sm mb-4">
				<thead>
					<tr class="border-b border-dashed border-gray-400">
						<th class="pb-1 text-left font-normal">Item</th>
						<th class="pb-1 text-center font-normal">Qty</th>
						<th class="pb-1 text-right font-normal">Price</th>
						<th class="pb-1 text-right font-normal">Total</th>
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
		<div class="mt-8 flex justify-center gap-4 print:hidden">
			<Button onclick={handlePrint}>Print Bill</Button>
			<Button href="/bill" variant="outline">New Order</Button>
		</div>
	</div>
</div>