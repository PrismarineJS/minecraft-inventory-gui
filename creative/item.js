// const mcData = require('minecraft-data')('1.16')

let PlayerInventory, DropDispenseInventory, AnvilInventory,
  BeaconInventory, FurnaceInventory, BrewingStandInventory, CraftingTableInventory,
  EnchantingTableInventory, GrindstoneInv, HopperInv, LecternInv, LoomInv, VillagerInv,
  ShulkerBoxInv, SmokerInv, CartographyInv, StonecutterInv

class PWindowManager {
  mouseDown = false
  constructor(win, inv) {
    this.win = win
    this.inv = inv
    this.map = win.getWindowMap()
    this.renderItems()

    win.on('itemEvent', (id, type, pos, data) => {
      console.log('itemEvent', id, type, pos, data)
      if (type == 'release') {
        this.mouseDown = false
        this.mouseDownData = null
      } else {
        const [containing, index] = data
        const slotIndex = this.map[containing][0] + index
        const item = this.inv.slots[slotIndex]
        this.onInventoryEvent(type, containing, index, slotIndex, item)
      }
    })
  }

  setSlot(inventoryIndex, item) {
    this.inv.slots[inventoryIndex] = item
    console.log('set', inventoryIndex, item)
    this.renderItems()
    this.win.needsUpdate = true
  }

  renderItems() {
    for (const key in this.map) {
      const [begin, end] = this.map[key]
      this.win[key] = this.inv.slots.slice(begin, end != null ? end + 1 : undefined)
    }
    this.win.needsUpdate = true
  }

  getMaxStackSize(item) {
    return 64//mcData.items[item.type].stackSize
  }

  onLeftClick(inventoryIndex, item) {
    const floating = this.win.floatingItem
    if (floating) {
      console.log('have a floating itm')
      if (item) {
        if (floating.type == item.type) {
          const free = this.getMaxStackSize(item) - item.count
          const consumable = Math.min(floating.count, free)
          floating.count -= consumable
          item.count += consumable
          if (floating.count <= 0) delete this.win.floatingItem
          this.win.needsUpdate = true
        } else {
          //swap
          const old = this.inv.slots[inventoryIndex]
          this.setSlot(inventoryIndex, this.win.floatingItem)
          this.win.floatingItem = old
          this.win.needsUpdate = true
        }
      } else {
        this.setSlot(inventoryIndex, this.win.floatingItem)
        this.win.floatingItem = null
        this.win.needsUpdate = true
      }
    } else { // pickup item
      this.win.floatingItem = item
      this.setSlot(inventoryIndex, null)
    }
  }

  onRightClick(inventoryIndex, slot) {
    const floating = this.win.floatingItem
    if (floating) {
      if (slot) {
        const free = this.getMaxStackSize(slot) - slot.count
        if (slot.type == floating.type && free >= 1) {
          slot.count++
          floating.count--
        } else {
          // we can't right click on this slot as there's something already there
        }
      } else {
        const slot = floating.clone()
        slot.count = 1
        floating.count--
        this.setSlot(inventoryIndex, slot)
      }
    } else {
      this.win.floatingItem = slot.clone()
      const split = Math.floor(slot.count / 2)
      slot.count -= split
      this.win.floatingItem.count = split
    }
    if (slot?.count == 0) delete this.inv.slots[inventoryIndex]
    if (floating?.count == 0) delete this.win.floatingItem
  }

