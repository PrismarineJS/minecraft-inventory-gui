import { InventoryWindow } from './InventoryWindow.mjs'

const noop = () => { }
console.log(globalThis.debuggingInventory)
const demo = globalThis.debuggingInventory ? setInterval : noop

export class CreativeWin extends InventoryWindow {
  layoutId = 'Creative'

  searchText = 'Click here to search'

  activeTab = 5

  hotbarItems = []
  bodyItems = []
  inventoryItems = []

  shieldItem = []
  headItem = []
  chestItem = []
  legItem = []
  feetItem = []

  constructor(...a) {
    super(...a)
  }

  onClickEvent = (id, type, pos, data) => {
    console.log('Clicked', id, '!')
    if (id.startsWith('tab')) {
      this.emit('tabChange', id, this.activeTab)
      this.activeTab = this.tabs.indexOf(id)
      this.needsUpdate = true
    } else {
      super.onClickEvent()
    }
  }

  getWindowMap(version) {
    if (version === 'bedrock') {
      return {
        headItem: { containerID: 'armor', range: [0] },
        chestItem: { containerID: 'armor', range: [1] },
        legItem: { containerID: 'armor', range: [2] },
        feetItem: { containerID: 'armor', range: [3] },
        hotbarItems: { containerID: 'hotbar_and_inventory', range: [0, 9] },
        inventoryItems: { containerID: 'hotbar_and_inventory', range: [9, 9 + (9 * 3)] },
        shieldItem: { containerID: 'offhand', range: [0] }
      }
    }
  }
}

export class BrewingWin extends InventoryWindow {
  layoutId = 'BrewingStand'

  blazePowderItem = []
  ingredientItem = []
  bottleItemA = []
  bottleItemB = []
  bottleItemC = []

  inventoryItems = []
  hotbarItems = []

  brewingTicks = 20 * 20
  fuelRemaining = 20

  constructor(...args) {
    super(...args)

    demo(() => {
      this.brewingTicks--
      this.fuelRemaining--
      if (this.fuelRemaining < 0) this.fuelRemaining = 20
      this.needsUpdate = true
    }, 50)
  }

  getWindowMap(version) {
    return {
      bottleItemA: [0],
      bottleItemB: [1],
      bottleItemC: [2],
      ingredientItem: [3],
      blazePowderItem: [4],
      inventoryItems: [5, 31],
      hotbarItems: [32, 40]
    }
  }
}

export class AnvilWin extends InventoryWindow {
  layoutId = 'Anvil'

  inputItemsA = []
  inputItemsB = []
  outputItems = []
  inventoryItems = []
  hotbarItems = []

  renameText = 'Hello world!'

  getWindowMap(version) {
    return {
      inputItemsA: [0],
      inputItemsB: [1],
      outputItems: [2],
      inventoryItems: [3, 29],
      hotbarItems: [30, 38]
    }
  }
}

export class EnchantingWin extends InventoryWindow {
  layoutId = 'EnchantingTable'

  animFrame = 0

  enchantItem = []
  lapisItem = []

  enchant1 = []
  enchant2 = null
  enchant3 = []

  inventoryItems = []
  hotbarItems = []

  constructor(...args) {
    super(...args)

    let reversing = false

    demo(() => {
      if (reversing) {
        this.animFrame -= 2
      } else {
        this.animFrame += 2
      }
      if (this.animFrame < 0) {
        reversing = false
        this.animFrame = 0
      } else if (this.animFrame > 330) {
        reversing = true
      }
      // console.log(this.animFrame)
      // this.animFrame = this.animFrame % 330
      this.needsUpdate = true
    }, 40)
  }

  isActive(id) {
    return super.isActive(id) && this[id]
  }

  getWindowMap(version) {
    return {
      enchantItem: [0],
      lapisItem: [1],
      inventoryItems: [2, 28],
      hotbarItems: [29, 37]
    }
  }
}

export class PlayerWin extends InventoryWindow {
  layoutId = 'PlayerInventory'

  craftingItems = []
  resultItems = []
  shieldItems = []
  armorItems = []
  inventoryItems = []
  hotbarItems = []

  items = [this.shieldItems, this.craftingItems, this.resultItems, this.armorItems, this.inventoryItems, this.hotbarItems]

  getWindowMap(version) {
    return {
      craftingItems: [1, 4],
      resultItems: [0],
      shieldItems: [45],
      armorItems: [5, 8],
      inventoryItems: [9, 35],
      hotbarItems: [36, 44]
    }
  }
}

