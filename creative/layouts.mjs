const L = {
  'Search Items': 'Search Items'
}

// 28,32 - tabs.png

globalThis.layouts = {}
var height = 136; var width = 195;
layouts.Creative = {
  // type: 'image',
  with: { // reusable constants + allow for assets to be easily preloaded without recusing
    'tab_inventory': { path: 'gui/container/creative_inventory/tab_inventory' },
    'tab_items': { path: 'gui/container/creative_inventory/tab_items' },
    'tab_item_search': { path: 'gui/container/creative_inventory/tab_item_search' },
    'inventoryTabActive': { path: 'gui/container/creative_inventory/tabs', slice: [0, 32, 28, 32] },
    'inventoryTab': { path: 'gui/container/creative_inventory/tabs', slice: [0, 0, 28, 32] },
    'inventoryBotTab': { path: 'gui/container/creative_inventory/tabs', slice: [0, 64, 28, 32], y: height + 28 },
    'inventoryBotActiveTab': { path: 'gui/container/creative_inventory/tabs', slice: [0, 64 + 32, 28, 32], y: height + 28 },
    'tabSliderInactive': { path: 'gui/container/creative_inventory/tabs', slice: [232 + 12, 0, 12, 15] },
    'tabSliderActive': { path: 'gui/container/creative_inventory/tabs', slice: [232, 0, 12, 15] },
    tabs: ['undefined', 'tabBuilding', 'tabDecoration', 'tabRedstone', 'tabTransport', 'tabSaved', 'tabSearch', 'tabMisc', 'tabFood', 'tabTools', 'tabCombat', 'tabBrewing', 'tabSurvival'],
    icon: { scale: 1.1, slice: [0, 0, 16, 16] },
  },
  children: [
    /* Top bar */
    { type: 'image', id: 'tabBuilding', using: (ctx) => ctx.activeTab == 1 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 0, y: 0, tip: 'Building blocks', onClick: [] },
    { type: 'image', id: 'tabDecoration', using: (ctx) => ctx.activeTab == 2 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 1, y: 0, tip: 'Decoration blocks', onClick: [] },
    { type: 'image', id: 'tabRedstone', using: (ctx) => ctx.activeTab == 3 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 2, y: 0, tip: 'Redstone', onClick: [] },
    { type: 'image', id: 'tabTransport', using: (ctx) => ctx.activeTab == 4 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 3, y: 0, tip: 'Transportation', onClick: [] },
    { type: 'image', id: 'tabSaved', using: (ctx) => ctx.activeTab == 5 ? 'inventoryTabActive' : 'inventoryTab', x: width - 29 * 2, y: 0, tip: 'Saved Inventories', onClick: [] },
    { type: 'image', id: 'tabSearch', using: (ctx) => ctx.activeTab == 6 ? 'inventoryTabActive' : 'inventoryTab', x: width - 29 * 1, y: 0, tip: 'Search', onClick: [] },
    /* Bottom bar */
    { type: 'image', id: 'tabMisc', using: (ctx) => ctx.activeTab == 7 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 0, tip: 'Miscellaneous', onClick: [] },
    { type: 'image', id: 'tabFood', using: (ctx) => ctx.activeTab == 8 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 1, tip: 'Foodstuffs', onClick: [] },
    { type: 'image', id: 'tabTools', using: (ctx) => ctx.activeTab == 9 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 2, tip: 'Tools', onClick: [] },
    { type: 'image', id: 'tabCombat', using: (ctx) => ctx.activeTab == 10 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 3, tip: 'Combat', onClick: [] },
    { type: 'image', id: 'tabBrewing', using: (ctx) => ctx.activeTab == 11 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 4, tip: 'Brewing', onClick: [] },
    { type: 'image', id: 'tabSurvival', using: (ctx) => ctx.activeTab == 12 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: width - 28, tip: 'Survival', onClick: [] },
    /* The actual body */
    { type: 'image', using: (ctx) => ctx.activeTab == 6 ? 'tab_item_search' : (ctx.activeTab == 12 ? 'tab_inventory' : 'tab_items'), y: 30 },

    /* Tab Icons */
    { type: 'image', path: 'item/brick', x: 5, y: 8, using: 'icon' },
    { type: 'image', path: 'block/brain_coral', x: (29 * 1) + 5, y: 8, using: 'icon' },//supposed to be bush or something, the cant find icon
    { type: 'image', path: 'item/redstone', x: (29 * 2) + 5, y: 8, using: 'icon' },
    { type: 'image', path: 'block/powered_rail_on', x: (29 * 3) + 5, y: 8, using: 'icon' },
    { type: 'image', path: 'block/bookshelf', x: width - (29 * 2) + 5, y: 8, using: 'icon' },
    { type: 'image', path: 'item/compass_00', x: width - (29 * 1) + 5, y: 8, using: 'icon' },

    { type: 'image', path: 'item/lava_bucket', x: (29 * 0) + 5, y: height + 31, using: 'icon' },
    { type: 'image', path: 'item/apple', x: (29 * 1) + 5, y: height + 31, using: 'icon' },
    { type: 'image', path: 'item/iron_axe', x: (29 * 2) + 5, y: height + 31, using: 'icon' },
    { type: 'image', path: 'item/golden_sword', x: (29 * 3) + 5, y: height + 31, using: 'icon' },
    { type: 'image', path: 'item/glass_bottle', x: (29 * 4) + 5, y: height + 31, using: 'icon' },//supposed to be water bottle
    { type: 'image', path: 'item/chest_minecart', x: width - (29 * 1) + 6, y: height + 31, using: 'icon' },//supposed to be chest
    /* Search bar if on search tab */
    {
      type: 'container', if: 'ctx.activeTab == 6', x: 8, y: 44, children: [
        { type: 'text', px: 11, value: L['Search Items'] },
        { type: 'input', bb: [80, 35, 90, 10] },
      ]
    },
    /* Items in the body */
    {
      type: 'container', if: 'ctx.activeTab != 12', x: 9, y: 47, children: [
        { type: 'itemgrid', containing: 'bodyItems', width: 9, height: 5, padding: 2, size: 16 }
      ]
    },
    {
      type: 'container', x: 9, y: 142, children: [
        { type: 'itemgrid', containing: 'hotbarItems', width: 9, height: 1, padding: 2, size: 16 }
      ]
    },
    /* Scrollbar */
    {
      type: 'container', if: 'ctx.activeTab != 12', x: 175, y: 48, children: [
        {
          type: 'scrollbar', id: 'scrollbar',
          using: 'tabSliderActive',
          // if: 'ctx.items.length > (5*9)',
          bb: [0, 0, 12, 110],
        },
        // { type: 'image', if: 'ctx.items.length <= (5*9)', x: 0, y: 0, using: 'tabSliderInactive' }
      ]
    },
    /* Survival Inventory */
    {
      type: 'container', if: 'ctx.activeTab == 12', children: [
        { type: 'itemgrid', containing: 'shieldItem', x: 35, y: 50, width: 1, height: 1 },
        { type: 'itemgrid', containing: 'headItem', x: 54, y: 36, width: 1, height: 1 },
        { type: 'itemgrid', containing: 'chestItem', x: 54, y: 63, width: 1, height: 1 },
        { type: 'itemgrid', containing: 'legItem', x: 108, y: 36, width: 1, height: 1 },
        { type: 'itemgrid', containing: 'feetItem', x: 108, y: 63, width: 1, height: 1 },
        {
          type: 'container', x: 9, y: 84, children: [
            { type: 'itemgrid', containing: 'survivalItems', width: 9, height: 3, padding: 2, size: 16 },
            { id: 'survivalClearBtn', type: 'button', x: 164, y: 58, slice: [0, 0, 16, 16], h: 16, w: 16, tip: 'Clear Inventory', onClick: [] }
          ]
        }
      ]
    }
  ]
}

