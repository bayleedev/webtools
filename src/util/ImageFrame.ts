import {
  CanvasVideoFrame,
  VideoFrame,
} from '../types';

export const VALUES_PER_PIXEL = 4

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

  static inBounds(options: {
    x: number,
    y: number,
    data: { width: number, height: number },
  }): boolean {
    const { height, width } = options.data
    if (options.x <= 0 || options.y <= 0) return false
    if (options.x > width) return false
    if (options.y > height) return false
    return true
  }

  // Gives you the starting index of a pixel given a x,y coordinate
  static pxToIndex(options: {
    x: number,
    y: number,
    data: { width: number, height: number },
  }): number {
    const { width } = options.data
    if (!ImageDataUtil.inBounds(options)) {
      throw new RangeError()
    }
    return (
      (options.x - 1) +
      ((options.y - 1) * width)
    ) * VALUES_PER_PIXEL
  }

  static toCanvas(data: ImageData): HTMLCanvasElement {
    const tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')!
    tempCanvas.height = data.height
    tempCanvas.width = data.width
    tempContext.putImageData(data, 0, 0)
    return tempCanvas
  }

  // prompts the user to save the input canvas as the original format uploaded
  // TODO support frames
  static toFlatPNG(options: {
    type: string,
    name: string,
    data: ImageData,
  }): void {
    const tempCanvas = ImageDataUtil.toCanvas(options.data)
    const dataURL = tempCanvas.toDataURL(options.type);
    const a:HTMLAnchorElement = document.createElement('a')
    a.download = options.name
    a.rel = 'noopener'
    a.href = dataURL
    a.dispatchEvent(new MouseEvent('click'))
  }
}
