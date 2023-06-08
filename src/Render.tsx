import React, { useRef, useEffect, useState } from 'react'
import { CubeModelData } from './Assets/Cube'
import { mat4, vec3, quat, glMatrix } from 'gl-matrix'
import { Object3D } from './GraphicsEngine/Object3D'
import { Renderer } from './GraphicsEngine/Renderer'
import { Model, parseOBJ } from './GraphicsEngine/Model'
import { LightMaterial } from './GraphicsEngine/Materials/LightMaterial'
import { Transform, base, boxes4x2 } from './BoxConfig'
import { shuttleOBJData } from './Assets/shuttle'

interface RenderComponentProps {
    loading: boolean
}

const rotationSpeed = 2.0 // degrees

const Render: React.FC<RenderComponentProps> = ({loading}: RenderComponentProps) => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth)

    const mainRotation: quat = quat.create()
    quat.fromEuler(mainRotation, 0.0, -45, 0.0)

    const projectionMatrix = mat4.create()
    mat4.perspective(projectionMatrix, 1.0472, canvasWidth / canvasHeight, 0.1, 1000)

    const canvasRef = useRef<HTMLCanvasElement>(null)

    // handle window resize
    useEffect(() => {
        function handleResize() {
            setCanvasHeight(window.innerHeight)
            setCanvasWidth(window.innerWidth)
        }
    
        window.addEventListener('resize', handleResize)
    
        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }, [])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'a':
                    quat.rotateY(mainRotation, mainRotation, glMatrix.toRadian(rotationSpeed))
                    break
                case 'd':
                    quat.rotateY(mainRotation, mainRotation, glMatrix.toRadian(-rotationSpeed))
                    break
                case 'w':
                    quat.rotateX(mainRotation, mainRotation, glMatrix.toRadian(-rotationSpeed))
                    break
                case 's':
                    quat.rotateX(mainRotation, mainRotation, glMatrix.toRadian(rotationSpeed))
                    break
                default:
                    break
            }
        }

        document.addEventListener('keypress', handleKeyDown)

        return () => {
            document.removeEventListener('keypress', handleKeyDown)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createSceneObject = (gl: WebGL2RenderingContext): Object3D => {
        const cubeModel = new Model(CubeModelData)

        const lightBrown = [0.480, 0.368, 0.264, 1.0]
        const boxRenderer = new Renderer(gl, cubeModel,  new LightMaterial(gl, lightBrown))

        const gray = [0.3, 0.3, 0.4, 1.0]
        const baseRenderer = new Renderer(gl, cubeModel, new LightMaterial(gl, gray))

        const boxes: Object3D[] = []
        boxes4x2.forEach((box: Transform) => {
            const boxObj = new Object3D(gl, boxRenderer, [])

            // y position adjustment -> position of the center of the box + half height of base + half height of box, divide this by the scale of the base
            boxObj.position = vec3.fromValues(
                box.position[0] / base.scale[0],
                (box.scale[1] / 2 + box.position[1] + base.scale[1] / 2) / base.scale[1],
                box.position[2] / base.scale[2],
            )

            // rotation remains the same
            boxObj.rotation = box.rotation

            // adjust the scale of the boxes so that they are not effected by the scaled up base
            // This needs to happen because I am using the same 1x1x1 model and scaling them to account for different sizes
            boxObj.scale = vec3.fromValues(box.scale[0]/base.scale[0], box.scale[1]/base.scale[1], box.scale[2]/base.scale[2])

            boxes.push(boxObj)
        })

        const baseObj = new Object3D(gl, baseRenderer, boxes)
        baseObj.position = base.position
        baseObj.rotation = base.rotation
        baseObj.scale = base.scale

        return baseObj
    }

    const objFileTest = (gl: WebGL2RenderingContext): Object3D => {
        const shuttleModel: Model = parseOBJ(shuttleOBJData)
        const shuttleRenderer = new Renderer(gl, shuttleModel, new LightMaterial(gl, [0.5, 1.0, 0.2, 1.0]))

        const shuttle = new Object3D(gl, shuttleRenderer, [])
        shuttle.scale = vec3.fromValues(40,40,40)
        return shuttle
    } 

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl2', { antialias: true })
        if (!gl) {
            console.error('WebGL 2 is not supported')
            return
        }

        // set clear color to black
        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        // enable depth testing
        gl.enable(gl.DEPTH_TEST)
            
        // Create view matrix (Camera)
        const viewMatrix = mat4.create()
        mat4.rotateX(viewMatrix, viewMatrix, glMatrix.toRadian(15))
        
        const cameraPos = vec3.fromValues(0.0, 60.0, 100)
        mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(-cameraPos[0], -cameraPos[1], -cameraPos[2]))

        const baseObject = createSceneObject(gl)
        // const baseObject = objFileTest(gl)

        baseObject.rotation = mainRotation

        // setup lighting properties
        const lightDirection = vec3.fromValues(0.25, 1.0, 0.5)

        const render = (timestamp: number) => {
            baseObject.rotation = mainRotation

            // clear the canvas and draw
            // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            // baseObject.render({
            //     viewMatrix, 
            //     projectionMatrix,
            //     lightProps: {
            //         lightAmbientColor: vec3.fromValues(0.5, 0.5, 0.5),
            //         lightColor: vec3.fromValues(1.0, 1.0, 1.0),
            //         lightDirection
            //     }
            // })
      
            // Call render again on the next frame
            requestAnimationFrame(render)
          }
      
          // Start the rendering loop - recommended way to render a webgl scene
          requestAnimationFrame(render)

        return () => {
            // Cleanup code goes here
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
}

export default Render