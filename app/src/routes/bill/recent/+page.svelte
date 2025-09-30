<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { navigating } from '$app/stores';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { enhance } from '$app/forms';
	import { CheckCircle2 } from 'lucide-svelte';

	let { data, form } = $props();
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
				{@const isServed = bill.orderStatus === 'served' || form?.servedBillId === bill.id}
				<Card.Root class={isServed ? 'bg-muted/50' : ''}>
					<Card.Header>
						<Card.Title class="flex justify-between items-baseline">
							<span class="flex items-center gap-2">
								Table: {bill.tableNumber}
								{#if isServed}<CheckCircle2 class="h-5 w-5 text-green-500" />{/if}
							</span>
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
					{#if !isServed}
						<Card.Footer>
							<form method="POST" action="?/markAsServed" use:enhance class="w-full">
								<input type="hidden" name="billId" value={bill.id} />
								<Button type="submit" class="w-full">Mark as Served</Button>
							</form>
						</Card.Footer>
					{/if}
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