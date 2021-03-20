import { SimpleEmitter } from './util/emitter.mjs'

const TESTING = globalThis.TESTING

export class BB {
  constructor(minX, minY, dx, dy, xoff = 0, yoff = 0) {
    this.minX = minX + xoff
    this.minY = minY + yoff
    this.maxX = this.minX + dx
    this.maxY = this.minY + dy
    this.contains = (x, y) => x > this.minX && y > this.minY && x < this.maxX && y < this.maxY
    this.bbRel = [this.minX, this.minY, dx, dy]
    this.bbAbs = [this.minX, this.minY, this.maxX, this.maxY]
  }
}

export function getDistance(x1, y1, x2, y2) {
  var a = x1 - x2
  var b = y1 - y2
  var c = Math.sqrt(a * a + b * b)
  return c
}

export class CanvasWindow extends SimpleEmitter {
  scale = 1

  drawItem(obj, x, y) {
    const items = ['item/brick',
      'block/brain_coral',
      'item/redstone',
      'block/powered_rail_on',
      'block/bookshelf',
      'item/apple',
      'item/compass_00']
    if (TESTING) {
      var path = items[Math.floor(Math.random() * items.length)];
      var count = Math.floor(Math.random() * 100)
    } else {
      var path = items[obj.type]
      var count = obj.count
    }
    this.drawImage({ path }, x, y)
    this.drawText({ value: count, stroke: true, fontStyle: 'bold 8px sans-serif', style: 'white' }, x + 10, y + 16)
  }

  drawImage(obj, dx, dy, slice, scale) {
    dx ||= 0; dy ||= 0;
    dx *= this.scale
    dy *= this.scale
    const img = this.getImage(obj)
    scale = scale || 1
    if (slice) {
      const w = slice[2]; const h = slice[3]
      this.drawCtx.drawImage(img, slice[0], slice[1], slice[2], slice[3], dx, dy, w * scale, h * scale)
    } else {
      this.drawCtx.drawImage(img, dx, dy)
    }
  }

  drawText(obj, x, y) {
    x ||= 0; y ||= 0;
    x *= this.scale
    y *= this.scale

    const oldFont = this.drawCtx.font
    const oldFillStyle = this.drawCtx.fillStyle

    this.drawCtx.font = obj.fontStyle ?? 'normal normal 11px sans-serif'
    this.drawCtx.fillStyle = obj.style || 'black'

    this.drawCtx.fillText(obj.value, x, y)
    if (obj.stroke) {
      this.drawCtx.lineWidth = 0.4
      this.drawCtx.strokeText(obj.value, x, y)
      this.drawCtx.lineWidth = 1
    }

    // restore
    this.drawCtx.font = oldFont
    this.drawCtx.fillStyle = oldFillStyle
  }

  drawBox(aroundBB) {
    this.drawCtx.fillStyle = "#000000";
    // console.log('box',aroundBB)
    this.drawCtx.strokeRect(...aroundBB)
  }

  drawInput(obj, [x, y, mx], text) {
    this.drawCtx.fillStyle = "#FFFFFF"
    const measured = this.drawCtx.measureText(text)
    const lPadding = obj.horizontalPadding ?? 2
    const rPadding = obj.horizontalPadding ?? 4
    const fontHeight = measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent
    this.drawCtx.fillText(text, x + lPadding, fontHeight + y, mx - rPadding)
  }
}