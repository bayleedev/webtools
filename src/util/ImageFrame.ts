import {
  CanvasVideoFrame,
  VideoFrame,
} from '../types';

export class ImageFrame {
  static fromVideoFrame(frame: VideoFrame): ImageData {
    const width = frame.displayWidth;
    const height = frame.displayHeight;
    const tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')!
    tempCanvas.height = height
    tempCanvas.width = width
    tempContext.drawImage(frame as CanvasVideoFrame, 0, 0)
    return tempContext.getImageData(0, 0, width, height)
  }
}
