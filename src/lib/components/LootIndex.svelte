<script>
  import { base } from '$app/paths'

  let { tables = [], groups = [] } = $props()
  let query = $state('')

  const visible = $derived(
    groups
      .map((g) => ({ ...g, items: tables.filter((t) => t.group === g.id && t.path.includes(query.trim().toLowerCase())) }))
      .filter((g) => g.items.length),
  )
</script>

<input class="search" type="search" placeholder="Filter by path, e.g. vault/ or fishing" bind:value={query} aria-label="Filter loot tables" />

{#each visible as g (g.id)}
  <section class="group">
    <h2 id={g.id}>{g.label} <small>{g.items.length}</small></h2>
    <p class="blurb">{g.blurb}{#if g.wiki} <a class="mc" href={g.wiki} target="_blank" rel="noopener">Minecraft Wiki ↗</a>{/if}</p>
    <ul class="paths">
      {#each g.items as t (t.path)}
        <li><a href="{base}/loot/{t.path}"><code>{t.path}</code></a> <span>{t.pools} pool{t.pools === 1 ? '' : 's'}</span></li>
      {/each}
    </ul>
  </section>
{/each}

<style>
  .search {
    width: 100%; padding: 0.55rem 0.8rem; border-radius: 8px; font: inherit; color: inherit; margin: 0.5rem 0 1rem;
    border: 1px solid color-mix(in srgb, currentColor 14%, transparent); background: color-mix(in srgb, currentColor 4%, transparent);
  }
  .group h2 small { font-size: 0.8rem; font-weight: 400; opacity: 0.6; }
  .blurb { margin: 0 0 0.6rem; opacity: 0.65; font-size: 0.9rem; }
  .mc { color: inherit; font-size: 0.8rem; }
  .paths { list-style: none; padding: 0; margin: 0 0 1.5rem; columns: 2 18rem; column-gap: 1.5rem; }
  .paths li { margin: 0 0 0.25rem; break-inside: avoid; font-size: 0.85rem; }
  .paths a { color: #c08a2e; text-decoration: none; }
  .paths a:hover { text-decoration: underline; }
  .paths span { opacity: 0.55; font-size: 0.75rem; }
</style>
