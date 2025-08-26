'use client'

import React, { useEffect, useRef } from 'react'

interface QRCodeBoxProps {
  data: string
  size?: number
}

export default function QRCodeBox({ data, size = 200 }: QRCodeBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simple QR code placeholder - in production you'd use a proper QR library
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, size, size)

    // Draw QR pattern placeholder (checkerboard)
    ctx.fillStyle = 'black'
    const cellSize = size / 20

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Add corner squares (QR code markers)
    const markerSize = cellSize * 3
    ctx.fillStyle = 'black'
    // Top-left
    ctx.fillRect(0, 0, markerSize, markerSize)
    // Top-right
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize)
    // Bottom-left
    ctx.fillRect(0, size - markerSize, markerSize, markerSize)

    // Add white centers
    ctx.fillStyle = 'white'
    const centerSize = cellSize
    ctx.fillRect(centerSize, centerSize, centerSize, centerSize)
    ctx.fillRect(size - markerSize + centerSize, centerSize, centerSize, centerSize)
    ctx.fillRect(centerSize, size - markerSize + centerSize, centerSize, centerSize)

  }, [data, size])

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-gray-200 rounded-lg"
      />
      <div className="text-xs text-gray-500 max-w-[200px] break-all">
        {data}
      </div>
    </div>
  )
}