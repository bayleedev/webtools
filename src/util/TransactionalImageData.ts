import {
  VALUES_PER_PIXEL,
  ImageDataUtil,
} from '../util/ImageFrame';
import { UniquePixelSet } from './UniquePixelSet';
import {
  RGBAColor,
  RGBColor,
  Pixel,
} from '../types';

export type Bounds = {
  maxX: number
  maxY: number
  minX: number
  minY: number
}

export type CropBounds = Bounds & {
  height: number
  width: number
}

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

  _isColEmpty (x: number): boolean {
    if (x > this.width) {
      throw RangeError()
    }
    for(let y = 0; y < this.height; y++) {
      const { alpha } = this.pxToRGBAColor({ y, x })
      if (alpha > 0) {
        return false
      }
    }
    return true
  }

  _isRowEmpty (y: number): boolean {
    if (y > this.height) {
      throw RangeError()
    }
    for(let x = 0; x < this.width; x++) {
      const { alpha } = this.pxToRGBAColor({ y, x })
      if (alpha > 0) {
        return false
      }
    }
    return true
  }

  autoCrop () {
    const cropBounds = this.getOpaqueBounds()
    return this.crop(cropBounds);
  }

  crop (cropBounds: CropBounds) {
    const newDataSize = cropBounds.height * cropBounds.width * VALUES_PER_PIXEL
    const newData: Uint8ClampedArray = new Uint8ClampedArray(newDataSize)
    for (let y = cropBounds.maxY; y < cropBounds.minY; y++) {
      const nextIdx = (cropBounds.maxY - y) * cropBounds.width * VALUES_PER_PIXEL
      const prevStartIdx = this._pxToIdx({y, x: cropBounds.minX})
      const prevEndIdx = prevStartIdx + cropBounds.width
      newData.set(this.data.slice(prevStartIdx, prevEndIdx), nextIdx);
    }
    this.height = cropBounds.height
    this.width = cropBounds.width
    this.data = newData
  }

  getOpaqueBounds (): CropBounds {
    const bounds: Bounds = {
      minX: 0,
      minY: 0,
      maxX: this.width - 1,
      maxY: this.height - 1,
    }

    // Get left bounds
    for(let x = 0; x < this.width; x++) {
      if (this._isColEmpty(x)) {
        bounds.minX = x
      } else {
        break
      }
    }

    // Get right bounds
    for(let x = this.width - 1; x >= 0; x--) {
      if (this._isColEmpty(x)) {
        bounds.maxX = x
      } else {
        break
      }
    }

    // Get top bounds
    for(let y = 0; y < this.height; y++) {
      if (this._isRowEmpty(y)) {
        bounds.minY = y
      } else {
        break
      }
    }

    // Get bottom bounds
    for(let y = this.height - 1; y >= 0; y--) {
      if (this._isRowEmpty(y)) {
        bounds.maxY = y
      } else {
        break
      }
    }

    return {
      ...bounds,
      height: (bounds.maxX - bounds.minX) + 1,
      width: (bounds.maxY - bounds.minY) + 1,
    }
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
