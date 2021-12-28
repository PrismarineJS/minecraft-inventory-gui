export class SimpleEmitter {
  _events = {}
  _onces = {}
  on (name, fn) {
    (this._events[name] ??= []).push(fn)
  }

  emit (name, ...data) {
    this._events[name]?.forEach(fn => fn(...data))
    this._onces[name]?.forEach(fn => this.off(name, fn))
    delete this._onces[name]
  }

  once (name, fn) {
    this.on(name, fn);
    (this._onces[name] ??= []).push(fn)
  }

  off (name, fn) {
    const event = this._events[name]?.indexOf(fn)
    if (event >= 0) this._events[name].splice(event, 1)

    const once = this._onces[name]?.indexOf(fn)
    if (once >= 0) this._onces[name].splice(once, 1)

    if (!fn || !this._events[name]?.length) {
      delete this._events[name]
      delete this._onces[name]
    }
  }
}
