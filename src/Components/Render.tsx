import React, { useRef, useEffect } from 'react'
import vertexShaderSource from './vertexShader.glsl'
import fragmentShaderSource from './fragmentShader.glsl'


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

        // set clear color to black
        gl.clearColor(0.0, 0.0, 0.0, 1.0)

        // enable depth testing
        gl.enable(gl.DEPTH_TEST)

        // compile vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)
        if (!vertexShader) {
            console.error('failed to create vertex shader')
            return 
        }
        gl.shaderSource(vertexShader, vertexShaderSource)
        gl.compileShader(vertexShader)

        // compile fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        if (!fragmentShader) {
            console.error('failed to create fragment shader')
            return 
        }
        gl.shaderSource(fragmentShader, fragmentShaderSource)
        gl.compileShader(fragmentShader)

        // Link shaders to a webgl program
        const program = gl.createProgram()
        if (!program) {
            console.error('failed to create shader program')
            return 
        }
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
        gl.linkProgram(program)
        gl.useProgram(program)

        // get vertex data

        return () => {
            // cleanup code
        }
    }, [])

    return <canvas ref={canvasRef} />
}

export default Render