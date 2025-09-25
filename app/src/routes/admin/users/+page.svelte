<script>
	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	// Reactive statement to clear the form message after a few seconds
	$: if (form) {
		setTimeout(() => {
			form = null;
		}, 3000);
	}
</script>

<div class="container mx-auto max-w-4xl p-4 md:p-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">User Management</h1>

	<!-- Add User Form -->
	<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold text-gray-700">Add New User</h2>
		<form method="POST" action="?/addUser" class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div>
					<label for="username" class="mb-1 block text-sm font-medium text-gray-600"
						>Username</label
					>
					<input
						type="text"
						id="username"
						name="username"
						required
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label for="password" class="mb-1 block text-sm font-medium text-gray-600"
						>Password</label
					>
					<input
						type="password"
						id="password"
						name="password"
						required
						minlength="6"
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
				<div class="self-end">
					<button
						type="submit"
						class="w-full rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
					>
						Add User
					</button>
				</div>
			</div>
			{#if form}
				<p class:text-green-600={form.success} class:text-red-600={!form.success}>
					{form.message}
				</p>
			{/if}
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
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.users as user (user.id)}
						<tr>
							<td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
								>{user.username}</td
							>
							<td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{new Date(user.createdAt * 1000).toLocaleDateString()}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="2" class="px-6 py-4 text-center text-sm text-gray-500"
								>No users found.</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>