  // Called whenever an inventory event occurs
  onInventoryEvent(type, containing, windowIndex, inventoryIndex, item) {
    const floating = this.win.floatingItem
    // The user has double clicked, so collect all the items that match this type
    // until the floating (held) stack has reached is its max size
    if (type === 'doubleclick' && floating) {
      console.assert(!item)
      // Trigger normal click event first (first click picks up, second places)
      // this.onClick(containing, windowIndex, inventoryIndex, item)
      let canPickup = this.getMaxStackSize(item) - floating.count
      if (!canPickup) {
        console.log('cant pickup items')
        return
      }
      for (let i = 0; i < this.inv.slots.length && canPickup; i++) {
        const slot = this.inv.slots[i]
        if (!slot) continue
        if (floating.type == slot.type && slot.count) {
          canPickup -= slot.count
          floating.count += slot.count
          slot.count = 0

          if (canPickup <= 0) {
            floating.count -= slot.count
            floating.count += +canPickup
            slot.count += +canPickup
            canPickup = 0
          }

          if (slot.count <= 0) delete this.inv.slots[i]

          // if (canPickup - slot.count >= 0) {
            
          // }

          // canPickup -= slot.count
          // slot.count -= canPickup
          // if (slot.count < 0) {
          //   canPickup = +slot.count
          //   slot.count = 0
          // } else {
          //   break
          // }
        }
        this.renderItems()
      }
    } else if (type == 'click' || type == 'rightclick') {
      this[type == 'click' ? 'onLeftClick' : 'onRightClick'](inventoryIndex, item)
      this.mouseDown = type
      this.mouseDownFloat = floating?.clone() // Backup of held item we start with
      this.mouseDownSlots = new Set([inventoryIndex])
    } else if (type == 'release') {
      this.mouseDown = false
      this.mouseDownSlots = null
      this.mouseDownFloat = null
    } else if (type == 'hover' && containing == 'inventoryItems' || containing == 'hotbarItems') {
      if (this.win.floatingItem && this.mouseDownFloat) {
        if (this.mouseDown == 'click') { // Left clicking
          // multi spread operation
          if (this.mouseDownSlots.has(inventoryIndex)) return
          const dividend = Math.floor(floating.count / this.mouseDownSlots.size)
          let accounted = this.mouseDownFloat.count
          for (const [key, val] of this.mouseDownSlots) {
            val.count = dividend
            accounted -= dividend
          }
          floating.count = accounted
          this.mouseDownSlots.add(inventoryIndex)
          this.renderItems()
        } else if (this.mouseDown == 'rightclick') {
          // single spread operation
          if (this.mouseDownSlots.has(inventoryIndex)) return
          this.onRightClick(inventoryIndex, item)
          this.mouseDownSlots.add(inventoryIndex)
        }
      }
    }
  }
}

class Item {
  constructor(type, count) {
    this.type = type
    this.count = count
  }
  clone() {
    return new Item(this.type, this.count)
  }
}

const slots = [
  new Item(2, 22),
  new Item(3, 18),
  new Item(4, 16),
  new Item(5, 15)
]

setTimeout(() => {
  window.manager = new PWindowManager(window.creative, { slots })
}, 2200)

function createWindowView(pwindow) {
  let windows = {}
  windows['minecraft:inventory'] = { clas: PlayerInventory }
  // windows['minecraft:generic_9x1'] = { type: protocolId++, inventory: { start: 1 * 9, end: 1 * 9 + 35 }, slots: 1 * 9 + 36, craft: -1, requireConfirmation: true }
  // windows['minecraft:generic_9x2'] = { type: protocolId++, inventory: { start: 2 * 9, end: 2 * 9 + 35 }, slots: 2 * 9 + 36, craft: -1, requireConfirmation: true }
  // windows['minecraft:generic_9x3'] = { type: protocolId++, inventory: { start: 3 * 9, end: 3 * 9 + 35 }, slots: 3 * 9 + 36, craft: -1, requireConfirmation: true }
  // windows['minecraft:generic_9x4'] = { type: protocolId++, inventory: { start: 4 * 9, end: 4 * 9 + 35 }, slots: 4 * 9 + 36, craft: -1, requireConfirmation: true }
  // windows['minecraft:generic_9x5'] = { type: protoc/olId++, inventory: { start: 5 * 9, end: 5 * 9 + 35 }, slots: 5 * 9 + 36, craft: -1, requireConfirmation: true }
  // windows['minecraft:generic_9x6'] = { type: protocolId++, inventory: { start: 6 * 9, end: 6 * 9 + 35 }, slots: 6 * 9 + 36, craft: -1, requireConfirmation: true }
  // windows['minecraft:generic_3x3'] = { type: protocolId++, inventory: { start: 7 * 9, end: 7 * 9 + 35 }, slots: 7 * 9 + 36, craft: -1, requireConfirmation: true }

  // windows['minecraft:anvil'] = { clas: AnvilInventory }
  // windows['minecraft:beacon'] = { clas: BeaconInventory }
  // windows['minecraft:blast_furnace'] = { clas: FurnaceInventory }
  // windows['minecraft:brewing_stand'] = { clas: BrewingStandInventory }
  // windows['minecraft:crafting'] = { clas: CraftingTableInventory }
  // windows['minecraft:enchantment'] = { clas: EnchantingTableInventory }
  // windows['minecraft:furnace'] = { clas: FurnaceInventory }
  // // windows['minecraft:grindstone'] = { type: protocolId++, inventory: { start: 3, end: 38 }, slots: 39, craft: 2, requireConfirmation: true }
  // windows['minecraft:hopper'] = { clas: HopperInv }
  // windows['minecraft:lectern'] = { clas: LecternInv }
  // windows['minecraft:loom'] = { clas: LoomInv }
  // windows['minecraft:merchant'] = { clas: VillagerInv }
  // windows['minecraft:shulker_box'] = { clas: ShulkerBoxInv }

  // windows['minecraft:smoker'] = { clas: SmokerInv }
  // windows['minecraft:cartography'] = { clas: CartographyInv }
  // windows['minecraft:stonecutter'] = { clas: StonecutterInv }
}