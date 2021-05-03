// import assert from 'assert'

function fail() { debugger; return false }

class Container {
  constructor(name, size) {
    this.name = name
    this.size = size
  }
}

/**
 * Trans holds a pending inventory state to be sent to the server. When a Transaction Group
 * is created, a new Trans object gets created. Inventory actions in the transaction are applied
 * to this object, before being permanently applied to the actual inventory once they're server
 * confirmed. If the server rejects, the Trans state held here is discarded and not applied.
 */
export class Trans {
  constructor(containers, id, actions) {
    this.containers = containers
    this.updated = {}
    this.id = id
    this.actions = actions
  }

  /**
   * Gets the slot in container, either from the updated slot list or from the base inv
   */
  get(container, slotIndex) {
    return this.updated[container]?.[slotIndex] ?? this.containers[container]?.slots?.[slotIndex]
  }

  /**
   * Merge the two containers (updated+base) and get an object like in Inventory.
   */
  getContainer(container) {
    const slots = []
    this.containers[container]?.slots.forEach((v, k) => slots[k] = v)
    this.updated[container]?.forEach((v, k) => { if (v) slots[k] = v })
    return { slots }
    // return this.updated[container] ?? this.containers[container]?.slots
  }

  /**
   * Updates a slot in the Trans state.
   */
  update(container, slotIndex, { newItem }) {
    (this.updated[container] ??= [])[slotIndex] = newItem?.count ? newItem : null
  }

  /**
   * Apply the Trans state to the base inventory. Returns server responses.
   */
  apply() {
    const accepted = {}
    for (const key in this.updated) {
      const updatedContainer = this.updated[key]
      for (let i = 0; i < updatedContainer.length; i++) {
        let v = updatedContainer[i]
        if (v !== undefined) {
          console.log('set', key, i, v, this.containers)
          this.containers[key].slots[i] = v

          accepted[key] ??= []
          accepted[key][i] ??= []
          accepted[key][i].push({
            slot: i, ...v
          })
        }
      }
    }

    const containers = []
    for (const key in accepted) {
      const r = { slot_type: key, slots: [] }
      const slots = accepted[key]
      for (const slot in slots) {
        const v = slots[slot]
        r.slots.push({
          slot: v.slot,
          hotbar_slot: v.slot,
          count: v.count,
          item_stack_id: v.stackId,
          custom_name: '',
          durability_correction: 0
        })
      }
      containers.push(r)
    }
    return containers
  }
}

export class InvManager {
  containers = {}

  constructor() {

  }

  addContainer(container) {
    this.containers[container]
  }

  getContainer(id) {
    return this.containers[id]
  }

  open(containerId, packet) {
    this.containers[containerId] ??= { slots: [] }
    this.containers[containerId].type = packet.type
    this.containers[containerId].entityId = packet.entity_id
    this.containers[containerId].pos = packet.coordinates
  }

  update(containerId, content) {
    this.containers[containerId] ??= { slots: [] }
    this.containers[containerId].slots = content
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

  tryApply(trans, transaction) {
    // console.trace('apply', transaction)

    // The first transaction to complete.
    const firstAction = transaction.actions[0]
    if (!firstAction) return // nothing to do    

    // console.log('FA', firstAction)
    if (firstAction.type_id === 'craft_recipe') {
      this.acceptCraftRecipe(transaction.actions, trans)
    } else if (firstAction.type_id === 'craft_creative') {
      this.acceptCraftCreative(transaction.actions, trans)
    } else for (const action of transaction.actions) {
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
    
    return trans
  }

  acceptTakeOrPlace(action, trans) {
    // console.log(JSON.stringify(trans))
    const source = trans.get(action.source.slot_type, action.source.slot)
    const dest = trans.get(action.destination.slot_type, action.destination.slot)
    if (!source && dest) return fail() // no item in source slot
    if (dest && source.type !== dest.type) return fail() // dest item exists but it's a different type
    console.assert(action.count, 'take empty count')
    const sourceClone = source.clone()
    sourceClone.count -= action.count
    if (sourceClone.count < 0) return fail() // source is now negative??

    // Here we compute and verify the new counts for the items.
    if (!dest) { // nothing in the new slot.
      trans.update(action.source.slot_type, action.source.slot, { newItem: sourceClone })
      const destClone = source.clone()
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

  acceptSwap(action, trans) {
    const source = trans.get(action.source.slot_type, action.source.slot)
    const dest = trans.get(action.destination.slot_type, action.destination.slot)
    console.assert(source || dest)
    
    trans.update(action.source.slot_type, action.source.slot, { newItem: dest ? dest.clone() : null })
    trans.update(action.destination.slot_type, action.destination.slot, { newItem: source? source.clone() : null })
    return true
  }

  acceptDropOrDestoryOrConsume(action, trans) {
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

  acceptCraftRecipe(actions, trans) {
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
      inputs, outputQuantity: output.count
    })

    if (verified) {
      for (const { source, item } of inputs) {
        trans.update(source.slot_type, source.slot, { newItem: item })
      }
      trans.update(outputSlot.destination.slot_type, outputSlot.destination.slot, { newItem: verified })
    }
  }

  // The client wants to add something from creative inventory
  acceptCraftCreative(actions, trans) {
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
    return false // Implementaton said no. Cancel this transaction.
  }
}



export class ServerInventory extends InvManager {
  startResponseGroup() {
    this.responseGroup = []
  }

  finishResponseGroup() {
    console.log('SERVER', JSON.stringify(this.containers))
    this.send(this.responseGroup)
    this.responseGroup = []
  }
  
  addResponseToGroup(response) {
    // console.log('RESPONSE', response)
    this.responseGroup.push(response)
  }

  accept(requestId, containers) {
    this.addResponseToGroup({
      status: 'ok',
      request_id: requestId,
      containers
    })
  }

  reject(request) {
    this.addResponseToGroup({
      status: 'error',
      request_id: request.request_id
    })
  }

  handle(requests) {
    this.startResponseGroup()
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
    this.finishResponseGroup()
  }
}

function inventoryTest() {
  const inv = new InvManager()
  inv.addContainer(new Container('hotbar_and_inventory', 64))
  inv.getContainer()
}