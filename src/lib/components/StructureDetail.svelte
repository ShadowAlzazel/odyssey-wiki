<script>
  import { base } from '$app/paths'

  let { structure: s } = $props()

  // Try the fallback icon once, then hide.
  const onIconError = (e, fallback) => {
    const img = e.currentTarget
    if (fallback && img.dataset.fellBack !== '1') {
      img.dataset.fellBack = '1'
      img.src = fallback
    } else img.style.visibility = 'hidden'
  }
  const src = (icon) => (icon?.startsWith('/') ? `${base}${icon}` : icon)
</script>

<article class="structure">
  <a class="back" href="{base}/world/structures">← All structures</a>

  {#if s.image}
    <img class="hero" src="{base}{s.image}" alt="{s.name}" />
  {/if}

  <header class="head">
    <span class="eyebrow">{s.dimensions.map((d) => d.label).join(' · ')}</span>
    <h1>{s.name}</h1>
    {#if s.desc}
      <p class="desc">{s.desc}</p>
    {:else}
      <p class="note">Description coming soon.</p>
    {/if}
  </header>

  <dl class="stats">
    {#if s.rarity}<div class="stat"><dt>Rarity</dt><dd>{s.rarity.label}</dd></div>{/if}
    {#if s.where.length}<div class="stat"><dt>Found</dt><dd>{s.where.join(', ')}</dd></div>{/if}
    {#if s.rarity?.spacing}<div class="stat"><dt>Spacing</dt><dd>{s.rarity.spacing} chunks</dd></div>{/if}
    {#if s.variants.length}<div class="stat"><dt>Variants</dt><dd>{s.variants.length}</dd></div>{/if}
  </dl>
  {#if s.rarity}<p class="hint">{s.rarity.detail}</p>{/if}

  {#if s.tips.length}
    <section class="block">
      <h2>Tips</h2>
      <ul>{#each s.tips as tip}<li>{tip}</li>{/each}</ul>
    </section>
  {/if}

  {#if s.variants.length}
    <section class="block">
      <h2>Variants</h2>
      <ul class="tags">{#each s.variants as v}<li>{v}</li>{/each}</ul>
    </section>
  {/if}

  <section class="block">
    <h2>Where it generates</h2>
    {#if s.biomes.length}
      <ul class="tags">
        {#each s.biomes as b}<li><a href="{base}/world/biome/{b.slug}">{b.name}</a></li>{/each}
      </ul>
    {/if}
    {#if s.vanillaBiomes.length}
      <p class="hint">{s.biomes.length ? 'Also in' : 'In'}: {s.vanillaBiomes.join(', ')}</p>
    {/if}
  </section>

  {#if s.loot.length}
    <section class="block">
      <h2>Loot</h2>
      <p class="hint">Everything you can find here, Odyssey items first. Open a loot table for exact chances.</p>
      {#each s.loot as group}
        <div class="loot-box">
          <h3>{group.label}</h3>
          <p class="tables">
            Loot tables:
            {#each group.tables as t, i}<a href="{base}/loot/{t.path}">{t.name}</a>{i < group.tables.length - 1 ? ', ' : ''}{/each}
          </p>
          <ul class="items">
            {#each group.items as it}
              <li title={it.id}>
                <img class="pixel-art" src={src(it.icon)} alt="" width="16" height="16" loading="lazy" onerror={(e) => onIconError(e, it.fallbackIcon)} />
                {#if it.href}<a href="{base}{it.href}">{it.name}</a>{:else}<span class:custom={it.custom}>{it.name}</span>{/if}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </section>
  {/if}
</article>

<style>
  .structure {
    --accent: #7a6bd6;
    --muted: color-mix(in srgb, currentColor 58%, transparent);
    --hairline: color-mix(in srgb, currentColor 14%, transparent);
    --panel: color-mix(in srgb, currentColor 4%, transparent);
    max-width: 66ch;
  }
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.85rem; color: var(--accent); text-decoration: none; }
  .back:hover { text-decoration: underline; }
  .hero { width: 100%; border-radius: 12px; border: 1px solid var(--hairline); }
  .head { border-bottom: 1px solid var(--hairline); padding: 1rem 0; margin-bottom: 1.25rem; }
  .eyebrow { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
  .head h1 { margin: 0.2rem 0 0.4rem; }
  .desc { margin: 0; font-size: 1.05rem; line-height: 1.55; }
  .note { margin: 0; font-size: 0.85rem; color: var(--muted); font-style: italic; }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.6rem; margin: 0 0 0.5rem; }
  .stat { padding: 0.7rem 0.85rem; border-radius: 10px; border: 1px solid var(--hairline); background: var(--panel); margin: 0; }
  .stat dt { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
  .stat dd { margin: 0.15rem 0 0; font-size: 1.05rem; font-weight: 600; }

  .block { margin: 1.5rem 0 1.75rem; }
  .block h2 { margin-bottom: 0.4rem; }
  .block h3 { font-size: 0.95rem; margin: 1.1rem 0 0.4rem; }
  .hint { margin: 0.3rem 0 0.6rem; font-size: 0.85rem; color: var(--muted); }

  .tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tags li { margin: 0; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid var(--hairline); background: var(--panel); font-size: 0.85rem; }
  .tags a { color: var(--accent); text-decoration: none; }

  .loot-box { border: 1px solid var(--hairline); border-radius: 10px; padding: 0.7rem 0.9rem; margin-bottom: 0.75rem; background: var(--panel); }
  .loot-box h3 { margin: 0 0 0.2rem; }
  .tables { margin: 0 0 0.6rem; font-size: 0.8rem; color: var(--muted); }
  .tables a { color: var(--accent); text-decoration: none; }
  .tables a:hover { text-decoration: underline; }
  .items { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 0.3rem 0.8rem; }
  .items li { display: flex; align-items: center; gap: 0.4rem; font-size: 0.84rem; margin: 0; }
  .items a { color: inherit; text-decoration: underline; text-decoration-color: var(--hairline); }
  .custom { font-weight: 500; }
</style>
