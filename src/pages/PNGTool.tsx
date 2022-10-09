import React, { useEffect, useState } from 'react';

import { ContentBox } from '../components/ContentBox';
import { UploadBox } from '../components/UploadBox';
import {
  ClickEvent,
  FileFrames,
  Loading,
} from '../types';
import { MdSaveAlt } from 'react-icons/md';
import { BiCrop } from 'react-icons/bi';
import { GiFairyWand } from 'react-icons/gi';
import { RiGhostSmileLine } from 'react-icons/ri';
import './PNGTool.css';

export interface PNGToolProps {
}

class PNGFaye {
  height: number
  width: number
  canvas: HTMLCanvasElement
  fileFrames: FileFrames
  context: CanvasRenderingContext2D | null

  constructor (canvas: HTMLCanvasElement, fileFrames: FileFrames) {
    // Setup
    this.fileFrames = fileFrames
    this.canvas = canvas
    this.width = this.canvas.width = this.fileFrames.data[0].displayWidth;
    this.height = this.canvas.height = this.fileFrames.data[0].displayHeight;
    this.context = this.canvas.getContext('2d', {
      willReadFrequently: true
    })
    // Draw single frame
    if (this.context) {
      this.context.drawImage(this.fileFrames.data[0],0,0);
    }
    /*
    // Draw Animation
    let i = 0
    const intervalId = setInterval(() => {
      if (this.context) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(this.fileFrames.data[i++ % this.fileFrames.data.length],0,0);
      } else {
        clearInterval(intervalId)
      }
    }, 100)
    */
  }

  save () {
    const dataURL = this.canvas.toDataURL(this.fileFrames.type); // TODO get real type
    let step = 1
    if (step === 1) {
      var a:any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      a.download = this.fileFrames.name
      a.rel = 'noopener'
      a.href = dataURL
      a.dispatchEvent(new MouseEvent('click'))
    }
    if (step === 3) {
      const newTab = window.open('about:blank','image from canvas')
      if (newTab) {
        newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
      }
    }
  }

  inBounds (pixel: SelectedPixel) {
    if (pixel.x >= 0 && pixel.x <= this.width) {
      if (pixel.y >= 0 && pixel.y <= this.height) {
        return true
      }
    }
    return false
  }

  // crop if all transparent
  autoCrop () {
    const toCrop: {
      top?: number
      bottom?: number
      left?: number
      right?: number
    }= {}
    if (!this.context) {
      throw Error('Context not found')
    }
    // left bar
    for (let x = 0;x<this.width;x++) {
      let isFullyTransparent = true
      for (let y = 0;y<this.height;y++) {
        const px:ImageData = this.context.getImageData(x, y, 1, 1)
        if (px.data[3] !== 0) {
          isFullyTransparent = false
          break
        }
      }
      if (isFullyTransparent) {
        toCrop.left = x
      } else {
        if (!toCrop.left && toCrop.left !== 0) {
          toCrop.left = -1 // 0, 0 is first pixel
        }
        break
      }
    }
    // top bar
    for (let y = 0;y<this.height;y++) {
      let isFullyTransparent = true
      for (let x = 0;x<this.width;x++) {
        const px:ImageData = this.context.getImageData(x, y, 1, 1)
        if (px.data[3] !== 0) {
          isFullyTransparent = false
          break
        }
      }
      if (isFullyTransparent) {
        toCrop.top = y
      } else {
        if (!toCrop.top && toCrop.top !== 0) {
          toCrop.top = -1 // 0,0 is first pixel
        }
        break
      }
    }
    // right bar
    for (let x = this.width;x>0;x--) {
      let isFullyTransparent = true
      for (let y = 0;y<this.height;y++) {
        const px:ImageData = this.context.getImageData(x, y, 1, 1)
        if (px.data[3] !== 0) {
          isFullyTransparent = false
          break
        }
      }
      if (isFullyTransparent) {
        if (toCrop.right) {
          toCrop.right = Math.min(toCrop.right, x)
        } else {
          toCrop.right = x
        }
      } else {
        if (!toCrop.right) {
          toCrop.right = this.width
        }
        break
      }
    }
    // bottom bar
    for (let y = this.height;y>0;y--) {
      let isFullyTransparent = true
      for (let x = 0;x<this.width;x++) {
        const px:ImageData = this.context.getImageData(x, y, 1, 1)
        if (px.data[3] !== 0) {
          isFullyTransparent = false
          break
        }
      }
      if (isFullyTransparent) {
        if (toCrop.bottom) {
          toCrop.bottom = Math.min(toCrop.bottom, y)
        } else {
          toCrop.bottom = y
        }
      } else {
        if (!toCrop.bottom) {
          toCrop.bottom = this.height
        }
        break
      }
    }

    const sourceX = toCrop.top! + 1
    const sourceY = toCrop.top! + 1
    const sourceW = toCrop.right! - toCrop.left! - 1
    const sourceH = toCrop.bottom! - toCrop.top! - 1
    const destinationX = 0
    const destinationY = 0
    const destinationW = sourceW
    const destinationH = sourceH

    const tempCanvas = document.createElement('canvas')
    const tempContext = tempCanvas.getContext('2d')!
    tempCanvas.width = sourceW
    tempCanvas.height = sourceH
    tempContext.drawImage(this.canvas, sourceX, sourceY, sourceW, sourceH,
        destinationX, destinationY, destinationW, destinationH);

    this.width = this.canvas.width = sourceW
    this.height = this.canvas.height = sourceH
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(tempCanvas, 0, 0)
  }

