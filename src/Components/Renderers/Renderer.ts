import { mat4 } from "gl-matrix";
import { AttributeType, Material } from "../Materials/Material";
import { ObjectRenderProps } from "../Object3D";
import { Model } from "../Cube";

export interface RenderProperties extends ObjectRenderProps {
    modelMatrix: mat4
}

export class Renderer {
    private _gl: WebGL2RenderingContext
    private _model: Model
    private _material: Material

    constructor(gl: WebGL2RenderingContext, model: Model, material: Material) {
        this._gl = gl
        this._model = model
        this._material = material
    }

    /**
     * This function will be different for every MeshRenderer
     *  it will get called on every single re-render of the object a Renderer is 
     *   attached to
     */
    public render(props: RenderProperties): void {
        this._material.use()
        this._material.run(props)

        // bind model vertices
        const vertexBuffer = this._gl.createBuffer()
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vertexBuffer)
        this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._model.vertices), this._gl.STATIC_DRAW)

        // set position attribute location
        this._material.setAttribute('aPosition', AttributeType.VERTEX)

        // TODO -- could also set up the other attribute locations here too like normals texture etc -- 

        // bind model indices
        const indexBuffer = this._gl.createBuffer()
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
        this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._model.indices), this._gl.STATIC_DRAW)

        this._gl.drawElements(this._gl.TRIANGLES, this._model.indices.length, this._gl.UNSIGNED_SHORT, 0)

        this._material.stopUse()
    }
}