export class DropDispenseWin extends InventoryWindow {
  layoutId = 'DropDispense'

  dispenseItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {
      dispenseItems: [0, 8],
      inventoryItems: [9, 35],
      hotbarItems: [36, 44]
    }
  }
}

export class CraftingWin extends InventoryWindow {
  layoutId = 'CraftingTable'

  craftingItems = []
  resultItem = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {
      craftingItems: [1, 9],
      resultItem: [0],
      inventoryItems: [10, 36],
      hotbarItems: [37, 45]
    }
  }
}

export class ChestWin extends InventoryWindow {
  layoutId = 'Chest'
  layout = [layouts.Chest]

  chestItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {
      chestItems: [0, 26],
      inventoryItems: [27, 53],
      hotbarItems: [51, 64]
    }
  }
}

export class LargeChestWin extends InventoryWindow {
  layoutId = 'LargeChest'

  chestItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {
      chestItems: [0, 53],
      inventoryItems: [54, 80],
      hotbarItems: [81, 89]
    }
  }
}

export class FurnaceWin extends InventoryWindow {
  layoutId = 'Furnace'

  inputSlot = []
  fuelSlot = []
  outputSlot = []
  inventoryItems = []
  hotbarItems = []

  litProgress = -1//16
  burnProgress = -1//22

  constructor(...a) {
    super(...a)

    demo(() => {
      this.litProgress++
      this.burnProgress++
      if (this.litProgress > 16) this.litProgress = 0
      if (this.burnProgress > 22) this.burnProgress = 0
      this.needsUpdate = true
    }, 40)
  }

  getWindowMap() {
    return {
      inputSlot: [0],
      fuelSlot: [1],
      outputSlot: [2],
      inventoryItems: [3, 29],
      hotbarItems: [30, 38]
    }
  }
}

// TODO: deal with this mess
export class HorseWin extends InventoryWindow {
  layoutId = 'Horse'

  hasChest = true
  chestItems = []
  inventoryItems = []
  hotbarItems = []

  /** @type {'horse' | 'donkey', 'llama'} */
  type = 'horse'

  getWindowMap() {
    if (this.type == 'horse') {
      return {

      }
    }
  }
}

export class VillagerWin extends InventoryWindow {
  layoutId = 'Villager'

  trades = [
    // if a 
    { input1: { type: 0, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 0, count: 1 }, output: { type: 0, count: 1 } },
    { input1: { type: 1, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 1, count: 1 }, output: { type: 1, count: 1 } },
    { input1: { type: 2, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 2, count: 1 }, output: { type: 2, count: 1 } },
    { input1: { type: 3, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 3, count: 1 }, output: { type: 3, count: 1 } },
    { input1: { type: 4, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 4, count: 1 }, output: { type: 4, count: 1 } },
    { input1: { type: 5, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 5, count: 1 }, output: { type: 5, count: 1 } },
    { input1: { type: 6, count: 1 }, inputSalePrice: 64, inputOriginalPrice: 0, input2: { type: 6, count: 1 }, output: { type: 6, count: 1 } },
  ]

  input1Items = []
  input2Items = []
  outputItems = []

  inventoryItems = []
  hotbarItems = []

  getWindowMap(version) {
    return {
      input1Items: [0],
      input2Items: [1],
      inventoryItems: [3, 29],
      hotbarItems: [30, 38]
    }
  }
}

export class HotbarWin extends InventoryWindow {
  layoutId = 'Hotbar'

  xpLevel = 1
  xpProgress = 50

  bubbles = 10
  armorPoints = 20
  healthPoints = 20
  hungerPoints = 20
  activeHotbarSlot = 1
  hotbarItems = []

  constructor(...a) {
    super(...a)

    console.log(globalThis.debuggingInventory)
    demo(() => {
      this.xpLevel++
      this.xpProgress++
      this.healthPoints--
      this.hungerPoints--
      this.armorPoints--
      this.bubbles--
      this.activeHotbarSlot++
      if (this.activeHotbarSlot > 8) this.activeHotbarSlot = 0
      if (this.xpLevel > 100) this.xpLevel = 0
      if (this.xpProgress > 100) this.xpProgress = 0
      if (this.armorPoints < 0) this.armorPoints = 20
      if (this.healthPoints < 0) this.healthPoints = 20
      if (this.hungerPoints < 0) this.hungerPoints = 20
      if (this.bubbles < 0) this.bubbles = 10
      this.needsUpdate = true
    }, 100)
  }

  getWindowMap() {
    return {
      hotbarItems: [32, 40]
    }
  }
}