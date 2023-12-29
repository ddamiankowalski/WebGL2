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
let colorAttribLoc = gl.getAttribLocation(program, "a_color");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let points = [
    -0.5, -0.5, 1, 0, 0,
     0.5,  0.5, 1, 0, 0,
     0.5, -0.5, 1, 0, 0,
    -0.5,  0.5, 1, 0, 0,
     0.5,  0.5, 1, 0, 0,
    -0.5, -0.5, 1, 0, 0
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.enableVertexAttribArray(positionAttribLoc);
gl.enableVertexAttribArray(colorAttribLoc);

let colorSize = 3;
let colorTyp = gl.FLOAT;
let colorNormalize = false;
let colorStride = 20;
let colorOffset = 4 * 3;

gl.vertexAttribPointer(colorAttribLoc, colorSize, colorTyp, colorNormalize, colorStride, colorOffset);

let size = 2;
let type = gl.FLOAT;
let normalize = false;
let stride = 20;
let offset = 0;

gl.vertexAttribPointer(positionAttribLoc, size, type, normalize, stride, offset);

const colorLoc = gl.getUniformLocation(program, "u_color");
gl.uniform3f(colorLoc, 1, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6);