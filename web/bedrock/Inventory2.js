// import assert from 'assert'
function fail () { debugger; return false }

console.assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

export class Item {
  static nextId = 200
  constructor (obj) {
    // this.assignId()
    Object.assign(this, obj)
    this._count = obj.count || obj._count; if (!this._count && obj.network_id) debugger
    this.random = (Math.random() * 100) | 0
  }

  assignId () {
    this.stack_id = Item.nextId++
  }

  set count (val) {
    //     console.trace('set count', this.random, val)
    this._count = val
  }

  get count () {
    return this._count || 0
  }

  clone () {
    return new Item(JSON.parse(JSON.stringify(this)))
  }

  freeSlots () {
    return 64 - this.count
  }
}

export class Container {
  // Call `Container.from`, do *not* do `new Container`
  constructor (windowId, windowType, slots) {
    this.id = windowId
    this.type = windowType
    this.slots = slots
    this.metadata = this[windowType]
  }

  static from (windowId, windowType, slots) {
    return new ({ furnace: Furnace, brewing_stand: BrewingStand }[windowType] ?? Container)(windowId, windowType, slots)
  }

  setMetadata (id, val) {
    const m = this.map[id]
    this[m] = val
  }
}

export class Furnace extends Container {
  tickCount = 0
  litTime = 0
  litDuration = 0
  storedXP = 0
  auxiliaryFuel = 0

  map = {
    0: 'tickCount',
    1: 'litTime',
    2: 'litDuration',
    3: 'storedXP',
    4: 'auxiliaryFuel'
  }
}

export class BrewingStand extends Container {
  brewTime = 0
  fuelAmount = 1
  fuelTotal = 2

  map = {
    0: 'brewTime',
    1: 'fuelAmount',
    2: 'fuelTotal'
  }
}

// Maps ContainerSlotType to a ContainerID+WindowType
const slotMap = {
  // windowType: { slotType: 'ContainerSlotType', range: map of ContainerID+WindowType slot to ContainerSlotType idx }

  cursor: [{ slotType: 'cursor', range: [0, 1] }],
  armor: [{ slotType: 'armor', range: [0, 4] }],
  hand: [{ slotType: 'offhand', range: [0, 1] }],

  container: [{ slotType: 'container', range: [0, 27] }],
  inventory: [{ slotType: 'hotbar_and_inventory', range: [0, 36] }, { slotType: 'inventory', range: [9, 36] }, { slotType: 'hotbar', range: [0, 8] }],
  workbench: [{ slotType: 'crafting_input', range: [0, 3] }],

  furnace: [{ slotType: 'furnace_fuel', range: [1] }, { slotType: 'furnace_ingredient', slot: [0] }],
  enchantment: [{ slotType: 'enchanting_lapis', range: [15] }, { slotType: 'enchanting_input', range: [14] }],
  brewing_stand: [{ slotType: 'brewing_input', range: [1, 3] }, { slotType: 'brewing_fuel', range: [4] }],
  anvil: [{ slotType: 'anvil_input', range: [1] }, { slotType: 'anvil_material', range: [2] }],

  dispenser: [{ slotType: 'container', range: [0, 8] }],
  dropper: [{ slotType: 'container', range: [0, 8] }],
  hopper: [{ slotType: 'container', range: [0, 4] }],

  minecart_hopper: [{ slotType: 'container', range: [0, 4] }]
}

// open = {1:{type:'inventory'}}
export function slotType2windowId (openContainers, slotType) {
//   console.trace(openContainers)
  // process.exit(1)
  for (const openContainer of Object.values(openContainers)) {
    console.log('c', openContainer)
    if (!openContainer.type || !slotMap[openContainer.type]) continue
    const maps = slotMap[openContainer.type]
    console.log('m', openContainer.type, maps)
    for (const map of maps) {
      console.log(map, slotType)
      if (map.slotType == slotType) return openContainer.id
    }
  }
  console.warn(openContainers, slotType)
  throw Error('unknown slot type: ' + slotType)
  return slotType
}

/**
 * Trans holds a pending inventory state to be sent to the server. When a Transaction Group
 * is created, a new Trans object gets created. Inventory actions in the transaction are applied
 * to this object, before being permanently applied to the actual inventory once they're server
 * confirmed. If the server rejects, the Trans state held here is discarded and not applied.
 */
export class Trans {
  constructor (containers, id, actions) {
    this.containers = containers
    this.updated = {}
    this.updates = {}
    this.id = id
    this.actions = actions
  }

  /**
   * Gets the slot in container, either from the updated slot list or from the base inv
   */
  get (slotType, slotIndex) {
    return this.getContainerFromSlotType(slotType).slots[slotIndex]
    // console.log('get', this.updated[container], this.containers[container], container, slotIndex)
    // return this.updated[container]?.slots?.[slotIndex] ?? this.containers[container]?.slots?.[slotIndex]
  }

  /**
   * Returns the raw data for the WindowID
   */
  getWindow (windowId) {
    const slots = []
    this.containers[windowId]?.slots.forEach((v, k) => slots[k] = v)
    this.updated[windowId]?.slots.forEach((v, k) => { if (v) slots[k] = v })
    return { slots }
  }

