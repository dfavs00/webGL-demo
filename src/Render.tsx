import React, { useRef, useEffect, useState } from 'react'
import { PalletSimulation } from './GraphicsEngine/PalletSimulation'

interface RenderComponentProps {
    loading: boolean
}

const Render: React.FC<RenderComponentProps> = ({loading}: RenderComponentProps) => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const palletSimulationRef = useRef<PalletSimulation | null>(null)

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
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext('webgl2', { antialias: true })
        if (!gl) {
            console.error('WebGL 2 is not supported')
            return
        }

        if (!palletSimulationRef.current) {
            palletSimulationRef.current = new PalletSimulation(gl)
            palletSimulationRef.current?.begin()
        }

        return () => {
            palletSimulationRef.current?.stop()
        }
    }, [])

    return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight}/>
}

export default Render