<script lang="ts">
    import '../../app.css';
    import { Button } from "$lib/components/ui/button/index.js";


	let { children } = $props();
    
    let bookmarks = $state(false);
    let fullUrls = $state(true);
    let profileRadioValue = $state("benoit");
   </script>
    
   

   <Button> The Hunger Blocks </Button>
   <Button> Parazzas</Button>
   <Button> Raitas & others </Button>
   <Button> Parazza Seasoning & Sides </Button>
   <Button> Rice Bowls  </Button>
   <Button> Chai & Chomp </Button>
   <Button>Rolls </Button>
   <Button> Fresh-Warm Bread Treats </Button>
   <Button> Drinks</Button>
   <Button> Desserts </Button>

   {@render children()}