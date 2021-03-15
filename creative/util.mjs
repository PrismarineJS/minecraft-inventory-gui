const IMAGE_ROOT = 'textures/'
const loadedImageBlobs = {}

const images = [
  'item/brick',
  'block/brain_coral',
  'item/redstone',
  'block/powered_rail_on',
  'block/bookshelf',
  'item/compass_00',
  'item/lava_bucket',
  'item/apple',
  'item/iron_axe',
  'item/golden_sword',
  'item/glass_bottle',
  'item/chest_minecart',
]
for (const win in globalThis.layouts) {
  const val = globalThis.layouts[win]
  for (const key in val.using) {
    const path = val.using[key].path
    if (path && !images.includes(path)) {
      images.push(path);
    }
  }
}

function loadAllImagesWeb() {
  // const images = [
  //   'gui/container/creative_inventory/tabs',
  //   'gui/container/creative_inventory/tab_item_search'
  // ]
  for (const path of images) {
    var img = new Image();   // Create new img element
    img.src = IMAGE_ROOT + path + '.png'; // Set source path
    img.onload = function () {
      loadedImageBlobs[path] = this
    }
  }
}

function loadRuntimeImage(atPath) {
  var img = new Image();   // Create new img element
  img.src = IMAGE_ROOT + atPath + '.png'; // Set source path
  img.style.imageRendering = 'pixelated'
  // img.onload = function () {
  //   loadedImageBlobs[path] = this
  // }
  loadedImageBlobs[atPath] = img
}

function loadAllImagesNode() {
  const { loadImage } = require('canvas')
  // const images = [
  //   'gui/container/creative_inventory/tabs',
  //   'gui/container/creative_inventory/tab_inventory'
  // ]
  for (const path of images) {
    loadImage(`./${path}.png`).then((image) => {
      loadedImageBlobs[path] = image
    })
  }
}

export function getImage(options) {
  let path = options.path

  if (!path && options.with.startsWith('item.')) { // Temp to load image icons
    path = options.with.replace('.', '/')
    loadRuntimeImage(path)
  }

  if (!loadedImageBlobs[path]) {
    loadRuntimeImage(path)
  }

  return loadedImageBlobs[path]
}

if (typeof window !== 'undefined') {
  loadAllImagesWeb()
} else {
  loadAllImagesNode()
  // module.exports = { getImage }
}