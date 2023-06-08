import { glMatrix, quat, vec3 } from "gl-matrix"
import { CubeModelData } from "../Assets/Cube"
import { base, boxes4x2 } from "../BoxConfig"
import { LightMaterial } from "./Materials/LightMaterial"
import { Model } from "./Model"
import { Object3D } from "./Object3D"
import { Renderer } from "./Renderer"
import { Projection, Scene } from "./Scene"
import { Light } from "./Light/Light"
import { Camera } from "./Camera/Camera"
import { Transform } from "./Transform"

/**
 * @summary class to run a pallet simulation and directly be called by the frontend framework
 */
export class PalletSimulation {
    private _gl: WebGL2RenderingContext
    private _scene: Scene

    private _baseObjectRotation: quat
    private _baseObject: Object3D | null

    static readonly rotationSpeed: number = 2.0 // degrees

    constructor(gl: WebGL2RenderingContext) {
        this._gl = gl
        this._baseObjectRotation = quat.fromEuler(quat.create(), 0, 45, 0)
        this._baseObject = null
        this._scene = this.setupScene()
        this.render = this.render.bind(this)
    }

    private setupScene(): Scene {
        // set clear color to black
        this._gl.clearColor(0.0, 0.0, 0.0, 1.0)

        // enable depth testing
        this._gl.enable(this._gl.DEPTH_TEST)

        // generate the scene objects
        const sceneObjects = this.createSceneObjects()
        
        // Create Directional Light
        const lightDirection = vec3.fromValues(0.25, 1.0, 0.5)
        const lightAmbientColor = vec3.fromValues(0.5, 0.5, 0.5)
        const lightColor = vec3.fromValues(1.0, 1.0, 1.0)
        const luminosity = 1.0
        const light = new Light(lightDirection, lightAmbientColor, lightColor, luminosity)

        // Create Camera
        const cameraTransform: Transform = new Transform(
            vec3.fromValues(-0.0, -40.0, -120),
            quat.fromEuler(quat.create(), 15, 0, 0)
        )
        const aspectRatio = this._gl.canvas.width / this._gl.canvas.height
        const cameraProjection: Projection = {
            aspectRatio,
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }
        const camera = new Camera(cameraTransform, cameraProjection)

        // create the scene
        return new Scene(this._gl, sceneObjects, light, camera)
    }

    public begin(): void {
        // add event listeners
        this.handleKeyDown = this.handleKeyDown.bind(this)
        window.addEventListener('keydown', this.handleKeyDown)
        this.handleResize = this.handleResize.bind(this)
        window.addEventListener('resize', this.handleResize)

        this.handleResize()
        requestAnimationFrame(this.render)
    }

    public stop(): void {
        this.handleKeyDown = this.handleKeyDown.bind(this)
        window.removeEventListener('keydown', this.handleKeyDown)

        this.handleResize = this.handleResize.bind(this)
        window.removeEventListener('resize', this.handleResize)
    }

    private render(timestamp: number) {
        this._scene.render()
        requestAnimationFrame(this.render)
    }

    private createSceneObjects(): Object3D[] {
        const sceneObjects: Object3D[] = []

        const cubeModel = new Model(CubeModelData)

        const lightBrown = [0.480, 0.368, 0.264, 1.0]
        const boxRenderer = new Renderer(this._gl, cubeModel,  new LightMaterial(this._gl, lightBrown))

        const gray = [0.3, 0.3, 0.4, 1.0]
        const baseRenderer = new Renderer(this._gl, cubeModel, new LightMaterial(this._gl, gray))

        const boxes: Object3D[] = []
        boxes4x2.forEach((box: Transform) => {
            const boxTransform = new Transform(
                // y position adjustment -> position of the center of the box + half height of base + half height of box, divide this by the scale of the base
                vec3.fromValues(
                    box.position[0] / base.scale[0],
                    (box.scale[1] / 2 + box.position[1] + base.scale[1] / 2) / base.scale[1],
                    box.position[2] / base.scale[2],
                ),
                // rotation remains the same
                box.rotation,
                // adjust the scale of the boxes so that they are not effected by the scaled up base
                // This needs to happen because I am using the same 1x1x1 model and scaling them to account for different sizes
                vec3.fromValues(box.scale[0]/base.scale[0], box.scale[1]/base.scale[1], box.scale[2]/base.scale[2])
            )
            const boxObj = new Object3D(this._gl, boxRenderer, [], boxTransform)
            
            boxes.push(boxObj)
        })

        this._baseObject = new Object3D(this._gl, baseRenderer, boxes, base)
        this._baseObject.transform.rotation = this._baseObjectRotation

        sceneObjects.push(this._baseObject)

        return sceneObjects
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        if (!this._baseObject) {
            return
        }

        switch (event.key) {    
            case 'a':
                this._baseObject.transform.rotation = quat.rotateY(this._baseObject.transform.rotation, this._baseObject.transform.rotation, glMatrix.toRadian(PalletSimulation.rotationSpeed))
                break
            case 'd':
                this._baseObject.transform.rotation = quat.rotateY(this._baseObject.transform.rotation, this._baseObject.transform.rotation, glMatrix.toRadian(-PalletSimulation.rotationSpeed))
                break
            case 'w':
                this._baseObject.transform.rotation = quat.rotateX(this._baseObject.transform.rotation, this._baseObject.transform.rotation, glMatrix.toRadian(-PalletSimulation.rotationSpeed))
                break
            case 's':
                this._baseObject.transform.rotation = quat.rotateX(this._baseObject.transform.rotation, this._baseObject.transform.rotation, glMatrix.toRadian(PalletSimulation.rotationSpeed))
                break
        }
    }

    private handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        const canvas = this._gl.canvas
        
        canvas.width = width
        canvas.height = height

        const aspectRatio = this._gl.canvas.width / this._gl.canvas.height
        const cameraProjection: Projection = {
            aspectRatio,
            fovY: 1.0472,
            near: 0.1,
            far: 1000
        }
        this._scene.camera.projection = cameraProjection

        this._gl.viewport(0, 0, width, height)
    }
}