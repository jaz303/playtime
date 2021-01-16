module.exports = class KeyRouter {
	constructor() {
		this._keys = new Map();
	}

	addKeyListener(code, target) {
		let listeners = this._keys.get(code);
		if (!listeners) {
			listeners = [];
			this._keys.set(code, listeners);
		}
		listeners.push(target);
	}

	dispatchKeyDown(code) {
		const ls = this._keys.get(code);
		if (ls) {
			ls.forEach(l => l.handleKeyDown());
		}
	}

	dispatchKeyUp(code) {
		const ls = this._keys.get(code);
		if (ls) {
			ls.forEach(l => l.handleKeyUp());
		}
	}
};