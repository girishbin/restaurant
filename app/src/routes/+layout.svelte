<script>
	import '../app.css';
	import { Button } from '$lib/components/ui/button';

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/sideBar/app-sidebar.svelte";

	let { data, children } = $props();

	// Determine the home URL based on the user's role.
	// Admins go to the /admin dashboard, others go to the homepage.
	const homeUrl = data.user?.role === 'admin' ? '/admin' : '/';
</script>

<div class="grid grid-rows-[auto_1fr] h-screen w-screen overflow-hidden">
	<header class="p-4 bg-gradient-to-r from-primary/20 to-primary/40 border-b flex justify-between items-center z-10">
		<div class="flex items-center gap-6">
			<a href={homeUrl} aria-label="Back to homepage">
				<img src="/logo.svg" alt="Logo" class="w-24 h-24 rounded-full" />
			</a>
			<a href={homeUrl} class="text-4xl font-['Great_Vibes']">Tawa & Kettles Caffe</a>
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

	<div class="relative flex overflow-hidden">
		<Sidebar.Provider>
			<AppSidebar />
			<main class="relative z-20 flex-1 overflow-y-auto p-4">
				<Sidebar.Trigger />
				{@render children?.()}
			</main>
		</Sidebar.Provider>
	</div>
</div>

<!-- <main>
	{@render children()}
</main> -->
