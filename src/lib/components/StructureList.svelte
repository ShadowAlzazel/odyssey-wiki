<script>
  import { base } from '$app/paths'

  let { groups = [] } = $props()
</script>

<div class="structures">
  {#each groups as g (g.id)}
    {#if g.items.length}
      <section class="group" id={g.id}>
        <h2>{g.label}</h2>
        <p class="blurb">{g.blurb}</p>
        <div class="grid">
          {#each g.items as s (s.slug)}
            <a class="card" href="{base}/world/structure/{s.slug}">
              <h3>{s.name}</h3>
              <p class="meta">
                {#if s.rarity}<span class="rarity rarity--{s.rarity.label.toLowerCase().replace(' ', '-')}">{s.rarity.label}</span>{/if}
                {#if s.where.length}<span>{s.where.join(', ')}</span>{/if}
              </p>
              {#if s.dimensions.length > 1}<p class="also">Overworld and the Edge</p>{/if}
              {#if s.loot.length}<p class="also">Loot: {s.loot.map((l) => l.label.toLowerCase()).join(', ')}</p>{/if}
            </a>
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>

<style>
  .structures {
    --accent: #7a6bd6;
    --muted: color-mix(in srgb, currentColor 58%, transparent);
    --hairline: color-mix(in srgb, currentColor 14%, transparent);
    --panel: color-mix(in srgb, currentColor 4%, transparent);
  }
  .group { margin: 1.5rem 0 2rem; }
  .group h2 { margin-bottom: 0.25rem; }
  .blurb { margin: 0 0 1rem; color: var(--muted); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
  .card {
    display: block; padding: 0.8rem 0.9rem; border-radius: 10px; border: 1px solid var(--hairline);
    background: var(--panel); color: inherit; text-decoration: none; transition: transform 0.12s ease, border-color 0.12s ease;
  }
  .card:hover { transform: translateY(-2px); border-color: var(--accent); }
  .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .card h3 { margin: 0 0 0.35rem; font-size: 1rem; border: 0; padding: 0; }
  .meta { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; margin: 0; font-size: 0.8rem; color: var(--muted); }
  .rarity { padding: 0.05rem 0.5rem; border-radius: 999px; font-weight: 600; color: #fff; background: #6b8f71; }
  .rarity--uncommon { background: #4f7fb8; }
  .rarity--rare { background: #8a5bc2; }
  .rarity--very-rare { background: #b8742a; }
  .also { margin: 0.35rem 0 0; font-size: 0.78rem; color: var(--muted); }
</style>
