import css from './style.css';
import { WebGLCustomProgram } from './webgl-program';

const vertexShaderSrc = `#version 300 es

uniform vec2 u_resolution;
uniform vec2 u_translation;

in vec2 a_texCoord;
in vec4 a_position;

out vec2 v_texCoord;

void main()
{
    gl_Position = a_position + vec4(u_translation, 0.0, 1.0);
    v_texCoord = a_texCoord;
}
`

const fragmentShaderSrc = `#version 300 es

precision highp float;

uniform sampler2D u_image;

in vec2 v_texCoord;

out vec4 outColor;

void main() 
{
    outColor = texture(u_image, v_texCoord);
}
`

const canvas = document.getElementById('webgl');
const gl = canvas.getContext("webgl2");
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
const program = new WebGLCustomProgram(gl, vertexShaderSrc, fragmentShaderSrc);

let translation = [0, 0];
let width = 100;
let height = 30;
let color = [Math.random(), Math.random(), Math.random(), 1];

function main() {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = 'https://webgl2fundamentals.org/webgl/resources/leaves.jpg';
    image.onload = () => render(image);
}

function render(image) {
    const gl = program.gl;
    gl.useProgram(program.program);

    const imageLocation = program.getUniformLocation('u_image');
    const translationLocation = program.getUniformLocation('u_translation');

    const positionAttribLoc = program.getAttributeLocation('a_position');
    const positionBuffer = program.createBuffer();
    const positions = [
        -0.5, -0.5,
         0.5,  0.5,
         0.5, -0.5,
         0.5,  0.5,
        -0.5,  0.5,
        -0.5, -0.5
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionAttribLoc, 2, gl.FLOAT, false, 0, 0);

    const texCoordAttribLoc = program.getAttributeLocation('a_texCoord');
    const texCoordBuffer = program.createBuffer();
    const texCoords = [
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        0.0, 0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(texCoordAttribLoc, 2, gl.FLOAT, false, 0, 0);

    // TEXTURE
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.uniform1i(imageLocation, 0);

    setInterval(() => {
        let translation = [Math.random() - 0.5, Math.random() - 0.5];
        gl.uniform2fv(translationLocation, translation);
        drawScene();
    }, 10);
}

function drawScene() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

main();