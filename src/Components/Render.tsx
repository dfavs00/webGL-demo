import React, { useRef, useEffect } from 'react'
import { CubeModel } from './Cube'
import { glMatrix, mat4, vec3 } from 'gl-matrix'
import { basicVertexShader } from './VertexShaders'
import { basicFragmentShader } from './FragmentShaders'

interface RenderProps {
    loading: boolean
}

const Render: React.FC<RenderProps> = ({loading}: RenderProps) => {
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
        

        // Link shaders to a webgl program
        const program = gl.createProgram()
        if (!program) {
            console.error('failed to create shader program')
            return 
        }
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        // Verify shader program linking
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Shader program linking failed:', gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program)

        // Create a buffer for model vertex data
        const vertexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CubeModel.vertices), gl.STATIC_DRAW)
        
        // Create a buffer for model index data
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(CubeModel.indices), gl.STATIC_DRAW);

        // set position attribute pointer so webgl knows where to put attributes
        //  this tells webgl how to process the vertex buffer
        const positionAttributeLocation = gl.getAttribLocation(program, 'aPosition')
        gl.enableVertexAttribArray(positionAttributeLocation)
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

        // Set uniform values for the shader
        const modelMatrixLocation = gl.getUniformLocation(program, 'uModelMatrix')
        const viewMatrixLocation = gl.getUniformLocation(program, 'uViewMatrix')
        const projectionMatrixLocation = gl.getUniformLocation(program, 'uProjectionMatrix')
        const colorUniformLocation = gl.getUniformLocation(program, 'uColor')
            
        // Create and set uniforms for the model view and projection matricies
        const modelPosition = vec3.fromValues(0.0, 0.0, -3.0)
        const modelMatrix = mat4.create()
        mat4.translate(modelMatrix, modelMatrix, modelPosition)
        mat4.rotateY(modelMatrix, modelMatrix, glMatrix.toRadian(45))
        gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix)

        const viewMatrix = mat4.create()
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix)

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 1.0472, aspectRatio, 0.1, 1000)
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix)

        // set the color uniform
        gl.uniform4fv(colorUniformLocation, [1.0, 0.0, 0.0, 1.0])

        const render = (timestamp: number) => {
            // Update animation or other logic here
            mat4.rotateY(modelMatrix, modelMatrix, glMatrix.toRadian(1));
            gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
      
            // clear the canvas and draw
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, CubeModel.indices.length, gl.UNSIGNED_SHORT, 0);
      
            // Call render again on the next frame
            requestAnimationFrame(render);
          }
      
          // Start the rendering loop
          requestAnimationFrame(render);

        return () => {
            // Cleanup code goes here
        }
    }, [])

    return <canvas ref={canvasRef} style={{width: "100%", height: "100%"}}/>
}

export default Render