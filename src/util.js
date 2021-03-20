const { Canvas, loadImage } = require('canvas')

function loadAllImages() {
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