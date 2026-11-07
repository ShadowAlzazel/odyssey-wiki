<script>
  import { base } from '$app/paths'
  import SourceLinks from '$lib/components/SourceLinks.svelte'
  import { WIKI } from '$lib/mcwiki.js'

  let { table: t } = $props()

  const onIconError = (e, fallback) => {
    const img = e.currentTarget
    if (fallback && img.dataset.fellBack !== '1') {
      img.dataset.fellBack = '1'
      img.src = fallback
    } else img.style.visibility = 'hidden'
  }
  const src = (icon) => (icon?.startsWith('/') ? `${base}${icon}` : icon)
</script>

<article class="loot">
  <a class="back" href="{base}/loot">← All loot tables</a>

  <header class="head">
    <span class="eyebrow">Loot table · {t.type}</span>
    <h1>{t.name}</h1>
    <code class="id">{t.id}</code>
    {#if t.tableNotes.length}<p class="hint">Applied to every drop: {t.tableNotes.join(', ')}</p>{/if}
  </header>

  <details class="howto">
    <summary>How to read this</summary>
    <ul>
      <li>Each <strong>pool</strong> is rolled separately. A roll picks one entry, weighted by <strong>weight</strong>.</li>
      <li><strong>Per roll</strong> is the chance one roll picks that entry. <strong>Per pool</strong> is the chance it's picked at least once across the pool's rolls (ignoring bonus rolls and conditions).</li>
      <li>Entries that point at another table link to it. Custom items link to their item page; vanilla items link to the Minecraft Wiki.</li>
      <li>For how loot tables work in general, see <a href={WIKI.lootTable} target="_blank" rel="noopener">Loot table on the Minecraft Wiki ↗</a>.</li>
    </ul>
  </details>

  {#each t.pools as pool}
    <section class="pool">
      <h2>Pool {pool.index}</h2>
      <p class="meta">
        <span>Rolls <b>{pool.rolls}</b></span>
        {#if pool.bonusRolls}<span>Bonus rolls <b>{pool.bonusRolls}</b> per luck</span>{/if}
        {#each pool.conditions as c}<span class="cond">{c}</span>{/each}
      </p>
      <div class="scroll">
        <table>
          <thead>
            <tr><th>Entry</th><th class="num">Weight</th><th class="num">Per roll</th><th class="num">Per pool</th><th class="num">Count</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {#each pool.entries as e}
              <tr>
                <td><div class="entry">
                  {#if e.icon}
                    <img class="pixel-art" src={src(e.icon)} alt="" width="16" height="16" loading="lazy" onerror={(ev) => onIconError(ev, e.fallbackIcon)} />
                  {:else}
                    <span class="glyph" aria-hidden="true">{e.kind === 'table' ? '↳' : '·'}</span>
                  {/if}
                  {#if e.href}
                    <a href="{base}{e.href}">{e.name}</a>
                  {:else if e.wiki}
                    <a class="mc" href={e.wiki} target="_blank" rel="noopener">{e.name}</a>
                  {:else}
                    <span>{e.name}</span>
                  {/if}
                  {#if e.kind === 'table'}<span class="pill">table</span>{/if}
                </div></td>
                <td class="num">{e.weight}</td>
                <td class="num">{e.perRoll}%</td>
                <td class="num">{e.atLeastOnce}%</td>
                <td class="num">{e.count}</td>
                <td class="notes">{[...e.notes, ...e.conditions].join(' · ')}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/each}

  {#if t.usedBy.length}
    <section class="pool">
      <h2>Used by</h2>
      <ul class="tags">
        {#each t.usedBy as u}<li><a href="{base}{u.href}">{u.path}</a></li>{/each}
      </ul>
    </section>
  {/if}

  <details class="raw">
    <summary>Raw JSON</summary>
    <pre><code>{t.raw}</code></pre>
  </details>
  <SourceLinks sources={[{ label: 'Loot table', ...t.source }]} />
</article>

<style>
  .loot {
    --accent: #c08a2e;
    --muted: color-mix(in srgb, currentColor 58%, transparent);
    --hairline: color-mix(in srgb, currentColor 14%, transparent);
    --panel: color-mix(in srgb, currentColor 4%, transparent);
  }
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.85rem; color: var(--accent); text-decoration: none; }
  .back:hover { text-decoration: underline; }
  .head { border-bottom: 1px solid var(--hairline); padding-bottom: 1rem; margin-bottom: 1rem; }
  .eyebrow { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
  .head h1 { margin: 0.2rem 0 0.3rem; }
  .id { font-size: 0.8rem; color: var(--muted); word-break: break-all; }
  .hint { margin: 0.5rem 0 0; font-size: 0.85rem; color: var(--muted); }

  .howto, .raw { margin: 0 0 1.25rem; font-size: 0.88rem; border: 1px solid var(--hairline); border-radius: 8px; padding: 0.5rem 0.8rem; background: var(--panel); }
  .howto summary, .raw summary { cursor: pointer; font-weight: 600; }
  .howto ul { margin: 0.5rem 0 0.2rem; padding-left: 1.1rem; }
  .raw pre { max-height: 32rem; overflow: auto; font-size: 0.78rem; margin: 0.6rem 0 0.2rem; }

  .pool { margin-bottom: 1.6rem; }
  .pool h2 { margin-bottom: 0.3rem; }
  .meta { display: flex; flex-wrap: wrap; gap: 0.4rem 1rem; margin: 0 0 0.6rem; font-size: 0.85rem; color: var(--muted); }
  .meta b { font-weight: 600; }
  .cond { color: var(--accent); }

  .scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.86rem; display: table; }
  th, td { text-align: left; padding: 0.35rem 0.5rem; border-bottom: 1px solid var(--hairline); vertical-align: middle; }
  th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 600; white-space: nowrap; }
  .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .entry { display: flex; align-items: center; gap: 0.45rem; min-width: 12rem; }
  .entry a { color: var(--accent); text-decoration: none; }
  .entry a:hover { text-decoration: underline; }
  .entry a.mc { color: inherit; text-decoration: underline dotted; text-underline-offset: 2px; }
  .glyph { width: 16px; text-align: center; color: var(--muted); }
  .pill { font-size: 0.68rem; padding: 0 0.4rem; border-radius: 999px; border: 1px solid var(--hairline); color: var(--muted); }
  .notes { font-size: 0.8rem; color: var(--muted); min-width: 10rem; }

  .tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tags li { margin: 0; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid var(--hairline); font-size: 0.82rem; }
  .tags a { color: var(--accent); text-decoration: none; }
</style>
