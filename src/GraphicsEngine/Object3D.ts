import { quat, vec3, mat4 } from "gl-matrix"
import { Renderer } from "./Renderer"
import { Light } from "./Light/Light"

/* Next Steps:

    - 

    - Make a "Scene" that you can add objects to in a map (no duplicates) and it renders each base object

    - Add texture to the shader (will need texCoords and cube normals)
        - same as above, figure out texture stuff again

    - Add input from the browser to be able to control things on the screen
        - Possibly may need to send out a raycast or something to detect what was clicked on
        - project the position on the canvas and draw a straight line back or something
        - Ability to move around or manually rotate, dragging is ideal because this will want to be on mobile

        - When a box is clicked on a shader value can be updated. Possibly just the color value, or maybe something with light
*/

export interface ObjectRenderProps {
    viewMatrix: mat4
    projectionMatrix: mat4
    light: Light
}

export class Object3D {
    private _gl: WebGL2RenderingContext
    private _parent: Object3D | null
    private _children: Object3D[]
    private _renderer: Renderer
    private _position: vec3
    private _rotation: quat
    private _scale: vec3

    constructor(gl: WebGL2RenderingContext, renderer: Renderer, children: Object3D[]) {
        this._gl = gl
        this._renderer = renderer
        this._position = vec3.create()
        this._rotation = quat.create()
        this._scale = vec3.fromValues(1, 1, 1)
        this._parent = null
        children.forEach((child: Object3D) => {
            child.setParent(this)
        })
        this._children = children
        
    }

    private setParent(parent: Object3D): void {
        this._parent = parent
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

        var modelMatrix: mat4 = mat4.create()
        if (this._parent) {
            mat4.multiply(modelMatrix, this._parent.getModelMatrix(), this.getModelMatrix())
        } else {
            modelMatrix = this.getModelMatrix()
        }

        // Render the object
        this._renderer.render({
            modelMatrix,
            ...props
        })

        // eventually render its children objects here
        this._children.forEach((child: Object3D) => {
            child.render(props)
        })
    }
}