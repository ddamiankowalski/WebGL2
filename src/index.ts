const canvas: HTMLCanvasElement = document.querySelector('canvas');
const gl: WebGLRenderingContext = canvas.getContext('webgl');

if(!gl) {
    throw new Error('WebGL not supported');
}

console.log('Everything works fine!');