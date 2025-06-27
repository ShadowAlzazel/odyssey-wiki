<script>
  export let name;
  export let size = 'medium';
  export let showTooltip = false;
  export let inline = true;
  export let onHoverShow = true;
  export let count = null;
  export let linkToPage = true;

  import { onMount } from "svelte";

  // "diamond_sword" -> "Diamond_Sword"
  // "lily_of_the_valley" -> "Lily_of_the_Valley"
  function getWikiTitle(itemName) {
    const exceptions = ['of', 'the'];

    return itemName
      .split('_')
      .map((word, index) => {
        if (index === 0 || !exceptions.includes(word)) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
      })
      .join('_');
  }

  function getDisplayName(itemName) {
    return itemName.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  let imageUrl;
  $: primaryUrl  = `https://raw.githubusercontent.com/misode/mcmeta/refs/heads/assets/assets/minecraft/textures/item/${name}.png`;
  $: fallbackUrl   = `https://minecraft.wiki/images/Invicon_${getWikiTitle(name)}.png`;

  onMount(async () => {
    try {
      const res = await fetch(primaryUrl);
      if (res.ok) {
        imageUrl = primaryUrl;
      } else {
        imageUrl = fallbackUrl;
      }
    } catch (e) {
      imageUrl = fallbackUrl;
    }
  });

  $: cssClasses = `minecraft-item pixel-art ${size} ${inline ? 'inline' : ''}`;
  $: wikiUrl = `https://minecraft.wiki/w/${getWikiTitle(name)}`;
</script>

{#if inline}
  <span class="item-wrapper relative group inline-flex items-center">
    {#if linkToPage}
      <a href={wikiUrl} class="inline-flex items-center gap-2 no-underline" target="_blank" rel="noopener noreferrer">
        <img
          src={imageUrl}
          alt={getDisplayName(name)}
          class="minecraft-icon {cssClasses}"
          loading="lazy"
        />
        {#if count && count > 1}
          <span class="item-count absolute bottom-0 right-0 bg-gray-800 text-white text-xs rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
            {count}
          </span>
        {/if}
      </a>
    {:else}
      <span class="relative inline-flex items-center gap-2">
        <img
          src={imageUrl}
          alt={getDisplayName(name)}
          class="minecraft-icon {cssClasses}"
          loading="lazy"
        />
        {#if count && count > 1}
          <span class="item-count absolute bottom-0 right-0 bg-gray-800 text-white text-xs rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
            {count}
          </span>
        {/if}
      </span>
    {/if}

    {#if showTooltip || onHoverShow}
      <span class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <span class="font-semibold text-yellow-300">{getDisplayName(name)}</span>
        {#if showTooltip}
          <span class="text-gray-300">Minecraft Item</span>
        {/if}
      </span>
    {/if}
  </span>
{:else}
  <div class="item-wrapper relative group">
    {#if linkToPage}
      <a href={wikiUrl} class="minecraft-item-container relative inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
        <img
          src={imageUrl}
          alt={getDisplayName(name)}
          class="minecraft-icon {cssClasses}"
          loading="lazy"
        />
        {#if count && count > 1}
          <span class="item-count absolute bottom-0 right-0 bg-gray-800 text-white text-xs rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
            {count}
          </span>
        {/if}
      </a>
    {:else}
      <div class="minecraft-item-container relative inline-flex items-center gap-2">
        <img
          src={imageUrl}
          alt={getDisplayName(name)}
          class="minecraft-icon {cssClasses}"
          loading="lazy"
        />
        {#if count && count > 1}
          <span class="item-count absolute bottom-0 right-0 bg-gray-800 text-white text-xs rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
            {count}
          </span>
        {/if}
      </div>
    {/if}

    {#if showTooltip || onHoverShow}
      <div class="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        <div class="font-semibold text-yellow-300">{getDisplayName(name)}</div>
        {#if showTooltip}
          <div class="text-gray-300">Minecraft Item</div>
        {/if}
      </div>
    {/if}
  </div>
{/if}

<style>
  .minecraft-icon {
    image-rendering: pixelated;
    filter: contrast(1.1) saturate(1.1);
  }

  .minecraft-icon:hover {
    filter: brightness(1.2) contrast(1.1) saturate(1.1);
  }

  .item-count {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    line-height: 1;
    font-size: 0.65rem;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1f2937 transparent transparent transparent;
  }
</style>
