<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { categories } from './schema';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Toaster, toast } from 'svelte-sonner';
	import type { MenuItemSelect } from '$lib/server/db/schema';
	import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	let {
		data,
		form
	}: {
		// Using 'form' for the "Add" form
		data: {
			items: MenuItemSelect[];
			sortBy?: string;
			sortOrder?: string;
			categoryFilter?: string;
			searchQuery?: string;
			url: string;
		};
		form?: { success: boolean; errors?: any; data?: any; message?: string };
	} = $props();

	// Local state for form fields
	let name = $state('');
	let description = $state('');
	let price = $state<number | undefined>(undefined);
	let category = $state('');
	let imageUrl = $state('');
	let isActive = $state(true);

	// State for the edit modal
	let editingItem = $state<MenuItemSelect | null>(null);

	// State for the delete confirmation dialog
	let deletingItem = $state<MenuItemSelect | null>(null);

	// State for the edit form fields
	let editName = $state('');
	let editDescription = $state('');
	let editPrice = $state<number | undefined>(undefined);
	let editCategory = $state('');
	let editImageUrl = $state('');
	let editIsActive = $state(true);

	// Isolated form state for the edit dialog
	let editForm = $state<{ success: boolean; errors?: any; data?: any; message?: string } | null>(null);

	// When the dialog opens, populate the edit form with the selected item's data
	$effect(() => {
		console.log('Effect triggered. Current editingItem:', editingItem);
		if (editingItem) {
			editName = editingItem.name;
			editDescription = editingItem.description ?? '';
			editPrice = editingItem.price;
			editCategory = editingItem.category;
			editImageUrl = editingItem.imageUrl ?? '';
			editIsActive = editingItem.isActive;
			// Reset edit form errors when a new item is selected
			editForm = null;
		}
	});

	function getSortLink(column: string) {
		const url = new URL(data.url);
		const currentSort = data.sortBy;
		const currentOrder = data.sortOrder;

		url.searchParams.set('sort', column);

		if (currentSort === column) {
			url.searchParams.set('order', currentOrder === 'asc' ? 'desc' : 'asc');
		} else {
			url.searchParams.set('order', 'asc');
		}
		return url.pathname + url.search;
	}
</script>

<Toaster />
<h1 class="text-2xl font-bold mb-4">Add New Menu Item</h1>
<form
	method="POST"
	action="?/create"
	use:enhance={() => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success' && result.status === 200) {
				// Manually reset form fields on success
				name = '';
				description = '';
				price = undefined;
				category = '';
				imageUrl = '';
				isActive = true;
				toast.success('Menu item created successfully!');
			}
		};
	}}
	class="space-y-6 max-w-2xl"
