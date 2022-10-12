import {
  CanvasVideoFrame,
  VideoFrame,
} from '../types';

export class ImageDataUtil {
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

  static toCanvas(data: ImageData): HTMLCanvasElement {
    const tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')!
    tempCanvas.height = data.height
    tempCanvas.width = data.width
    tempContext.putImageData(data, 0, 0)
    return tempCanvas
  }

  static toFlatPNG(options: {
    type: string,
    name: string,
    data: ImageData
  }): void {
    const tempCanvas = ImageDataUtil.toCanvas(options.data)
    const dataURL = tempCanvas.toDataURL(options.type);
    var a:any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
    a.download = options.name
    a.rel = 'noopener'
    a.href = dataURL
    a.dispatchEvent(new MouseEvent('click'))
  }
}
