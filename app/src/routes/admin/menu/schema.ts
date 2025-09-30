import { z } from 'zod';

export const categories = [
	'Paranthas',
	'Parazzas',
	'Raita',
	'Sandwiches',
	'Rolls',
	'Beverages'
] as const;

export const formSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters long.'),
	description: z.string().optional(),
	price: z.coerce.number().positive('Price must be a positive number.'),
	category: z.enum(categories),
	imageUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
	isActive: z.boolean().default(true)
});

export type FormSchema = typeof formSchema;