<script>
	import { Button } from '$lib/components/ui/button/index.js';
	let { form } = $props();
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
	<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
		<h2 class="text-2xl font-bold text-center">Login</h2>

		{#if form?.message}
			<div class="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
				{form.message}
			</div>
		{/if}

		<form method="POST" action="?/login" class="space-y-6">
			<div>
				<label for="username" class="block mb-2 text-sm font-medium">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
					placeholder="admin or user"
					required
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
					placeholder="password"
					required
				/>
			</div>
			<Button type="submit" class="w-full">Login</Button>
		</form>
		<p class="text-sm text-center text-gray-500">Hint: Use user/password or admin/password</p>
	</div>
</div>