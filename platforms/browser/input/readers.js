module.exports = {
	"is-pressed": (target, name, context, buttonName) => {
		const button = context.controls.get(buttonName);
		target[name] = false;
		return () => {
			target[name] = button.isPressed();
		}
	}
};