layouts.BrewingStand = {
  with: {
    'brewing_stand': { path: 'gui/container/brewing_stand', slice: [0, 0, 176, 164] },
    'fuel': { path: 'gui/container/brewing_stand', slice: [176, 29, null, 4] },
    'arrow': { path: 'gui/container/brewing_stand', slice: [176, 0, 9, null] },
    'bubbles': { path: 'gui/container/brewing_stand', slice: [185, 0, 12, null] },
    'bubbleHeights': [29, 24, 20, 16, 11, 6, 0]
  },
  type: 'image',
  using: 'brewing_stand',
  children: [
    { type: 'itemgrid', containing: 'blazePowderItem', x: 17, y: 17 },
    { type: 'itemgrid', containing: 'ingredientItem', x: 79, y: 17 },
    { type: 'itemgrid', containing: 'bottleItemA', x: 56, y: 51 },
    { type: 'itemgrid', containing: 'bottleItemB', x: 79, y: 58 },
    { type: 'itemgrid', containing: 'bottleItemC', x: 102, y: 51 },
    {
      type: 'container', if: 'ctx.brewingTicks > 0', children: [
        {
          type: 'item', using: 'fuel', x: 60, y: 44,
          draw(ctx, self, [x, y]) {
            const width = Math.max(0, Math.min((18 * ctx.fuelRemaining + 20 - 1) / 20, 18))
            console.log('drawing', [self.slice[0], self.slice[1], width, self.slice[3]])
            ctx.drawImage(self, x, y, [self.slice[0], self.slice[1], width, self.slice[3]])
          }
        },
        {
          type: 'item', using: 'arrow', x: 97, y: 16,
          draw(ctx, self, [x, y]) {
            const height = (28.0 * (1.0 - ctx.brewingTicks / 400.0))
            ctx.drawImage(self, x, y, [self.slice[0], 0, self.slice[2], height])
          }
        },
        {
          type: 'image', using: 'bubbles', x: 63, y: 14,
          draw(ctx, self, [x, y]) {
            // console.log('draw', ctx.brewingTicks / 2 % 7, ctx.bubbleHeights)
            const height = ctx.bubbleHeights[Math.floor(ctx.brewingTicks / 2 % 7)]
            // const height = 6
            ctx.drawImage(self, x, y + 29 - height, [self.slice[0], 29 - height, self.slice[2], height])
            // ctx.drawImage(self, x, y + height, [self.slice[0], height, self.slice[2], 29 - height])

            // console.log([self.slice[0], 29 - height, self.slice[2], height])
          }
        },
      ]
    },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 },
  ]
}

