import { quat, vec3, mat4 } from "gl-matrix"
import { Renderer } from "./Renderers/Renderer"

/* Next Steps:
    - Abstract the shaders into a shader program, that contains a webGLShaderProgram inside it, but all we care about is using it 
       and setting the uniforms properly, it can extend a normal shader, take a vertex and frag shader, but the uniforms can be passed in either through
         some interface or a constructor... Think about it more...

    - Add lighting to the shader (will need cube normals)
        - class changes, new uniforms for light
        - possibly abstract shader program

    - Add texture to the shader (will need texCoords and cube normals)
        - same as above, figure out texture stuff again

    - Add an object hierarchy
        - every object has a parent Object3D and a list of children
        - parent Object3D can be null
        - a parent will call render for all of its children, propagating its model matrix down (child can just access the parent object)

    - Add input from the browser to be able to control things on the screen
        - Possibly may need to send out a raycast or something to detect what was clicked on
        - project the position on the canvas and draw a straight line back or something
        - Ability to move around or manually rotate, dragging is ideal because this will want to be on mobile

        - When a box is clicked on a shader value can be updated. Possibly just the color value, or maybe something with light
*/

export interface ObjectRenderProps {
    viewMatrix: mat4
    projectionMatrix: mat4

    // Add lighting properties eventually
}

export class Object3D {
    private _gl: WebGL2RenderingContext
    private _renderer: Renderer
    private _position: vec3
    private _rotation: quat
    private _scale: vec3

    constructor(gl: WebGL2RenderingContext, renderer: Renderer) {
        this._gl = gl
        this._renderer = renderer
        this._position = vec3.create()
        this._rotation = quat.create()
        this._scale = vec3.fromValues(1, 1, 1)
    }

    public get position(): vec3 {
        return vec3.clone(this._position)
    }

    public get rotation(): quat {
        return quat.clone(this._rotation)
    }

    public get scale(): vec3 {
        return vec3.clone(this._scale)
    }

    public set position(pos: vec3){
        this._position = pos
    }

    public set rotation(rot: quat){
        this._rotation = rot
    }

    public set scale(sca: vec3) {
        this._scale = sca
    }

    public getModelMatrix(): mat4 {
        const mMat = mat4.create()
        mat4.fromRotationTranslationScale(mMat, this._rotation, this._position, this._scale)
        return mMat
    }

    public render(props: ObjectRenderProps) {

        // set up object transformations
        const modelMatrix = this.getModelMatrix()

        // Render the object
        this._renderer.render({
            modelMatrix,
            ...props
        })

        // eventually render its children objects here
    }
}