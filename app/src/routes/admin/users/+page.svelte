<script>
	import { enhance } from '$app/forms';
	import { Toaster, toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	/**
	 * @typedef {Object} User
	 * @property {number} id
	 * @property {string} username
	 * @property {Date} createdAt
	 */

	/** @type {User | null} */
	let selectedUser = null;
	let changePasswordOpen = false;
	let deleteUserOpen = false;

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	// Reactive statement to clear the form message after a few seconds
	$: if (form) {
		if (form.success) {
			toast.success(form.message);
		} else if (form.message) {
			toast.error(form.message);
		}
	}

	// Function to handle opening change password dialog
	function openChangePasswordDialog(user) {
		console.log('Opening change password dialog for:', user);
		selectedUser = user;
		changePasswordOpen = true;
		console.log('After setting: changePasswordOpen =', changePasswordOpen);
	}

	// Function to handle opening delete user dialog
	function openDeleteUserDialog(user) {
		console.log('Opening delete user dialog for:', user);
		selectedUser = user;
		deleteUserOpen = true;
		console.log('After setting: deleteUserOpen =', deleteUserOpen);
	}

	// Test functions for debugging
	function testChangePassword() {
		console.log('TEST: Change password clicked');
		changePasswordOpen = true;
	}

	function testDelete() {
		console.log('TEST: Delete clicked');
		deleteUserOpen = true;
	}

	// Debug reactive statements
	$: console.log('changePasswordOpen:', changePasswordOpen);
	$: console.log('deleteUserOpen:', deleteUserOpen);
	$: console.log('selectedUser:', selectedUser);
</script>

<div class="container mx-auto max-w-4xl p-4 md:p-8">
	<Toaster />
	<h1 class="mb-6 text-3xl font-bold text-gray-800">User Management</h1>



	<!-- Add User Form -->
	<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold text-gray-700">Add New User</h2>
		<form
			id="add-user-form"
			method="POST"
			action="?/addUser"
			class="space-y-4"
			use:enhance={() => {
				return async ({ result, update }) => {
					await update();
					if (result.type === 'success') {
						document.getElementById('add-user-form')?.reset();
					}
				};
			}}
		>
			<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
				<div class="grid w-full items-center gap-1.5">
					<Label for="username">Username</Label>
					<Input
						type="text"
						id="username"
						name="username"
						placeholder="e.g., john.doe"
						required
					/>
				</div>
				<div class="grid w-full items-center gap-1.5">
					<Label for="password">Password</Label>
					<Input
						type="password"
						id="password"
						name="password"
						placeholder="••••••••"
						required
						minlength="6"
					/>
				</div>
				<Button type="submit" class="w-full">Add User</Button>
			</div>
		</form>
	</div>

	<!-- User List -->
	<div class="overflow-hidden rounded-lg bg-white shadow-md">
		<h2 class="border-b border-gray-200 p-4 text-xl font-semibold text-gray-700">
			Existing Users
		</h2>
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Username</th
						>
						<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
							>Date Created</th
						>
						<th class="relative px-6 py-3">
							<span class="sr-only">Actions</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.users as user (user.id)}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
								{user.username}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{new Date(user.createdAt * 1000).toLocaleDateString()}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
								<div class="flex items-center justify-end space-x-2">
									<button 
										class="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50"
										on:click={() => openChangePasswordDialog(user)}
									>
										Change Password
									</button>
									<button 
										class="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
										on:click={() => openDeleteUserDialog(user)}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500"
								>No users found.</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Change Password Dialog -->
	<Dialog.Root bind:open={changePasswordOpen}>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Change Password for {selectedUser?.username || 'User'}</Dialog.Title>
				<Dialog.Description> Enter a new password for the user. </Dialog.Description>
			</Dialog.Header>
			<form
				method="POST"
				action="?/changePassword"
				class="space-y-4"
				use:enhance={() => {
					return async ({ result, update }) => {
						await update();
						if (result.type === 'success') {
							changePasswordOpen = false;
							selectedUser = null;
						}
					};
				}}
			>
				<input type="hidden" name="userId" value={selectedUser?.id || ''} />
				<div class="grid w-full items-center gap-1.5">
					<Label for="new-password">New Password</Label>
					<Input type="password" name="password" id="new-password" minlength="6" required />
				</div>
				<Dialog.Footer>
					<Button type="button" variant="outline" on:click={() => changePasswordOpen = false}>
						Cancel
					</Button>
					<Button type="submit">Save Changes</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Delete User Alert Dialog -->
	<AlertDialog.Root bind:open={deleteUserOpen}>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
				<AlertDialog.Description>
					This action cannot be undone. This will permanently delete the user account for
					<strong>{selectedUser?.username || 'this user'}</strong>.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel on:click={() => deleteUserOpen = false}>Cancel</AlertDialog.Cancel>
				<form
					id="delete-form"
					method="POST"
					action="?/deleteUser"
					use:enhance={() => {
						return async ({ result, update }) => {
							await update();
							if (result.type === 'success') {
								deleteUserOpen = false;
								selectedUser = null;
							}
						};
					}}
				>
					<input type="hidden" name="userId" value={selectedUser?.id || ''} />
				</form>
				<AlertDialog.Action form="delete-form" type="submit">Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
</div>

<style>
	/* Ensure dropdown items are clickable */
	[data-radix-collection-item] {
		cursor: pointer;
	}
</style>