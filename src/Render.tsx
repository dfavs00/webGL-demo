import React, { useRef, useEffect, useState, MouseEvent } from 'react'
import { PalletSimulation } from './GraphicsEngine/PalletSimulation'
import { boxes4x2 } from './BoxConfig'

interface RenderComponentProps {
    loading: boolean
}

const Render: React.FC<RenderComponentProps> = ({loading}: RenderComponentProps) => {
    const [canvasHeight, setCanvasHeight] = useState<number>(window.innerHeight)
    const [canvasWidth, setCanvasWidth] = useState<number>(window.innerWidth)
    const [selectedBoxIndex, setSelectedBoxIndex] = useState<number>(0)

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const palletSimulationRef = useRef<PalletSimulation | null>(null)

    const onMouseDown = (event: MouseEvent): void => {
        if (palletSimulationRef.current) {
            palletSimulationRef.current.handleMouseDown(event)
        }
    }

    const onMouseUp = (event: MouseEvent): void => {
        if (palletSimulationRef.current) {
            palletSimulationRef.current.handleMouseUp(event)
        }
    }

    const onMouseMove = (event: MouseEvent): void => {
        if (palletSimulationRef.current) {
            palletSimulationRef.current.handleMouseMove(event)
        }
    }

    // const onResize = (): void => {
    //     if (palletSimulationRef.current) {
    //         palletSimulationRef.current.handleResize()
    //     }
    // }

    const onMouseLeave = (event: MouseEvent): void => {
        if (palletSimulationRef.current) {
            palletSimulationRef.current.handleMouseLeave(event)
        }
    }

    const prevBox = (): void => {
        let newIndex: number
        if (selectedBoxIndex <= 0) {
            newIndex = boxes4x2.length - 1
        } else {
            newIndex = selectedBoxIndex - 1
        }
        palletSimulationRef.current?.setSelectedBoxIndex(newIndex)
        setSelectedBoxIndex(newIndex)
    }

    const nextBox = (): void => {
        let newIndex: number
        if (selectedBoxIndex >= boxes4x2.length - 1) {
            newIndex = 0
        } else {
            newIndex = selectedBoxIndex + 1
        }
        palletSimulationRef.current?.setSelectedBoxIndex(newIndex)
        setSelectedBoxIndex(newIndex)
    }   

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
            palletSimulationRef.current = new PalletSimulation(gl, boxes4x2)
            palletSimulationRef.current?.begin()
        }

        return () => {
            palletSimulationRef.current?.stop()
        }
    }, [])

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
            <canvas 
                ref={canvasRef} 
                width={canvasWidth} 
                height={canvasHeight}
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp} 
                onMouseLeave={onMouseLeave}
            />
            <div>
                <button
                    onClick={prevBox}
                >
                    Prev
                </button>
                <button
                    onClick={nextBox}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Render