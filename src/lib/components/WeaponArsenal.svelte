<script>
  import { base } from '$app/paths';

  /* Data comes from the plugin source via mc_data/weapons.json (see src/lib/server/weapons.js). */
  let { materials = [], weapons = [], categories = [], traitFilters = [] } = $props();

  const CAT = Object.fromEntries(categories.map(c => [c.id, c]));
  const CATS = ["all", ...categories.map(c => c.id).filter(id => weapons.some(w => w.category === id))];
  const ARCHS = [["all","All"],["piercing","Piercing"],["slashing","Slashing"],["blunt","Blunt"]];
  const SORTS = [["damage","Damage"],["dps","DPS"],["speed","Attack speed"],["reach","Reach"],["name","Name (A–Z)"]];

  /* ---------- state ---------- */
  let mat   = $state(materials.find(m => m.id === "iron") ?? materials[0]);
  let q     = $state("");
  let sort  = $state("damage");
  let cat   = $state("all");
  let arch  = $state("all");
  let props = $state([]);              // active trait ids

  /* ---------- helpers ---------- */
  const fmt = n => Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
  const iconSrc = m => m.icon.url ?? `${base}${m.icon.path}`;
  // Mirrors ToolMaker.kt + WeaponListeners.kt: damage = weapon base + material (the plugin removes
  // the player's base 1 from Odyssey weapon hits), and some materials change attack speed.
  const compute = w => {
    const damage = w.baseDamage + mat.damage;
    const speed = w.baseSpeed * (mat.speedMultiplier ?? 1);
    return { damage, speed, dps: damage * speed, reach: 3.0 + w.bonusRange };
  };
  const has = (w, traitId) => w.traits.some(t => t.id === traitId);

  function toggleProp(p) {
    props = props.includes(p) ? props.filter(x => x !== p) : [...props, p];
  }
  function reset() { q = ""; cat = "all"; arch = "all"; props = []; }

  const SORTERS = {
    damage: (a, b) => compute(b).damage - compute(a).damage,
    dps:    (a, b) => compute(b).dps - compute(a).dps,
    speed:  (a, b) => compute(b).speed - compute(a).speed,
    reach:  (a, b) => compute(b).reach - compute(a).reach,
    name:   (a, b) => a.name.localeCompare(b.name),
  };

  const list = $derived.by(() => {
    const ql = q.trim().toLowerCase();
    return weapons
      .filter(w => {
        if (cat !== "all" && w.category !== cat) return false;
        if (arch !== "all" && w.damageType?.id !== arch) return false;
        for (const p of props) if (!has(w, p)) return false;
        if (ql && !(w.name.toLowerCase().includes(ql) || w.className.toLowerCase().includes(ql))) return false;
        return true;
      })
      .sort(SORTERS[sort]);
  });

  // Damage-type traits are shown as the coloured tag, not as badges.
  const BADGE_SKIP = new Set(["piercing", "slashing", "blunt"]);
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
  <link
    href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="arsenal" style="--metal:{mat.tint}; --metal-dim:{mat.tint}55; --forge-top:0px;">
  <!-- masthead -->
  <header class="top">
    <div class="eyebrow">Weapon Arsenal </div>
  </header>

  <!-- forge / material bar -->
  <div class="forge">
    <div class="forge-head">
      <span class="forge-label">Forge with</span>
      <span class="forge-read">
        <b>{mat.name}</b> — {[`+${fmt(mat.damage)} damage`, mat.speedMultiplier !== 1 ? `×${mat.speedMultiplier} speed` : null, mat.durability ? `${mat.durability} durability` : null, mat.origin].filter(Boolean).join(' · ')}
      </span>
    </div>
    <div class="ingots" role="group" aria-label="Choose forging material">
      {#each materials as m}
        <button
          class="ingot"
          style="--tint:{m.tint}"
          aria-pressed={m.id === mat.id}
          onclick={() => (mat = m)}
        >
          <img src={iconSrc(m)} class="pixel-art large inline" alt="">
          <div class="m-name">{m.name}</div>
          <div class="m-mult">+{fmt(m.damage)}{m.durability ? ` · ${m.durability} dur` : ''}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- controls -->
  <div class="controls">
    <div class="searchrow">
      <div class="search">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
        <input type="search" placeholder="Search weapons…" autocomplete="off" aria-label="Search weapons" bind:value={q} />
      </div>
      <div class="sortsel">
        <label for="ars-sort">Sort</label>
        <select id="ars-sort" bind:value={sort} aria-label="Sort weapons">
          {#each SORTS as [val, label]}<option value={val}>{label}</option>{/each}
        </select>
      </div>
    </div>

    <div class="chipset">
      <div class="chipgroup">
        <span class="gl">Class</span>
        {#each CATS as c}
          <button class="chip" aria-pressed={cat === c} onclick={() => (cat = c)}>{c === "all" ? "All" : CAT[c]?.label ?? c}</button>
        {/each}
      </div>
      <div class="chipgroup">
        <span class="gl">Type</span>
        {#each ARCHS as [val, label]}
          <button
            class="chip"
            class:p-pierce={val === "piercing"}
            class:p-slash={val === "slashing"}
            class:p-blunt={val === "blunt"}
            aria-pressed={arch === val}
            onclick={() => (arch = val)}
          >{label}</button>
        {/each}
      </div>
    </div>

    <div class="chipgroup">
      <span class="gl">Traits</span>
      {#each traitFilters as t}
        <button class="chip prop" aria-pressed={props.includes(t.id)} onclick={() => toggleProp(t.id)}>{t.label}</button>
      {/each}
    </div>

    <div class="countline">
      <span>{list.length} of {weapons.length} weapons · forged in {mat.name}</span>
      <button class="reset" onclick={reset}>Clear filters</button>
    </div>
  </div>

  <!-- grid (re-mounts on material change to replay the forge animation) -->
  {#key mat.id}
    <div class="grid">
      {#if list.length === 0}
        <div class="empty"><b>Nothing forged to fit</b>No weapon matches these filters. Loosen one and try again.</div>
      {:else}
        {#each list as w (w.id)}
          {@const c = compute(w)}
          <article class="card" style="--catc:{CAT[w.category]?.color || '#555'}">
            <div class="c-head">
              <div>
                <a class="c-name" href="{base}/items/weapon/{w.id}">{w.name}</a>
                <div class="c-cat">{w.className}</div>
              </div>
              {#if w.damageType}
                <span class="arch" class:pierce={w.damageType.id === "piercing"} class:slash={w.damageType.id === "slashing"} class:blunt={w.damageType.id === "blunt"}>{w.damageType.label}</span>
              {/if}
            </div>

            <div class="dmg">
              <div class="val">{fmt(c.damage)}</div>
              <div class="meta">Damage per hit<br /><b>{fmt(w.baseDamage)} + {fmt(mat.damage)}</b></div>
            </div>

            <div class="stats">
              <div class="stat"><div class="k">Atk Speed</div><div class="v">{fmt(Math.round(c.speed * 100) / 100)}</div></div>
              <div class="stat"><div class="k">DPS</div><div class="v">{c.dps.toFixed(1)}</div></div>
              <div class="stat"><div class="k">Reach</div><div class="v">{c.reach.toFixed(1)}{#if w.bonusRange}<small> / {w.bonusRange > 0 ? "+" + fmt(w.bonusRange) : fmt(w.bonusRange)}</small>{/if}</div></div>
            </div>

            <div class="badges">
              {#each w.traits.filter(t => !BADGE_SKIP.has(t.id) && t.id !== "reach") as t}
                <a class="badge" class:hot={t.id === "charge" || t.id === "shield_break"} href="{base}/items/weapons/traits#{t.id}">{t.icon} {t.label}{#if t.value} <span class="d">{t.value}</span>{/if}</a>
              {:else}
                <span class="badge muted">No special traits</span>
              {/each}
            </div>
          </article>
        {/each}
      {/if}
    </div>
  {/key}

  <footer>
    <span class="fmono">ODYSSEY // ARSENAL</span> — Damage per hit = weapon + material · Reach = 3.0 + range bonus · DPS = damage × attack speed · Click a weapon or trait for details.
  </footer>
</div>

<style>
  .arsenal{
    --bg:#131519; --panel:#1c2028; --panel2:#21262f;
    --line:#2c323d; --line-soft:#242932;
    --ink:#e9e7e0; --ink-dim:#9aa0aa; --ink-faint:#6a7079;
    --ember:#ff7a34; --ember-soft:#ffb27a;
    --pierce:#5fb3d9; --slash:#e0a03d; --blunt:#c9603f;
    --r:14px;
    position:relative; color:var(--ink);
    font-family:"Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    line-height:1.5; border:1px solid var(--line); border-radius:20px;
    padding:0 22px 22px; margin:8px 0;
    background:
      radial-gradient(1200px 600px at 78% -8%, #1d222b 0%, transparent 60%),
      radial-gradient(900px 500px at 0% 0%, #191d24 0%, transparent 55%),
      var(--bg);
    -webkit-font-smoothing:antialiased;
  }
  .arsenal *{box-sizing:border-box}

  /* masthead */
  .top{padding:34px 0 22px; border-bottom:1px solid var(--line-soft)}
  .eyebrow{
    font-family:"Oswald",sans-serif; font-weight:600; letter-spacing:.42em;
    text-transform:uppercase; font-size:12px; color:var(--metal);
    transition:color .5s ease; display:flex; align-items:center; gap:14px;
  }
  .eyebrow::after{content:""; flex:1; height:1px; background:linear-gradient(90deg,var(--metal-dim),transparent); opacity:.6}

  /* forge / material bar */
  .forge{
    position:sticky; top:var(--forge-top); z-index:5;
    background:linear-gradient(180deg,var(--bg) 62%,#131519e8);
    border-bottom:1px solid var(--line); backdrop-filter:blur(9px);
    margin:0 -22px; padding:16px 22px 18px;
  }
  .forge-head{display:flex; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:12px}
  .forge-label{font-family:"Oswald",sans-serif; text-transform:uppercase; letter-spacing:.24em; font-size:12px; font-weight:600; color:var(--ink-dim)}
  .forge-read{font-family:"JetBrains Mono",ui-monospace,monospace; font-size:12.5px; color:var(--ink-faint)}
  .forge-read b{color:var(--metal); transition:color .5s ease}
  .ingots{display:flex; gap:8px; overflow-x:auto; padding-bottom:4px; scrollbar-width:thin}
  .ingots::-webkit-scrollbar{height:6px}
  .ingots::-webkit-scrollbar-thumb{background:var(--line); border-radius:6px}
  .ingot{
    flex:0 0 auto; cursor:pointer; border:1px solid var(--line); background:var(--panel);
    border-radius:11px; padding:9px 13px 8px; min-width:104px; text-align:left; color:var(--ink);
    transition:border-color .18s, transform .12s, background .18s; position:relative; overflow:hidden; font:inherit;
  }
  .ingot:hover{transform:translateY(-2px); border-color:var(--tint)}
  .ingot:focus-visible{outline:2px solid var(--ember); outline-offset:2px}
  .ingot .m-name{font-family:"Oswald",sans-serif; font-weight:600; font-size:14px; letter-spacing:.03em; line-height:1.05}
  .ingot .m-mult{font-family:"JetBrains Mono",ui-monospace,monospace; font-size:11.5px; color:var(--ink-dim); margin-top:2px}
  .ingot[aria-pressed="true"]{border-color:var(--tint); background:linear-gradient(180deg,color-mix(in srgb,var(--tint) 14%,transparent),var(--panel2))}
  .ingot[aria-pressed="true"]::before{content:""; position:absolute; inset:0 0 auto 0; height:3px; background:var(--tint)}

  /* controls */
  .controls{padding:22px 0 6px; display:grid; gap:14px}
  .searchrow{display:flex; gap:12px; flex-wrap:wrap; align-items:center}
  .search{flex:1; min-width:220px; position:relative}
  .search input{
    width:100%; background:var(--panel); border:1px solid var(--line); border-radius:11px;
    color:var(--ink); font-family:"JetBrains Mono",ui-monospace,monospace; font-size:14px;
    padding:12px 14px 12px 40px; transition:border-color .18s
  }
  .search input::placeholder{color:var(--ink-faint)}
  .search input:focus{outline:none; border-color:var(--metal)}
  .search svg{position:absolute; left:13px; top:50%; transform:translateY(-50%); width:16px; height:16px; stroke:var(--ink-faint)}
  .sortsel{display:flex; align-items:center; gap:8px}
  .sortsel label{font-size:12px; text-transform:uppercase; letter-spacing:.14em; color:var(--ink-faint); font-family:"Oswald",sans-serif; font-weight:600}
  .sortsel select{
    background:var(--panel); border:1px solid var(--line); color:var(--ink); border-radius:10px;
    padding:10px 12px; font-family:"JetBrains Mono",ui-monospace,monospace; font-size:13px; cursor:pointer
  }
  .sortsel select:focus{outline:none; border-color:var(--metal)}
  .chipset{display:flex; gap:14px; flex-wrap:wrap; align-items:center}
  .chipgroup{display:flex; gap:7px; flex-wrap:wrap; align-items:center}
  .chipgroup .gl{font-size:11px; text-transform:uppercase; letter-spacing:.16em; color:var(--ink-faint); font-family:"Oswald",sans-serif; font-weight:600; margin-right:2px; align-self:center}
  .chip{
    cursor:pointer; border:1px solid var(--line); background:transparent; color:var(--ink-dim);
    border-radius:999px; padding:6px 13px; font-size:12.5px; font-weight:500; letter-spacing:.01em;
    transition:.15s; font-family:"Inter",sans-serif
  }
  .chip:hover{color:var(--ink); border-color:var(--ink-faint)}
  .chip:focus-visible{outline:2px solid var(--ember); outline-offset:2px}
  .chip[aria-pressed="true"]{background:var(--metal); color:#14171c; border-color:var(--metal); font-weight:600}
  .chip.p-pierce[aria-pressed="true"]{background:var(--pierce); border-color:var(--pierce); color:#0d1116}
  .chip.p-slash[aria-pressed="true"]{background:var(--slash); border-color:var(--slash); color:#0d1116}
  .chip.p-blunt[aria-pressed="true"]{background:var(--blunt); border-color:var(--blunt); color:#fff}
  .chip.prop[aria-pressed="true"]{background:transparent; color:var(--ember); border-color:var(--ember)}
  .countline{
    display:flex; justify-content:space-between; align-items:baseline; gap:12px;
    padding:8px 0 2px; color:var(--ink-faint); font-size:12.5px;
    font-family:"JetBrains Mono",ui-monospace,monospace; border-top:1px solid var(--line-soft); margin-top:4px
  }
  .reset{background:none; border:none; color:var(--ink-faint); cursor:pointer; font-family:inherit; font-size:12px; text-decoration:underline dotted; padding:4px}
  .reset:hover{color:var(--ember)}

  /* grid + cards */
  .grid{
    display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:15px; padding:14px 0 8px;
    animation:reforge .5s ease;
  }
  @keyframes reforge{from{opacity:0; transform:translateY(6px)} to{opacity:1; transform:none}}
  .card{
    background:linear-gradient(180deg,var(--panel2),var(--panel));
    border:1px solid var(--line); border-radius:var(--r); padding:16px 16px 14px;
    display:flex; flex-direction:column; gap:12px; position:relative; overflow:hidden;
    transition:border-color .2s, transform .12s
  }
  .card::before{content:""; position:absolute; inset:0 auto 0 0; width:3px; background:var(--catc,var(--line)); opacity:.85}
  .card:hover{border-color:#3a4250; transform:translateY(-2px)}
  .c-head{display:flex; justify-content:space-between; align-items:flex-start; gap:10px}
  .c-name{font-family:"Oswald",sans-serif; font-weight:600; text-transform:uppercase; letter-spacing:.03em; font-size:19px; line-height:1.02}
  .c-cat{font-size:10.5px; text-transform:uppercase; letter-spacing:.15em; color:var(--ink-faint); font-family:"Oswald",sans-serif; font-weight:500; margin-top:3px}
  .arch{flex:0 0 auto; font-size:10px; text-transform:uppercase; letter-spacing:.1em; font-weight:700; font-family:"Oswald",sans-serif; padding:4px 8px; border-radius:6px; border:1px solid; white-space:nowrap}
  .arch.pierce{color:var(--pierce); border-color:#5fb3d955; background:#5fb3d914}
  .arch.slash{color:var(--slash); border-color:#e0a03d55; background:#e0a03d12}
  .arch.blunt{color:var(--blunt); border-color:#c9603f55; background:#c9603f14}
  .dmg{display:flex; align-items:flex-end; gap:12px; padding:2px 0 4px; border-bottom:1px solid var(--line-soft)}
  .dmg .val{font-family:"JetBrains Mono",ui-monospace,monospace; font-weight:700; font-size:34px; line-height:.9; text-shadow:0 0 22px #ff7a3438; font-variant-numeric:tabular-nums}
  .dmg .meta{font-family:"JetBrains Mono",ui-monospace,monospace; font-size:11px; color:var(--ink-faint); padding-bottom:4px; line-height:1.35}
  .dmg .meta b{color:var(--ink-dim); font-weight:500}
  .stats{display:grid; grid-template-columns:repeat(3,1fr); gap:2px}
  .stat{padding:6px 2px}
  .stat .k{font-size:9.5px; text-transform:uppercase; letter-spacing:.13em; color:var(--ink-faint); font-family:"Oswald",sans-serif; font-weight:600}
  .stat .v{font-family:"JetBrains Mono",ui-monospace,monospace; font-size:16px; font-weight:500; margin-top:2px; font-variant-numeric:tabular-nums}
  .stat .v small{color:var(--ink-faint); font-size:11px}
  .badges{display:flex; flex-wrap:wrap; gap:6px; margin-top:auto}
  .badge{font-size:10.5px; font-weight:600; letter-spacing:.02em; padding:3px 8px; border-radius:6px; background:#ffffff08; border:1px solid var(--line); color:var(--ink-dim); display:inline-flex; align-items:center; gap:5px; font-family:"Inter",sans-serif}
  .badge.muted{opacity:.5}
  a.badge{text-decoration:none}
  a.badge:hover{color:var(--ink); border-color:var(--metal)}
  a.c-name{display:block; color:var(--ink); text-decoration:none}
  a.c-name:hover{color:var(--metal)}
  .badge.hot{color:var(--ember); border-color:#ff7a3444; background:#ff7a3410}
  .badge .d{font-family:"JetBrains Mono",ui-monospace,monospace; color:var(--ink-faint); font-weight:500}
  .badge.hot .d{color:var(--ember-soft)}

  .empty{grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--ink-faint)}
  .empty b{color:var(--ink); font-family:"Oswald",sans-serif; text-transform:uppercase; letter-spacing:.1em; display:block; font-size:20px; margin-bottom:6px}

  footer{border-top:1px solid var(--line-soft); padding:18px 0 4px; color:var(--ink-faint); font-size:12.5px; margin-top:20px}
  .fmono{color:var(--ink-dim); font-family:"JetBrains Mono",ui-monospace,monospace}

  @media (max-width:560px){
    .top{padding:26px 0 18px}
    .dmg .val{font-size:30px}
  }
  @media (prefers-reduced-motion:reduce){
    .arsenal *{transition:none !important; animation:none !important}
  }
</style>