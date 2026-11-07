<script>
  import { base } from '$app/paths'
  import SourceLinks from '$lib/components/SourceLinks.svelte'

  let { weapon: w, rows = [], materials = [], traits = [] } = $props()

  const fmt = (n) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100))
  const matById = Object.fromEntries(materials.map((m) => [m.id, m]))
  const iconSrc = (m) => m.icon.url ?? `${base}${m.icon.path}`
  const traitInfo = Object.fromEntries(traits.map((t) => [t.id, t]))
  const shownTraits = $derived(w.traits.filter((t) => !['piercing', 'slashing', 'blunt'].includes(t.id)))
</script>

<article class="weapon">
  <a class="back" href="{base}/items/weapons">← All weapons</a>

  <header class="head">
    <span class="eyebrow">{w.className}{w.damageType ? ` · ${w.damageType.label}` : ''}</span>
    <h1>{w.name}</h1>
    {#if w.desc}
      <p class="desc">{w.desc}</p>
    {:else if !w.vanilla}
      <p class="note">Description coming soon.</p>
    {/if}
    {#if w.wiki}
      <p class="note">A vanilla weapon, also craftable in Odyssey's materials. <a href={w.wiki} target="_blank" rel="noopener">{w.name} on the Minecraft Wiki ↗</a></p>
    {/if}
  </header>

  <dl class="stats">
    <div class="stat"><dt>Base damage</dt><dd>{fmt(w.baseDamage)}</dd><small>+ material</small></div>
    <div class="stat"><dt>Attack speed</dt><dd>{fmt(w.baseSpeed)}</dd></div>
    <div class="stat"><dt>Reach</dt><dd>{fmt(3 + w.bonusRange)}</dd><small>{w.bonusRange ? `${w.bonusRange > 0 ? '+' : ''}${fmt(w.bonusRange)} blocks` : 'blocks'}</small></div>
    {#if w.hitbox !== null}<div class="stat"><dt>Hitbox margin</dt><dd>{fmt(w.hitbox)}</dd><small>blocks</small></div>{/if}
    {#if w.animation}<div class="stat"><dt>Swing</dt><dd>{w.animation.type}</dd><small>{fmt(w.animation.ticks / 20)}s</small></div>{/if}
  </dl>

  {#if shownTraits.length || w.damageType}
    <section class="block">
      <h2>Traits</h2>
      <ul class="traits">
        {#if w.damageType}
          <li>
            <a href="{base}/items/weapons/traits#{w.damageType.id}"><b>{w.damageType.label}</b></a>
            <span>{traitInfo[w.damageType.id]?.summary}</span>
          </li>
        {/if}
        {#each shownTraits as t}
          <li>
            <a href="{base}/items/weapons/traits#{t.id}"><b>{t.icon} {t.label}</b>{#if t.value} <code>{t.value}</code>{/if}</a>
            <span>{traitInfo[t.id]?.summary}</span>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if w.throwable}
    <section class="block">
      <h2>Throwing</h2>
      <ul class="facts">
        <li>Cooldown: <b>{fmt(w.throwable.cooldownTicks / 20)}s</b></li>
        <li>Throw speed: <b>{fmt(w.throwable.speed)}</b>{w.throwable.gravity ? '' : ', flies straight (no gravity)'}</li>
        <li>{w.throwable.consumes === 'item' ? 'Each throw uses up one from the stack' : 'Each throw costs 1 durability'}</li>
        {#if w.throwable.returns}<li>Returns to you after the throw</li>{/if}
        {#if w.throwable.dualThrowable}<li>Holding one in each hand throws both</li>{/if}
      </ul>
    </section>
  {/if}

  <section class="block">
    <h2>Stats by material</h2>
    <p class="hint">Damage is per full-strength hit. DPS = damage × attack speed.</p>
    <div class="scroll">
      <table>
        <thead><tr><th>Material</th><th class="num">Damage</th><th class="num">Speed</th><th class="num">DPS</th><th class="num">Durability</th></tr></thead>
        <tbody>
          {#each rows as r}
            {@const m = matById[r.material]}
            <tr>
              <td><div class="mat"><img class="pixel-art" src={iconSrc(m)} alt="" width="16" height="16" loading="lazy" />{m.name} {w.name}</div></td>
              <td class="num">{fmt(r.damage)}</td>
              <td class="num">{fmt(r.speed)}</td>
              <td class="num">{r.dps}</td>
              <td class="num">{r.durability ?? '—'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <SourceLinks sources={w.sources} />
</article>

<style>
  .weapon {
    --accent: #c9603f;
    --muted: color-mix(in srgb, currentColor 58%, transparent);
    --hairline: color-mix(in srgb, currentColor 14%, transparent);
    --panel: color-mix(in srgb, currentColor 4%, transparent);
    max-width: 66ch;
  }
  .back { display: inline-block; margin-bottom: 1rem; font-size: 0.85rem; color: var(--accent); text-decoration: none; }
  .back:hover { text-decoration: underline; }
  .head { border-bottom: 1px solid var(--hairline); padding-bottom: 1rem; margin-bottom: 1.25rem; }
  .eyebrow { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); }
  .head h1 { margin: 0.2rem 0 0.4rem; }
  .desc { margin: 0; font-size: 1.05rem; line-height: 1.55; }
  .note { margin: 0.3rem 0 0; font-size: 0.85rem; color: var(--muted); }
  .note a { color: var(--accent); }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 0.6rem; margin: 0 0 1.5rem; }
  .stat { padding: 0.7rem 0.85rem; border-radius: 10px; border: 1px solid var(--hairline); background: var(--panel); margin: 0; }
  .stat dt { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
  .stat dd { margin: 0.15rem 0 0; font-size: 1.15rem; font-weight: 600; }
  .stat small { font-size: 0.75rem; color: var(--muted); }

  .block { margin-bottom: 1.75rem; }
  .block h2 { margin-bottom: 0.4rem; }
  .hint { margin: 0 0 0.6rem; font-size: 0.85rem; color: var(--muted); }

  .traits { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.45rem; }
  .traits li { margin: 0; display: grid; grid-template-columns: minmax(11rem, auto) 1fr; gap: 0.2rem 0.9rem; font-size: 0.9rem; align-items: baseline; }
  .traits a { color: inherit; text-decoration: none; }
  .traits a:hover b { color: var(--accent); }
  .traits code { font-size: 0.78rem; }
  .traits span { color: var(--muted); }
  @media (max-width: 520px) { .traits li { grid-template-columns: 1fr; } }
  .facts { margin: 0; padding-left: 1.1rem; font-size: 0.9rem; }

  .scroll { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 0.88rem; display: table; }
  th, td { text-align: left; padding: 0.35rem 0.5rem; border-bottom: 1px solid var(--hairline); }
  th { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 600; white-space: nowrap; }
  .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  .mat { display: flex; align-items: center; gap: 0.45rem; white-space: nowrap; }
</style>
