<script>
	import '../app.css';
	import { Button } from '$lib/components/ui/button';

	let { data, children } = $props();
</script>

<header class="p-4 bg-gray-100 dark:bg-gray-800 border-b flex justify-between items-center">
	<a href="/" class="text-xl font-bold">Restaurant POS</a>
	{#if data.user}
		<div class="flex items-center gap-4">
			<span>Welcome, <span class="font-semibold">{data.user.username}</span> ({data.user.role})</span>
			<form action="/login?/logout" method="POST">
				<Button type="submit" variant="outline">Logout</Button>
			</form>
		</div>
	{:else}
		<Button href="/login">Login</Button>
	{/if}
</header>

<main>
	{@render children()}
</main>
