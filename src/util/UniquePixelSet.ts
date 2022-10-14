import { Pixel } from '../types';

export class UniquePixelSet {
  iterator: Set<Pixel>
  unique: Map<number, Set<number>>
  constructor (defaultValue?: Pixel[]) {
    this.iterator = new Set<Pixel>(defaultValue)
    this.unique = new Map<number, Set<number>>()
  }

  add (pixel: Pixel, debug = false) {
    const xMap = this.unique.get(pixel.x)
    if (xMap) {
      if (xMap.has(pixel.y)) {
        if (debug) {
          console.log(pixel, xMap)
          debugger
        }
        return false
      } else {
        xMap.add(pixel.y)
      }
    } else {
      this.unique.set(pixel.x, new Set([pixel.y]))
    }
    this.iterator.add(pixel)
    return true
  }
}
