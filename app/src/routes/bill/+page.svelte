<script>
    import MenuItem from '../../lib/components/dishcard/dishcard.svelte';
    import { createEventDispatcher } from 'svelte';
    
    let cartItems = [];
    
    const menuItems = [
      {
        id: 1,
        name: "Margherita Pizza",
        price: 299,
        image: "https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Fresh tomatoes, mozzarella, and basil"
      },
      {
        id: 2,
        name: "Chicken Biryani",
        price: 349,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
        description: "Aromatic basmati rice with spiced chicken"
      }
    ];
  
    function handleQuantityChange(event) {
      const { item, quantity, total } = event.detail;
      
      // Update cart logic here
      const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
      
      if (quantity === 0) {
        cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
      } else if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.total = total;
      } else {
        cartItems = [...cartItems, { ...item, quantity, total }];
      }
      
      console.log('Cart updated:', cartItems);
    }
  </script>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    {#each menuItems as item}
      <MenuItem 
        {item} 
        on:quantityChange={handleQuantityChange}
      />
    {/each}
  </div>