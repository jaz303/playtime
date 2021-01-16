exports.PrimitiveVertexBuffer = class PrimitiveVertexBuffer {
	constructor() {
		this.storage = new Float32Array(1024);
		this.length = 0;
	}

	reset() {
		this.length = 0;
	}

	getIndex() {
		return this.length / 6;
	}

	getArray() {
		return this.storage.subarray(0, this.length);
	}

	push_X_Y_Array(x, y, color) {
		this._grow(6);
		this.storage[this.length++] = x;
		this.storage[this.length++] = y;
		this.storage[this.length++] = color[0];
		this.storage[this.length++] = color[1];
		this.storage[this.length++] = color[2];
		this.storage[this.length++] = color[3];
	}

	_grow(n) {
		if ((this.length + n) > this.storage.length) {
			
		}
	}
}
