
** This is a restaurant management system. **

** It has the following features: **


- Bill Management in /bill route
- Adding daily expense in /expense route

** Database Schema: **
- Uses drizzle-orm with postgres
- Schema is present in /src/lib/server/db/schema.ts

** UI: **
- Uses shadcn-svelte UI library components
- TailwindCSS
- SvelteKit

** Must Use **
- While calling a database always access the database connection using locals which is attached to the request lifecyle.
  Example:
     export const load = async ({ locals }) => {
  	 const { db } = locals;
         }
- Always use normal <button> while using or working with 'AlertDialog' shadcn component.