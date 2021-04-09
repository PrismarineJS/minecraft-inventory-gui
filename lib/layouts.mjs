const L = {
  'Search Items': 'Search Items'
}

// 28,32 - tabs.png

export let layouts = {}
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
      type: 'container', if: 'ctx.activeTab == 6', x: 0, y: 35, children: [
        { type: 'text', x: 8, y: 8, value: L['Search Items'] },
        { type: 'input', variable: 'searchText', bb: [80, 0, 90, 10] },
      ]
    },
    /* Items in the body */
    {
      type: 'container', if: 'ctx.activeTab != 12', x: 9, y: 47, children: [
        { type: 'itemgrid', containing: 'bodyItems', width: 9, height: 5, size: 16 }
      ]
    },
    {
      type: 'container', x: 9, y: 142, children: [
        { type: 'itemgrid', containing: 'hotbarItems', width: 9, height: 1, size: 16 }
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
            { type: 'itemgrid', containing: 'survivalItems', width: 9, height: 3, size: 16 },
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
            // console.log('drawing', [self.slice[0], self.slice[1], width, self.slice[3]])
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
    { type: 'itemgrid', containing: 'outputItems', x: 134, y: 47, width: 1, height: 1 },
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
      slice: [0, 0, 128, 128],
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
        { draw: (ctx, self, [x, y]) => ctx.drawImage(ctx.enchant1 ? ctx.active_orb : ctx.inactive_orb, x, y + 2, [0, 223 + (ctx.enchant1 ? 0 : 16), 16, 16]) }
      ],
    },
    {
      type: 'container', x: 60, y: 14 + 19, children: [
        { type: 'image', id: 'enchant2', tip: true, using: (ctx) => ctx.isActive('enchant2') ? 'hover_ench' : (ctx.enchant2 ? 'active_ench' : 'inactive_ench') },
        { draw: (ctx, self, [x, y]) => ctx.drawImage(ctx.enchant2 ? ctx.active_orb : ctx.inactive_orb, x, y + 2, [16, 223 + (ctx.enchant2 ? 0 : 16), 16, 16]) }
      ]
    },
    {
      type: 'container', x: 60, y: 14 + 19 + 19, children: [
        { type: 'image', id: 'enchant3', tip: true, using: (ctx) => ctx.isActive('enchant3') ? 'hover_ench' : (ctx.enchant3 ? 'active_ench' : 'inactive_ench') },
        { draw: (ctx, self, [x, y]) => ctx.drawImage(ctx.enchant3 ? ctx.active_orb : ctx.inactive_orb, x, y + 2, [32, 223 + (ctx.enchant3 ? 0 : 16), 16, 16]) }
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

layouts.DropDispense = {
  with: {
    inventory: { path: 'gui/container/dispenser', slice: [0, 0, 176, 166] },
  },
  type: 'image',
  using: 'inventory',
  children: [
    { type: 'itemgrid', containing: 'dispenseItems', x: 62, y: 17, width: 3, height: 3 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

layouts.CraftingTable = {
  with: {
    inventory: { path: 'gui/container/crafting_table', slice: [0, 0, 176, 166] },
  },
  type: 'image',
  using: 'inventory',
  children: [
    { type: 'itemgrid', containing: 'craftingItems', x: 30, y: 17, width: 3, height: 3 },
    // { type: 'itemgrid', containing: 'resultItem', x: 124, y: 35 },
    { type: 'itemgrid', containing: 'resultItem', x: 120, y: 31, padding: 4 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

// mc used to be able to do arbitrary size containers which was hacky, but
// now most things are fixed size so it makes things alot easier for us now :)
layouts.Chest = {
  with: {
    inventory: { path: 'gui/container/shulker_box', slice: [0, 0, 176, 166] },
  },
  type: 'image',
  using: 'inventory',
  children: [
    { type: 'itemgrid', containing: 'chestItems', x: 8, y: 18, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

layouts.LargeChest = {
  with: {
    inventory: { path: 'gui/container/generic_54', slice: [0, 0, 176, 221] },
  },
  type: 'image',
  using: 'inventory',
  children: [
    { type: 'itemgrid', containing: 'chestItems', x: 8, y: 18, width: 9, height: 6 },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 140, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 140 + 58, width: 9, height: 1 }
  ]
}

layouts.Furnace = {
  with: {
    inventory: { path: 'gui/container/furnace', slice: [0, 0, 176, 166] },
    fuel: { path: 'gui/container/furnace', slice: [176, 0, 14, 16] },
    progress: { path: 'gui/container/furnace', slice: [176, 14, null, 16] },
  },
  type: 'image',
  using: 'inventory',
  children: [
    { type: 'itemgrid', containing: 'inputSlot', x: 56, y: 17 },
    { type: 'itemgrid', containing: 'fuelSlot', x: 56, y: 53 },
    { type: 'itemgrid', containing: 'outputSlot', x: 112, y: 31, padding: 4 },
    {
      type: 'image', using: 'fuel', x: 56, y: 36,
      draw(ctx, self, [x, y]) {
        ctx.drawImage(self, x, y + 12 - ctx.litProgress, [self.slice[0], 12 - ctx.litProgress, self.slice[2], ctx.litProgress + 1])
      }
    },
    {
      type: 'image', using: 'progress', x: 79, y: 34,
      draw(ctx, self, [x, y]) {
        ctx.drawImage(self, x, y, [self.slice[0], self.slice[1], ctx.burnProgress + 1, self.slice[3]])
      }
    },
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

// Horses/Llamas... TODO
layouts.Horse = {
  with: {
    inventory: { path: 'gui/container/horse', slice: [0, 0, 176, 166] },
    extraSlots: { path: 'gui/container/horse', slice: [0, 166, 18 * 5, 54] }
  },
  type: 'image',
  using: 'inventory',
  children: [
    // { type: 'image', using: 'extraSlots', if: 'ctx.hasChest', x: 79, y: 17 },
    // { type: 'itemgrid', if: 'ctx.hasChest', containing: 'chestItems', x: 80, y: 18, width: 5, height: 3 },
    // { type: 'image', using: '' }
    { type: 'itemgrid', containing: 'inventoryItems', x: 8, y: 84, width: 9, height: 3 },
    { type: 'itemgrid', containing: 'hotbarItems', x: 8, y: 84 + 58, width: 9, height: 1 }
  ]
}

layouts.Villager = {
  with: {
    inventory: { path: 'gui/container/villager2', slice: [0, 0, 276, 166] },
    box: { path: 'gui/container/villager2', slice: [279, 74, 88, 25] },
    arrow: { path: 'gui/container/villager2', slice: [15, 171, 10, 9] },
    tabSliderActive: { path: 'gui/container/villager2', slice: [0, 199, 6, 27] }
  },
  type: 'image',
  using: 'inventory',
  children: [
    {
      type: 'container', x: 4, y: 18, children: [
        {
          draw(ctx, self, [x, y]) {
            const layouts = []
            for (let i = 0; i < 7; i++) {
              if (!ctx.trades[i]) continue
              layouts.push({
                type: 'container', x, y: y + (i * 20), w: 88, h: 20, tip: 'hello', children: [
                  {
                    draw(ctx, self, [x, y]) {
                      ctx.drawItem({ ...ctx.trades[i].input1, count: ctx.trades[i].inputOriginalPrice }, x + 2, y + 2)
                      if (ctx.trades[i].inputSalePrice)
                        ctx.drawText({ value: ctx.trades[i].inputSalePrice, fontStyle: 'italic 7px sans-serif', style: 'red' }, x + 22, y + 18)
                      ctx.drawItem(ctx.trades[i].input2, x + 32, y + 2)
                      ctx.drawItem(ctx.trades[i].input2, x + 70, y + 2)
                    }
                  },
                  { type: 'image', using: 'arrow', x: 55, y: 5 },
                ]
              })
            }
            ctx.renderLayout(layouts)
          },
        },
        {
          type: 'scrollbar', id: 'scrollbar',
          using: 'tabSliderActive', x: 90, y: 0,
          // if: 'ctx.items.length > (5*9)',
          bb: [90, 0, 6, 140],
        },
      ]
    },
    {
      type: 'container', x: 107, children: [
        { type: 'itemgrid', containing: 'input1Items', x: 136 - 107, y: 37 },
        { type: 'itemgrid', containing: 'input2Items', x: 162 - 107, y: 37 },
        { type: 'itemgrid', containing: 'outputItems', x: 216 - 107, y: 34, padding: 4 },
        { type: 'itemgrid', containing: 'inventoryItems', x: 1, y: 84, width: 9, height: 3 },
        { type: 'itemgrid', containing: 'hotbarItems', x: 1, y: 84 + 58, width: 9, height: 1 }
      ]
    }
  ]
}

layouts.Hotbar = {
  with: {
    xpBg: { path: 'gui/icons', slice: [0, 64, 182, 5] },
    xpFg: { path: 'gui/icons', slice: [0, 69, 182, 5] },
    hotbar: { path: 'gui/widgets', slice: [0, 0, 182, 22] },
    activeBox: { path: 'gui/widgets', slice: [0, 22, 24, 24] },
    offhand: { path: 'gui/widgets', slice: [0, 182, 22, 22] },
    icons: { path: 'gui/icons' },
  },
  // x: ctx => (ctx.can.width / 2) - (182 / 2), 
  // y: ctx => ctx.can.height - 24,
  children: [
    {
      draw(ctx, self, [x, y]) {
        if (ctx.armorPoints) for (let i = 0; i < 10; i++) ctx.drawImage(ctx.icons, x + (i * 8), y, [16, 9, 9, 9])

        for (let i = 0; i < ctx.armorPoints; i++) { // armor 26
          ctx.drawImage(ctx.icons, 1 + x + (i * 4), y, [i % 2 == 0 ? 35 : 35 + 4, 9, 4, 8])
        }
        for (let i = 0; i < 10; i++) { // hearts
          ctx.drawImage(ctx.icons, x + (i * 8), y + 10, [16, 0, 9, 8.5])
        }
        for (let i = 0; i < ctx.healthPoints; i++) {
          ctx.drawImage(ctx.icons, 1 + x + (i * 4), y + 10, [i % 2 == 0 ? 53 : 53 + 4, 0, 4, 8])
        }
      }
    },
    {
      x: 100,
      draw(ctx, self, [x, y]) {
        for (let i = 0; i < ctx.bubbles; i++) { // bubble 💧
          ctx.drawImage(ctx.icons, x + ((9 - i) * 8), y, [16, 18, 9, 9])
        }
        for (let i = 0; i < 10; i++) {
          ctx.drawImage(ctx.icons, x + (i * 8), y + 10, [16, 27, 9, 8.90])
        }
        for (let i = 0; i < ctx.hungerPoints; i++) { // TODO: better way?
          if (i % 2 == 0) ctx.drawImage(ctx.icons, 1 + 74 + x - (i * 4), y + 11, [53 + 2, 28, 6, 7])
          if (i % 2 != 0) ctx.drawImage(ctx.icons, 1 + 76 + x - (i * 4), y + 11, [53, 28, 2, 7])
        }
      }
    },
    { type: 'bar', bg: 'xpBg', fg: 'xpFg', containing: 'xpProgress', y: 8 + 12 },
    { type: 'text', x: 84, y: 18, containing: 'xpLevel', style: 'lime', stroke: 'black', w: 182, align: 'center' },
    {
      type: 'container', y: 8 + 14, children: [
        { type: 'image', using: 'hotbar', y: 6 },
        { type: 'image', using: 'activeBox', x: ctx => (ctx.activeHotbarSlot * 20) - 1, y: 5 },
        { type: 'itemgrid', containing: 'hotbarItems', x: 3, y: 9, margin: 4, width: 9 },
      ]
    }
  ]
}