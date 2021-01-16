const {PrimitiveVertexBuffer} = require('./primitive-vertex-buffer');

exports.PrimitiveRenderer = class PrimitiveRenderer {
	constructor(buffer, opQueue) {
		this.buffer = buffer;
		this.opQueue = opQueue;
	}

	reset(buffer, opQueue) {
		this.buffer = buffer;
		this.opQueue = opQueue;
	}

	drawLine(x1, y1, x2, y2, color) {
		const start = this.buffer.getIndex();
		this.buffer.push_X_Y_Array(x1, y1, color);
		this.buffer.push_X_Y_Array(x2, y2, color);
		this.opQueue.push(new DrawLineOp(start));	
	}

	fillCircle(cx, cy, r, color, steps = undefined) {
		if (typeof steps !== 'number') {
			steps = 64; // TODO: heuristic
		}

		const start = this.buffer.getIndex();
		this.buffer.push_X_Y_Array(cx, cy, color);

		const inc = (Math.PI * 2) / steps;
		for (let i = 0; i <= steps; i++) {
			const angle = inc * i;
			const x = cx + Math.cos(angle) * r;
			const y = cy + Math.sin(angle) * r;
			this.buffer.push_X_Y_Array(x, y, color);
		}

		this.opQueue.push(new FillCircleOp(start, steps));
	}

	fillRect(x, y, w, h, color) {
		const start = this.buffer.getIndex();
		this.buffer.push_X_Y_Array(x, y + h, color);
		this.buffer.push_X_Y_Array(x, y, color);
		this.buffer.push_X_Y_Array(x + w, y + h, color);
		this.buffer.push_X_Y_Array(x + w, y, color);
		this.opQueue.push(new FillRectOp(start));
	}

	fillTriangle(x1, y1, x2, y2, x3, y3, color) {
		const start = this.buffer.getIndex();
		this.buffer.push_X_Y_Array(x1, y1, color);
		this.buffer.push_X_Y_Array(x2, y2, color);
		this.buffer.push_X_Y_Array(x3, y3, color);
		this.opQueue.push(new FillTriangleOp(start));
	}
}

class DrawLineOp {
	constructor(bufferIndex) {
		this.bufferIndex = bufferIndex;
	}

	exec(gl) {
		gl.drawArrays(gl.LINES, this.bufferIndex, 2);
	}
}

class FillCircleOp {
	constructor(bufferIndex, steps) {
		this.bufferIndex = bufferIndex;
		this.steps = steps;
	}

	exec(gl) {
		gl.drawArrays(gl.TRIANGLE_FAN, this.bufferIndex, this.steps + 2);
	}
}

class FillRectOp {
	constructor(bufferIndex) {
		this.bufferIndex = bufferIndex;
	}

	exec(gl) {
		gl.drawArrays(gl.TRIANGLE_STRIP, this.bufferIndex, 4);
	}
}

class FillTriangleOp {
	constructor(bufferIndex) {
		this.bufferIndex = bufferIndex;
	}

	exec(gl) {
		gl.drawArrays(gl.TRIANGLES, this.bufferIndex, 3);
	}
}
