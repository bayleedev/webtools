import React, { useEffect, useState } from 'react';

export interface BufferProps {
  buffer: Uint8ClampedArray
  height: number
  width: number
}

export const Buffer = (props: BufferProps) => {
  const [reference] = useState(React.createRef<HTMLCanvasElement>());
  const {
    buffer,
    height,
    width
  } = props

  useEffect(() => {
    // TODO we are getting pinker than expected colors
    const data = new ImageData(buffer, width, height)
    const canvas = reference.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        context.putImageData(data, 0, 0);
      }
    }

  }, [reference, buffer, height, width])

  return (
    <canvas
      height={height}
      width={width}
      id={"buffer"}
      ref={reference}></canvas>
  )
}
