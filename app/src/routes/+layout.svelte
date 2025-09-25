<script>
	import '../app.css';
	import { Button } from '$lib/components/ui/button';

	let { data, children } = $props();
</script>

<header class="p-4 bg-gradient-to-r from-primary/10 to-primary/30 border-b flex justify-between items-center">
	<div class="flex items-center gap-6">
		<a href="/" aria-label="Back to homepage">
			<img src="/logo.svg" alt="Logo" class="w-24 h-24" />
		</a>
		<a href="/" class="text-4xl font-['Great_Vibes']">Tawa & Kettles Caffe</a>
	</div>
	{#if data.user}
		<div class="flex items-center gap-4 text-primary-foreground">
			<span class="font-semibold text-black">{data.user.username}</span>
			<form action="/login?/logout" method="POST">
				<Button type="submit">Logout</Button>
			</form>
		</div>
	{:else}
		<Button href="/login">Login</Button>
	{/if}
</header>

<main>
	{@render children()}
</main>
