<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';
	import { page } from '$app/stores';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { allItems } from './menu-items';

	let { user } = $props();

	// Filter the items based on the current user's role.
	// If no user is logged in, the sidebar will be empty.
	const visibleItems = $derived(
		user ? allItems.filter((item) => item.roles.includes(user.role)) : []
	);

	// Reactive function to check if a parent menu item is active
	const isParentActive = (item) => {
		if (!item.children) return false;
		// A parent is active if the current path starts with the path of any of its children.
		// This handles both '/bill' and '/bill?category=...'
		const childBaseUrl = item.children[0]?.url.split('?')[0];
		return $page.url.pathname === childBaseUrl;
	};
</script>

<Sidebar.Root class="!absolute !h-full">
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each visibleItems as item (item.title)}
						{#if item.children && item.children.length > 0}
							<Collapsible.Root class="w-full">
								<Sidebar.MenuItem>
									<Collapsible.Trigger class="w-full">
										<Sidebar.MenuButton
											class={isParentActive(item)
												? 'bg-primary text-primary-foreground hover:bg-primary [&>div]:hidden'
												: '[&>div]:hidden'}
										>
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
											<a href={subItem.url} class="block pl-10 py-1.5 text-sm">
												<span
													class="rounded-md px-2 py-1"
													class:bg-primary={$page.url.pathname + $page.url.search ===
														subItem.url}
													class:text-primary-foreground={$page.url.pathname +
														$page.url.search ===
														subItem.url}
												>
													{#if subItem.icon}
														<subItem.icon class="inline w-4 h-4 mr-2" />
													{/if}
													{subItem.title}
												</span>
											</a>
										{/each}
									</Sidebar.Menu>
								</Collapsible.Content>
							</Collapsible.Root>
						{:else}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									class={item.url && $page.url.pathname.startsWith(item.url)
										? 'bg-primary text-primary-foreground hover:bg-primary'
										: ''}
								>
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
