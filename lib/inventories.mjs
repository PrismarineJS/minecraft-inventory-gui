import { InventoryWindow } from './InventoryWindow.mjs'
export class CreativeWin extends InventoryWindow {
  layoutId = 'Creative'
  activeTab = 5

  hotbarItems = []
  bodyItems = []
  survivalItems = []

  shieldItem = []
  headItem = []
  chestItem = []
  legItem = []
  feetItem = []

  constructor(...a) {
    super(...a)

    // Load layout
    this.layout = [globalThis.layouts.Creative]
  }

  onClickEvent = (id, type, pos) => {
    console.log('Clicked', id, '!')
    this.activeTab = this.tabs.indexOf(id)
    this.needsUpdate = true
  }
}

export class BrewingStandWin extends InventoryWindow {
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

    setInterval(() => {
      this.brewingTicks--
      this.fuelRemaining--
      if (this.fuelRemaining < 0) this.fuelRemaining = 20
      this.needsUpdate = true
    }, 50)
  }
}

export class AnvilWin extends InventoryWindow {
  layoutId = 'Anvil'

  inputItemsA = []
  inputItemsB = []
  resultItems = []
  inventoryItems = []
  hotbarItems = []

  renameText = 'Hello world!'
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

    setInterval(() => {
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

  onTooltipEvent(id, type, pos) {
    super.onTooltipEvent(id, type, pos)
    this.needsUpdate = true
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
    return {}
  }
}

export class CraftingWin extends InventoryWindow {
  layoutId = 'CraftingTable'

  craftingItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {}
  }
}

export class ChestWin extends InventoryWindow {
  layoutId = 'Chest'
  layout = [layouts.Chest]

  chestItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {}
  }
}

export class LargeChestWin extends InventoryWindow {
  layoutId = 'LargeChest'

  chestItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {}
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

    // let reversing = false

    setInterval(() => {
      this.litProgress++
      this.burnProgress++
      if (this.litProgress > 16) this.litProgress = 0
      if (this.burnProgress > 22) this.burnProgress = 0
      this.needsUpdate = true
    }, 40)
  }

  getWindowMap() {
    return {}
  }
}

export class HorseWin extends InventoryWindow {
  layoutId = 'Horse'

  hasChest = true
  chestItems = []
  inventoryItems = []
  hotbarItems = []

  getWindowMap() {
    return {}
  }
}

export class VillagerWin extends InventoryWindow {
  layoutId = 'Villager'

  trades = [
    // if a 
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
    { input1: {}, inputSalePrice: 64, inputOriginalPrice: 0, input2: {}, output: {} },
  ]

  input1Items = []
  input2Items = []
  outputItems = []

  inventoryItems = []
  hotbarItems = []
}