  /**
   * Merge the two containers (updated+base) and get an object like in Inventory. Returns container from slotType.
   */
  getContainerFromSlotType (slotType) {
    const winId = slotType2windowId({ ...this.containers, ...this.updated }, slotType)
    return this.getWindow(winId)
  }

  /**
   * Updates a slot in the Trans state.
   */
  update (slotType, slotIndex, { newItem }) {
    console.log('SetSlot', slotType, slotIndex, newItem)
    const winId = slotType2windowId({ ...this.containers, ...this.updated }, slotType)
    const container = this.containers[winId]
    this.updated[winId] ??= new Container(winId, container.type, [])
    if (newItem) newItem.modSlot = slotType // temporary as we have no way to reverse slotType2WindowId
    this.updated[winId].slots[slotIndex] = newItem?.count ? newItem : null
    this.updates[winId + slotIndex] = slotType
    console.log('SetTED', slotType, slotIndex, this.updated[winId].slots)
  }

  /**
   * Update metadata for a specific container, for example fuel burn time for a furnace
   */
  updateMetadata (windowId, keyId, val) {
    const container = this.containers[windowId]
    container.setMetadata(keyId, val)
  }

  /**
   * Apply the Trans state to the base inventory. Returns server responses.
   */
  apply () {
    console.log('applying', this.updated)
    const accepted = {}
    for (const key in this.updated) {
      const updatedContainer = this.updated[key].slots
      for (let i = 0; i < updatedContainer.length; i++) {
        const v = updatedContainer[i]
        if (v !== undefined) {
          console.log('set', key, i, v, this.containers)
          this.containers[key].slots[i] = v

          const slotType = this.updates[key + i]

          accepted[slotType] ??= []
          accepted[slotType][i] ??= []
          accepted[slotType][i].push({
            slot: i, ...v
          })
          delete this.updates[key + i]
        }
      }
    }

    const containers = []
    for (const key in accepted) {
      const r = { slot_type: key, slots: [] }
      const slots = accepted[key]
      console.warn('ACCEPTED', JSON.stringify(accepted))
      for (const slot in slots) {
        const vs = slots[slot]
        for (const v of vs) {
          r.slots.push({
            slot: v.slot,
            hotbar_slot: v.slot,
            count: v.count,
            item_stack_id: v.stack_id,
            custom_name: '',
            durability_correction: 0
          })
        }
      }
      containers.push(r)
    }
    return containers
  }
}

export class InvManager {
  containers = {}

  constructor () {

  }

  addContainer (container) {
    this.containers[container]
  }

  getContainerFromSlotType (slotType) {
    const winId = slotType2windowId(this.containers, slotType)
    return this.containers[winId]
  }

  getContainer (windowId) {
    return this.containers[windowId]
  }

  open (windowId, windowType, pos, entityId) {
    this.containers[windowId] ??= new Container(windowId, windowType, [])
    this.containers[windowId].type = windowType
    this.containers[windowId].entityId = entityId
    this.containers[windowId].pos = pos
  }

  update (windowId, content) {
    const items = content.map(k => k instanceof Item ? k : new Item(k))
    this.containers[windowId].slots = items
  }

  dump () {
    console.log('inv', new Date().toLocaleTimeString())
    console.log(this.containers)
  }

  handlers = {
    take: this.acceptTakeOrPlace.bind(this),
    place: this.acceptTakeOrPlace.bind(this),
    swap: this.acceptSwap.bind(this),
    drop: this.acceptDropOrDestoryOrConsume.bind(this),
    destroy: this.acceptDropOrDestoryOrConsume.bind(this),
    consume: this.acceptDropOrDestoryOrConsume.bind(this),
    craft_recipe: this.acceptCraftRecipe.bind(this),
    craft_creative: this.acceptCraftCreative.bind(this)
  }

  tryApply (trans, transaction) {
    // console.trace('apply', transaction)

    // The first transaction to complete.
    const firstAction = transaction.actions[0]
    if (!firstAction) return // nothing to do

    // console.log('FA', firstAction)
    if (firstAction.type_id === 'craft_recipe') {
      return this.acceptCraftRecipe(transaction.actions, trans)
    } else if (firstAction.type_id === 'craft_creative') {
      return this.acceptCraftCreative(transaction.actions, trans)
    } else {
      for (const action of transaction.actions) {
        console.log('handling action', action)
        if (!this.handlers[action.type_id]) {
          console.warn('unknown action', action.type_id)
          return false
        }
        const ret = this.handlers[action.type_id](action, trans)
        if (!ret) {
          console.log('failed action!')
          throw Error('failed')
          return false
        }
      }
    }

    return trans
  }

