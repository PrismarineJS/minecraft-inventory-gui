const L = {
  'Search Items': 'Search Items'
}

// 28,32 - tabs.png

var windows = {}
var height = 136; var width = 195;
windows.Creative = {
  // type: 'image',
  using: { // reusable constants + allow for assets to be easily preloaded without recusing
    'tab_inventory': { path: 'gui/container/creative_inventory/tab_inventory' },
    'tab_items': { path: 'gui/container/creative_inventory/tab_items' },
    'tab_item_search': { path: 'gui/container/creative_inventory/tab_item_search' },
    'inventoryTabActive': { path: 'gui/container/creative_inventory/tabs', slice: [0, 0, 28, 32] },
    'inventoryTab': { path: 'gui/container/creative_inventory/tabs', slice: [0, 0, 28, 32] },
    'inventoryBotTab': { path: 'gui/container/creative_inventory/tabs', slice: [0, 64, 28, 32], y: height + 28 },
    'inventoryBotActiveTab': { path: 'gui/container/creative_inventory/tabs', slice: [0, 64+32, 20, 20], y: height + 28 },
    'tabSliderInactive': { path: 'gui/container/creative_inventory/tabs', slice: [232 + 12, 0, 12, 15] },
    'tabSliderActive': { path: 'gui/container/creative_inventory/tabs', slice: [232, 0, 12, 15] },
    icon: { scale: 1.1, slice: [0,0,16,16] }
  },
  children: [
    /* Top bar */
    { type: 'image', with: (ctx) => ctx.activeTab == 1 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 0, y: 0, tip: 'Building blocks' },
    { type: 'image', with: (ctx) => ctx.activeTab == 2 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 1, y: 0, tip: 'Decoration blocks' },
    { type: 'image', with: (ctx) => ctx.activeTab == 3 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 2, y: 0, tip: 'Redstone' },
    { type: 'image', with: (ctx) => ctx.activeTab == 4 ? 'inventoryTabActive' : 'inventoryTab', x: 29 * 3, y: 0, tip: 'Transportation' },
    { type: 'image', with: (ctx) => ctx.activeTab == 5 ? 'inventoryTabActive' : 'inventoryTab', x: width - 29 * 2, y: 0, tip: 'Saved Inventories' },
    { type: 'image', with: (ctx) => ctx.activeTab == 6 ? 'inventoryTabActive' : 'inventoryTab', x: width - 29 * 1, y: 0, tip: 'Search' },
    /* Bottom bar */
    { type: 'image', with: (ctx) => ctx.activeTab == 7 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 0, tip: 'Miscellaneous' },
    { type: 'image', with: (ctx) => ctx.activeTab == 8 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 1, tip: 'Foodstuffs' },
    { type: 'image', with: (ctx) => ctx.activeTab == 9 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 2, tip: 'Tools' },
    { type: 'image', with: (ctx) => ctx.activeTab == 10 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 3, tip: 'Combat' },
    { type: 'image', with: (ctx) => ctx.activeTab == 11 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: 29 * 4, tip: 'Brewing' },
    { type: 'image', with: (ctx) => ctx.activeTab == 12 ? 'inventoryBotActiveTab' : 'inventoryBotTab', x: width - 28, tip: 'Survival' },

    { type: 'image', with: (ctx) => ctx.activeTab == 6 ? 'tab_items' : 'tab_item_search', y: 30 },

    /* Tab Icons */
    { type: 'image', path: 'item/brick', x: 5, y: 8, with: 'icon' },
    { type: 'image', path: 'block/brain_coral', x: (29*1) + 5, y: 8, with: 'icon' },//supposed to be bush or something, the cant find icon
    { type: 'image', path: 'item/redstone', x: (29*2) + 5, y: 8, with: 'icon' },
    { type: 'image', path: 'block/powered_rail_on', x: (29*3) + 5, y: 8, with: 'icon' },
    { type: 'image', path: 'block/bookshelf', x: width - (29*2) + 5, y: 8, with: 'icon' },
    { type: 'image', path: 'item/compass_00', x: width - (29*1) + 5, y: 8, with: 'icon' },

    { type: 'image', path: 'item/lava_bucket', x: (29*0) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/apple', x: (29*1) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/iron_axe', x: (29*2) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/golden_sword', x: (29*3) + 5, y: height + 31, with: 'icon' },
    { type: 'image', path: 'item/glass_bottle', x: (29*4) + 5, y: height + 31, with: 'icon' },//supposed to be water bottle
    { type: 'image', path: 'item/chest_minecart', x: width - (29*1) + 6, y: height + 31, with: 'icon' },//supposed to be chest
    /* Search bar if on search tab */
    {
      type: 'container', if: 'ctx.activeTab == 5', x: 20, y: 40, children: [
        { type: 'text', value: L['Search Items'] },
        { type: 'input', bb: [60, 40, 120, 80] },
      ]
    },
    /* Items in the body */
    {
      type: 'container', if: 'ctx.activeTab != 12', x: 20, y: 60, children: [
        { type: 'itemgrid', width: 9, height: 9 }
      ]
    },
    /* Scrollbar */
    {
      type: 'container', if: 'ctx.activeTab != 12', x: 175, y: 48, children: [
        {
          if: 'ctx.items.length > (5*9)',
          draw(ctx, self) {
            const rowSize = 9
            const rows = Math.ceil(ctx.items / rowSize)
            ctx.cursorVertPosInContainer
            // ctx.drawImage(ctx.tabSliderActive, 0, 0) // TODO: scrolling
          }
        },
        { type: 'image', if: 'ctx.items.length <= (5*9)', x: 0, y: 0, with: 'tabSliderInactive' }
      ]
    }
  ]
}

if (typeof module != 'undefined') module.exports = { windows }