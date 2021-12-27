import { Item, Trans, InvManager, ServerInventory } from './Inventory2.js'
// import assert from 'assert'

class Action {
  // constructor(type, )
}

export class TransactionError extends Error {

}

export class ClientInventory extends InvManager {
  #stackId = 0
  // List of transactions pending server confirmation
  sentTransactions = {}

  nextRequestId = 1

  sendRequestID = 0
  recvRequestID = 0

  ackCb

  get cursorItem() {
    return this.tx ? this.tx.get('cursor', 0) : this.getContainerFromSlotType('cursor')?.slots[0]
  }

  set cursorItem(val) {
    if (this.tx) this.tx.update('cursor', 0, { newItem: val })
    else this.getContainerFromSlotType('cursor').slots[0] = val
  }

  startTransactionGroup() {
    if (this.transactionGroup?.length) {
      this.finishTransactionGroup()
    }
    if (this.isWaitingForAck()) {
      throw Error('Cannot start new transaction; waiting for previous ack')
    }
    console.log('containers', this.containers)
    this.tx = new Trans(this.containers)
    this.transactionGroup = []
  }

  finishTransactionGroup(responseCb) {
    if (this.transactionGroup.length) {
      this.sendRequestID = this.transactionGroup[this.transactionGroup.length - 1].request_id
      this.ackCb = responseCb
      this.send(this.transactionGroup)
      this.transactionGroup = []
    }
    this.tx = null
    return true
  }

  eraseTransaction() {
    this.transactionGroup = []
    this.activeTransaction = []
  }

  addTransactionToGroup(transaction) {
    this.transactionGroup.push(transaction)
    console.log('SEND REQ', transaction, this.sendRequestID)
    return this.nextRequestId++
  }

  sendRequest() {
    const txId = this.nextRequestId++
    this.send([{
      "request_id": txId,
      "actions": this.activeTransaction,
      "custom_names": []
    }])
    this.activeTransaction = null
  }

  nextStackId() {
    return this.#stackId++
  }

  handleResponse(responses) {
    let ok = true
    const trans = new Trans(this.containers)
    for (const response of responses) {
      console.log('RESPONSE', response)
      const id = response.request_id
      this.recvRequestID = id
      if (response.status != 'ok') ok = false
      else if (response.status == 'ok') {
        const tx = this.sentTransactions[id]
        if (!tx) {
          throw new TransactionError('Client received an inventory transaction response for an unknown request ID')
        }
        console.log('TRANS', response, trans, tx)
        if (this.tryApply(trans, tx)) {
          trans.apply()
        } else ok = false
      }
    }
    this.ackCb?.(ok)
    // console.log('Ok', ok, this.ackCb)
    // console.log('------', JSON.stringify(this.containers))
  }

  handleAccept(id) {
    const tx = this.sentTransactions[id]
    tx.apply()
    tx.resolve(true)
    delete this.sentTransactions[id]
  }

  handleReject(id) {
    const tx = this.sentTransactions[id]
    tx.resolve(false)
    delete this.sentTransactions[id]
  }

  finishTransaction() {
    const transaction = { request_id: this.nextRequestId, actions: this.activeTransaction, custom_names: [] }
    const trans = this.tx// || new Trans(this.containers, this.nextRequestId)
    const tx = this.tryApply(trans, transaction)
    if (!tx) {
      this.eraseTransaction()
      return false
      //throw Error('Cannot perform the requested actions')
    }
    // console.log('OK!', JSON.stringify(trans))
    // process.exit(1)
    this.sentTransactions[this.nextRequestId] = transaction
    this.activeTransaction = []
    return this.addTransactionToGroup(transaction)
  }

  isWaitingForAck() {
    // console.log('ida',this.sendRequestID, this.recvRequestID)
    if (this.sendRequestID > this.recvRequestID) return true
    return false
  }

  addTransaction(transaction) {
    // console.trace('ADD TRANS',this.transactionGroup, this.isWaitingForAck())
    if (/*this.transactionGroup.length ||*/ this.isWaitingForAck()) {
      throw Error('Already have a queued request') // Need to send queued request + wait for ACK
    }
    this.activeTransaction ??= []
    this.activeTransaction.push(transaction)
  }

  creativeCreate(itemId, intoContainer, intoSlotIx, count) {
    this.addTransaction({ type_id: 'craft_creative', slot: 50, item_id: itemId })
    this.addTransaction({
      type_id: intoContainer == 'cursor' ? 'take' : 'place', count,
      source: { slot_type: "creative_output", slot: 50, stack_id: this.nextStackId() },
      destination: { slot_type: intoContainer, slot: intoSlotIx, stack_id: 0 },
    })
    return this.finishTransaction()
  }

  // CLIENT OUTBOUND

  // Below are request functions 

