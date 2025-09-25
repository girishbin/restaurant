<script>
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button/index.js';
    
    function navigateToBill() {
      goto('/bill/');
    }
    
    function navigateToAdmin() {
      goto('/admin/all-bills');
    }
  </script>
  
  
  <link rel="icon" href="./favicon.svg" />

<div class="p-8 flex justify-center gap-4">
  <Button onclick={navigateToBill}>Make Bill</Button>
  <Button onclick={navigateToAdmin}>View bills</Button>
</div>
