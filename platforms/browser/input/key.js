module.exports = class Key {
	constructor(name, code) {
		this.name = name;
		this.code = code;
		this._down = false;
	}

	install(ctx) {
		ctx.keyRouter.addKeyListener(this.code, this);
	}

	isPressed() { return this._down; }
	handleKeyDown() { this._down = true; }
	handleKeyUp() { this._down = false; }
};