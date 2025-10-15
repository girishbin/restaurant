import { BarChart, Banknote, ClipboardPenLine, LogOut, NotebookTabs, UsersRound, CookingPot, icons } from 'lucide-svelte';

import { Building2, Cog, ChartLine } from 'lucide-svelte'; 

// Define all possible menu items with the roles that can see them.
export const allItems = [
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
				title: 'Raita',
				url: '/bill?category=Raita',
				roles: ['admin', 'user']
			},
			{
				title: 'Rice-bowls',
				url: '/bill?category=Rice-bowls',
				roles: ['admin', 'user']
			},
			{
				title: 'Sandwiches',
				url: '/bill?category=Sandwiches',
				roles: ['admin', 'user']
			},
			{
				title: 'Rolls',
				url: '/bill?category=Rolls',
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
		title: 'Menu Manager',
		url: '/admin/menu',
		icon: CookingPot,
		roles: ['admin'] // Accessible only to admins
	},
	{
		title: 'Expenses',
		url: '/expenses',
		icon: Banknote,
		roles: ['admin','user'] // Accessible only to admins
	},
	{
		title: 'View Reports',
		url: '/admin/reports',
		icon: BarChart,
		roles: ['admin'], // Accessible only to admins
		children: [
			{
				title: 'Sales',
				url: '/admin/reports/sales',
				icon: ChartLine,
				roles: ['admin']
			},
			{
				title: 'Expenses',
				url: '/admin/reports/expenses',
				icon: ChartLine,
				roles: ['admin']
			}
		]
	},
	{
		title: 'Settings',
		icon: Cog,
		roles: ['admin'],
		children: [
			{
				title: 'User Management',
				url: '/admin/settings/users',
				icon: UsersRound,
				roles: ['admin']
			},
			{
				title: 'Cafe Settings',
				url: '/admin/settings/cafe',
				icon: Building2,
				roles: ['admin']
			}
		]
	},
	{
		title: 'Logout',
		url: '/login?/logout',
		icon: LogOut,
		roles: ['admin', 'user'] // Accessible to all logged-in users
	}
];