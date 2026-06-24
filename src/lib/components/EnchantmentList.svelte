<script>
  import { enchantments as allEnchants, groups } from '$lib/data/enchantments.js'

  // Props (all optional). Pass your own data/groups to reuse this elsewhere.
  let {
    enchantments = allEnchants,
    groupList = groups,
  } = $props()

  let query = $state('')
  let active = $state('all') // 'all' | group id

  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  const roman = (n) => ROMAN[n] ?? String(n)

  // Filter + sort once, reactively.
  const filtered = $derived(
    enchantments
      .filter((e) => active === 'all' || e.group === active)
      .filter((e) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          e.name.toLowerCase().includes(q) ||
          e.desc.toLowerCase().includes(q) ||
          e.tag.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name)),
  )

  // Group the filtered list, preserving the order defined in groupList.
  const sections = $derived(
    groupList
      .map((g) => ({ ...g, items: filtered.filter((e) => e.group === g.id) }))
      .filter((g) => g.items.length > 0),
  )

  const total = $derived(filtered.length)
</script>

<div class="ench">
  <div class="ench__toolbar">
    <input
      class="ench__search"
      type="search"
      placeholder="Search enchantments…"
      bind:value={query}
      aria-label="Search enchantments"
    />
    <div class="ench__filters" role="group" aria-label="Filter by category">
      <button
        class="chip"
        class:chip--on={active === 'all'}
        aria-pressed={active === 'all'}
        onclick={() => (active = 'all')}
      >All</button>
      {#each groupList as g}
        <button
          class="chip"
          class:chip--on={active === g.id}
          aria-pressed={active === g.id}
          onclick={() => (active = g.id)}
        >{g.label}</button>
      {/each}
    </div>
    <p class="ench__count">{total} {total === 1 ? 'enchantment' : 'enchantments'}</p>
  </div>

  {#if sections.length === 0}
    <p class="ench__empty">No enchantments match “{query}”. Try a different term.</p>
  {/if}

  {#each sections as section (section.id)}
    <section class="ench__group">
      <header class="ench__grouphead">
        <h2 id={section.id}>{section.label}</h2>
        <p>{section.blurb}</p>
      </header>

      <div class="ench__grid">
        {#each section.items as e (e.name)}
          <article class="card">
            <div class="card__top">
              <h3 class="card__name">{e.name}</h3>
              <div class="card__badges">
                <span class="badge badge--level" title="Maximum level">
                  Max&nbsp;{roman(e.max)}
                </span>
                {#if e.cost == null}
                  <span class="badge badge--none" title="Not used by vanilla enchantments">—</span>
                {:else}
                  <span class="badge badge--cost" title="Enchantability cost">
                    {e.cost}&nbsp;pt{e.cost === 1 ? '' : 's'}
                  </span>
                {/if}
              </div>
            </div>
            <span class="card__tag">{e.tag}</span>
            <p class="card__desc">{e.desc}</p>
          </article>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  /* Theme hooks — fall back gracefully if SveltePress vars aren't present.   */
  .ench {
    --accent: #8a63d2;          /* enchanting-table violet */
    --accent-soft: #b79cf0;
    --xp: #6bbf3f;              /* experience-orb green     */
    --card-bg: rgba(138, 99, 210, 0.05);
    --card-bd: rgba(138, 99, 210, 0.22);
    --chip-bg: rgba(138, 99, 210, 0.08);
    --muted: color-mix(in srgb, currentColor 55%, transparent);
    --hairline: color-mix(in srgb, currentColor 12%, transparent);
    margin: 1.25rem 0 2rem;
  }
  :global(html.dark) .ench,
  :global(.dark) .ench {
    --card-bg: rgba(138, 99, 210, 0.12);
    --card-bd: rgba(183, 156, 240, 0.3);
    --chip-bg: rgba(138, 99, 210, 0.16);
  }

  /* Toolbar ---------------------------------------------------------------- */
  .ench__toolbar { margin-bottom: 1.5rem; }
  .ench__search {
    width: 100%;
    box-sizing: border-box;
    padding: 0.6rem 0.85rem;
    font: inherit;
    color: inherit;
    background: var(--chip-bg);
    border: 1px solid var(--card-bd);
    border-radius: 8px;
    outline: none;
  }
  .ench__search:focus-visible {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 30%, transparent);
  }
  .ench__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.75rem;
  }
  .chip {
    padding: 0.3rem 0.7rem;
    font: inherit;
    font-size: 0.82rem;
    line-height: 1.4;
    color: inherit;
    background: var(--chip-bg);
    border: 1px solid var(--card-bd);
    border-radius: 999px;
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease, border-color 0.12s ease;
  }
  .chip:hover { border-color: var(--accent); }
  .chip--on {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .chip:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  .ench__count {
    margin: 0.75rem 0 0;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .ench__empty {
    padding: 2rem 0;
    color: var(--muted);
    text-align: center;
  }

  /* Group ------------------------------------------------------------------ */
  .ench__group { margin-top: 2.25rem; }
  .ench__grouphead { border-bottom: 1px solid var(--hairline); margin-bottom: 1rem; }
  .ench__grouphead h2 {
    margin: 0;
    font-size: 1.15rem;
    letter-spacing: 0.02em;
  }
  .ench__grouphead p {
    margin: 0.15rem 0 0.6rem;
    font-size: 0.85rem;
    color: var(--muted);
  }

  /* Cards ------------------------------------------------------------------ */
  .ench__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.75rem;
  }
  .card {
    position: relative;
    padding: 0.85rem 0.95rem 0.95rem;
    background: var(--card-bg);
    border: 1px solid var(--card-bd);
    border-left: 3px solid var(--accent);   /* the one bold cue: enchant glint */
    border-radius: 8px;
  }
  .card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .card__name {
    margin: 0;
    font-size: 1rem;
    line-height: 1.3;
  }
  .card__badges {
    display: flex;
    flex-shrink: 0;
    gap: 0.35rem;
  }
  .badge {
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 0.72rem;
    white-space: nowrap;
    padding: 0.15rem 0.45rem;
    border-radius: 5px;
    border: 1px solid transparent;
  }
  .badge--level {
    color: var(--accent-soft);
    background: color-mix(in srgb, var(--accent) 16%, transparent);
    border-color: color-mix(in srgb, var(--accent) 35%, transparent);
  }
  .badge--cost {
    color: var(--xp);
    background: color-mix(in srgb, var(--xp) 14%, transparent);
    border-color: color-mix(in srgb, var(--xp) 35%, transparent);
  }
  .badge--none { color: var(--muted); }

  .card__tag {
    display: inline-block;
    margin-top: 0.45rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
  }
  .card__desc {
    margin: 0.35rem 0 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  @media (prefers-reduced-motion: reduce) {
    .chip { transition: none; }
  }
</style>