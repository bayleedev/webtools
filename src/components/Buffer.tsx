import React, { useEffect, useState } from 'react';
import {
  ClickEvent,
  Pixel,
} from '../types';

export interface BufferProps {
  buffer: ImageData
  setPixel: (pixel: Pixel) => void
}

export const Buffer = (props: BufferProps) => {
  const [reference] = useState(React.createRef<HTMLCanvasElement>());
  const {
    setPixel,
    buffer,
  } = props

  useEffect(() => {
    const canvas = reference.current
    if (!canvas) {
      return
    }
    const handleClick = (event: ClickEvent) => {
      const bounding = canvas.getBoundingClientRect();
      const x = event.clientX - bounding.left;
      const y = event.clientY - bounding.top;
      setPixel({x, y})
    }
    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
    }
  }, [reference, setPixel])

  useEffect(() => {
    const canvas = reference.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        context.putImageData(buffer, 0, 0);
      }
    }

  }, [reference, buffer])

  return (
    <canvas
      height={buffer.height}
      width={buffer.width}
      ref={reference}></canvas>
  )
}
