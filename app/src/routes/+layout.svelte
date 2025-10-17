<script>
	import '../app.css';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import AppSidebar from "$lib/components/sideBar/app-sidebar.svelte";

	let { data, children } = $props();

	// Determine the home URL based on the user's role.
	// Admins go to the /admin dashboard, others go to the homepage.
	const homeUrl = data.user?.role === 'admin' ? '/admin' : '/';

	// Check if current route is login page
	const isLoginPage = $derived($page.url.pathname === '/login');
</script>

<!-- This is a hidden container for content that needs to be printed. -->
<div id="print-container" class="hidden print:block"></div>

<!-- Single flex container for the entire app -->
<!-- The main app view, which will be hidden during printing. -->
<div class="h-screen w-screen overflow-y-auto print:hidden">
	<!-- Header - now part of the scrollable content -->
	<header class="flex-shrink-0 p-4 bg-gradient-to-r from-primary/20 to-primary/40 border-b flex justify-between items-center z-50">
		<div class="flex items-center gap-6">
			<a href={homeUrl} aria-label="Back to homepage">
				<img src="/logo.svg" alt="Logo" class="w-24 h-24 rounded-full" />
			</a>
			<a href={homeUrl} class="text-4xl font-['Great_Vibes']">Tawa & Kettles Cafe</a>
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

	<!-- Main content area -->
	<div class="flex relative">
		{#if isLoginPage}
			<!-- Login page without sidebar -->
			<main class="flex-1 p-6">
				{@render children?.()}
			</main>
		{:else}
			<!-- Regular pages with sidebar -->
			<Sidebar.Provider>
				<!-- Sidebar -->
				<AppSidebar user={data.user} />
				
				<!-- Main content - takes remaining width -->
				<div class="flex-1 flex flex-col min-w-0 relative z-10">
					<!-- Sidebar trigger -->
					<div class="p-4 border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
						<Sidebar.Trigger />
					</div>
					
					<!-- Page content - scrollable -->
					<main class="flex-1 p-6">
						{@render children?.()}
					</main>
				</div>
			</Sidebar.Provider>
		{/if}
	</div>
</div>