<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { page } from '$app/stores';

	let { data } = $props();

	// Helper to get date in YYYY-MM-DD format for the input
	const getTodayString = () => new Date().toISOString().split('T')[0];

	// Pre-fill inputs:
	// - If 'from'/'to' params exist in the URL, use them.
	// - If no params exist (fresh page load), default to today's date.
	// - If params are explicitly empty (e.g., from a cleared filter), keep them empty.
	const fromParam = $page.url.searchParams.get('from');
	const toParam = $page.url.searchParams.get('to');
	let fromDate = fromParam === null ? getTodayString() : fromParam;
	let toDate = toParam === null ? getTodayString() : toParam;

	function clearFilters(event) {
		// No need to manually clear fields. The `goto` navigation will cause the component
		// to re-initialize, and the `fromDate`/`toDate` variables will be reset
		// because the new URL won't have search parameters.
	}
</script>

<div class="container mx-auto py-10">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Bills Report</h1>
		<form class="flex items-end gap-4">
			<div>
				<Label for="from-date">From</Label>
				<Input type="date" id="from-date" name="from" bind:value={fromDate} />
			</div>
			<div>
				<Label for="to-date">To</Label>
				<Input type="date" id="to-date" name="to" bind:value={toDate} />
			</div>
			<Button type="submit">Apply Filter</Button>
			<Button href="/admin/reports" variant="outline">Clear</Button>
		</form>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
		<div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
			<h3 class="text-sm font-medium text-muted-foreground">Total Sales</h3>
			<div class="text-2xl font-bold mt-2">
				₹{data.totalSales.toFixed(2)}
			</div>
		</div>
	</div>

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
							<Table.Cell class="font-medium">
								<a
									href={`/bill/receipt/${bill.billId}`}
									target="_blank"
									rel="noopener noreferrer"
									class="text-blue-600 hover:underline"
								>{bill.billNumber}</a>
							</Table.Cell>
							<Table.Cell>{new Date(bill.createdAt).toLocaleDateString()}</Table.Cell>
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