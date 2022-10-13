import {
  VALUES_PER_PIXEL,
} from '../util/ImageFrame';
import {
  RGBAColor,
  RGBColor,
  Pixel,
} from '../types';

export class TransactionalImageData {
  data: Uint8ClampedArray
  width: number
  height: number

  constructor (frame: ImageData) {
    this.data = frame.data
    this.width = frame.width
    this.height = frame.height
  }

  commit (): ImageData {
    return new ImageData(
      this.data,
      this.width,
      this.height,
    )
  }

  pxToRGBAColor(pixel: Pixel): RGBAColor {
    const start = this._pxToIdx(pixel)
    return {
      red: this.data[start + 0],
      green: this.data[start + 1],
      blue: this.data[start + 2],
      alpha: this.data[start + 3],
    }
  }

  *findByColor(color: RGBColor) {
    const totalPixels = this.data.length / 4
    for (let pixel = 0;pixel < totalPixels;pixel++) {
      const pxIdx = pixel * 4
      if (color.red !== this.data[pxIdx + 0]) {
        continue
      }
      if (color.green !== this.data[pxIdx + 1]) {
        continue
      }
      if (color.blue !== this.data[pxIdx + 2]) {
        continue
      }
      yield((yieldOptions: Partial<RGBAColor>): void => {
        if (yieldOptions.red !== undefined) {
          this.data[pxIdx + 0] = yieldOptions.red
        }
        if (yieldOptions.green !== undefined) {
          this.data[pxIdx + 1] = yieldOptions.green
        }
        if (yieldOptions.blue !== undefined) {
          this.data[pxIdx + 2] = yieldOptions.blue
        }
        if (yieldOptions.alpha !== undefined) {
          this.data[pxIdx + 3] = yieldOptions.alpha
        }
      })
    }
  }

  _pxToIdx(pixel: Pixel): number {
    if (pixel.x <= 0 || pixel.y <= 0) throw new RangeError()
    if (pixel.x > this.width) throw new RangeError()
    if (pixel.y > this.height) throw new RangeError()
    return (
      (pixel.x - 1) +
      ((pixel.y - 1) * this.width)
    ) * VALUES_PER_PIXEL
  }
}

export class TransactionalImageDataCollection {
  frames: TransactionalImageData[]

  constructor (frames: ImageData[]) {
    this.frames = frames.map((frame: ImageData): TransactionalImageData => {
      return new TransactionalImageData(frame)
    })
  }

  get (idx: number): TransactionalImageData {
    if (idx >= 0 && idx < this.frames.length) {
      return this.frames[idx]
    }
    throw RangeError()
  }

  safeGet <R>(idx: number, fallback: R): TransactionalImageData|R {
    if (idx >= 0 && idx < this.frames.length) {
      return this.frames[idx]
    }
    return fallback
  }

  pxToRGBAColor(pixel: Pixel): RGBAColor[] {
    return this.frames.map((frame: TransactionalImageData): RGBAColor => {
      return frame.pxToRGBAColor(pixel)
    })
  }

  *findByColor(color: RGBColor) {
    for (const frame of this.frames) {
      for (const setter of frame.findByColor(color)) {
        yield setter
      }
    }
  }

  commit (): ImageData[] {
    return this.frames.map((frame: TransactionalImageData): ImageData => {
      return frame.commit()
    })
  }
}
