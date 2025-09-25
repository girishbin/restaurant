

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
  
  <h1>Welcome to Tawa & Kettle Caffe</h1>
  <link rel="icon" href="favicon.ico" />

  <Button onclick={navigateToBill}>Go to Bills</Button>
  <Button onclick={navigateToAdmin}>Go to Admin</Button>
  