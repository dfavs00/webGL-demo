import React, { useRef, useEffect } from 'react'
import { CubeModelData } from './Cube'
import { quat, mat4, vec3, glMatrix } from 'gl-matrix'
import { Object3D } from './Object3D'
import { Renderer } from './Renderers/Renderer'
import { Model } from './Model'
import { LightMaterial } from './Materials/LightMaterial'

interface RenderComponentProps {
    loading: boolean
}

const Render: React.FC<RenderComponentProps> = ({loading}: RenderComponentProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl2')
        if (!gl) {
            console.error('WebGL 2 is not supported')
            return
        }

        // Calculate the aspect ratio
        const aspectRatio = canvas.width / canvas.height;

        // set clear color to black
        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        // enable depth testing
        gl.enable(gl.DEPTH_TEST)
            
        // Create view and projection matricies
        const viewMatrix = mat4.create()
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 1.0472, aspectRatio, 0.1, 1000)

        const cubeModel = new Model(CubeModelData)

        const lightBrown = [0.480, 0.368, 0.264, 1.0]
        const basicMat = new LightMaterial(gl, lightBrown)
        const renderer = new Renderer(gl, cubeModel, basicMat)
        
        const cubeObject3D = new Object3D(gl, renderer)
        cubeObject3D.position = vec3.fromValues(0.0, 0.0, -3.0)


        // setup lighting properties
        const lightDirection = vec3.fromValues(0.0, 1.0, 1.0)

        const render = (timestamp: number) => {

            const newRotation = cubeObject3D.rotation
            quat.rotateY(newRotation, newRotation, glMatrix.toRadian(1))
            quat.rotateX(newRotation, newRotation, glMatrix.toRadian(1))
            cubeObject3D.rotation = newRotation

            // clear the canvas and draw
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            cubeObject3D.render({
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
    }, [])

    return <canvas ref={canvasRef} style={{width: "100%", height: "100%"}}/>
}

export default Render