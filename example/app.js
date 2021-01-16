const playtime = require('../');
const createPlatform = require('../platforms/browser');

window.init = () => {
	
	const platform = createPlatform({
		canvas: document.querySelector('canvas'),
		controls: {
			up:     ['key', 'ArrowUp'],
			down:   ['key', 'ArrowDown'],
			left:   ['key', 'ArrowLeft'],
			right:  ['key', 'ArrowRight'],
			fire:   ['key', 'Space']
		},
		input: {
			up:     ['is-pressed', 'up'],
			down:   ['is-pressed', 'down'],
			left:   ['is-pressed', 'left'],
			right:  ['is-pressed', 'right'],
			fire:   ['is-pressed', 'fire']
		}
	});

	const P = require('../')(platform);

	P.run({
		setup() {

		},
		loop() {
			P.vector.drawLine(10, 10, 100, 100, [1, 0, 0, 1]);
			P.vector.fillTriangle(400, 200, 300, 250, 600, 400, [0, 0, 1, 1]);
			P.vector.fillRect(600, 50, 170, 50, [0, 1, 0, 1]);
			P.vector.fillCircle(300, 400, 60, [1, 0.5, 1, 1]);
		}
	});

}
