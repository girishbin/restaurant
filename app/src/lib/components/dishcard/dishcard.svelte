<script>
    import { createEventDispatcher } from 'svelte';
    
    // Props
    export let item = {
      id: 1,
      name: 'Sample Dish',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      description: 'Delicious sample dish'
    };
    export let quantity = 0;
    export let maxQuantity = 10;
  
    const dispatch = createEventDispatcher();
  
    // Functions
    function decreaseQuantity() {
      if (quantity > 0) {
        quantity -= 1;
        dispatch('quantityChange', { 
          item: item, 
          quantity: quantity,
          total: item.price * quantity 
        });
      }
    }
  
    function increaseQuantity() {
      if (quantity < maxQuantity) {
        quantity += 1;
        dispatch('quantityChange', { 
          item: item, 
          quantity: quantity,
          total: item.price * quantity 
        });
      }
    }
  
    // Reactive statements
    $: totalPrice = (item.price * quantity).toFixed(2);
    $: isInCart = quantity > 0;
  </script>
  
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
    <!-- Image Section -->
    <div class="relative h-48 overflow-hidden">
      {#if item.imageUrl}
        <img
          src={item.imageUrl}
          alt={item.name}
          class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
      {:else}
        <div class="flex h-full w-full items-center justify-center bg-gray-200">
          <span class="text-gray-500">No Image</span>
        </div>
      {/if}
      {#if isInCart}
        <div class="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          In Cart
        </div>
      {/if}
    </div>
  
    <!-- Content Section -->
    <div class="p-4">
      <!-- Item Info -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
        {#if item.description}
          <p class="text-sm text-gray-600 mb-2">{item.description}</p>
        {/if}
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-green-600">₹{item.price}</span>
          {#if isInCart}
            <span class="text-sm font-medium text-gray-600">
              Total: ₹{totalPrice}
            </span>
          {/if}
        </div>
      </div>
  
      <!-- Quantity Controls -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button 
            on:click={decreaseQuantity}
            disabled={quantity <= 0}
            class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center transition-colors duration-150"
          >
            -
          </button>
          
          <span class="w-8 text-center font-semibold text-lg text-gray-800">
            {quantity}
          </span>
          
          <button 
            on:click={increaseQuantity}
            disabled={quantity >= maxQuantity}
            class="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg flex items-center justify-center transition-colors duration-150"
          >
            +
          </button>
        </div>
  
        {#if isInCart}
          <div class="text-right">
            <div class="text-xs text-gray-500">Qty: {quantity}</div>
          </div>
        {/if}
      </div>
  
      <!-- Add to Cart Button (optional, shows when quantity is 0) -->
      {#if quantity === 0}
        <button 
          on:click={increaseQuantity}
          class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-150"
        >
          Add to Cart
        </button>
      {/if}
    </div>
  </div>
  
  <style>
    /* Additional custom styles if needed */
  </style>