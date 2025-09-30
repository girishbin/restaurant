<script lang="ts">
	import { enhance } from '$app/forms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { categories } from './schema';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { MenuItemSelect } from '$lib/server/db/schema';
	import { Button } from '$lib/components/ui/button';

	let {
		data
	}: {
		data: { items: MenuItemSelect[] };
	} = $props();

	// Local state for form fields
	let name = '';
	let description = '';
	let price: number | undefined = undefined;
	let category = '';
	let imageUrl = '';
	let isActive = true;
</script>

<h1 class="text-2xl font-bold mb-4">Add New Menu Item</h1>
<form
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			// Reset form on successful submission
			name = '';
			description = '';
			price = undefined;
			category = '';
			imageUrl = '';
			isActive = true;
			await update();
		};
	}}
	class="space-y-6 max-w-2xl"
>
	<div>
		<label for="name" class="text-sm font-medium leading-none">Name</label>
		<Input id="name" name="name" bind:value={name} required />
	</div>

	<div>
		<label for="description" class="text-sm font-medium leading-none">Description</label>
		<Textarea id="description" name="description" bind:value={description} />
		<p class="text-sm text-muted-foreground">A brief description of the menu item.</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<div class="space-y-2">
			<label for="price" class="text-sm font-medium leading-none">Price</label>
			<Input
				id="price"
				name="price"
				type="number"
				step="0.01"
				bind:value={price}
				required
			/>
		</div>

		<div class="space-y-2">
			<label for="category-trigger" class="text-sm font-medium leading-none">Category</label>
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
		</div>
	</div>

	<div>
		<label for="imageUrl" class="text-sm font-medium leading-none">Image URL</label>
		<Input id="imageUrl" name="imageUrl" bind:value={imageUrl} />
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
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[200px]">Name</Table.Head>
					<Table.Head>Category</Table.Head>
					<Table.Head class="text-right">Price</Table.Head>
					<Table.Head class="text-center">Status</Table.Head>
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
					</Table.Row>
				{:else}
					<Table.Row>
						<Table.Cell colspan={4} class="h-24 text-center">No menu items found.</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</div>