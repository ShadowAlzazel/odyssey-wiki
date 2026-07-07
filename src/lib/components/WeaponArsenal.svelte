<script>
  import CustomItem from '$lib/components/CustomItem.svelte';

  /* ============================================================
     DATA — mirrors your source enums.
     Add a row here and it appears everywhere: cards, filters, sort.
     ============================================================ */
  const MATERIALS = [
    // id, name, mult, durability, source, tint, img
    ["iron","Iron",3.0,250,"Overworld","#c9ccd1","iron_ingot"],
    ["silver","Silver",3.0,337,"Overworld","#ebecf9","silver_ingot"],
    ["soul_steel","Soul Steel",4.0,666,"Nether","#585f7b","soul_steel_ingot"],
    ["titanium","Titanium",4.0,1002,"Overworld","#d9d9bd","titanium_ingot"],
    ["anodized_titanium","Anodized Titanium",4.0,1002,"Overworld","#2744cb","anodized_titanium_ingot"],
    ["crystal_alloy","Crystal Alloy",4.0,1123,"The Edge","#7fc7e8","crystal_alloy_ingot"],
    ["diamond","Diamond",4.0,1561,"Overworld","#5fd6d0","diamond"],
    ["netherite","Netherite",5.0,2031,"Nether","#8a7d88","netherite_ingot"],
    ["iridium","Iridium",5.0,3108,"Overworld","#dd7ce4","iridium_ingot"],
    ["mithril","Mithril",6.0,1789,"The Edge","#9fe6cf","mithril_ingot"],
  ].map(m => ({ id: m[0], name: m[1], mult: m[2], dur: m[3], source: m[4], tint: m[5], img: m[6] }));

  const CAT_COLOR = {
    Sword:"#8fa8bd", Polearm:"#c9603f", Axe:"#e0a03d",
    Blunt:"#b06a4f", Special:"#7fc7e8", Vanilla:"#6a7079"
  };

  const WEAPONS = [
    // id, name, base, speed, range, category
    ["sword","Sword",3.0,1.6,0,"Vanilla"],
    ["axe","Axe",5.0,1.0,0,"Vanilla"],
    ["cutlass","Cutlass",2.5,2.1,0,"Sword"],
    ["katana","Katana",3.0,1.7,0.2,"Sword"],
    ["longsword","Longsword",4.0,1.5,0.3,"Sword"],
    ["rapier","Rapier",1.5,3.5,0,"Sword"],
    ["saber","Saber",3.0,1.8,0,"Sword"],
    ["chakram","Chakram",1.5,2.5,-0.3,"Sword"],
    ["dagger","Dagger",1.0,3.0,-0.3,"Sword"],
    ["kunai","Kunai",1.0,2.5,0,"Sword"],
    ["sickle","Sickle",1.5,2.7,-0.2,"Sword"],
    ["claymore","Claymore",6.5,1.1,0.5,"Sword"],
    ["kriegsmesser","Kriegsmesser",6.0,1.3,0.5,"Sword"],
    ["zweihander","Zweihander",7.0,0.8,1.0,"Sword"],
    ["halberd","Halberd",4.0,0.8,2.0,"Polearm"],
    ["pike","Pike",6.0,0.6,3.0,"Polearm"],
    ["poleaxe","Poleaxe",4.0,1.1,1.0,"Polearm"],
    ["glaive","Glaive",4.0,1.2,1.0,"Polearm"],
    ["scythe","Scythe",3.0,1.1,1.0,"Polearm"],
    ["double_axe","Double Axe",5.0,1.0,0,"Axe"],
    ["longaxe","Longaxe",6.0,0.9,0.5,"Axe"],
    ["battlesaw","Battlesaw",4.0,1.0,1.0,"Axe"],
    ["warhammer","Warhammer",4.0,1.4,0,"Blunt"],
    ["shuriken","Shuriken",0.5,1.0,0,"Special"],
  ].map(w => ({ id: w[0], name: w[1], base: w[2], speed: w[3], range: w[4], cat: w[5] }));

  const ARCH = {
    pierce: new Set(["rapier","dagger","kunai","halberd","poleaxe","pike"]),
    slash:  new Set(["katana","longsword","claymore","cutlass","saber","sickle","chakram","zweihander","kriegsmesser","glaive","longaxe","double_axe","battlesaw","scythe","shuriken"]),
    blunt:  new Set(["warhammer"]),
  };
  const CAN_PARRY  = new Set(["katana","claymore","longsword","rapier","saber","sickle","dagger","kriegsmesser","zweihander","poleaxe"]);
  const DUAL_WIELD = new Set(["dagger","cutlass","chakram","double_axe"]);
  const THROWABLE  = new Set(["kunai","chakram","shuriken"]);
  const KINETIC    = new Set(["pike"]);
  const DISABLE_SH = { longaxe:100, double_axe:100, poleaxe:80, glaive:80, halberd:60, warhammer:60, sickle:40 }; // ticks
  const MIN_CHARGE = { halberd:0.5, longaxe:0.5, pike:0.5, claymore:0.3, kriegsmesser:0.3, zweihander:0.3 };
  const HITBOX     = { katana:0.35, claymore:0.4, longsword:0.35, double_axe:0.35, sickle:0.45, scythe:0.7, battlesaw:0.45, kriegsmesser:0.4, zweihander:0.45, pike:0.35 };
  const CRIT       = { katana:0.1, longaxe:0.25 };

  const ARCH_LABEL = { pierce:"Piercing", slash:"Slashing", blunt:"Blunt" };
  const CATS  = ["all", ...new Set(WEAPONS.map(w => w.cat))];
  const ARCHS = [["all","All"],["pierce","Piercing"],["slash","Slashing"],["blunt","Blunt"]];
  const PROPS = [["parry","Can parry"],["dual","Dual-wield"],["throw","Throwable"],["charge","Kinetic charge"],["shield","Shield-break"]];
  const SORTS = [["final","Final damage"],["dps","DPS"],["speed","Attack speed"],["reach","Reach"],["name","Name (A–Z)"]];

  /* ---------- state ---------- */
  let mat   = $state(MATERIALS[0]);
  let q     = $state("");
  let sort  = $state("final");
  let cat   = $state("all");
  let arch  = $state("all");
  let props = $state([]);              // active trait keys

  /* ---------- helpers ---------- */
  const fmt    = n => Number.isInteger(n) ? String(n) : n.toFixed(1);
  const archOf = id => ARCH.pierce.has(id) ? "pierce" : ARCH.slash.has(id) ? "slash" : ARCH.blunt.has(id) ? "blunt" : null;
  const compute = w => {
    const final = w.base + mat.mult;
    return { final, dps: final * w.speed, reach: 3.0 + w.range, arch: archOf(w.id) };
  };
  const hasProp = (id, p) =>
    p === "parry"  ? CAN_PARRY.has(id) :
    p === "dual"   ? DUAL_WIELD.has(id) :
    p === "throw"  ? THROWABLE.has(id) :
    p === "charge" ? KINETIC.has(id) :
    p === "shield" ? id in DISABLE_SH : false;

  function toggleProp(p) {
    props = props.includes(p) ? props.filter(x => x !== p) : [...props, p];
  }
  function reset() { q = ""; cat = "all"; arch = "all"; props = []; }

  const SORTERS = {
    final: (a, b) => compute(b).final - compute(a).final,
    dps:   (a, b) => compute(b).dps - compute(a).dps,
    speed: (a, b) => b.speed - a.speed,
    reach: (a, b) => compute(b).reach - compute(a).reach,
    name:  (a, b) => a.name.localeCompare(b.name),
  };

  const list = $derived.by(() => {
    const ql = q.trim().toLowerCase();
    return WEAPONS
      .filter(w => {
        if (cat !== "all" && w.cat !== cat) return false;
        if (arch !== "all" && archOf(w.id) !== arch) return false;
        for (const p of props) if (!hasProp(w.id, p)) return false;
        if (ql && !(w.name.toLowerCase().includes(ql) || w.cat.toLowerCase().includes(ql))) return false;
        return true;
      })
      .sort(SORTERS[sort]);
  });
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
        <b>{mat.name}</b> — ×{fmt(mat.mult)} damage · {mat.dur} durability · {mat.source}
      </span>
    </div>
    <div class="ingots" role="group" aria-label="Choose forging material">
      {#each MATERIALS as m}
        <button
          class="ingot"
          style="--tint:{m.tint}"
          aria-pressed={m.id === mat.id}
          onclick={() => (mat = m)}
        >
          <img src="../images/{m.img}.png" class="pixel-art large inline" alt="Copper Ingot">
          <div class="m-name">{m.name}</div>
          <div class="m-mult">+{fmt(m.mult)} · {m.dur} dur</div>
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
          <button class="chip" aria-pressed={cat === c} onclick={() => (cat = c)}>{c === "all" ? "All" : c}</button>
        {/each}
      </div>
      <div class="chipgroup">
        <span class="gl">Type</span>
        {#each ARCHS as [val, label]}
          <button
            class="chip"
            class:p-pierce={val === "pierce"}
            class:p-slash={val === "slash"}
            class:p-blunt={val === "blunt"}
            aria-pressed={arch === val}
            onclick={() => (arch = val)}
          >{label}</button>
        {/each}
      </div>
    </div>

    <div class="chipgroup">
      <span class="gl">Traits</span>
      {#each PROPS as [key, label]}
        <button class="chip prop" aria-pressed={props.includes(key)} onclick={() => toggleProp(key)}>{label}</button>
      {/each}
    </div>

    <div class="countline">
      <span>{list.length} of {WEAPONS.length} weapons · forged in {mat.name}</span>
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
          <article class="card" style="--catc:{CAT_COLOR[w.cat] || '#555'}">
            <div class="c-head">
              <div>
                <div class="c-name">{w.name}</div>
                <div class="c-cat">{w.cat}</div>
              </div>
              {#if c.arch}
                <span class="arch" class:pierce={c.arch === "pierce"} class:slash={c.arch === "slash"} class:blunt={c.arch === "blunt"}>{ARCH_LABEL[c.arch]}</span>
              {/if}
            </div>

            <div class="dmg">
              <div class="val">{fmt(c.final)}</div>
              <div class="meta">Final Damage<br /><b>{fmt(w.base)} + {fmt(mat.mult)}</b></div>
            </div>

            <div class="stats">
              <div class="stat"><div class="k">Atk Speed</div><div class="v">{fmt(w.speed)}</div></div>
              <div class="stat"><div class="k">DPS</div><div class="v">{c.dps.toFixed(1)}</div></div>
              <div class="stat"><div class="k">Reach</div><div class="v">{c.reach.toFixed(1)}<small> / {w.range > 0 ? "+" + fmt(w.range) : fmt(w.range)}</small></div></div>
            </div>

            <div class="badges">
              {#if CAN_PARRY.has(w.id)}<span class="badge">⚔ Parry</span>{/if}
              {#if DUAL_WIELD.has(w.id)}<span class="badge">⧉ Dual-wield</span>{/if}
              {#if THROWABLE.has(w.id)}<span class="badge">➹ Throwable</span>{/if}
              {#if KINETIC.has(w.id)}<span class="badge hot">↯ Kinetic charge</span>{/if}
              {#if w.id in DISABLE_SH}<span class="badge hot">⛨ Shield-break <span class="d">{(DISABLE_SH[w.id] / 20).toFixed(1)}s</span></span>{/if}
              {#if w.id in MIN_CHARGE}<span class="badge">◔ Min charge <span class="d">{MIN_CHARGE[w.id]}</span></span>{/if}
              {#if w.id in HITBOX}<span class="badge">◎ Hitbox <span class="d">+{fmt(HITBOX[w.id]-0.3)}</span></span>{/if}
              {#if w.id in CRIT}<span class="badge">✦ Crit <span class="d">+{Math.round(CRIT[w.id] * 100)}%</span></span>{/if}
              {#if !CAN_PARRY.has(w.id) && !DUAL_WIELD.has(w.id) && !THROWABLE.has(w.id) && !KINETIC.has(w.id) && !(w.id in DISABLE_SH) && !(w.id in MIN_CHARGE) && !(w.id in HITBOX) && !(w.id in CRIT)}
                <span class="badge muted">No special traits</span>
              {/if}
            </div>
          </article>
        {/each}
      {/if}
    </div>
  {/key}

  <footer>
    <span class="fmono">ODYSSEY // ARSENAL</span> — Reach = 3.0 + range bonus · DPS = final damage × attack speed · shield-break in seconds (ticks ÷ 20).
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
  .arsenal :is(h1,p){margin:0}

  /* masthead */
  .top{padding:34px 0 22px; border-bottom:1px solid var(--line-soft)}
  .eyebrow{
    font-family:"Oswald",sans-serif; font-weight:600; letter-spacing:.42em;
    text-transform:uppercase; font-size:12px; color:var(--metal);
    transition:color .5s ease; display:flex; align-items:center; gap:14px;
  }
  .eyebrow::after{content:""; flex:1; height:1px; background:linear-gradient(90deg,var(--metal-dim),transparent); opacity:.6}
  h1{
    font-family:"Oswald",sans-serif; font-weight:700; letter-spacing:.01em;
    font-size:clamp(34px,6vw,64px); line-height:.92; margin:.2em 0 .14em;
    text-transform:uppercase; color:var(--ink); border:0; padding:0;
  }
  .lede{color:var(--ink-dim); max-width:56ch; font-size:15px}
  .lede code{
    font-family:"JetBrains Mono",ui-monospace,monospace; font-size:13px; color:var(--ember-soft);
    background:#ffffff0a; padding:1px 6px; border-radius:5px; border:1px solid var(--line)
  }

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
  .ingot .swatch{
    width:26px; height:26px; border-radius:6px; margin-bottom:7px;
    background:linear-gradient(135deg,var(--tint),#0006);
    box-shadow:inset 0 0 0 1px #ffffff30, 0 0 10px -2px var(--tint)
  }
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