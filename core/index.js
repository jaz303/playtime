const {PrimitiveVertexBuffer} = require('./primitive-vertex-buffer.js');
const {PrimitiveRenderer} = require('./primitive-renderer');
const {PrimitiveShader} = require('./primitive-shader');
const {mat4} = require('gl-matrix');

module.exports = function createCore(platform) {
	const gl = platform.gl;
	
	const shader = new PrimitiveShader(gl);
	const opQueue = [];
	const primitiveBuffer = new PrimitiveVertexBuffer();
	const primitives = new PrimitiveRenderer(primitiveBuffer, opQueue);
	const glBuffer = gl.createBuffer();

	const projectionMatrix = mat4.create();
	mat4.ortho(projectionMatrix, 0, platform.width, platform.height, 0, -1, 1);

	function beforeLoop() {
		primitiveBuffer.reset();
		opQueue.length = 0;
	}

	function afterLoop() {
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(shader.program);
		gl.uniformMatrix4fv(shader.locProjectionMatrix, false, projectionMatrix);

		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

		gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, primitiveBuffer.getArray(), gl.DYNAMIC_DRAW);

		gl.enableVertexAttribArray(shader.locPosition);
		gl.enableVertexAttribArray(shader.locColor);

		gl.vertexAttribPointer(shader.locPosition, 2, gl.FLOAT, gl.FALSE, 24, 0);
		gl.vertexAttribPointer(shader.locColor, 4, gl.FLOAT, gl.FALSE, 24, 8);

		opQueue.forEach(op => op.exec(gl));

		platform.flush();
	}

	return {
		vector: primitives,
		run({setup, loop}) {
			setup();
			return platform.run({
				fps: 60,
				loop(input) {
					beforeLoop();
					loop(input);
					afterLoop();
				}
			});
		}
	}
}