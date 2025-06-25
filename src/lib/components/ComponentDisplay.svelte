
<script>
  export let component;
</script>

<div class="component-display p-4 bg-gray-50 rounded-lg">
  {#if component.type === 'FoodComponent'}
    <h3 class="font-semibold text-green-700 mb-2">🍎 Food Properties</h3>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium">Nutrition:</span> {component.nutrition}
      </div>
      <div>
        <span class="font-medium">Saturation:</span> {component.saturation}
      </div>
      {#if component.consume_seconds}
        <div>
          <span class="font-medium">Consume Time:</span> {component.consume_seconds}s
        </div>
      {/if}
      {#if component.can_always_eat}
        <div class="col-span-2">
          <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
            Can Always Eat
          </span>
        </div>
      {/if}
    </div>
    
  {:else if component.type === 'MaxDamageComponent'}
    <h3 class="font-semibold text-red-700 mb-2">⚔️ Durability</h3>
    <div class="text-sm">
      <span class="font-medium">Max Damage:</span> {component.max_damage}
    </div>
    
  {:else if component.type === 'ConsumableComponent'}
    <h3 class="font-semibold text-purple-700 mb-2">🧪 Consumable</h3>
    <div class="text-sm">
      <span class="font-medium">Consume Time:</span> {component.consume_seconds}s
    </div>
    
  {:else if component.type === 'ItemModelComponent'}
    <h3 class="font-semibold text-blue-700 mb-2">🎨 Custom Model</h3>
    <div class="text-sm">
      <span class="font-medium">Model:</span> <code class="bg-blue-50 px-1 rounded">{component.item_model}</code>
    </div>
    
  {:else if component.type === 'ItemNameComponent'}
    <h3 class="font-semibold text-indigo-700 mb-2">🏷️ Item Name</h3>
    <div class="text-sm">
      <span class="font-medium">Internal Name:</span> <code class="bg-indigo-50 px-1 rounded">{component.item_name}</code>
    </div>
    
  {:else if component.type === 'EquippableComponent'}
    <h3 class="font-semibold text-amber-700 mb-2">👕 Equippable</h3>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span class="font-medium">Slot:</span> 
        <span class="capitalize bg-amber-50 px-2 py-1 rounded text-xs">{component.slot}</span>
      </div>
      <div>
        <span class="font-medium">Asset:</span> <code class="bg-amber-50 px-1 rounded text-xs">{component.asset_id}</code>
      </div>
      {#if component.equip_sound}
        <div class="col-span-2">
          <span class="font-medium">Equip Sound:</span> <code class="bg-amber-50 px-1 rounded text-xs">{component.equip_sound}</code>
        </div>
      {/if}
    </div>
    
  {:else if component.type === 'AttributesComponent'}
    <h3 class="font-semibold text-emerald-700 mb-2">⚡ Attributes</h3>
    <div class="space-y-2">
      {#each component.modifiers as modifier}
        <div class="bg-emerald-50 p-2 rounded text-sm">
          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="font-medium">Attribute:</span> 
              <span class="capitalize">{modifier.attribute.replace('_', ' ')}</span>
            </div>
            <div>
              <span class="font-medium">Amount:</span> 
              <span class="font-mono">{modifier.amount}</span>
            </div>
            <div>
              <span class="font-medium">Slot:</span> 
              <span class="capitalize bg-emerald-100 px-1 rounded text-xs">{modifier.slot}</span>
            </div>
            <div>
              <span class="font-medium">Operation:</span> 
              <span class="bg-emerald-100 px-1 rounded text-xs">{modifier.operation}</span>
            </div>
          </div>
          {#if modifier.keyId}
            <div class="mt-1 text-xs text-emerald-600">
              <span class="font-medium">ID:</span> <code>{modifier.keyId}</code>
            </div>
          {/if}
        </div>
      {/each}
    </div>
    
  {:else}
    <h3 class="font-semibold text-gray-700 mb-2">📋 {component.type}</h3>
    <div class="bg-gray-100 p-3 rounded">
      <details class="cursor-pointer">
        <summary class="text-sm font-medium text-gray-600 hover:text-gray-800">
          Show Raw Data
        </summary>
        <pre class="text-xs mt-2 overflow-x-auto whitespace-pre-wrap">
{JSON.stringify(component, null, 2)}
        </pre>
      </details>
    </div>
  {/if}
</div>

<style>
  .component-display {
    transition: all 0.2s ease-in-out;
  }
  
  .component-display:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.85em;
  }
</style>