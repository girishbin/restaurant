<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';

	let { data } = $props();
</script>

<div class="container mx-auto py-10">
	<h1 class="text-3xl font-bold mb-6">All Bills</h1>
	<div class="border rounded-lg">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[200px]">Bill Number</Table.Head>
					<Table.Head>Date</Table.Head>
					<Table.Head>Payment Method</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.bills.length > 0}
					{#each data.bills as bill}
						<Table.Row>
							<Table.Cell class="font-medium">{bill.billNumber}</Table.Cell>
							<Table.Cell>{new Date(bill.createdAt * 1000).toLocaleDateString()}</Table.Cell>
							<Table.Cell class="capitalize">{bill.paymentMethod}</Table.Cell>
							<Table.Cell class="capitalize">{bill.paymentStatus}</Table.Cell>
							<Table.Cell class="text-right">₹{bill.finalAmount.toFixed(2)}</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="h-24 text-center"> No bills found. </Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>