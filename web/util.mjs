import { layouts } from '../lib/layouts.mjs'

globalThis.layouts = layouts

if (window.location.href.includes('127.0.0.1')) {
  var IMAGE_ROOT = 'textures/'
} else {
  var IMAGE_ROOT = 'https://raw.githubusercontent.com/PrismarineJS/minecraft-assets/master/data/1.16.4/'
}

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

for (const win in layouts) {
  const val = layouts[win]
  for (const key in val.with) {
    const path = val.with[key].path
    if (path && !images.includes(path)) {
      images.push(path);
    }
  }
}

function loadAllImagesWeb() {
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

loadAllImagesWeb()