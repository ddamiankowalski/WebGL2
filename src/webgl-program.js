export class WebGLCustomProgram {
    constructor(gl, vertexSrc, fragmentSrc) {
        this.gl = gl;

        this.vertexShader = this.createShader(vertexSrc, this.gl.VERTEX_SHADER);
        this.fragmentShader = this.createShader(fragmentSrc, this.gl.FRAGMENT_SHADER);
        this.program = this.createProgram();

        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
    }

    getAttributeLocation(name) {
        const location = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(location);

        return location;
    }

    getUniformLocation(name) {
        const location = this.gl.getUniformLocation(this.program, name);
        return location;
    }

    createBuffer() {
        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

        return buffer;
    }

    createShader(src, type) {
        const shader = this.gl.createShader(type);
        
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);

        if(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            return shader;
        }

        console.log(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    createProgram() {
        const program = this.gl.createProgram();

        this.gl.attachShader(program, this.vertexShader);
        this.gl.attachShader(program, this.fragmentShader);
        this.gl.linkProgram(program);

        if(this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            return program;
        }

        console.log(this.gl.getProgramInfoLog(program));
        this.gl.deleteProgram(program);
    }
}