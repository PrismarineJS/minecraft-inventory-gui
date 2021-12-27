import { SimpleEmitter } from './util/emitter.mjs'

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
    const icon = obj.icon ?? this.getImageIcon(obj)
    if (!icon) return
    obj.icon ??= icon
    this.drawImage(icon, x, y, icon.slice, icon.scale)
    this.drawText({ value: obj.count ?? '', stroke: true, fontStyle: 'bold 8px sans-serif', style: 'white' }, x + 10, y + 16)
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
    this.drawCtx.save()
    this.drawCtx.font = obj.fontStyle ?? 'normal normal 11px sans-serif'
    this.drawCtx.fillStyle = obj.style || 'black'
    const measured = this.drawCtx.measureText(obj.value)
    const aw = Math.abs(measured.actualBoundingBoxLeft) + Math.abs(measured.actualBoundingBoxRight)
    if (obj.align === 'center') {
      x = this.xoff + (obj.w / 2) - (measured.width / 2)
    }
    
    if (obj.bg) {
      this.drawCtx.fillStyle = '#010101B0'
      this.drawRoundRect(x-2, y-8, measured.width+4, 12, 2).fill()
    }

    this.drawCtx.fillText(obj.value, x, y)
    if (obj.stroke) {
      this.drawCtx.lineWidth = 0.4
      this.drawCtx.strokeStyle = obj.stroke
      this.drawCtx.strokeText(obj.value, x, y)
      this.drawCtx.lineWidth = 1
    }

    // restore
    this.drawCtx.restore()
  }

  drawBox(aroundBB) {
    this.drawCtx.fillStyle = "#000000";
    this.drawCtx.strokeRect(...aroundBB)
  }

  drawInput(obj, [x, y, mx], text) {
    this.drawCtx.fillStyle = "#FFFFFF"
    const measured = this.drawCtx.measureText(text)
    const lPadding = obj.leftPad ?? 2
    const rPadding = obj.rightPad ?? 4
    this.drawCtx.font = obj.fontStyle ?? 'normal normal 8px sans-serif'
    const fontHeight = measured.fontBoundingBoxAscent + measured.fontBoundingBoxDescent
    this.drawCtx.fillText(text, x + lPadding, fontHeight + y, mx - rPadding)
  }

  // https://stackoverflow.com/a/7838871
  drawRoundRect(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    this.drawCtx.beginPath()
    this.drawCtx.moveTo(x+r, y)
    this.drawCtx.arcTo(x+w, y,   x+w, y+h, r)
    this.drawCtx.arcTo(x+w, y+h, x,   y+h, r)
    this.drawCtx.arcTo(x,   y+h, x,   y,   r)
    this.drawCtx.arcTo(x,   y,   x+w, y,   r)
    this.drawCtx.closePath()
    return this.drawCtx
  }
}