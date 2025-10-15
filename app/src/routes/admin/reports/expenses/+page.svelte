<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { page, navigating } from '$app/stores';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { enhance, applyAction } from '$app/forms';
	import { Toaster, toast } from 'svelte-sonner';
	import { Trash2, Pencil } from 'lucide-svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { data, form } = $props();

	/**
	 * @typedef {import('$lib/server/db/schema').ExpenseSelect} Expense
	 */

	// --- Date Filter Logic ---
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

	// --- Dialog State Logic ---
	/** @type {Expense | null} */
	let deletingExpense = $state(null);
	let deleteDialogOpen = $state(false);

	/** @type {Expense | null} */
	let editingExpense = $state(null);
	let editDialogOpen = $state(false);

	// --- Form Action Feedback ---
	$effect(() => {
		if (form) {
			if (form.success) {
				toast.success(form.message);
			} else if (form.message) {
				toast.error(form.message);
			}
		}
	});

	/**
	 * Formats a Date object into a 'YYYY-MM-DD' string for date inputs,
	 * respecting the local timezone.
	 * @param {Date | string | number} date
	 * @returns {string}
	 */
	function toLocalDateString(date) {
		if (!date) return '';
		const d = new Date(date);
		const year = d.getFullYear();
		const month = (d.getMonth() + 1).toString().padStart(2, '0');
		const day = d.getDate().toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
</script>

<div class="container mx-auto py-10">
	<Toaster />
	{#if $navigating}
		<div
			class="fixed top-0 left-0 z-50 h-1 w-full"
			style="background-color: oklch(0.44 0.07 188)"
		>
			<Progress class="w-full" />
		</div>
	{/if}
	<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
		<h1 class="text-3xl font-bold">Expenses Report</h1>
		<form class="flex flex-col sm:flex-row sm:items-end gap-4 w-full md:w-auto">
			<div class="w-full sm:w-auto">
				<Label for="from-date">From</Label>
				<Input type="date" id="from-date" name="from" bind:value={fromDate} />
			</div>
			<div class="w-full sm:w-auto">
				<Label for="to-date">To</Label>
				<Input type="date" id="to-date" name="to" bind:value={toDate} />
			</div>
			<Button type="submit">Apply Filter</Button>
			<Button href="/admin/reports/expenses" variant="outline">Clear</Button>
		</form>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
		<div class="rounded-lg border shadow-sm bg-gradient-to-r from-primary/40 to-primary/50 p-6">
			<h3 class="text-sm font-medium text-foreground/80">Total Amount</h3>
			<div class="text-2xl font-bold mt-2">
				₹{data.totalAmount.toFixed(2)}
			</div>
		</div>
		<div class="rounded-lg border shadow-sm bg-gradient-to-r from-primary/40 to-primary/50 p-6">
			<h3 class="text-sm font-medium text-foreground/80">Total Expenses</h3>
			<div class="text-2xl font-bold mt-2">{data.totalExpenses}</div>
		</div>
	</div>

	<div class="border rounded-lg">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[200px]">Name</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head>Date</Table.Head>
					<Table.Head class="text-right">Amount</Table.Head>
					<Table.Head class="text-right w-[120px]">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if data.expenses.length > 0}
					{#each data.expenses as expense}
						<Table.Row>
							<Table.Cell class="font-medium">{expense.name}</Table.Cell>
							<Table.Cell class="capitalize">{expense.category || 'N/A'}</Table.Cell>
							<Table.Cell>{new Date(expense.expenseDate).toLocaleDateString()}</Table.Cell>
							<Table.Cell class="text-right">₹{Number(expense.amount).toFixed(2)}</Table.Cell>
							<Table.Cell class="text-right">
								<div class="flex items-center justify-end space-x-2">
									<button
										class="flex h-8 w-8 items-center justify-center text-blue-600 hover:text-blue-800"
										on:click={() => {
											editingExpense = expense;
											editDialogOpen = true;
										}}
									>
										<Pencil class="h-4 w-4" />
									</button>
									<button
										class="flex h-8 w-8 items-center justify-center text-destructive hover:text-red-700"
										on:click={() => {
											deletingExpense = expense;
											deleteDialogOpen = true;
										}}
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
							</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="h-24 text-center"> No expenses found. </Table.Cell>
					</Table.Row>
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<!-- Edit Expense Dialog -->
<Dialog.Root bind:open={editDialogOpen}>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>Edit Expense</Dialog.Title>
			<Dialog.Description>Update the details for "{editingExpense?.name}".</Dialog.Description>
		</Dialog.Header>
		<form
			method="POST"
			action="?/editExpense"
			class="space-y-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();
					if (result.type === 'success') {
						editDialogOpen = false;
						editingExpense = null;
					}
				};
			}}
		>
			<input type="hidden" name="id" value={editingExpense?.id} />
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="edit-name">Name</Label>
					<Input id="edit-name" name="name" value={editingExpense?.name} />
				</div>
				<div class="space-y-2">
					<Label for="edit-amount">Amount</Label>
					<Input
						id="edit-amount"
						name="amount"
						type="number"
						step="0.01"
						value={editingExpense?.amount}
					/>
				</div>
				<div class="space-y-2">
					<Label for="edit-date">Date</Label>
					<Input
						id="edit-date"
						name="expenseDate"
						type="date"
						value={toLocalDateString(editingExpense?.expenseDate)}
					/>
				</div>
				<div class="space-y-2">
					<Label for="edit-category">Category</Label>
					<Input id="edit-category" name="category" value={editingExpense?.category ?? ''} />
				</div>
				<div class="space-y-2 md:col-span-2">
					<Label for="edit-description">Description</Label>
					<Textarea
						id="edit-description"
						name="description"
						placeholder="Optional notes"
						value={editingExpense?.description ?? ''}
					/>
				</div>
			</div>
			<Dialog.Footer>
				<button
					type="button"
					class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					on:click={() => (editDialogOpen = false)}>Cancel</button
				>
				<Button type="submit">Save Changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root bind:open={deleteDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the expense for
				<strong>"{deletingExpense?.name}"</strong>.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={() => (deleteDialogOpen = false)}>Cancel</AlertDialog.Cancel>
			<form
				id="delete-form"
				method="POST"
				action="?/deleteExpense"
				use:enhance={({ form, data, action, cancel, submitter }) => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							deleteDialogOpen = false;
						}
					};
				}}
			>
				{#if deletingExpense}
					<input type="hidden" name="id" value={deletingExpense.id} />
				{/if}
			</form>
			<AlertDialog.Action form="delete-form" type="submit">Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>