  acceptTakeOrPlace (action, trans) {
    // console.log(JSON.stringify(trans))
    const source = trans.get(action.source.slot_type, action.source.slot)
    const dest = trans.get(action.destination.slot_type, action.destination.slot)
    if (!source && dest) return fail() // no item in source slot
    if (dest && dest.network_id && source.network_id !== dest.network_id) return fail() // dest item exists but it's a different type
    console.assert(action.count, 'take empty count')
    //     console.log(action)
    if (!source) {
      console.log('item does not exist at source', this.containers, action.source.slot_type, trans.getContainerFromSlotType(action.source.slot_type))
    }
    //     console.log(source)
    const sourceClone = source.clone()

    sourceClone.count -= action.count
    if (sourceClone.count < 0) return fail() // source is now negative??

    // Here we compute and verify the new counts for the items.
    if (!dest || !dest.network_id) { // nothing in the new slot.
      trans.update(action.source.slot_type, action.source.slot, { newItem: sourceClone })
      const destClone = source.clone()
      destClone.assignId()
      destClone.count = action.count
      // console.log(action.count, destClone.freeSlots())
      if (destClone.freeSlots() < 0) return fail() // not enough slots
      trans.update(action.destination.slot_type, action.destination.slot, { newItem: destClone })
      return true
    }

    const destClone = dest.clone()
    destClone.count += action.count
    if (destClone.freeSlots() < 0) return fail() // not enough slots

    // OK
    trans.update(action.source.slot_type, action.source.slot, { newItem: sourceClone })
    trans.update(action.destination.slot_type, action.destination.slot, { newItem: destClone })
    return true
  }

  acceptSwap (action, trans) {
    const source = trans.get(action.source.slot_type, action.source.slot)
    const dest = trans.get(action.destination.slot_type, action.destination.slot)
    console.assert(source || dest)

    trans.update(action.source.slot_type, action.source.slot, { newItem: dest ? dest.clone() : null })
    trans.update(action.destination.slot_type, action.destination.slot, { newItem: source ? source.clone() : null })
    return true
  }

  acceptDropOrDestoryOrConsume (action, trans) {
    const source = trans.get(action.source.slot_type, action.source.slot)
    if (!source) return false // nothing to drop

    const clone = source.clone()
    clone.count -= action.count
    if (clone.count < 0) return false

    // console.log('Dropping', clone.count, action.count)
    // OK
    trans.update(action.source.slot_type, action.source.slot, { newItem: clone })
    return true
  }

  acceptCraftRecipe (actions, trans) {
    let recipe, output
    const inputs = []
    for (const action of actions) {
      if (action.type_id.startsWith('craft_recipe')) {
        recipe = action
      } else if (action.type_id === 'consume') {
        const input = trans.get(action.source.slot_type, action.source.slot)
        if (!input) return false // bad packet
        inputs.push({ source: action.source, item: input.clone(), consumed: action.count })
      } else if (action.type_id === 'take' || action.type_id === 'place') {
        output = action
      }
    }

    const verified = this.client.tryCraftRecipe({
      recipe: recipe.recipe_network_id,
      inputs,
      outputQuantity: output.count
    })

    if (verified) {
      for (const { source, item } of inputs) {
        trans.update(source.slot_type, source.slot, { newItem: item })
      }
      trans.update(outputSlot.destination.slot_type, outputSlot.destination.slot, { newItem: verified })
    }
  }

  // The client wants to add something from creative inventory
  acceptCraftCreative (actions, trans) {
    // console.trace(actions)
    let recipe, output
    for (const action of actions) {
      if (action.type_id.startsWith('craft_creative')) {
        recipe = action
      } else if (action.type_id === 'take' || action.type_id === 'place') {
        output = action
      }
    }

    // console.log('cli', this.client)
    const verified = this.client.tryCreateItem(recipe.item_id, output.count)

    if (verified) { // Ask server impl if creative
      trans.update(output.destination.slot_type, output.destination.slot, { newItem: verified })
    }
    // console.log('accepted', verified, actions, trans, output.destination, JSON.stringify(trans))
    // process.exit(1)
    return !!verified // Implementaton said no. Cancel this transaction.
  }
}

export class ServerInventory extends InvManager {
  startResponseGroup () {
    this.responseGroup = []
  }

  finishResponseGroup () {
    console.log('SERVER', JSON.stringify(this.containers))
    this.send(this.responseGroup)
    this.responseGroup = []
  }

  addResponseToGroup (response) {
    // console.log('RESPONSE', response)
    this.responseGroup.push(response)
  }

  accept (requestId, containers) {
    this.addResponseToGroup({
      status: 'ok',
      request_id: requestId,
      containers
    })
  }

  reject (request) {
    this.addResponseToGroup({
      status: 'error',
      request_id: request.request_id
    })
  }

  handle (requests) {
    this.startResponseGroup()
    console.log('containers before handling', this.containers)
    const tx = new Trans(this.containers)
    let rejecting
    for (const request of requests) {
      // console.log('REQ', request)
      if (rejecting) {
        this.reject(request)
      }
      if (this.tryApply(tx, request, true)) {
        const response = tx.apply()
        this.accept(request.request_id, response)
      } else {
        rejecting = true
        this.reject(request)
      }
    }
    // console.log('applied', this.containers)
    // process.exit(1)

    this.finishResponseGroup()
  }
}

function inventoryTest () {
  const inv = new InvManager()
  inv.addContainer(new Container('hotbar_and_inventory', 64))
  inv.getContainer()
}
