import { mat4 } from "gl-matrix"
import { Renderer } from "./Renderer"
import { Light } from "./Light/Light"
import { Transform } from "./Transform"

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
    private _renderer: Renderer
    private _transform: Transform
    private _children: Object3D[]

    constructor(gl: WebGL2RenderingContext, renderer: Renderer, children?: Object3D[], transform?: Transform) {
        this._gl = gl
        this._renderer = renderer
        this._transform = transform ?? new Transform()
        this._parent = null

        children?.forEach((child: Object3D) => {
            child.setParent(this)
        })
        this._children = children ?? []
        
    }

    public get transform(): Transform {
        return this._transform
    }

    private setParent(parent: Object3D): void {
        this._parent = parent
    }

    public render(props: ObjectRenderProps) {

        var modelMatrix: mat4 = mat4.create()
        if (this._parent) {
            mat4.multiply(modelMatrix, this._parent.transform.matrix, this.transform.matrix)
        } else {
            modelMatrix = this.transform.matrix
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