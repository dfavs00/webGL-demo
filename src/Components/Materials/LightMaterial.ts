import { compileShader, createShaderProgram } from "../ShaderUtils"
import { lightVertexShader } from "../VertexShaders"
import { lightFragmentShader } from "../FragmentShaders"
import { Material, UniformType } from "./Material"
import { RenderProperties } from "../Renderers/Renderer"

export class LightMaterial extends Material {
    private _color: number[]

    constructor(gl: WebGL2RenderingContext, color?: number[]) {
        super(gl)
        this._color = color ?? [1.0, 1.0, 1.0, 1.0] // default to white
    }

    setupShaderProgram(): WebGLProgram {
        const vShader = compileShader(this._gl, lightVertexShader, this._gl.VERTEX_SHADER)
        const fShader = compileShader(this._gl, lightFragmentShader, this._gl.FRAGMENT_SHADER)
    
        return createShaderProgram(this._gl, vShader, fShader)
    }

    run(props: RenderProperties): void {
        // set uniforms
        this.setUniform('uModelMatrix', UniformType.MAT4, props.modelMatrix)
        this.setUniform('uViewMatrix', UniformType.MAT4, props.viewMatrix)
        this.setUniform('uProjectionMatrix', UniformType.MAT4, props.projectionMatrix)
        this.setUniform('uLightDirection', UniformType.VEC3, props.lightProps.lightDirection)
        this.setUniform('uLightColor', UniformType.VEC3, props.lightProps.lightColor)
        this.setUniform('uAmbientColor', UniformType.VEC3, props.lightProps.lightAmbientColor)
        this.setUniform('uColor', UniformType.VEC4, this._color)
    }
}