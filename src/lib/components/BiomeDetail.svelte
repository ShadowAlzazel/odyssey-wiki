<script>
  import { base } from '$app/paths'

  let { biome: b } = $props()

  const DIMENSION = { overworld: 'Overworld', edge: 'The Edge' }
  const swatches = $derived(
    [
      ['Sky', b.colors.sky],
      ['Fog', b.colors.fog],
      ['Grass', b.colors.grass],
      ['Foliage', b.colors.foliage],
      ['Water', b.colors.water],
      ['Water fog', b.colors.waterFog],
    ].filter(([, c]) => c),
  )
  const hero = $derived(
    b.image
      ? `background-image:url('${base}${b.image}')`
      : `background-image:linear-gradient(180deg, ${b.colors.sky ?? '#78a7ff'} 0%, ${b.colors.fog ?? '#c0d8ff'} 55%, ${b.colors.grass ?? b.colors.foliage ?? '#79c05a'} 56%, ${b.colors.foliage ?? b.colors.grass ?? '#59ae30'} 100%)`,
  )
  const eggUrl = (icon) =>
    `https://raw.githubusercontent.com/misode/mcmeta/refs/heads/assets/assets/minecraft/textures/item/${icon}.png`
</script>

<article class="biome">
  <a class="back" href="{base}/world/biomes">← All biomes</a>

  <div class="hero" style={hero} role="img" aria-label="{b.name} colours"></div>

  <header class="head">
    <span class="eyebrow">{DIMENSION[b.dimension] ?? 'Unknown'}{b.cave ? ' · Cave biome' : ''}</span>
    <h1>{b.name}</h1>
    {#if b.inspiration}<p class="place">Inspired by {b.inspiration}</p>{/if}
    {#if b.desc}
      <p class="desc">{b.desc}</p>
    {:else}
      <p class="note">Description coming soon.</p>
    {/if}
  </header>

  <dl class="stats">
    <div class="stat"><dt>Temperature</dt><dd>{b.climate.temperature}</dd><small>{b.climate.rawTemperature}</small></div>
    <div class="stat"><dt>Humidity</dt><dd>{b.climate.humidity}</dd><small>{b.climate.rawDownfall}</small></div>
    <div class="stat"><dt>Weather</dt><dd>{b.climate.precipitation === 'None' ? 'No rain' : b.climate.precipitation}</dd></div>
    {#if b.categories.length}
      <div class="stat"><dt>Counts as</dt><dd class="small">{b.categories.join(', ')}</dd></div>
    {/if}
  </dl>

  <section class="block">
    <h2>Colours</h2>
    <ul class="swatches">
      {#each swatches as [label, color]}
        <li><span class="sw" style="background:{color}"></span><span class="sw-text"><span>{label}</span><code>{color}</code></span></li>
      {/each}
    </ul>
    {#if b.hasParticles}<p class="hint">This biome has ambient particles floating in the air.</p>{/if}
  </section>

  {#if b.structures.length}
    <section class="block">
      <h2>Structures</h2>
      <p class="hint">Odyssey structures that can generate here.</p>
      <ul class="tags">
        {#each b.structures as s}
          <li><a href="{base}/world/structure/{s.slug}">{s.name}</a></li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if b.features.length}
    <section class="block">
      <h2>Features</h2>
      <p class="hint">Custom terrain features and vegetation.</p>
      <ul class="tags">
        {#each b.features as f}<li>{f}</li>{/each}
      </ul>
    </section>
  {/if}

  {#if b.spawns.length}
    <section class="block">
      <h2>Mob spawns</h2>
      <p class="hint">Natural spawns. Chance is the share of spawn attempts in that group; Odyssey's custom mobs spawn separately.</p>
      {#each b.spawns as g}
        <h3>{g.label}</h3>
        <table class="spawns">
          <thead><tr><th>Mob</th><th>Chance</th><th>Group size</th></tr></thead>
          <tbody>
            {#each g.mobs as m}
              <tr>
                <td class="mob">
                  {#if m.icon}<img class="pixel-art" src={eggUrl(m.icon)} alt="" width="16" height="16" loading="lazy" onerror={(e) => (e.currentTarget.style.visibility = 'hidden')} />{/if}
                  {m.name}
                </td>
                <td>{m.chance}%</td>
                <td>{m.group}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/each}
    </section>
  {/if}

  {#if b.music.length}
    <section class="block">
      <h2>Music</h2>
      <ul class="tags">
        {#each b.music as m}<li>{m.name}{m.custom ? ' (Odyssey)' : ''}</li>{/each}
      </ul>
    </section>
  {/if}

  {#if b.advancements.length}
    <section class="block">
      <h2>Advancements</h2>
      <ul class="advs">
        {#each b.advancements as a}
          <li><strong>{a.title}</strong>{#if a.description}{' — '}{a.description}{/if}</li>
        {/each}
      </ul>
    </section>
  {/if}
</article>

<style>
  .biome {
    --accent: #3f9b6b;
    --muted: color-mix(in srgb, currentColor 58%, transparent);
    --hairline: color-mix(in srgb, currentColor 14%, transparent);
    --panel: color-mix(in srgb, currentColor 4%, transparent);
    max-width: 64ch;
  }
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.85rem; color: var(--accent); text-decoration: none; }
  .back:hover { text-decoration: underline; }
  .hero { aspect-ratio: 3 / 1; border-radius: 12px; background-size: cover; background-position: center; border: 1px solid var(--hairline); }

  .head { border-bottom: 1px solid var(--hairline); padding: 1rem 0; margin-bottom: 1.25rem; }
  .eyebrow { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
  .head h1 { margin: 0.2rem 0 0.25rem; }
  .place { margin: 0 0 0.6rem; color: var(--muted); }
  .desc { margin: 0; font-size: 1.05rem; line-height: 1.55; }
  .note { margin: 0; font-size: 0.85rem; color: var(--muted); font-style: italic; }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.6rem; margin: 0 0 1.5rem; }
  .stat { padding: 0.7rem 0.85rem; border-radius: 10px; border: 1px solid var(--hairline); background: var(--panel); margin: 0; }
  .stat dt { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
  .stat dd { margin: 0.15rem 0 0; font-size: 1.15rem; font-weight: 600; }
  .stat dd.small { font-size: 0.95rem; }
  .stat small { font-size: 0.75rem; color: var(--muted); font-variant-numeric: tabular-nums; }

  .block { margin-bottom: 1.75rem; }
  .block h2 { margin-bottom: 0.3rem; }
  .block h3 { font-size: 0.95rem; margin: 1rem 0 0.4rem; }
  .hint { margin: 0 0 0.6rem; font-size: 0.85rem; color: var(--muted); }

  .swatches { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.6rem; }
  .swatches li { display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; margin: 0; }
  .sw { width: 1.6rem; height: 1.6rem; border-radius: 6px; border: 1px solid var(--hairline); flex: none; }
  .sw-text { display: flex; flex-direction: column; line-height: 1.2; }
  .swatches code { font-size: 0.72rem; color: var(--muted); background: none; padding: 0; }

  .tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tags li { margin: 0; padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid var(--hairline); background: var(--panel); font-size: 0.85rem; }
  .tags a { color: var(--accent); text-decoration: none; }
  .tags a:hover { text-decoration: underline; }

  .spawns { width: 100%; border-collapse: collapse; font-size: 0.88rem; display: table; }
  .spawns th, .spawns td { text-align: left; padding: 0.35rem 0.5rem; border-bottom: 1px solid var(--hairline); }
  .spawns th { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 600; }
  .spawns td:not(.mob) { font-variant-numeric: tabular-nums; width: 6.5rem; }
  .mob { display: flex; align-items: center; gap: 0.45rem; }
  .advs { padding-left: 1.1rem; margin: 0; }
</style>
