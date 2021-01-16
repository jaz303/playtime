module.exports = function createBrowserPlatform({canvas, controls, input}) {
	const inputManager = require('./input')(canvas, controls, input);
	const gl = canvas.getContext('webgl');

	return {
		gl: gl,
		width: canvas.width,
		height: canvas.height,
		getInput() {
			return inputManager.getInput();
		},
		flush() {

		},
		run({fps, loop}) {
			let running = true;

			const cancel = () => { running = false; }

			function tick() {
				if (!running) {
					return;
				}
				loop(inputManager.getInput());
				requestAnimationFrame(tick);
			}

			requestAnimationFrame(tick);

			return cancel;
		}
	};
}