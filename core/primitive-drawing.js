module.exports = () => {

	const bufferData = [];
	const opQueue = [];

	let color = [1, 1, 1, 1];

	function pushVertex(x, y) {
		bufferData.push(x, y, color[0], color[1], color[2], color[3]);
	}

	function setColor(r, g, b, a) {
		color = [r, g, b, a];
	}

	function fillTriangle(x1, y1, x2, y2, x3, y3) {
		const start = bufferData.length;
		pushVertex(x1, y1);
		pushVertex(x2, y2);
		pushVertex(x3, y3);
		opQueue.push((gl) => {
			gl.drawArrays(gl.TRIANGLES, start / 6, 3);
		});
	}

	function drawLine(x1, y1, x2, y2) {
		const start = bufferData.length;
		pushVertex(x1, y1);
		pushVertex(x2, y2);
		opQueue.push((gl) => {
			gl.drawArrays(gl.LINES, start / 6, 2);
		});
	}

	function fillRect(x, y, w, h) {
		const start = bufferData.length;
		pushVertex(x, y + h);
		pushVertex(x, y);
		pushVertex(x + w, y + h);
		pushVertex(x + w, y);
		opQueue.push((gl) => {
			gl.drawArrays(gl.TRIANGLE_STRIP, start / 6, 4);
		});
	}

	function fillCircle(cx, cy, r, steps = undefined) {
		if (typeof steps !== 'number') {
			steps = 64;
		}

		console.log("drawing a circle with %d sides", steps);
		
		const start = bufferData.length;
		pushVertex(cx, cy);

		const inc = (Math.PI * 2) / steps;
		for (let i = 0; i <= steps; i++) {
			const angle = inc * i;
			const x = cx + Math.cos(angle) * r;
			const y = cy + Math.sin(angle) * r;
			pushVertex(x, y);
		}
		
		opQueue.push((gl) => {
			gl.drawArrays(gl.TRIANGLE_FAN, start / 6, steps + 2);
		});
	}

	return {
		setColor,
		fillTriangle,
		drawLine,
		fillRect,
		fillCircle
	};

}