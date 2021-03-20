export class SimpleEmitter {
  _events = {}
  _onces = {}
  on(name, fn) {
    (this._events[name] ??= []).push(fn);
  }

  emit(name, ...data) {
    this._events[name]?.forEach(fn => fn(...data))
    this._onces[name]?.forEach(fn => this.off(name, fn))
    delete this._onces[name]
  }

  once(name, fn) {
    this.on(name, fn);
    (this._onces[name] ??= []).push(fn);
  }

  off(name, fn) {
    const index = this.registry[name]?.indexOf(fn)
    if (index >= 0) this.registry[name].splice(index, 1)
  }
}