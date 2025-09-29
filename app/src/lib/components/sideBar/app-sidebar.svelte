<script lang="ts">
	import { BarChart, ClipboardPenLine, LogOut, UsersRound } from 'lucide-svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { user } = $props();

	// Define all possible menu items with the roles that can see them.
	const allItems = [
		{
			title: 'Make Bill',
			url: '/bill',
			icon: ClipboardPenLine,
			roles: ['admin', 'user'] // Accessible to all logged-in users
		},
		{
			title: 'View Reports',
			url: '/admin/reports',
			icon: BarChart,
			roles: ['admin'] // Accessible only to admins
		},
        {
            title: 'Users',
            url: '/admin/users',
            icon: UsersRound,
            roles: ['admin']
        },
        {
            title: 'Logout',
            url: '/login?/logout',
            icon: LogOut,
            roles: ['admin', 'user']
        }
	];

	// Filter the items based on the current user's role.
	// If no user is logged in, the sidebar will be empty.
	const visibleItems = $derived(
		user ? allItems.filter((item) => item.roles.includes(user.role)) : []
	);
</script>

<Sidebar.Root class="!absolute !h-full">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each visibleItems as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>