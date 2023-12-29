import css from './style.css';

const canvas = document.getElementById('webgl');

const getShaderSrc = (id) => document.getElementById(id).textContent;

const createShader = (gl, type, source) => {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

    if (success) {
        return shader;
    } else {
        gl.deleteShader(shader);
        throw new Error("Shader compilation failed: " + gl.getShaderInfoLog(shader));
    }
};

const createProgram = (vertexShader, fragmentShader) => {
    let program = gl.createProgram();
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    return program;
}

if(!canvas) {
    throw new Error("Could not get canvas element");
}

const gl = canvas.getContext("webgl");

const vertexShaderSrc = getShaderSrc('vertex-shader');
const fragmentShaderSrc = getShaderSrc('fragment-shader');

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

let program = createProgram(vertexShader, fragmentShader);

let positionAttribLoc = gl.getAttribLocation(program, "a_position");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let points = [
    -0.5, -0.5,
     0.5,  0.5,
     0.5, -0.5,
    -0.5,  0.5,
     0.5,  0.5,
    -0.5, -0.5
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.enableVertexAttribArray(positionAttribLoc);

let size = 2;
let type = gl.FLOAT;
let normalize = false;
let stride = 0;
let offset = 0;

const setRect = (gl) => {
    let x1 = Math.random() - 1;
    let y1 = Math.random() - 1;
    let x2 = x1 + 0.5;
    let y2 = y1 + 0.5;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW);
}

for (let i = 0; i < 10; i++) {
    let colorUniformLoc = gl.getUniformLocation(program, "u_color");
    gl.uniform3f(colorUniformLoc, Math.random(), Math.random(), Math.random());
    setRect(gl);

    gl.vertexAttribPointer(positionAttribLoc, size, type, normalize, stride, offset);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}