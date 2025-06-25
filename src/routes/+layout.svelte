<script>
  import '../app.css'
  
  /**
   * @typedef {object} Props
   * @property {import('svelte').Snippet} [children] - The children of the layout
   */

  /** @type {Props} */
  let { children } = $props()
</script>

<!-- Leave this. Or you can add more content for your custom layout -->
<main>
  {@render children?.()}
</main>

