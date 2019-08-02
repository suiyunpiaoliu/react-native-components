export function log(target, name, descriptor) {
	var oldValue = descriptor.value;
	descriptor.value = function () {
		console.log(`calling ${name},with`, arguments)
		return oldValue.apply(this, arguments);
	};
	return descriptor;
}
export function loading(indicatorName = 'loading') {
	return function loading(target, name, descriptor) {
		var oldValue = descriptor.value;
		descriptor.value = function () {
			if (this[indicatorName]) {
				return
			}
			console.log(indicatorName)
			this[indicatorName] = true
			let res = oldValue.apply(this, arguments);
			if ((res && typeof res.finally) === 'function') {
				res.finally(() => {
					this[indicatorName] = false
				})
			} else {
				this[indicatorName] = false
			}
			console.log(indicatorName)
			return res
		};
		return descriptor;
	}
}
export function browsingTraces() {
	return function (target, name, descriptor) {
		var oldValue = descriptor.value;
		descriptor.value = function () {
			console.log(this.ClassName,name,...arguments)
			return oldValue.apply(this, arguments);
		};
		return descriptor;
	}
}