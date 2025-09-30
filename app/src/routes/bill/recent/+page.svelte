<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { navigating } from '$app/stores';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
</script>

<div class="container mx-auto py-10">
	{#if $navigating}
		<div class="fixed top-0 left-0 w-full h-1 z-50">
			<Progress class="w-full" />
		</div>
	{/if}
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Recent Orders</h1>
		<Button href="/bill" variant="outline">New Order</Button>
	</div>

	{#if data.bills.length > 0}
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			{#each data.bills as bill (bill.id)}
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex justify-between items-baseline">
							<span>Table: {bill.tableNumber}</span>
							<a
								href={`/bill/receipt/${bill.id}`}
								target="_blank"
								rel="noopener noreferrer"
								class="text-sm font-medium text-blue-600 hover:underline"
							>
								{bill.billNumber}
							</a>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-1 text-sm">
							{#each bill.billItems as item}
								<li class="flex justify-between">
									<span>{item.itemName}</span>
									<span class="font-mono">x{item.quantity}</span>
								</li>
							{/each}
						</ul>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center text-center border rounded-lg h-64">
			<h3 class="text-2xl font-bold tracking-tight">No recent orders found.</h3>
			<p class="text-sm text-muted-foreground mb-4">Create a new order to see it here.</p>
			<Button href="/bill">Create New Order</Button>
		</div>
	{/if}
</div>