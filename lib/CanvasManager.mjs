export class CanvasEventManager {
  lastCursorPosition = { x: 0, y: 0 }
  needsInputUpdate = false

  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.children = []
    this.ctx.imageSmoothingEnabled = false;//derp
    canvas.onmousemove = this.onCursorMove
    canvas.onmousedown = this.onCursorClick
    canvas.onmouseup = this.onCursorRelease
    canvas.tabIndex = 1 // Allow us to capture key presses
    canvas.style.outline = "none" // remove the outline
    canvas.addEventListener('keydown', this.onKeyDown, { passive: true })
    canvas.addEventListener('keyup', this.onKeyUp, { passive: true })

    canvas.oncontextmenu = e => e.preventDefault()
  }

  setScale(scale) {
    this.ctx.scale(scale, scale)
  }

  // Translates cursor page position to canvas relative position
  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect()
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    }
  }

  // Translates canvas DOM position to context scaled position
  getCanvasCoords(ctx, screenX, screenY) {
    let matrix = ctx.getTransform();
    var imatrix = matrix.invertSelf();
    let x = screenX * imatrix.a + screenY * imatrix.c + imatrix.e;
    let y = screenX * imatrix.b + screenY * imatrix.d + imatrix.f;
    return { x, y }
  }

  onCursorMove = (evt) => {
    const pos = this.getMousePos(this.canvas, evt)
    this.lastCursorPosition = this.getCanvasCoords(this.ctx, pos.x, pos.y)
    this.needsInputUpdate = true
  }

  onCursorClick = (evt) => {
    const pos = this.getMousePos(canvas, evt);
    const { x, y } = this.getCanvasCoords(this.ctx, pos.x, pos.y)
    const secondary = evt.button == 2 // Right click
    this.children.forEach(e => e.onCanvasMouseDown(x, y, secondary))
  }

  onCursorRelease = (evt) => {
    const pos = this.getMousePos(canvas, evt);
    const { x, y } = this.getCanvasCoords(this.ctx, pos.x, pos.y)
    this.children.forEach(e => e.onCanvasMouseUp(x, y))
  }

  onKeyDown = (evt) => this.children.forEach(e => e.onCanvasKeyDown(evt.key, evt.code))
  onKeyUp = (evt) => this.children.forEach(e => e.onCanvasKeyUp(evt.key, evt.code))

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.index = 0
  }

  startRendering() {
    const loop = () => {
      for (const child of this.children) {
        child.render()
      }

      setTimeout(() => requestAnimationFrame(loop), 40)
    }
    requestAnimationFrame(loop)
  }
}