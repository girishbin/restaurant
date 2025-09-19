<script>
	import { cart } from '$lib/stores/cart.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Minus, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let showCart = $state(false);
</script>

{#if cart.totalItems > 0}
	<div class="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center">
		<div class="w-full max-w-2xl">
			{#if showCart}
				<div transition:slide={{ duration: 200, axis: 'y' }}>
					<Card>
						<CardHeader class="flex flex-row items-center justify-between p-4">
							<CardTitle>Your Cart ({cart.totalItems})</CardTitle>
							<Button type="button" variant="ghost" size="icon" onclick={() => (showCart = false)}>
								<ChevronDown class="h-4 w-4" />
								<span class="sr-only">Hide Cart</span>
							</Button>
						</CardHeader>
						<CardContent class="max-h-60 overflow-y-auto p-4">
							<div class="grid gap-4">
								{#each Array.from(cart.items.values()) as item (item.id)}
									<div class="flex items-center justify-between">
										<div>
											<p class="font-medium">{item.name}</p>
											<p class="text-sm text-muted-foreground">
												₹{Number(item.price).toFixed(2)}
											</p>
										</div>
										<div class="flex items-center gap-2">
											<Button
												variant="outline"
												size="icon"
												type="button"
												class="h-8 w-8"
												onclick={() => cart.updateItemQuantity(item, item.quantity - 1)}
											>
												{#if item.quantity > 1}
													<Minus class="h-4 w-4" />
												{:else}
													<Trash2 class="h-4 w-4" />
												{/if}
											</Button>
											<span>{item.quantity}</span>
											<Button
												variant="outline"
												size="icon"
												type="button"
												class="h-8 w-8"
												onclick={() => cart.updateItemQuantity(item, item.quantity + 1)}
											>
												<Plus class="h-4 w-4" />
											</Button>
										</div>
									</div>
								{/each}
							</div>
						</CardContent>
						<CardFooter class="flex items-center justify-between p-4">
							<p class="font-semibold">Total: ₹{cart.totalPrice.toFixed(2)}</p>
							<!-- This button now navigates to the checkout page, which reads from the global cart store. -->
							<Button href="/bill/checkout">Checkout</Button>
						</CardFooter>
					</Card>
				</div>
			{:else}
				<div class="flex justify-center">
					<Button onclick={() => (showCart = true)} class="w-full shadow-lg">
						View Cart ({cart.totalItems}) - ₹{cart.totalPrice.toFixed(2)}
						<ChevronUp class="ml-2 h-4 w-4" />
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
