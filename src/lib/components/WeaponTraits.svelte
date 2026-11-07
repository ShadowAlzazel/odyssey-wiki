<script>
  import { base } from '$app/paths'
  import SourceLinks from '$lib/components/SourceLinks.svelte'

  let { traits = [], groups = [] } = $props()
</script>

<nav class="toc" aria-label="Traits">
  {#each groups as g}
    <div><b>{g}</b> {#each traits.filter((t) => t.group === g) as t, i}<a href="#{t.id}">{t.label}</a>{i < traits.filter((x) => x.group === g).length - 1 ? ' · ' : ''}{/each}</div>
  {/each}
</nav>

{#each groups as g}
  <h2>{g}</h2>
  {#each traits.filter((t) => t.group === g) as t (t.id)}
    <section class="trait" id={t.id}>
      <h3><span aria-hidden="true">{t.icon}</span> {t.label}</h3>
      {#each t.body as p}<p>{p}</p>{/each}
      {#if t.wiki}<p class="wiki"><a href={t.wiki} target="_blank" rel="noopener">Related: Minecraft Wiki ↗</a></p>{/if}
      <ul class="weapons">
        {#each t.weapons as w}
          <li><a href="{base}/items/weapon/{w.id}">{w.name}</a>{#if w.value} <code>{w.value}</code>{/if}</li>
        {/each}
      </ul>
      <details class="src"><summary>Source</summary><SourceLinks sources={t.sources} note="Where this trait is defined and applied." /></details>
    </section>
  {/each}
{/each}

<style>
  .toc { font-size: 0.88rem; display: grid; gap: 0.3rem; margin: 1rem 0 1.5rem; padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid color-mix(in srgb, currentColor 14%, transparent); }
  .toc b { margin-right: 0.4rem; }
  .trait { margin: 0 0 1.6rem; scroll-margin-top: 5rem; }
  .trait h3 { margin-bottom: 0.3rem; }
  .trait p { margin: 0 0 0.45rem; }
  .wiki { font-size: 0.82rem; }
  .weapons { list-style: none; padding: 0; margin: 0.4rem 0 0; display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .weapons li { margin: 0; padding: 0.2rem 0.6rem; border-radius: 999px; border: 1px solid color-mix(in srgb, currentColor 14%, transparent); font-size: 0.84rem; }
  .weapons a { color: inherit; text-decoration: none; font-weight: 500; }
  .weapons a:hover { text-decoration: underline; }
  .weapons code { font-size: 0.75rem; background: none; padding: 0; opacity: 0.7; }
  .src { margin-top: 0.4rem; font-size: 0.8rem; opacity: 0.85; }
  .src summary { cursor: pointer; opacity: 0.7; }
  .src :global(.source) { margin-top: 0.4rem; border: 0; padding-top: 0; }
</style>
