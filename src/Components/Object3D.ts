import { quat, vec3, mat4 } from "gl-matrix"
import { Model } from "./Cube"

export class Object3D {
    private gl: WebGL2RenderingContext
    private shaderProgram: WebGLProgram
    private model: Model
    private color: number[]
    private position: vec3
    private rotation: quat
    private scale: vec3

    constructor(gl: WebGL2RenderingContext, model: Model, vShader: WebGLShader, fShader: WebGLShader, color: number[]) {
        this.gl = gl
        this.model = model
        this.color = color
        this.shaderProgram = this.createShaderProgram(vShader, fShader)
        this.position = vec3.create()
        this.rotation = quat.create()
        this.scale = vec3.fromValues(1, 1, 1)
    }

    private createShaderProgram(vShader: WebGLShader, fShader: WebGLShader): WebGLProgram {
        const gl = this.gl

        const program = gl.createProgram()
        if (!program) {
            throw new Error('Unable to create shader program')
        }

        gl.attachShader(program, vShader)
        gl.attachShader(program, fShader)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Shader program linking error:', gl.getProgramInfoLog(program));
            throw new Error('unable to link shader program')
          }

        // create and link shader program
        return program
    }

    public getPosition(): vec3 {
        return vec3.clone(this.position)
    }

    public getRotation(): quat {
        return quat.clone(this.rotation)
    }

    public getScale(): vec3 {
        return vec3.clone(this.scale)
    }

    public setPosition(pos: vec3): void {
        this.position = pos
    }

    public setRotation(rot: quat): void {
        this.rotation = rot
    }

    public setScale(sca: vec3): void {
        this.scale = sca
    }

    public render(viewMatrix: mat4, projectionMatrix: mat4) {
        const gl = this.gl

        // Set up shader program
        gl.useProgram(this.shaderProgram)

        // set up object transformations
        const modelMatrix = mat4.create()
        mat4.fromRotationTranslationScale(modelMatrix, this.rotation, this.position, this.scale)

        // Get uniform locations
        const modelMatrixUniformLocation = gl.getUniformLocation(this.shaderProgram, 'uModelMatrix')
        const viewMatrixLocation = gl.getUniformLocation(this.shaderProgram, 'uViewMatrix')
        const projectionMatrixLocation = gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix')
        const colorUniformLocation = gl.getUniformLocation(this.shaderProgram, 'uColor')

        // Set uniform values  
        gl.uniformMatrix4fv(modelMatrixUniformLocation, false, modelMatrix)
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)
        gl.uniform4fv(colorUniformLocation, this.color)

        // -------Render the object--------

        // bind model vertices
        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.model.vertices), gl.STATIC_DRAW)

        // set position attribute location
        const positionAttributeLocation = gl.getAttribLocation(this.shaderProgram, 'aPosition')
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

        // bind model indices
        const indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.model.indices), gl.STATIC_DRAW)

        gl.drawElements(gl.TRIANGLES, this.model.indices.length, gl.UNSIGNED_SHORT, 0)
        gl.useProgram(null)
    }
}