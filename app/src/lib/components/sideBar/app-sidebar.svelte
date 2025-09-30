<script lang="ts">
	import {
		BarChart,
		ClipboardPenLine,
		LogOut,
		UsersRound,
		NotebookTabs,
		ChevronRight
	} from 'lucide-svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	let { user } = $props();

	// Define all possible menu items with the roles that can see them.
	const allItems = [
		{
			title: 'Make Bill',
			icon: ClipboardPenLine,
			roles: ['admin', 'user'], // Accessible to all logged-in users
			children: [
				{
					title: 'All Items',
					url: '/bill',
					roles: ['admin', 'user']
				},
				{
					title: 'Paranthas',
					url: '/bill?category=Paranthas',
					roles: ['admin', 'user']
				},
				{
					title: 'Parazzas',
					url: '/bill?category=Parazzas',
					roles: ['admin', 'user']
				},
				{
					title: 'Rolls',
					url: '/bill?category=Rolls',
					roles: ['admin', 'user']
				},
				{
					title: 'Sandwiches',
					url: '/bill?category=Sandwiches',
					roles: ['admin', 'user']
				}
			]
		},
		{
			title: 'Recent Orders',
			url: '/bill/recent',
			icon: NotebookTabs,
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
						{#if item.children && item.children.length > 0}
							<Collapsible.Root class="w-full">
								<Sidebar.MenuItem>
									<Collapsible.Trigger class="w-full">
										<Sidebar.MenuButton class="[&>div]:hidden">
											{#snippet child({ props })}
												<div {...props}>
													<item.icon />
													<span>{item.title}</span>
													<ChevronRight
														class="ml-auto h-4 w-4 transition-transform [&[data-state=open]]:rotate-90"
													/>
												</div>
											{/snippet}
										</Sidebar.MenuButton>
									</Collapsible.Trigger>
								</Sidebar.MenuItem>
								<Collapsible.Content>
									<Sidebar.Menu>
										{#each item.children as subItem (subItem.title)}
											<a href={subItem.url} class="pl-10">{subItem.title}</a>
										{/each}
									</Sidebar.Menu>
								</Collapsible.Content>
							</Collapsible.Root>
						{:else}
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
						{/if}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>