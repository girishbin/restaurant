<script>
	import { enhance } from '$app/forms';
	import { Toaster, toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card/index.js';

	export let data;
	export let form;

	// Reactive statement to show toast notifications based on form action results
	$: if (form) {
		if (form.success) {
			toast.success(form.message);
		} else if (form.message) {
			toast.error(form.message);
		}
	}
</script>

<div class="w-full max-w-2xl mx-auto p-4 md:p-8">
	<Toaster />
	<Card>
		<CardHeader>
			<CardTitle>Cafe Settings</CardTitle>
			<CardDescription>Update the general information for your cafe.</CardDescription>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				use:enhance={() => {
					return async ({ update }) => {
						await update({ reset: false });
					};
				}}
				class="space-y-6"
			>
				<div class="space-y-2">
					<Label for="cafeName">Cafe Name</Label>
					<Input
						id="cafeName"
						name="cafeName"
						placeholder="Your Cafe's Name"
						value={data.settings?.cafeName ?? ''}
					/>
					{#if form?.errors?.cafeName}
						<p class="text-sm text-destructive">{form.errors.cafeName[0]}</p>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="cafePhone">Phone Number</Label>
					<Input
						id="cafePhone"
						name="cafePhone"
						placeholder="Contact Phone Number"
						value={data.settings?.cafePhone ?? ''}
					/>
				</div>

				<div class="space-y-2">
					<Label for="cafeAddress">Address</Label>
					<Textarea
						id="cafeAddress"
						name="cafeAddress"
						placeholder="Cafe's Full Address"
						value={data.settings?.cafeAddress ?? ''}
					/>
				</div>

				<Button type="submit" class="w-full">Save Settings</Button>
			</form>
		</CardContent>
	</Card>
</div>
