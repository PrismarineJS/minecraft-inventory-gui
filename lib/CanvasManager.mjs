export class CanvasEventManager {
  lastCursorPosition = { x: 0, y: 0 }
  needsInputUpdate = false
  rendering = false

  constructor (canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.children = []
    this.ctx.imageSmoothingEnabled = false
    canvas.onmousemove = this.onCursorMove
    canvas.onmousedown = this.onCursorClick
    canvas.onmouseup = this.onCursorRelease
    canvas.tabIndex = 1 // Allow us to capture key presses
    canvas.style.outline = 'none' // remove the outline
    canvas.addEventListener('keydown', this.onKeyDown)
    canvas.addEventListener('keyup', this.onKeyUp, { passive: true })
    canvas.addEventListener('wheel', this.onWheel)

    canvas.oncontextmenu = e => e.preventDefault()
  }

  setScale (scale) {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(scale, scale)
    this.ctx.imageSmoothingEnabled = false
  }

  // Translates cursor page position to canvas relative position
  getMousePos (canvas, evt) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    }
  }

  // Translates canvas DOM position to context scaled position
  getCanvasCoords (ctx, screenX, screenY) {
    const matrix = ctx.getTransform()
    const imatrix = matrix.invertSelf()
    const x = screenX * imatrix.a + screenY * imatrix.c + imatrix.e
    const y = screenX * imatrix.b + screenY * imatrix.d + imatrix.f
    return { x, y }
  }

  pos (evt) {
    const pos = this.getMousePos(this.canvas, evt)
    return this.getCanvasCoords(this.ctx, pos.x, pos.y)
  }

  onCursorMove = (evt) => {
    this.lastCursorPosition = this.pos(evt)
    this.needsInputUpdate = true
  }

  onCursorClick = (evt) => {
    const { x, y } = this.pos(evt)
    const secondary = evt.button === 2 // Right click
    this.children.forEach(e => e.onCanvasMouseDown(x, y, secondary))
  }

  onCursorRelease = (evt) => {
    const { x, y } = this.pos(evt)
    this.children.forEach(e => e.onCanvasMouseUp(x, y))
  }

  onWheel = evt => {
    const { x, y } = this.pos(evt)
    this.children.forEach(e => e.onCanvasScroll(x, y, evt.deltaY) ? evt.preventDefault() : null)
  }

  onKeyDown = (evt) => this.children.forEach(e => e.onCanvasKeyDown(evt.key, evt.code) ? evt.preventDefault() : null)
  onKeyUp = (evt) => this.children.forEach(e => e.onCanvasKeyUp(evt.key, evt.code) ? evt.preventDefault() : null)

  clear () {
    if (this.index === 0) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  messageTicks = 0

  displayBlockingMessage (message, forLength = 200) {
    this.message = message
    this.messageTicks = forLength
  }

  delay = 40

  async slideInUp (layout) { // for testing positioning, leaving because it looks cool :D
    this.delay = 2
    for (let i = 30; i >= 0; i -= 2) {
      layout.yoff = i
      await new Promise(resolve => setTimeout(resolve, 0))
      layout.needsUpdate = true
    }
    this.delay = 40
  }

  reset () {
    this.children = []
  }

  startRendering () {
    this.rendering = true
    const loop = () => {
      this.index = 0
      if (this.messageTicks > 0) {
        this.ctx.fillStyle = '#20202020'
        this.ctx.fillRect(0, 8, this.canvas.width, 20)
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(this.message, 12, 20)
      } else {
        for (const child of this.children) {
          child.render(this.children.length > 0 || this.forceRender)
          this.index++
        }
      }

      this.messageTicks--

      if (this.rendering) setTimeout(() => requestAnimationFrame(loop), this.delay)
    }
    requestAnimationFrame(loop)
  }

  stopRendering () {
    this.rendering = false
  }
}
