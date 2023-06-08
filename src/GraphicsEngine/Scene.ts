import { mat4 } from "gl-matrix";
import { Transform } from "../BoxConfig";
import { Light } from "./Light/Light";
import { Object3D, ObjectRenderProps } from "./Object3D";

export interface Projection {
    fovY: number
    aspectRatio: number
    near: number
    far: number
}

export class Scene {
    private _gl: WebGL2RenderingContext
    private _objects: Object3D[]
    private _light: Light

    // eventually this may be able to be a camera class
    private _camera: Transform 
    private _viewMatrix: mat4
    private _projection: Projection
    private _projectionMatrix: mat4

    constructor(gl: WebGL2RenderingContext, objects: Object3D[], light: Light, camera: Transform, perspective: Projection) {
        this._gl = gl
        this._objects = objects
        this._light = light
        this._camera = camera
        this._viewMatrix = mat4.fromRotationTranslation(mat4.create(), camera.rotation, camera.position)
        this._projection = perspective
        this._projectionMatrix = mat4.perspective(mat4.create(), perspective.fovY, perspective.aspectRatio, perspective.near, perspective.far)
    }

    public set camera(camera: Transform) {
        this._camera = camera
        this._viewMatrix = mat4.fromRotationTranslation(mat4.create(), camera.rotation, camera.position)
    }

    public set projection(projection: Projection) {
        this._projection = projection
        this._projectionMatrix = mat4.perspective(mat4.create(), projection.fovY, projection.aspectRatio, projection.near, projection.far)
    }

    /**
     * @summary Renders all objects in this scene
     */
    public render(): void {
        this._objects.forEach((object: Object3D) => {
            object.render({
                projectionMatrix: this._projectionMatrix,
                viewMatrix: this._viewMatrix,
                light: this._light,
            } as ObjectRenderProps)
        })
    }
}