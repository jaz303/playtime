const playtime = require('../');

function initPlaytime() {
	const platform = require('../platforms/browser')({
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

	return require('../')(platform);
}

window.init = () => {
	const P = initPlaytime();

	P.run({
		setup() {
			console.log("setup!");
		},
		loop(input) {
			P.vector.drawLine(10, 10, 100, 100, [1, 0, 0, 1]);
			P.vector.fillTriangle(400, 200, 300, 250, 600, 400, [0, 0, 1, 1]);
			P.vector.fillRect(600, 50, 170, 50, [0, 1, 0, 1]);
			P.vector.fillCircle(300, 400, 60, [1, 0.5, 1, 1]);
		}
	});
}
