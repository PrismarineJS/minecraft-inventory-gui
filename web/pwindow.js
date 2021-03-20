// const mcData = require('minecraft-data')('1.16')

let PlayerInventory

// , DropDispenseInventory, AnvilInventory,
//   BeaconInventory, FurnaceInventory, BrewingStandInventory, CraftingTableInventory,
//   EnchantingTableInventory, GrindstoneInv, HopperInv, LecternInv, LoomInv, VillagerInv,
//   ShulkerBoxInv, SmokerInv, CartographyInv, StonecutterInv

class PWindowManager {
  mouseDown = false
  constructor(win, inv) {
    this.win = win
    this.inv = inv
    this.map = win.getWindowMap()
    this.renderItems()

    win.on('itemEvent', (id, type, pos, data) => {
      // console.log('itemEvent', id, type, pos, data)
      if (type == 'release') {
        this.onRelease()
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
    // console.log('set', inventoryIndex, item)
    this.renderItems()
    this.win.needsUpdate = true
  }

  // Called when we've updated the Prismarine-Windows inventory slots, re-render the GUI window
  renderItems() {
    for (const key in this.map) {
      const [begin, end] = this.map[key]
      this.win[key] = this.inv.slots.slice(begin, end != null ? end + 1 : undefined)
    }
    this.win.needsUpdate = true
  }

  // Helper for the max amount of items that can be filled in this slot, TODO: fill in with mcData
  getMaxStackSize(item) {
    return 64//mcData.items[item.type].stackSize
  }

  // Called after the user has held down the mouse and has now released it
  onRelease() {
    this.mouseDown = false
    this.mouseDownSlots = null
    this.mouseDownFloat = null
    if (this.win.floatingItem?.count == 0) delete this.win.floatingItem
  }

  onLeftClick(inventoryIndex, item) {
    const floating = this.win.floatingItem
    if (floating) {
      console.log('have a floating itm')
      if (item) {
        if (floating.type == item.type) {
          // add to existing slot
          const free = item.stackSize - item.count
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
        // slot is empty, set floating item to slot
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
        const free = slot.stackSize - slot.count
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
    } else if (slot) {
      this.win.floatingItem = slot.clone()
      const split = Math.ceil(slot.count / 2)
      slot.count -= split
      this.win.floatingItem.count = split
    }
    if (slot?.count == 0) delete this.inv.slots[inventoryIndex]
    if (floating?.count == 0) delete this.win.floatingItem
  }

  // Adds an item to a slot and returns how much was able to be added
  addToSlot(inventoryIndex, item, existingOnly = true) {
    const currentItem = this.inv.slots[inventoryIndex]
    if (currentItem) {
      if (currentItem.type !== item.type) return 0
      const free = currentItem.stackSize - item.count
      const amountToAdd = Math.min(item.count, free)
      if (amountToAdd <= 0) return 0
      currentItem.count += amountToAdd
      item.count -= amountToAdd
      return amountToAdd
    } else if (!existingOnly) {
      this.inv.slots[inventoryIndex] = item.clone()
      item.count = 0
      return this.inv.slots[inventoryIndex].count
    }
    return 0
  }

  /**
   * 
   * @param {string} slotType - The type of ItemGrid for example the hotbar or armor bar or inventory. The variable used in layout window classes.
   * @param {number} inventoryIndex - The index in the Prismarine-Window slots sent over the network
   * @param {*} item - The item at the position of the `inventoryIndex`
   */
  onShiftClick(slotType, inventoryIndex, item) {
    if (!item) return
    // Shift click move item, TODO: handle edge cases:
    // if (type is armor) move to armor slot;
    // if (type is shield) move to shield slot;
    // else ...

    const shift = (to) => {
      const map = this.map[to]
      // First, try to add to add the floating item to all the slots that match the floating item type
      for (let i = map[0]; i < map[1] && item.count; i++) {
        const added = this.addToSlot(i, item, true)
        // item.count -= added
        if (item.count <= 0) delete this.inv.slots[inventoryIndex]
      }
      // Then if we still have remaining items, add to any empty slot
      for (let i = map[0]; i < map[1] && item.count; i++) {
        const added = this.addToSlot(i, item, false)
        // item.count -= added
        if (item.count <= 0) delete this.inv.slots[inventoryIndex]
      }
    }

    if (slotType == 'hotbarItems') shift('inventoryItems')
    if (slotType == 'inventoryItems') shift('hotbarItems')
    this.renderItems()
  }

  // Called whenever an inventory event occurs
  onInventoryEvent(type, containing, windowIndex, inventoryIndex, item) {
    const floating = this.win.floatingItem
    // The user has double clicked, so collect all the items that match this type
    // until the floating (held) stack has reached is its max size
    if (type === 'doubleclick' && floating && !item) {
      // console.assert(!item)
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
        }
        this.renderItems()
      }
    } else if (type == 'click' && this.win._downKeys.has('ShiftLeft')) {
      this.onShiftClick(containing, inventoryIndex, item)
    } else if (type == 'click' || type == 'rightclick') {
      console.log('click with', this.win._downKeys)
      this[type == 'click' ? 'onLeftClick' : 'onRightClick'](inventoryIndex, item)
      this.mouseDown = type
      this.mouseDownFloat = this.win.floatingItem?.clone() // Backup of held item we start with
      this.mouseDownSlots = new Set([inventoryIndex])
    } else if (type == 'release') {
      // this.mouseDown = false
      // this.mouseDownSlots = null
      // this.mouseDownFloat = null
    } else if (type == 'hover' && containing == 'inventoryItems' || containing == 'hotbarItems') {
      if (this.win.floatingItem && this.mouseDownFloat) {
        if (this.mouseDown == 'click') { // Left clicking
          // multi spread operation
          if (this.mouseDownSlots.has(inventoryIndex) || item) return
          this.mouseDownSlots.add(inventoryIndex)
          const dividend = Math.floor(this.mouseDownFloat.count / this.mouseDownSlots.size)
          if (!dividend) return
          let accounted = this.mouseDownFloat.count
          for (const slotIndex of this.mouseDownSlots) {
            let val = this.inv.slots[slotIndex]
            if (!val) {
              this.inv.slots[slotIndex] = this.mouseDownFloat.clone()
              val = this.inv.slots[slotIndex]
            }
            val.count = dividend
            accounted = accounted - dividend
          }
          floating.count = accounted
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

    this.stackSize = 64
  }
  clone() {
    return new Item(this.type, this.count)
  }
}

class PWindow {
  slots = [
    new Item(2, 22),
    new Item(3, 18),
    new Item(4, 16),
    new Item(5, 15)
  ]

  firstEmptySlotRange(start, end) {
    for (let i = start; i < end; ++i) {
      if (!this.slots[i]) return i
    }
    return null
  }

  firstEmptyHotbarSlot() {
    return this.firstEmptySlotRange(this.hotbarStart, this.inventoryEnd)
  }

  firstEmptyContainerSlot() {
    return this.firstEmptySlotRange(0, this.inventoryStart)
  }
}

const pwindow = new PWindow()

setTimeout(() => {
  window.manager = new PWindowManager(window.inventory, pwindow)
}, 2200)

// function createWindowView(pwindow) {
//   let windows = {}
//   windows['minecraft:inventory'] = { clas: PlayerInventory }
// }