  // Picks an item up and puts it into the 'cursor' item which must be free/same type
  take(containerId, sourceIndex, count) {
    if (!this.tx) throw Error('Inactive transaction goup')
    // console.log('TX', containerId, sourceIndex, this.tx, this.tx.getContainer(containerId), this.tx.get(containerId, sourceIndex))
    const item = this.tx.get(containerId, sourceIndex)
    if (!item) {
      // console.log(item, this.tx.getContainerFromSlotType(containerId))
      // console.log('nothing', containerId, sourceIndex, count)
      return false // Have nothing at slot, can't take !
    } else if (this.cursorItem) {
      if (this.cursorItem.type !== item.type) return false
      if (this.cursorItem.freeSlots() < item.count) return false
    }

    this.addTransaction({
      type_id: "take", count,
      source: { slot_type: containerId, slot: sourceIndex, stack_id: item.stackId },
      destination: { slot_type: "cursor", slot: 0, stack_id: this.nextStackId() },
    })

    // console.log('Finishing')
    return this.finishTransaction()
  }

  // Double click operation - pick up everything
  takeAll(containerId, itemType) {
    if (!this.tx) throw Error('Inactive transaction goup')
    const win = this.tx.getContainerFromSlotType(containerId).slots
    if (!win.length) return false // don't know this inventory ID
    if (this.cursorItem && this.cursorItem.type != itemType) return false // items we want to pick up don't match what's in cursor

    this.startTransactionGroup()

    const cursor = this.cursorItem.clone()

    let ok

    // Pick up as much of the item until no more free space in cursor item
    for (let i = 0; i < win.length; i++) {
      if (ok === false) { debugger; break }
      const item = win[i]
      if (!item) continue
      if ((item.type !== itemType) || (cursor.type !== item.type)) continue
      if (cursor.freeSlots() < item.count) continue
      if (cursor.freeSlots() === 0) break

      cursor.count += item.count

      this.addTransaction({
        type_id: "take", count: item.count,
        destination: { slot_type: "cursor", slot: 0, stack_id: this.nextStackId() },
        source: { slot_type: containerId, slot: i, stack_id: item.stackId },
      })

      ok = this.finishTransaction()
    }

    return ok
  }

  // Places a picked up item
  place(fromContainerId, fromSlot, destContainerId, destSlot, count) {
    if (!this.tx) throw Error('Inactive transaction goup')
    const from = this.tx.get(fromContainerId, fromSlot)
    if (!from) return false // don't have any item in the from slot to place from
    const to = this.tx.get(destContainerId, destSlot)
    if (to && to.type !== from.type) return false // already have a slot in the destination slot
    const destStackId = to ? to.slot : this.nextStackId()
    this.addTransaction({
      type_id: 'place', count,
      source: { slot_type: fromContainerId, slot: fromSlot, stack_id: from.stackId },
      destination: { slot_type: destContainerId, slot: destSlot, stack_id: destStackId }
    })
    return this.finishTransaction()
  }

  // Switches items
  swap(fromContainerId, fromSlotIx, destContainerId, destSlotIx) {
    if (!this.tx) throw Error('Inactive transaction goup')
    const from = this.tx.get(fromContainerId, fromSlotIx)
    if (!from) return false // no item at place, you need to pickup() instead
    const dest = this.tx.get(destContainerId, destSlotIx)
    // if (!dest) return false // Can't sawp to a container we haven't opened
    this.addTransaction({
      type_id: 'swap',
      source: { slot_type: fromContainerId, slot: fromSlotIx, stack_id: from.stackId },
      destination: { slot_type: destContainerId, slot: destSlotIx, stack_id: dest?.stackId ?? this.nextStackId() }
    })
    return this.finishTransaction()
  }

  drop(containerId, slotIx, count, randomly) {
    if (!this.tx) throw Error('Inactive transaction goup')
    const from = this.tx.get(containerId, slotIx)
    if (!from) return false // no item in slot
    this.addTransaction({
      type_id: 'drop', count, randomly,
      source: { slot_type: containerId, slot: slotIx, stack_id: from.stackId },
    })
    return this.finishTransaction()
  }

  destroy(containerId, slotIx, count) {
    if (!this.tx) throw Error('Inactive transaction goup')
    const from = this.tx.get(containerId, slotIx)
    if (!from) return false // no item in slot
    this.addTransaction({
      type_id: 'destroy', count,
      source: { slot_type: containerId, slot: slotIx, stack_id: from.stackId }
    })
    return this.finishTransaction()
  }

  consume(containerId, slotIx, count) {
    if (!this.tx) throw Error('Inactive transaction goup')
    const from = this.tx.get(containerId, slotIx)
    this.addTransaction({
      type_id: 'consume', count,
      source: { slot_type: containerId, slot: slotIx, stack_id: from.stackId }
    })
    return this.finishTransaction()
  }

