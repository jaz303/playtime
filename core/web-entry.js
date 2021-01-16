const {PrimitiveVertexBuffer} = require('./primitive-vertex-buffer.js');
const {PrimitiveRenderer} = require('./primitive-renderer');
const {PrimitiveShader} = require('./primitive-shader');
const {mat4} = require('gl-matrix');

let initialised = false;

function expose(target, {context, primitives}) {

	let fillColor = [1,1,1,1];
	let lineColor = [1,1,1,1];

	target.configureInput = function(input) {
		context.inputConfig = input;
	}
	
	target.setBackgroundColor = function(r, g, b) {
		context.backgroundColor = [r/255, g/255, b/255, 1];
	}

	target.setFillColor = function(r, g, b, a = 1) {
		fillColor = [r/255, g/255, b/255, a];
	}

	target.setLineColor = function(r, g, b, a = 1) {
		lineColor = [r/255, g/255, b/255, a];
	}

	target.drawLine = function(x1, y1, x2, y2) {
		primitives.drawLine(x1, y1, x2, y2, lineColor);
	}

	target.fillRect = function(x, y, width, height) {
		primitives.fillRect(x, y, width, height, fillColor);
	}

	target.fillTriangle = function(x1, y1, x2, y2, x3, y3) {
		primitives.fillTriangle(x1, y1, x2, y2, x3, y3, fillColor);
	}

	target.fillCircle = function(centerX, centerY, radius) {
		primitives.fillCircle(centerX, centerY, radius, fillColor);	
	}

}

window.___playtime___ = {
	globalInit({globalTarget, canvas, defaultInputConfig}) {
		if (initialised) {
			return;
		}
		
		initialised = true;

		const gl = canvas.getContext('webgl');
		const shader = new PrimitiveShader(gl);
		const opQueue = [];
		const primitiveBuffer = new PrimitiveVertexBuffer();
		const primitives = new PrimitiveRenderer(primitiveBuffer, opQueue);
		const glBuffer = gl.createBuffer();

		const context = {
			inputConfig: defaultInputConfig,
			backgroundColor: [0, 0, 0, 1]
		};

		expose(globalTarget, {context, primitives});

		const projectionMatrix = mat4.create();
		mat4.ortho(projectionMatrix, 0, canvas.width, canvas.height, 0, -1, 1);

		function beforeLoop() {
			primitiveBuffer.reset();
			opQueue.length = 0;
		}

		function afterLoop() {
			gl.clearColor(...context.backgroundColor);
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
		}

		let running = true;

		return {
			run({setup, loop}) {
				setup();

				const inputManager = require('@playtime/input-dom')(
					canvas,
					context.inputConfig.controls,
					context.inputConfig.shape
				);

				function tick() {
					if (!running) {
						return;
					}
					beforeLoop();
					loop(inputManager.getInput());
					afterLoop();
					requestAnimationFrame(tick);
				}

				requestAnimationFrame(tick);
			},
			stop() {
				running = false;
			}
		};
	}
};

