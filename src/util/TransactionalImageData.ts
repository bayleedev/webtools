import {
  ImageDataUtil,
} from '../util/ImageFrame';
import { UniquePixelSet } from './UniquePixelSet';
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

  idxToRGBAColor(start: number): RGBAColor {
    return {
      red: this.data[start + 0],
      green: this.data[start + 1],
      blue: this.data[start + 2],
      alpha: this.data[start + 3],
    }
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

  // TODO color helper
  // TODO support match%
  _colorMatch(a: RGBColor, b: RGBColor): boolean {
    if (a.red !== b.red) {
      return false
    }
    if (a.green !== b.green) {
      return false
    }
    if (a.blue !== b.blue) {
      return false
    }
    return true
  }

  _editPixel(px: Pixel) {
    const pxIdx = this._pxToIdx(px)
    return this._editPixelByIdx(pxIdx)
  }

  _editPixelByIdx(pxIdx: number) {
    return (newColor: Partial<RGBAColor>): void => {
      if (newColor.red !== undefined) {
        this.data[pxIdx + 0] = newColor.red
      }
      if (newColor.green !== undefined) {
        this.data[pxIdx + 1] = newColor.green
      }
      if (newColor.blue !== undefined) {
        this.data[pxIdx + 2] = newColor.blue
      }
      if (newColor.alpha !== undefined) {
        this.data[pxIdx + 3] = newColor.alpha
      }
    }
  }

  *findRangeByPixel(startingPixel: Pixel) {
    const pxSet = new UniquePixelSet([startingPixel])
    const startingColor = this.pxToRGBAColor(startingPixel)
    const imgData = { width: this.width, height: this.height }
    for (const px of pxSet.iterator) {
      if (!ImageDataUtil.inBounds({ ...px, data: imgData })) {
        continue
      }
      const foundColor = this.pxToRGBAColor(px)
      if (this._colorMatch(startingColor, foundColor)) {
        pxSet.add({ x: px.x - 1, y: px.y})
        pxSet.add({ x: px.x + 1, y: px.y})
        pxSet.add({ x: px.x, y: px.y + 1})
        pxSet.add({ x: px.x, y: px.y - 1})
        yield(this._editPixel(px))
      }
    }
  }

  *findByColor(color: RGBColor) {
    const totalPixels = this.data.length / 4
    for (let pixel = 0;pixel < totalPixels;pixel++) {
      const pxIdx = pixel * 4
      const pxColor = this.idxToRGBAColor(pxIdx)
      if (!this._colorMatch(color, pxColor)) {
        continue
      }
      yield(this._editPixelByIdx(pxIdx))
    }
  }

  _pxToIdx(pixel: Pixel): number {
    return ImageDataUtil.pxToIndex({
      ...pixel,
      data: {
        width: this.width,
        height: this.height,
      },
    })
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
