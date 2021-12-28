# minecraft-inventory-gui
[![NPM version](https://badge.fury.io/js/minecraft-inventory-gui.svg)](https://www.npmjs.com/package/minecraft-inventory-gui)
[![Build Status](https://github.com/PrismarineJS/minecraft-inventory-gui/workflows/CI/badge.svg)](https://github.com/PrismarineJS/minecraft-inventory-gui/actions?query=workflow%3A%22CI%22)

minecraft-inventory-gui provides a GUI library to interact with minecraft inventories. It does not by itself implement _any_ inventory logic such as clicks, shift clicking, etc. and this is left to the user. This allows the lib to be used in a wide variety of environments, and across different editions of the game.

At this moment in time, the usage for the library looks like this (ES6 import required, in the future we may export a WebComponent):

```sh
npm i minecraft-inventory-gui
```

```js
import { CanvasEventManager } from 'minecraft-inventory-gui'
import * as InventoryWindows from 'minecraft-inventory-gui'
```

The CanvasEventManager provides an interface to interact with a DOM canvas and handles events such as cursor drags, clicks, etc.

`InventoryWindows` exposes many different windows such as CreateInventory, SurvivalInventory, etc. that can draw onto a CanvasEventManager instance.

```js
const win = new InventoryWindows.PlayerWin(canvasManager, { getImage })
```

All of the InventoryWindows have a second `dataProvider` argument. This should have a `getImage` function that should return an  [`Image`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image) instance, and take a "path" parameter. This function is called whenever an icon (such as a minecraft item or background image) needs to be rendered. It's then cached inside the renderer for that path.

## Usage

An example implementation, hosted on Github Pages is found in `web/` directory. This example does not connect with any minecraft protocol APIs, it simply simulates an offline inventory. 

After an inventory is drawn to the screen, whenever the user interacts with the inventory, the the InventoryWindow emits `itemEvent`, `click`, and `tooltip` events. The notable one is `itemEvent` which is triggered every time an interaction with an item happens in the inventory.

### on('itemEvent', id, type, pos, data)

* `id` - the ID of the element which triggered the event
* `type` the specific action that occurred,  `click`, `doubleClick`, `rightClick`, `release`.
* `pos` the X and Y canvas position where the interaction occurred
* `data` [container, slot] - Contains the string container ID where the interaction occurred and its slot. For example, the PlayerWin has a inventory 9x3 grid, clicking the second item would return `["survivalItems", 1]`.

Based on these emitted events, you can implement inventory logic ontop. Each of the InventoryWindows contain variables which contain arrays of items. You can update these arrays to update the items inside a specific container.

See https://github.com/extremeheat/minecraft-inventory-gui/blob/master/lib/inventories.mjs for a list of properties.

These adjustments should be automatically re-rendered by your render loop.

See https://github.com/extremeheat/minecraft-inventory-gui/tree/master/web for an example implementation.

## WIP
* Export an easier interface without here without needing the user to implement inventory logic, like the `web/` example.
