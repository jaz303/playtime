module.exports = function createBrowserPlatform({canvas, controls, input}) {

	const inputManager = require('./input')(canvas, controls, input);

	return {
		canvas: canvas, // temporary hack
		getInput() {
			return inputManager.getInput();
		}
	};
}