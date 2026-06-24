<script>
  import { base } from '$app/paths'

  let { enchantment: e } = $props()

  const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
  const roman = (n) => ROMAN[n] ?? String(n)

  // Cost band at a given level, from a {base, per_level_above_first} object.
  const costAtLevel = (cost, level) =>
    cost ? cost.base + (level - 1) * (cost.per_level_above_first ?? 0) : null

  const levels = $derived(Array.from({ length: e.maxLevel }, (_, i) => i + 1))
  const hasCostTable = $derived(Boolean(e.minCost || e.maxCost))
  const hasEffects = $derived(e.effects && Object.keys(e.effects).length > 0)
  const rawJson = $derived(JSON.stringify(e.raw, null, 2))
</script>

<article class="detail">
  <a class="detail__back" href="{base}/enchanting/enchantments">← All enchantments</a>

  <header class="detail__head">
    <span class="detail__eyebrow">{e.tag}</span>
    <h1>{e.name}</h1>
    <p class="detail__desc">{e.desc}</p>
    {#if !e.hasDescription}
      <p class="detail__note">Description not yet written — showing the definition's fallback.</p>
    {/if}
  </header>

  <dl class="stats">
    <div class="stat stat--hero">
      <dt>Enchantability</dt>
      <dd>{e.enchantability}</dd>
      <small>anvil cost ÷ 2</small>
    </div>
    <div class="stat">
      <dt>Max level</dt>
      <dd>{roman(e.maxLevel)}</dd>
    </div>
    <div class="stat">
      <dt>Anvil cost</dt>
      <dd>{e.anvilCost}</dd>
    </div>
    <div class="stat">
      <dt>Weight</dt>
      <dd>{e.weight ?? '—'}</dd>
    </div>
  </dl>

  {#if hasCostTable}
    <section class="block">
      <h2>Enchanting cost by level</h2>
      <p class="block__hint">The power band used when this enchantment can appear at each level.</p>
      <table class="costs">
        <thead>
          <tr><th>Level</th><th>Min</th><th>Max</th></tr>
        </thead>
        <tbody>
          {#each levels as lvl}
            <tr>
              <td>{roman(lvl)}</td>
              <td>{costAtLevel(e.minCost, lvl) ?? '—'}</td>
              <td>{costAtLevel(e.maxCost, lvl) ?? '—'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </section>
  {/if}

  <section class="block">
    <h2>Applies to</h2>
    <div class="kv">
      <span class="kv__key">Slots</span>
      <span class="kv__val">
        {#if e.slots.length}
          {#each e.slots as s}<code class="pill">{s}</code>{/each}
        {:else}—{/if}
      </span>
    </div>
    <div class="kv">
      <span class="kv__key">Items</span>
      <span class="kv__val"><code>{e.supportedItems || '—'}</code></span>
    </div>
    {#if e.translate}
      <div class="kv">
        <span class="kv__key">Translate</span>
        <span class="kv__val"><code>{e.translate}</code></span>
      </div>
    {/if}
  </section>

  <section class="block">
    <h2>Effects</h2>
    {#if hasEffects}
      <pre class="code">{JSON.stringify(e.effects, null, 2)}</pre>
    {:else}
      <p class="block__hint">No declarative effects in the definition — behaviour is handled in code.</p>
    {/if}
  </section>

  <details class="raw">
    <summary>Raw definition</summary>
    <pre class="code">{rawJson}</pre>
  </details>
</article>

<style>
  .detail {
    --accent: #8a63d2;
    --accent-soft: #b79cf0;
    --xp: #6bbf3f;
    --panel: rgba(138, 99, 210, 0.06);
    --bd: rgba(138, 99, 210, 0.22);
    --muted: color-mix(in srgb, currentColor 55%, transparent);
    --hairline: color-mix(in srgb, currentColor 12%, transparent);
    max-width: 60ch;
  }
  :global(html.dark) .detail,
  :global(.dark) .detail {
    --panel: rgba(138, 99, 210, 0.12);
    --bd: rgba(183, 156, 240, 0.3);
  }

  .detail__back {
    display: inline-block;
    margin-bottom: 1.25rem;
    font-size: 0.85rem;
    color: var(--accent-soft);
    text-decoration: none;
  }
  .detail__back:hover { text-decoration: underline; }

  .detail__head { border-bottom: 1px solid var(--hairline); padding-bottom: 1rem; margin-bottom: 1.25rem; }
  .detail__eyebrow {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent-soft);
  }
  .detail__head h1 { margin: 0.2rem 0 0.5rem; }
  .detail__desc { margin: 0; font-size: 1.05rem; line-height: 1.55; }
  .detail__note { margin: 0.6rem 0 0; font-size: 0.8rem; color: var(--muted); font-style: italic; }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.6rem;
    margin: 0 0 1.75rem;
  }
  .stat {
    padding: 0.7rem 0.8rem;
    background: var(--panel);
    border: 1px solid var(--bd);
    border-radius: 8px;
  }
  .stat dt { margin: 0; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
  .stat dd {
    margin: 0.15rem 0 0;
    font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 1.5rem;
    line-height: 1.1;
  }
  .stat small { color: var(--muted); font-size: 0.7rem; }
  .stat--hero { border-left: 3px solid var(--xp); }
  .stat--hero dd { color: var(--xp); }

  .block { margin: 1.75rem 0; }
  .block h2 { font-size: 1.05rem; margin: 0 0 0.4rem; }
  .block__hint { margin: 0 0 0.7rem; font-size: 0.85rem; color: var(--muted); }

  .costs { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .costs th, .costs td {
    text-align: left;
    padding: 0.4rem 0.6rem;
    border-bottom: 1px solid var(--hairline);
    font-variant-numeric: tabular-nums;
  }
  .costs th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
  .costs td:first-child { color: var(--accent-soft); }

  .kv { display: flex; gap: 0.75rem; padding: 0.35rem 0; align-items: baseline; }
  .kv__key { flex: 0 0 5rem; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
  .kv__val { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .pill {
    padding: 0.1rem 0.45rem;
    background: var(--panel);
    border: 1px solid var(--bd);
    border-radius: 999px;
    font-size: 0.8rem;
  }

  .code {
    margin: 0;
    padding: 0.85rem 1rem;
    background: var(--panel);
    border: 1px solid var(--bd);
    border-radius: 8px;
    overflow-x: auto;
    font-size: 0.82rem;
    line-height: 1.5;
  }
  .raw { margin-top: 1.5rem; }
  .raw summary { cursor: pointer; font-size: 0.85rem; color: var(--muted); }
  .raw[open] summary { margin-bottom: 0.6rem; }
</style>