  deleteMagic (pixelNeedle: SelectedPixel) {
    if (!this.context) {
      throw Error('Context not found')
    }
    if (!this.inBounds(pixelNeedle)) {
      return false
    }
    const colorMatches = (a: ImageData, b: ImageData) => {
      if (a.data[0] !== b.data[0]) return false
      if (a.data[1] !== b.data[1]) return false
      if (a.data[2] !== b.data[2]) return false
      return true
    }
    class UniquePixelSet {
      iterator: Set<SelectedPixel>
      unique: Map<number, Set<number>>
      constructor () {
        this.iterator = new Set<SelectedPixel>()
        this.unique = new Map<number, Set<number>>()
      }

      add (pixel: SelectedPixel) {
        const xMap = this.unique.get(pixel.x)
        if (xMap) {
          if (xMap.has(pixel.y)) {
            return
          } else {
            xMap.add(pixel.y)
          }
        } else {
          this.unique.set(pixel.x, new Set([pixel.y]))
        }
        this.iterator.add(pixel)
      }
    }
    const pxIterator = new UniquePixelSet()
    const colorToMatch: ImageData = this.context.getImageData(pixelNeedle.x, pixelNeedle.y, 1, 1)
    pxIterator.add(pixelNeedle)
    for (const pixel of pxIterator.iterator) {
      if (!this.inBounds(pixel)) {
        continue
      }
      const pixelColor: ImageData = this.context.getImageData(pixel.x, pixel.y, 1, 1)
      if (colorMatches(pixelColor, colorToMatch)) {
        pixelColor.data[3] = 0
        this.context.putImageData(pixelColor, pixel.x, pixel.y)
        pxIterator.add({ x: pixel.x - 1, y: pixel.y})
        pxIterator.add({ x: pixel.x + 1, y: pixel.y})
        pxIterator.add({ x: pixel.x, y: pixel.y + 1})
        pxIterator.add({ x: pixel.x, y: pixel.y - 1})
      }
    }
  }

  deleteColor (pixel: SelectedPixel) {
    if (!this.context) {
      throw Error('Context not found')
    }
    const deletePixel:ImageData = this.context.getImageData(pixel.x, pixel.y, 1, 1);
    const deleteColor:Uint8ClampedArray = deletePixel.data
    for (let width = 0; width < this.width;width++) {
      for (let height = 0; height < this.height;height++) {
        const currentPixel:ImageData = this.context.getImageData(width, height, 1, 1);
        const color:Uint8ClampedArray = currentPixel.data
        const hasR = color[0] === deleteColor[0]
        const hasG = color[1] === deleteColor[1]
        const hasB = color[2] === deleteColor[2]
        if (hasR && hasG && hasB) {
          color[3] = 0
          this.context.putImageData(currentPixel, width, height)
        }
      }
    }
  }
}

type SelectedPixel = {
  x: number
  y: number
}

export const PNGTool = (props: PNGToolProps) => {
  const [reference] = useState(React.createRef<HTMLCanvasElement>());
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<Loading>(Loading.Unknown);
  const [faye, setFaye] = useState<PNGFaye>();
  const [selectedPixel, setSelectedPixel] = useState<SelectedPixel>();

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
  }, [loading, reference])

  const handleStart = (starting: true) => {
    setLoading(Loading.Loading)
  }

  const handleError = (error: Error) => {
    setError(error)
    setLoading(Loading.Error)
  }

  const onHandleFile = (fileFrames: FileFrames) => {
    setLoading(Loading.Loaded)
    const canvas = reference.current
    if (canvas) {
      setFaye(new PNGFaye(canvas, fileFrames))
    }
  }

  return (
    <ContentBox
      widthLg={12}
      widthMd={12}
      title={
        <>
          <span>PNG Tools</span>
        </>
      }
    >
      <div>
        {((loading === Loading.Unknown) &&  (
          <p>Upload a file to begin.</p>
        )) || ((loading === Loading.Error) && (
          <p>{error ? error.message : 'An unknown error has occured'}</p>
        )) || ((loading === Loading.Loading) && (
          <p>Loading...</p>
        )) || ((loading === Loading.Loaded) && (
          <div className="button-set">
            <button
              onClick={() => {
                if (faye && selectedPixel) {
                  faye.deleteColor(selectedPixel)
                }
              }}
              type="button"
              className="btn btn-info"
            >
              <RiGhostSmileLine /> Transparent Selected Color
            </button>
            <button
              onClick={() => {
                if (faye && selectedPixel) {
                  faye.deleteMagic(selectedPixel)
                }
              }}
              type="button"
              className="btn btn-info"
            >
              <GiFairyWand /> Transparent Magic Wand
            </button>
            <button
              onClick={() => {
                if (faye) {
                  faye.autoCrop()
                }
              }}
              type="button"
              className="btn btn-info"
            >
              <BiCrop /> Autocrop
            </button>
            <button
              onClick={() => {
                faye && faye.save()
              }}
              type="button"
              className="btn btn-info"
            >
              <MdSaveAlt /> Save
            </button>
          </div>
        ))}
      </div>
      <>
        {(loading === Loading.Unknown) ? (
          <UploadBox
            allowedFileType={/.*/}
            handleUploadStart={handleStart}
            handleUpload={onHandleFile}
            handleError={handleError}
          />
        ) : (
          <>
            <canvas
              id={"viewport"}
              ref={reference}></canvas>
            { selectedPixel ? (
              <p>Selected: x: {selectedPixel.x};x: {selectedPixel.y}</p>
            ) : (
              <p>Selected <span className="text-danger">Click a pixel to make a selection</span></p>
            )}
          </>
        )}
      </>
    </ContentBox>
  );
}
