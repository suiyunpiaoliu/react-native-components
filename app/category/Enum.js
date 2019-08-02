const NOPE = () => {
  throw new Error("Can't modify read-only view");
}

const NOPE_HANDLER = {
  set: NOPE,
  defineProperty: NOPE,
  deleteProperty: NOPE,
  preventExtensions: NOPE,
  setPrototypeOf: NOPE
}

const ReadOnlyView = target => new Proxy(target, NOPE_HANDLER)

const Enum = (target) => ReadOnlyView(new Proxy(target, {
  get: (obj, prop) => {
    if (prop in obj) {
      return Reflect.get(obj, prop)
    }
    if ('default' in obj) {
    	return Reflect.get(obj,'default')
    }
    throw new ReferenceError(`Unknown prop "${prop}"`)
    
  }
}))
module.exports = {
	Enum,
	ReadOnlyView,
}


