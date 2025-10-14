<script>
	import { enhance, applyAction } from '$app/forms';
	import { Toaster, toast } from 'svelte-sonner';
	import { Trash2, Pencil } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	export let data;
	export let form; // This holds the data returned from the form action

	/**
	 * @typedef {import('$lib/server/db/schema').ExpenseSelect} Expense
	 */

	/** @type {Expense | null} */
	let deletingExpense = null;
	let deleteDialogOpen = false;

	/** @type {Expense | null} */
	let editingExpense = null;
	let editDialogOpen = false;

	// Reactive statement to show toast notifications based on form action results
	$: if (form) {
		if (form.success) {
			toast.success(form.message);
		} else if (form.message) {
			toast.error(form.message);
		}
	}
</script>

<div class="w-full max-w-4xl mx-auto p-4 md:p-8 space-y-8">
	<Toaster />
	<Card class="w-full">
		<CardHeader>
			<CardTitle>Add New Expense</CardTitle>
			<CardDescription>Enter the details of the expense below.</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				id="add-expense-form"
				method="POST"
				action="?/addExpense"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success' && result.status === 200) {
							document.getElementById('add-expense-form')?.reset();
						}
					};
				}}
				class="space-y-6"
			>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div class="space-y-2">
						<Label for="name">Name</Label>
						<Input type="text" name="name" id="name" value={form?.data?.name ?? ''} placeholder="e.g., Vegetables" />
						{#if form?.errors?.name}
							<p class="text-sm text-destructive">{form.errors.name[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="amount">Amount</Label>
						<Input type="number" name="amount" id="amount" step="0.01" value={form?.data?.amount ?? ''} placeholder="e.g., 1500.50" />
						{#if form?.errors?.amount}
							<p class="text-sm text-destructive">{form.errors.amount[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="expenseDate">Date</Label>
						<Input type="date" name="expenseDate" id="expenseDate" value={form?.data?.expenseDate ?? ''} />
						{#if form?.errors?.expenseDate}
							<p class="text-sm text-destructive">{form.errors.expenseDate[0]}</p>
						{/if}
					</div>

					<div class="space-y-2">
						<Label for="category">Category</Label>
						<Input type="text" name="category" id="category" value={form?.data?.category ?? ''} placeholder="e.g., Groceries" />
					</div>

					<div class="space-y-2 md:col-span-2">
						<Label for="description">Description</Label>
						<Textarea name="description" id="description" placeholder="Optional notes about the expense">{form?.data?.description ?? ''}</Textarea>
					</div>
				</div>
				<Button type="submit">Add Expense</Button>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Expense History</CardTitle>
		</CardHeader>
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Category</TableHead>
						<TableHead class="text-right">Amount</TableHead>
						<TableHead class="text-right">Date</TableHead>
						<TableHead class="text-right w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.expenses as expense}
						<TableRow>
							<TableCell class="font-medium">{expense.name}</TableCell>
							<TableCell>{expense.category || 'N/A'}</TableCell>
							<TableCell class="text-right">₹{expense.amount.toFixed(2)}</TableCell>
							<TableCell class="text-right">{new Date(expense.expenseDate).toLocaleDateString()}</TableCell>
							<TableCell class="text-right w-[100px]">
								<div class="flex items-center justify-end space-x-2">
									<button
										class="h-8 w-8 text-blue-600 hover:text-blue-800"
										on:click={() => {
											editingExpense = expense;
											editDialogOpen = true;
										}}
									>
										<Pencil class="h-4 w-4" />
									</button>
									<button
										class="h-8 w-8 text-destructive hover:text-red-700"
										on:click={() => {
											deletingExpense = expense;
											deleteDialogOpen = true;
										}}
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</CardContent>
	</Card>
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
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="edit-name">Name</Label>
					<Input id="edit-name" name="name" value={editingExpense?.name} />
				</div>
				<div class="space-y-2">
					<Label for="edit-amount">Amount</Label>
					<Input id="edit-amount" name="amount" type="number" step="0.01" value={editingExpense?.amount} />
				</div>
				<div class="space-y-2">
					<Label for="edit-date">Date</Label>
					<Input
						id="edit-date"
						name="expenseDate"
						type="date"
						value={new Date(editingExpense?.expenseDate ?? Date.now()).toISOString().split('T')[0]}
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
				<Button type="button" variant="outline" on:click={() => (editDialogOpen = false)}>
					Cancel
				</Button>
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
				use:enhance={() => {
					return async ({ result }) => {
						await applyAction(result);
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
			<!-- 
				This button is outside the form but is linked via the `form` attribute.
				It triggers the submission of the 'delete-form'.
			-->
			<AlertDialog.Action form="delete-form" type="submit">Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>