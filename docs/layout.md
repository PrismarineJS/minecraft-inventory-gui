## API docs


### Layouts

This library uses an JSON object-based layout system. Layouts are stored in lib/layouts.mjs.

For example, a Minecraft furnace layout looks like such:

```js
{
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
```

The `with` key at the root of the layout contains variables for this layout. Images stored inside here can be pre-loaded and cached. 

The `type` key specifies the function or block of code that should be triggered to render this block.

The `using` key tells the renderer to copy the data from the root `with` key into the current object with an `Object.assign()` operation.

The `x` and `y` keys hold the relative position on the canvas to draw this block in.

Each `type` can expect its own keys. For example, for `image` type the renderer expects `path` and `slice` keys. `path` specifies where to load the image from, and `slice` represents the bounding box for the image. The paramaters are [ uvX, uvY, widthX, heightY ] where `uvX` and `uvY` are the positions in the image at `path` to start cropping from. These paramaters are passed to the Canvas.drawImage API.

The `children` key holds additional blocks to render after the current one. It is typically combined with the `container` type. The `container` type passes down its X and Y to all of its children.

The `draw` key specifies a custom function that should be run to render this block. It gets passed 3 paramaters: the current class context (ctx), refrence to the current block (self), and the canvas position for this block, accounting all its parents.