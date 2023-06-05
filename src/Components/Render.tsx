import React, { useRef, useEffect } from 'react'
import { CubeModel } from './Cube'
import { quat, mat4, vec3, glMatrix } from 'gl-matrix'
import { basicVertexShader } from './VertexShaders'
import { basicFragmentShader } from './FragmentShaders'
import { Object3D } from './Object3D'
import { BasicMaterial } from './Materials/BasicMaterial'
import { Renderer } from './Renderers/Renderer'

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

        // compile vertex shader
        //const vertexShaderCode = getGLSLFromPath(vertexShaderSource)
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        if (!vertexShader) {
            console.error('failed to create vertex shader')
            return 
        }
        gl.shaderSource(vertexShader, basicVertexShader)
        gl.compileShader(vertexShader)
        // Verify vertex shader compilation
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error('Vertex shader compilation failed:', gl.getShaderInfoLog(vertexShader));
            return;
        }

        // compile fragment shader
        //const fragmentShaderCode = getGLSLFromPath(fragmentShaderSource)
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        if (!fragmentShader) {
            console.error('failed to create fragment shader')
            return 
        }
        gl.shaderSource(fragmentShader, basicFragmentShader)
        gl.compileShader(fragmentShader)
        // Verify fragment shader compilation
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error('Fragment shader compilation failed:', gl.getShaderInfoLog(fragmentShader));
            return;
        }
            
        // Create and set uniforms for the model view and projection matricies
        
        const viewMatrix = mat4.create()
        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 1.0472, aspectRatio, 0.1, 1000)

        const lightBrown = [0.480, 0.368, 0.264, 1.0]
        const basicMat = new BasicMaterial(gl, lightBrown)
        const renderer = new Renderer(gl, CubeModel, basicMat)
        
        const cubeObject3D = new Object3D(gl, renderer)
        cubeObject3D.position = vec3.fromValues(0.0, 0.0, -3.0)

        const render = (timestamp: number) => {

            const newRotation = cubeObject3D.rotation
            quat.rotateY(newRotation, newRotation, glMatrix.toRadian(1))
            quat.rotateX(newRotation, newRotation, glMatrix.toRadian(1))
            cubeObject3D.rotation = newRotation

            // clear the canvas and draw
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            cubeObject3D.render({viewMatrix, projectionMatrix})
      
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