exports.createProgram = function(gl, vss, fss) {
	const vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, vss);
	gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
		throw "could not compile vertex shader: " + gl.getShaderInfoLog(vs);
	}

	const fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, fss);
	gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
		throw "could not compile vertex shader: " + gl.getShaderInfoLog(fs);
	}

	const prog = gl.createProgram();
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		throw "could not link program: " + gl.getProgramInfoLog(prog);
	}

	return prog;
}