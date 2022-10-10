import React, { useEffect, useState } from 'react';
import {
  ClickEvent,
  SelectedPixel,
} from '../types';

export interface BufferProps {
  buffer: ImageData
  setSelectedPixel: (pixel: SelectedPixel) => void
}

export const Buffer = (props: BufferProps) => {
  const [reference] = useState(React.createRef<HTMLCanvasElement>());
  const {
    setSelectedPixel,
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
      setSelectedPixel({x, y})
    }
    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
    }
  }, [reference, setSelectedPixel])

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
