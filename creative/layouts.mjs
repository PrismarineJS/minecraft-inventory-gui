const L = {
  'Search Items': 'Search Items'
}

// 28,32 - tabs.png

globalThis.layouts = {}
var height = 136; var width = 195;
layouts.Creative = {
  // type: 'image',
  using: { // reusable constants + allow for assets to be easily preloaded without recusing
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
    { type: 'image', id: 'tabBuilding', with: (ctx) => ctx.activeTab == 1 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 0, y: 0, tip: 'Building blocks', onClick: [] },
    { type: 'image', id: 'tabDecoration', with: (ctx) => ctx.activeTab == 2 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 1, y: 0, tip: 'Decoration blocks', onClick: [] },
    { type: 'image', id: 'tabRedstone', with: (ctx) => ctx.activeTab == 3 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 2, y: 0, tip: 'Redstone', onClick: [] },
    { type: 'image', id: 'tabTransport', with: (ctx) => ctx.activeTab == 4 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 3, y: 0, tip: 'Transportation', onClick: [] },
    { type: 'image', id: 'tabSaved', with: (ctx) => ctx.activeTab == 5 ? 'inventoryTabActive' : 'inventoryTab', x: width - 29 * 2, y: 0, tip: 'Saved Inventories', onClick: [] },
    { type: 'image', id: 'tabSearch', with: (ctx) => ctx.activeTab == 6 ? 'inventoryTabActive' : 'inventoryTab', x: width - 29 * 1, y: 0, tip: 'Search', onClick: [] },
    /* Bottom bar */
    { type: 'image', id: 'tabMisc', with: (ctx) => ctx.activeTab == 7 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 0, tip: 'Miscellaneous', onClick: [] },
    { type: 'image', id: 'tabFood', with: (ctx) => ctx.activeTab == 8 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 1, tip: 'Foodstuffs', onClick: [] },
    { type: 'image', id: 'tabTools', with: (ctx) => ctx.activeTab == 9 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 2, tip: 'Tools', onClick: [] },
    { type: 'image', id: 'tabCombat', with: (ctx) => ctx.activeTab == 10 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 3, tip: 'Combat', onClick: [] },
    { type: 'image', id: 'tabBrewing', with: (ctx) => ctx.activeTab == 11 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 4, tip: 'Brewing', onClick: [] },
    { type: 'image', id: 'tabSurvival', with: (ctx) => ctx.activeTab == 12 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: width - 28, tip: 'Survival', onClick: [] },
    /* The actual body */
    { type: 'image', with: (ctx) => ctx.activeTab == 6 ? 'tab_item_search' : (ctx.activeTab == 12 ? 'tab_inventory' : 'tab_items'), y: 30 },

    /* Tab Icons */
    { type: 'image', path: 'item/brick', x: 5, y: 8, with: 'icon' },
    { type: 'image', path: 'block/brain_coral', x: (29 * 1) + 5, y: 8, with: 'icon' },//supposed to be bush or something, the cant find icon
    { type: 'image', path: 'item/redstone', x: (29 * 2) + 5, y: 8, with: 'icon' },
    { type: 'image', path: 'block/powered_rail_on', x: (29 * 3) + 5, y: 8, with: 'icon' },
    { type: 'image', path: 'block/bookshelf', x: width - (29 * 2) + 5, y: 8, with: 'icon' },
    { type: 'image', path: 'item/compass_00', x: width - (29 * 1) + 5, y: 8, with: 'icon' },

    { type: 'image', path: 'item/lava_bucket', x: (29 * 0) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/apple', x: (29 * 1) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/iron_axe', x: (29 * 2) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/golden_sword', x: (29 * 3) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/glass_bottle', x: (29 * 4) + 5, y: height + 31, with: 'icon' },//supposed to be water bottle
    { type: 'image', path: 'item/chest_minecart', x: width - (29 * 1) + 6, y: height + 31, with: 'icon' },//supposed to be chest
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
          with: 'tabSliderActive',
          // if: 'ctx.items.length > (5*9)',
          bb: [0, 0, 12, 110],
        },
        // { type: 'image', if: 'ctx.items.length <= (5*9)', x: 0, y: 0, with: 'tabSliderInactive' }
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
  using: {
    'brewing_stand': { path: 'gui/container/brewing_stand', slice: [0, 0, 176, 164] },
    'fuel': { path: 'gui/container/brewing_stand', slice: [176, 29, null, 4] },
    'arrow': { path: 'gui/container/brewing_stand', slice: [176, 0, 9, null] },
    'bubbles': { path: 'gui/container/brewing_stand', slice: [185, 0, 12, null] },
    'bubbleHeights': [29, 24, 20, 16, 11, 6, 0]
  },
  type: 'image',
  with: 'brewing_stand',
  children: [
    { type: 'itemgrid', containing: 'blazePowderItem', x: 17, y: 17 },
    { type: 'itemgrid', containing: 'ingredientItem', x: 79, y: 17 },
    { type: 'itemgrid', containing: 'bottleItemA', x: 56, y: 51 },
    { type: 'itemgrid', containing: 'bottleItemB', x: 79, y: 58 },
    { type: 'itemgrid', containing: 'bottleItemC', x: 102, y: 51 },
    {
      type: 'container', if: 'ctx.brewingTicks > 0', children: [
        {
          type: 'item', with: 'fuel', x: 60, y: 44,
          draw(ctx, self, [x, y]) {
            const width = Math.max(0, Math.min((18 * ctx.fuelRemaining + 20 - 1) / 20, 18))
            console.log('drawing',[self.slice[0], self.slice[1], width, self.slice[3]])
            ctx.drawImage(self, x, y, [self.slice[0], self.slice[1], width, self.slice[3]])
          }
        },
        {
          type: 'item', with: 'arrow', x: 97, y: 16,
          draw(ctx, self, [x, y]) {
            const height = (28.0 * (1.0 - ctx.brewingTicks / 400.0))
            ctx.drawImage(self, x, y, [self.slice[0], 0, self.slice[2], height])
          }
        },
        {
          type: 'image', with: 'bubbles', x: 63, y: 14,
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
  using: {
    'anvil': { path: 'gui/container/anvil', slice: [0, 0, 176, 166] },
    'writable': { path: 'gui/container/anvil', slice: [0, 166, 110, 16] },
    'unwritable': { path: 'gui/container/anvil', slice: [0, 16 + 166, 110, 16] },
  },
  type: 'image',
  with: 'anvil',
  children: [
    { type: 'image', with: 'writable', x: 59, y: 20 },
    { type: 'input', id: 'renameTextInput', variable: 'renameText', bb: [60, 21, 108, 14] },
    { type: 'itemgrid', containing: 'inputItemsA', x: 27, y: 47, width: 1, height: 1 },
    { type: 'itemgrid', containing: 'inputItemsB', x: 76, y: 47, width: 1, height: 1 },
    { type: 'itemgrid', containing: 'resultItems', x: 134, y: 47, width: 1, height: 1 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 },
  ]
}

if (typeof module != 'undefined') module.exports = { windows }