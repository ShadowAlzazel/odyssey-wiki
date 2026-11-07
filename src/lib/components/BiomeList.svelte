<script>
  import { base } from '$app/paths'

  let { biomes = [], groups = [] } = $props()

  let query = $state('')
  let active = $state('all')

  const matches = (b) => {
    if (active !== 'all' && b.group !== active) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [b.name, b.inspiration ?? '', ...b.categories, b.climate.temperature, b.climate.humidity]
      .join(' ')
      .toLowerCase()
      .includes(q)
  }

  const visible = $derived(groups.map((g) => ({ ...g, items: biomes.filter((b) => b.group === g.id && matches(b)) })))
  const total = $derived(visible.reduce((n, g) => n + g.items.length, 0))

  // Card art: a screenshot when there is one, otherwise a sky -> ground gradient from the biome's own colours.
  const art = (b) =>
    b.image
      ? `background-image:url('${base}${b.image}')`
      : `background-image:linear-gradient(180deg, ${b.colors.sky ?? '#78a7ff'} 0%, ${b.colors.fog ?? '#c0d8ff'} 45%, ${b.colors.grass ?? b.colors.foliage ?? '#79c05a'} 46%, ${b.colors.foliage ?? b.colors.grass ?? '#59ae30'} 100%)`
</script>

<div class="biomes">
  <div class="controls">
    <input class="search" type="search" placeholder="Search biomes, places, climates…" bind:value={query} aria-label="Search biomes" />
    <div class="chips" role="group" aria-label="Filter by dimension">
      <button class="chip" aria-pressed={active === 'all'} onclick={() => (active = 'all')}>All · {biomes.length}</button>
      {#each groups as g}
        <button class="chip" aria-pressed={active === g.id} onclick={() => (active = g.id)}>{g.label} · {g.count}</button>
      {/each}
    </div>
  </div>

  {#each visible as g (g.id)}
    {#if g.items.length}
      <section class="group" id={g.id}>
        <h2>{g.label}</h2>
        {#if g.blurb}<p class="blurb">{g.blurb}</p>{/if}
        <div class="grid">
          {#each g.items as b (b.slug)}
            <a class="card" href="{base}/world/biome/{b.slug}">
              <div class="art" style={art(b)}>
                {#if b.cave}<span class="badge">Cave</span>{/if}
              </div>
              <div class="body">
                <h3>{b.name}</h3>
                {#if b.inspiration}<p class="place">{b.inspiration}</p>{/if}
                <p class="meta">
                  {b.climate.temperature} · {b.climate.humidity}{#if b.climate.precipitation !== 'Rain'} · {b.climate.precipitation === 'None' ? 'No rain' : b.climate.precipitation}{/if}
                </p>
              </div>
            </a>
          {/each}
        </div>
      </section>
    {/if}
  {/each}

  {#if total === 0}
    <p class="empty">No biomes match “{query}”.</p>
  {/if}
</div>

<style>
  .biomes {
    --muted: color-mix(in srgb, currentColor 58%, transparent);
    --hairline: color-mix(in srgb, currentColor 14%, transparent);
    --panel: color-mix(in srgb, currentColor 4%, transparent);
    --accent: #3f9b6b;
  }
  .controls { display: flex; flex-direction: column; gap: 0.75rem; margin: 1rem 0 1.5rem; }
  .search {
    width: 100%; padding: 0.55rem 0.8rem; border-radius: 8px; font: inherit; color: inherit;
    border: 1px solid var(--hairline); background: var(--panel);
  }
  .search:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
  .chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip {
    font: inherit; font-size: 0.82rem; color: inherit; cursor: pointer;
    padding: 0.3rem 0.75rem; border-radius: 999px; border: 1px solid var(--hairline); background: transparent;
  }
  .chip[aria-pressed='true'] { background: var(--accent); border-color: var(--accent); color: #fff; }

  .group { margin-bottom: 2rem; }
  .group h2 { margin-bottom: 0.25rem; }
  .blurb { margin: 0 0 1rem; color: var(--muted); }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 0.85rem; }
  @media (max-width: 520px) {
    .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }
    .body { padding: 0.5rem 0.6rem 0.6rem; }
  }
  .card {
    display: flex; flex-direction: column; border-radius: 10px; overflow: hidden; color: inherit;
    text-decoration: none; border: 1px solid var(--hairline); background: var(--panel);
    transition: transform 0.12s ease, border-color 0.12s ease;
  }
  .card:hover { transform: translateY(-2px); border-color: var(--accent); }
  .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .art { position: relative; aspect-ratio: 16 / 9; background-size: cover; background-position: center; }
  .badge {
    position: absolute; top: 0.45rem; right: 0.45rem; font-size: 0.7rem; padding: 0.1rem 0.45rem;
    border-radius: 999px; background: rgba(0, 0, 0, 0.55); color: #fff;
  }
  .body { padding: 0.6rem 0.75rem 0.7rem; }
  .body h3 { margin: 0; font-size: 1rem; border: 0; padding: 0; }
  .place { margin: 0.15rem 0 0; font-size: 0.78rem; color: var(--muted); line-height: 1.35; }
  .meta { margin: 0.35rem 0 0; font-size: 0.78rem; }
  .empty { color: var(--muted); }
</style>
