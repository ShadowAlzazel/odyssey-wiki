<script>
  // "Source" footer: links to the datapack / plugin files a page is generated from.
  // sources: [{ label?, repo, path, url }]
  let { sources = [], note = '' } = $props()

  const seen = new Set()
  const list = $derived(sources.filter((s) => s && !seen.has(s.url) && seen.add(s.url)))
</script>

{#if list.length}
  <aside class="source" aria-label="Source files">
    <h2>Source</h2>
    <p>{note || 'For technical players: the files this page is generated from or based on.'}</p>
    <ul>
      {#each list as s}
        <li>
          {#if s.label}<span class="label">{s.label}</span>{/if}
          <a href={s.url} target="_blank" rel="noopener"><span class="repo">{s.repo}</span>/<code>{s.path}</code></a>
        </li>
      {/each}
    </ul>
  </aside>
{/if}

<style>
  .source {
    margin-top: 2.5rem;
    padding-top: 1rem;
    border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
    font-size: 0.82rem;
  }
  .source h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.3rem; border: 0; padding: 0; opacity: 0.7; }
  .source p { margin: 0 0 0.5rem; opacity: 0.65; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { margin: 0 0 0.3rem; display: grid; grid-template-columns: 8.5rem minmax(0, 1fr); gap: 0 0.75rem; align-items: baseline; }
  .label { opacity: 0.65; }
  li:not(:has(.label)) a { grid-column: 1 / -1; }
  @media (max-width: 520px) {
    li { grid-template-columns: 1fr; }
  }
  a { color: inherit; text-decoration: none; word-break: break-all; }
  a:hover { text-decoration: underline; }
  .repo { opacity: 0.6; }
  code { font-size: 0.78rem; background: none; padding: 0; }
</style>