>
	<div>
		<label for="name" class="text-sm font-medium leading-none">Name</label>
		<Input id="name" name="name" bind:value={name} required />
		{#if form?.errors?.name}
			<p class="text-sm text-destructive mt-1">{form.errors.name[0]}</p>
		{/if}
	</div>

	<div>
		<label for="description" class="text-sm font-medium leading-none">Description</label>
		<Textarea id="description" name="description" bind:value={description} />
		{#if form?.errors?.description}
			<p class="text-sm text-destructive mt-1">{form.errors.description[0]}</p>
		{/if}
		<p class="text-sm text-muted-foreground">A brief description of the menu item.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="space-y-2">
			<label for="price" class="text-sm font-medium leading-none">Price</label>
			<Input
				id="price"
				name="price"
				type="number"
				step="5"
				bind:value={price}
				required
			/>
			{#if form?.errors?.price}
				<p class="text-sm text-destructive mt-1">{form.errors.price[0]}</p>
			{/if}
		</div>

		<div class="space-y-2">
			<label for="category" class="text-sm font-medium leading-none">Category</label>
			<select
				name="category"
				id="category"
				bind:value={category}
				class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				required
			>
				<option value="" disabled>Select a category</option>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</select>
			{#if form?.errors?.category}
				<p class="text-sm text-destructive mt-1">{form.errors.category[0]}</p>
			{/if}
		</div>
	</div>

	<div>
		<label for="imageUrl" class="text-sm font-medium leading-none">Image URL</label>
		<Input id="imageUrl" name="imageUrl" bind:value={imageUrl} />
		{#if form?.errors?.imageUrl}
			<p class="text-sm text-destructive mt-1">{form.errors.imageUrl[0]}</p>
		{/if}
	</div>

	<div class="flex flex-row items-center justify-between rounded-lg border p-4">
		<div class="space-y-0.5">
			<label for="isActive" class="text-sm font-medium leading-none">Active</label>
			<p class="text-sm text-muted-foreground">
				Inactive items will not be visible on the "Make Bill" page.
			</p>
		</div>
		<Switch id="isActive" name="isActive" bind:checked={isActive} />
	</div>

	<Button type="submit">Add Menu Item</Button>
</form>

<!-- Existing Menu Items Table -->
<div class="mt-12">
	<h2 class="text-2xl font-bold mb-4">Existing Menu Items</h2>

	<!-- Filter and Search Form -->
	<form method="GET" class="flex items-center gap-4 mb-4">
		<Input
			type="search"
			name="search"
			placeholder="Search by name..."
			value={data.searchQuery ?? ''}
			class="max-w-xs"
		/>
		<select
			name="category"
			class="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
			onchange={(e) => (e.currentTarget as HTMLSelectElement).form?.submit()}
		>
			<option value="">All Categories</option>
			{#each categories as cat}
				<option value={cat} selected={data.categoryFilter === cat}>{cat}</option>
			{/each}
		</select>
		<Button type="submit">Filter</Button>
		<a href="/admin/menu" class="text-sm text-muted-foreground hover:underline">Clear</a>
	</form>

	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[250px]">
						<a href={getSortLink('name')} class="flex items-center gap-2">
							Name
							{#if data.sortBy !== 'name'}
								<ArrowUpDown class="h-4 w-4 text-muted-foreground" />
							{:else if data.sortOrder === 'asc'}
								<ArrowUp class="h-4 w-4" />
							{:else}
								<ArrowDown class="h-4 w-4" />
							{/if}
						</a>
					</Table.Head>
					<Table.Head>
						<a href={getSortLink('category')} class="flex items-center gap-2">
							Category
							{#if data.sortBy !== 'category'}
								<ArrowUpDown class="h-4 w-4 text-muted-foreground" />
							{:else if data.sortOrder === 'asc'}
								<ArrowUp class="h-4 w-4" />
							{:else}
								<ArrowDown class="h-4 w-4" />
							{/if}
						</a>
					</Table.Head>
					<Table.Head class="text-right">
						<a href={getSortLink('price')} class="flex items-center justify-end gap-2">
							Price
							{#if data.sortBy !== 'price'}
								<ArrowUpDown class="h-4 w-4 text-muted-foreground" />
							{:else if data.sortOrder === 'asc'}
								<ArrowUp class="h-4 w-4" />
							{:else}
								<ArrowDown class="h-4 w-4" />
							{/if}
						</a>
					</Table.Head>
					<Table.Head class="text-center">
						<a href={getSortLink('isActive')} class="flex items-center justify-center gap-2">
							Status
							{#if data.sortBy !== 'isActive'}
								<ArrowUpDown class="h-4 w-4 text-muted-foreground" />
							{:else if data.sortOrder === 'asc'}
								<ArrowUp class="h-4 w-4" />
							{:else}
								<ArrowDown class="h-4 w-4" />
							{/if}
						</a>
					</Table.Head>
					<Table.Head class="text-right">Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.items as item (item.id)}
					<Table.Row>
						<Table.Cell class="font-medium">{item.name}</Table.Cell>
						<Table.Cell>{item.category}</Table.Cell>
						<Table.Cell class="text-right">₹{item.price.toFixed(2)}</Table.Cell>
						<Table.Cell class="text-center">
							<Badge variant={item.isActive ? 'default' : 'destructive'}>
								{item.isActive ? 'Active' : 'Inactive'}
							</Badge>
						</Table.Cell>
						<Table.Cell class="text-right space-x-2">
							<Button
								variant="outline"
								size="sm"
								onclick={() => {
									console.log('Edit button clicked for item:', item);
									editingItem = item;
								}}>Edit</Button
							>
							<Button
								variant="destructive"
								size="sm"
								onclick={() => (deletingItem = item)}>Delete</Button
							>
						</Table.Cell>
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={5} class="h-24 text-center">No menu items found.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>

<!-- Edit Item Dialog -->
<!--
  By wrapping the entire Dialog.Root in the #if block, we ensure that it and its overlay
  are completely removed from the DOM when not in use, preventing it from blocking clicks.
-->
{#if editingItem}
	<Dialog.Root
		open={true}
		onOpenChange={(open) => {
			if (!open) editingItem = null;
		}}
	>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Edit: {editingItem.name}</Dialog.Title>
				<Dialog.Description>
					Make changes to the menu item here. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<form
				method="POST"
				action="?/update"
				use:enhance={() => {
					return async ({ result, update }) => {
						console.log('Edit form submission result:', result);
						await update();

						if (result.type === 'success' && result.status === 200) {
							editingItem = null; // Close dialog on success
							toast.success('Menu item updated successfully!');
						} else if (result.type === 'failure') {
							editForm = result.data;
						} else {
							editForm = null;
						}
					};
				}}
				class="space-y-4 pt-4"
			>
				<input type="hidden" name="id" value={editingItem.id} />
				<div>
					<label for="edit-name" class="text-sm font-medium">Name</label>
					<Input id="edit-name" name="name" bind:value={editName} required />
					{#if editForm?.errors?.name}
						<p class="text-sm text-destructive mt-1">{editForm.errors.name[0]}</p>
					{/if}
				</div>
				<div>
					<label for="edit-description" class="text-sm font-medium">Description</label>
					<Textarea id="edit-description" name="description" bind:value={editDescription} />
					{#if editForm?.errors?.description}
						<p class="text-sm text-destructive mt-1">{editForm.errors.description[0]}</p>
					{/if}
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="edit-price" class="text-sm font-medium">Price</label>
						<Input
							id="edit-price"
							name="price"
							type="number"
							step="5"
							bind:value={editPrice}
							required
						/>
						{#if editForm?.errors?.price}
							<p class="text-sm text-destructive mt-1">{editForm.errors.price[0]}</p>
						{/if}
					</div>
					<div>
						<label for="edit-category" class="text-sm font-medium">Category</label>
						<select
							name="category"
							id="edit-category"
							bind:value={editCategory}
							class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							required
						>
							{#each categories as cat}
								<option value={cat}>{cat}</option>
							{/each}
						</select>
						{#if editForm?.errors?.category}
							<p class="text-sm text-destructive mt-1">{editForm.errors.category[0]}</p>
						{/if}
					</div>
				</div>
				<div>
					<label for="edit-imageUrl" class="text-sm font-medium">Image URL</label>
					<Input id="edit-imageUrl" name="imageUrl" bind:value={editImageUrl} />
					{#if editForm?.errors?.imageUrl}
						<p class="text-sm text-destructive mt-1">{editForm.errors.imageUrl[0]}</p>
					{/if}
				</div>
				<div class="flex items-center space-x-2 pt-2">
					<Switch id="edit-isActive" name="isActive" bind:checked={editIsActive} />
					<label for="edit-isActive" class="text-sm font-medium">Active</label>
				</div>
				<Dialog.Footer>
					<Button type="submit">Save changes</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root open={deletingItem !== null}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete the menu item
				<strong>"{deletingItem?.name}"</strong>.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={() => (deletingItem = null)}>Cancel</AlertDialog.Cancel>
			<form
				method="POST"
				action="?/delete"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success' && result.status === 200) {
							deletingItem = null;
							toast.success('Menu item deleted successfully!');
						}
					};
				}}
			>
				{#if deletingItem}
					<input type="hidden" name="id" value={deletingItem.id} />
				{/if}
				<AlertDialog.Action type="submit">Continue</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>