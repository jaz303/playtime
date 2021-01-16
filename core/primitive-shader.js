const {createProgram} = require('./gl-helpers');

const VSS = `
precision highp float;

attribute vec2 aPosition;
attribute lowp vec4 aColor;

uniform mat4 pMatrix;

varying lowp vec4 vColor;

void main() {
	gl_Position = pMatrix * vec4(aPosition, 0.0, 1.0);
	vColor = aColor;
}
`;

const FSS = `
precision highp float;

varying lowp vec4 vColor;

void main() {
	gl_FragColor = vColor;
}
`;

exports.PrimitiveShader = class PrimitiveShader {
	constructor(gl) {
		this.gl = gl;
		const p = this.program = createProgram(gl, VSS, FSS);
		this.locPosition = gl.getAttribLocation(p, 'aPosition');
		this.locColor = gl.getAttribLocation(p, 'aColor');
		this.locProjectionMatrix = gl.getUniformLocation(p, 'pMatrix');
	}
};
