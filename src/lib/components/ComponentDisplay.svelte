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
      <span class="font-medium">Model:</span> <code>{component.item_model}</code>
    </div>
    
  {:else}
    <h3 class="font-semibold text-gray-700 mb-2">📋 {component.type}</h3>
    <pre class="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{JSON.stringify(component, null, 2)}
    </pre>
  {/if}
</div>