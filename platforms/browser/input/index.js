const KeyRouter = require('./key-router');
const Readers = require('./readers');
const ControlTypes = require('./control-types');

function createControls(defs) {
	const cs = new Map();
	for ([name, [type, ...args]] of Object.entries(defs)) {
		const ctor = ControlTypes[type];
		const control = new ctor(name, ...args);
		cs.set(name, control);
	}
	return cs;
}

function bindEvents(el, {keyRouter}) {
	el.addEventListener('keydown', (evt) => {
		if (evt.repeat)
			return;
		keyRouter.dispatchKeyDown(evt.code);
	});

	el.addEventListener('keyup', (evt) => {
		keyRouter.dispatchKeyUp(evt.code);
	});
}

module.exports = (sourceElement, controlDefs, shape) => {
	const controls = createControls(controlDefs);
	const keyRouter = new KeyRouter();

	const context = {
		controls,
		keyRouter
	};

	controls.forEach((c) => { c.install(context); });

	const [input, updateInput] = createInputObject(context, shape);

	bindEvents(sourceElement, context);

	return {
		getInput() {
			updateInput();
			return input;
		}
	};
};

function createInputObject(context, shape) {
	const updaters = [];
	
	return [
		_add({}, shape),
		() => updaters.forEach(u => u())
	];

	function _add(obj, shape) {
		for (let [k, v] of Object.entries(shape)) {
			if (Array.isArray(v)) {
				const [reader, ...args] = v;
				updaters.push(Readers[reader](
					obj,
					k,
					context,
					...args
				));
			} else {
				const child = {};
				obj[k] = child;
				_add(child, v);
			}
		}
		return obj;
	}
}