import React, { useRef, useEffect, useState } from 'react'
import { CubeModelData } from './Cube'
import { mat4, vec3, quat, glMatrix } from 'gl-matrix'
import { Object3D } from './Object3D'
import { Renderer } from './Renderers/Renderer'
import { Model } from './Model'
import { LightMaterial } from './Materials/LightMaterial'

interface RenderComponentProps {
    loading: boolean
}

const rotationSpeed = 2.0 // degrees

const Render: React.FC<RenderComponentProps> = ({loading}: RenderComponentProps) => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth)

    const mainRotation: quat = quat.create()
    quat.fromEuler(mainRotation, 0.0, -45, 0.0)

    const projectionMatrix = mat4.create();
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
        mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0.0, -3.0, -5))

        const cubeModel = new Model(CubeModelData)

        const lightBrown = [0.480, 0.368, 0.264, 1.0]
        const basicMat = new LightMaterial(gl, lightBrown)
        const cubeModelRenderer = new Renderer(gl, cubeModel, basicMat)
        
        const gray = [0.3, 0.3, 0.4, 1.0]
        const baseMat = new LightMaterial(gl, gray)
        const baseRenderer = new Renderer(gl, cubeModel, baseMat)

        const cubeObject3D = new Object3D(gl, cubeModelRenderer, [])
        cubeObject3D.position = vec3.fromValues(0.25, 1.0, 0.25)
        // only doing this because the base object is scaled. Normally the base object would be
        // a model and not just another scaled cube
        cubeObject3D.scale = vec3.fromValues(0.5, 1.0, 0.5)

        const baseObject = new Object3D(gl, baseRenderer, [cubeObject3D])
        baseObject.scale = vec3.fromValues(2.0, 0.5, 2.0)
        baseObject.rotation = mainRotation

        // setup lighting properties
        const lightDirection = vec3.fromValues(0.25, 1.0, 0.5)

        const render = (timestamp: number) => {
            baseObject.rotation = mainRotation

            // clear the canvas and draw
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            baseObject.render({
                viewMatrix, 
                projectionMatrix,
                lightProps: {
                    lightAmbientColor: vec3.fromValues(0.5, 0.5, 0.5),
                    lightColor: vec3.fromValues(1.0, 1.0, 1.0),
                    lightDirection
                }
            })
      
            // Call render again on the next frame
            requestAnimationFrame(render);
          }
      
          // Start the rendering loop - recommended way to render a webgl scene
          requestAnimationFrame(render);

        return () => {
            // Cleanup code goes here
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
}

export default Render