layouts.Anvil = {
  with: {
    'anvil': { path: 'gui/container/anvil', slice: [0, 0, 176, 166] },
    'writable': { path: 'gui/container/anvil', slice: [0, 166, 110, 16] },
    'unwritable': { path: 'gui/container/anvil', slice: [0, 16 + 166, 110, 16] },
  },
  type: 'image',
  using: 'anvil',
  children: [
    { type: 'image', using: 'writable', x: 59, y: 20 },
    { type: 'input', id: 'renameTextInput', variable: 'renameText', bb: [60, 21, 108, 14] },
    { type: 'itemgrid', containing: 'inputItemsA', x: 27, y: 47, width: 1, height: 1 },
    { type: 'itemgrid', containing: 'inputItemsB', x: 76, y: 47, width: 1, height: 1 },
    { type: 'itemgrid', containing: 'resultItems', x: 134, y: 47, width: 1, height: 1 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 },
  ]
}

layouts.EnchantingTable = {
  with: {
    enchanting_table: { path: 'gui/container/enchanting_table', slice: [0, 0, 176, 166] },
    active_ench: { path: 'gui/container/enchanting_table', slice: [0, 166, 108, 19] },
    inactive_ench: { path: 'gui/container/enchanting_table', slice: [0, 166 + 19, 108, 19] },
    hover_ench: { path: 'gui/container/enchanting_table', slice: [0, 204, 108, 19] },
    active_orb: { path: 'gui/container/enchanting_table' },
    inactive_orb: { path: 'gui/container/enchanting_table' },
    book_anims: { path: 'enchant_table_anims2' }
  },
  type: 'image',
  using: 'enchanting_table',
  children: [
    {
      type: 'image', x: 14, y: 10, using: 'book_anims',
      slice: [ 0, 0, 128, 128 ],
      // slice: [ 0, 0, 128, 128 ],
      // scale: 0.25,
      draw(ctx, self, [x, y]) {
        // const row = Math.floor(ctx.animFrame / 5)
        // const col = ctx.animFrame % 5
        ctx.drawImage(self, x, y, [0, ctx.animFrame * 150, 150, 150], 0.25)
      }
    },
    {
      type: 'container', x: 60, y: 14, children: [
        { type: 'image', id: 'enchant1', tip: true, using: (ctx) => ctx.isActive('enchant1') ? 'hover_ench' : (ctx.enchant1 ? 'active_ench' : 'inactive_ench') },
        { draw: (ctx, self, [x, y]) => ctx.drawImage(ctx.enchant1 ? ctx.active_orb : ctx.inactive_orb, x, y + 2, [ 0, 223 + (ctx.enchant1 ? 0 : 16), 16, 16 ]) }
      ],
    },
    {
      type: 'container', x: 60, y: 14 + 19, children: [
        { type: 'image', id: 'enchant2', tip: true, using: (ctx) => ctx.isActive('enchant2') ? 'hover_ench' : (ctx.enchant2 ? 'active_ench' : 'inactive_ench') },
        { draw: (ctx, self, [x, y]) => ctx.drawImage(ctx.enchant2 ? ctx.active_orb : ctx.inactive_orb, x, y + 2, [ 16, 223 + (ctx.enchant2 ? 0 : 16), 16, 16 ]) }
      ]
    },
    {
      type: 'container', x: 60, y: 14 + 19 + 19, children: [
        { type: 'image', id: 'enchant3', tip: true, using: (ctx) => ctx.isActive('enchant3') ? 'hover_ench' : (ctx.enchant3 ? 'active_ench' : 'inactive_ench') },
        { draw: (ctx, self, [x, y]) => ctx.drawImage(ctx.enchant3 ? ctx.active_orb : ctx.inactive_orb, x, y + 2, [ 32, 223 + (ctx.enchant3 ? 0 : 16), 16, 16 ]) }
      ]
    },
    { type: 'itemgrid', containing: 'enchantItem', x: 15, y: 47 },
    { type: 'itemgrid', containing: 'lapisItem', x: 35, y: 47 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

layouts.PlayerInventory = {
  with: {
    inventory: { path: 'gui/container/inventory', slice: [0, 0, 176, 166] },
  },
  type: 'image',
  using: 'inventory',
  children: [
    { type: 'itemgrid', containing: 'shieldItems', x: 77, y: 62 },
    { type: 'itemgrid', containing: 'craftingItems', x: 98, y: 18, width: 2, height: 2 },
    { type: 'itemgrid', containing: 'resultItems', x: 154, y: 28 },
    { type: 'itemgrid', containing: 'armorItems', x: 8, y: 8, width: 1, height: 4 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

if (typeof module != 'undefined') module.exports = { windows }