  craft(containerId, slots, recipeId, resultCount) {
    if (!this.tx) throw Error('Inactive transaction goup')
    // First we request to craft the recipe
    this.addTransaction({
      type_id: 'craft_recipe', recipe_network_id: recipeId
    })
    // Request to delete the items from the input slot
    for (const { slot, count } of slots) {
      const from = this.tx.get(containerId, slot)
      this.addTransaction({
        type_id: 'consume', count,
        source: { slot_type: containerId, slot: slot, stack_id: from.stackId }
      })
    }
    // Request to put the output into the cursor
    this.addTransaction({
      type_id: 'take', count: resultCount,
      source: { slot_type: 'creative_output', slot: 50, stack_id: this.nextStackId() },
      destination: { slot_type: 'cursor', slot: 0, stack_id: 0 },
    })
    return this.finishTransaction()
  }
}

function clientInventoryTest() {
  const clientInventory = new ClientInventory()
  const serverInventory = new ServerInventory()

  const assert = { ok: console.assert }

  const cl = {
    tryCraftRecipe: id => true,
    tryCreateItem: (id, count) => {
      console.log('user wants to craft', id)
      const stackId = 2
      return new Item({ type: id, stackId, count })
    }
  }

  clientInventory.client = cl
  serverInventory.client = cl

  clientInventory.send = (packet) => {
    console.log('Client outbound', JSON.stringify(packet, null, 2))
    console.log('Clientbound')
    serverInventory.handle(packet)
  }
  serverInventory.send = packet => {
    console.log('Client inbound', JSON.stringify(packet))
    clientInventory.handleResponse(packet)
  }

  const openAll = invs => invs.forEach(inv => {
    serverInventory.open(inv.windowID, inv.windowType)
    clientInventory.open(inv.windowID, inv.windowType)

    clientInventory.update(inv.windowID, [])
    serverInventory.update(inv.windowID, [])
  })

  openAll([
    // The windowID is a sequential number linked to a window instance, windowType is a list from an enum
    { windowID: 'cursor', windowType: 'cursor' },

    { windowID: 'inventory', windowType: 'inventory' },
    { windowID: 'armor', windowType: 'armor' },
    { windowID: 'ui', windowType: 'hud' },
    { windowID: 'offhand', windowType: 'hand' }
  ])

  // invnetory
  // armor
  // ui
  // offhand
  openAll(['cursor', 'inventory', 'ui', 'armor', 'offhand', 'creative_output'])

  function testTx() {
    clientInventory.startTransactionGroup()

    assert.ok(clientInventory.creativeCreate(64, 'hotbar_and_inventory', 0, 32)) // Create an item.
    // clientInventory.finishTransactionGroup()
    // clientInventory.startTransactionGroup()
    assert.ok(clientInventory.take('hotbar_and_inventory', 0, 16)) // Create an item.

    // clientInventory.finishTransactionGroup()

    // clientInventory.dump()
    // process.exit(1)

    assert.ok(clientInventory.place('cursor', 0, 'hotbar_and_inventory', 0, 8)) // Swap

    assert.ok(clientInventory.swap('hotbar_and_inventory', 0, 'hotbar_and_inventory', 20)) // Swap

    assert.ok(clientInventory.takeAll('hotbar_and_inventory', 64)) // Swap

    // assert.ok(clientInventory.drop('hotbar_and_inventory', 20, 4)) // Swap

    clientInventory.finishTransactionGroup()
    clientInventory.dump()
  }

  async function testReplay() {
    const rp = (await import('./replay.js')).replay
    console.log(rp)
    for (let i = 0; i < rp.length; i++) {
      const packet = rp[i]
      const next = rp[i + 1]
      if (packet.name === 'inventory_content') {
        const d = packet.params
        clientInventory.update(d.window_id, d.input)
        serverInventory.update(d.window_id, d.input)
        console.log('server inv updated', d.window_id, d.input)
      } else if (packet.name.includes('request')) {
        console.log('handling c>s', JSON.stringify(packet))
        serverInventory.send = packet => {
          console.log('Our server response', JSON.stringify(packet))
          console.log('Vanilla server response', JSON.stringify(next.params.responses))
        }

        serverInventory.handle(packet.params.requests)
        // process.exit(1)
      } else if (packet.name.includes('response')) {
        // clientInventory.send = pack => {
        //   console.log('Our Client response', pack)
        //   console.log('Vanilla client response', JSON.stringify())
        // }
        clientInventory.handleResponse(packet.params.responses)

        // for (const resp of packet.params.responses) {
        // }
        process.exit(1)
      }
    }
  }
  // x={"params":{"requests":[{"custom_names":[],"actions":[{"count":64,"source":{"slot":0,"stack_id":145,"slot_type":"hotbar"},"destination":{"slot":9,"stack_id":0,"slot_type":"inventory"},"type_id":"place"}],"request_id":1569}]},"name":"item_stack_request"}
  testReplay()
}

clientInventoryTest()