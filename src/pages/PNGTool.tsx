import React, { useEffect, useState } from 'react';

import { ContentBox } from '../components/ContentBox';
import { UploadBox } from '../components/UploadBox';
import { ClickEvent, Loading, VideoFrame, CanvasVideoFrame } from '../types';
import './PNGTool.css';

export interface PNGToolProps {
}

class PNGFaye {
  canvas: HTMLCanvasElement
  fileContents: CanvasVideoFrame
  context: CanvasRenderingContext2D | null

  constructor (canvas: HTMLCanvasElement, fileContents: CanvasVideoFrame) {
    this.canvas = canvas
    this.fileContents = fileContents
    this.context = this.canvas.getContext('2d')
  }

  draw () {
    if (!this.context) {
      throw Error('Context not found')
    }
    this.canvas.width = this.fileContents.displayWidth;
    this.canvas.height = this.fileContents.displayHeight;
    this.context.drawImage(this.fileContents,0,0);
  }

  save () {
    const dataURL = this.canvas.toDataURL("image/png"); // TODO get real type
    let step = 1
    if (step === 1) {
      var a:any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      a.download = 'download.png' // TODO get real filename
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

  deleteColor (pixel: SelectedPixel) {
    if (!this.context) {
      throw Error('Context not found')
    }
    const deletePixel:ImageData = this.context.getImageData(pixel.x, pixel.y, 1, 1);
    const deleteColor:Uint8ClampedArray = deletePixel.data
    for (let width = 0; width < this.fileContents.displayWidth;width++) {
      for (let height = 0; height < this.fileContents.displayHeight;height++) {
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

  const onHandleFile = (fileFrames: any|VideoFrame) => {
    setLoading(Loading.Loaded)
    const fileContents: CanvasVideoFrame = fileFrames
    const canvas = reference.current
    if (canvas) {
      const faye = new PNGFaye(canvas, fileContents)
      faye.draw()
      setFaye(faye)
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
          <div className="buttons">
            { selectedPixel && (<p>Selected: x: {selectedPixel.x};x: {selectedPixel.y}</p>) }
            <button
              onClick={() => {
                if (faye && selectedPixel) {
                  faye.deleteColor(selectedPixel)
                }
              }}
              type="button"
              className="btn btn-primary"
            >
              Make selected transparent
            </button>
            <button
              onClick={() => {
                faye && faye.save()
              }}
              type="button"
              className="btn btn-primary"
            >
              Save
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
          <canvas
            id={"viewport"}
            ref={reference}></canvas>
        )}
      </>
    </ContentBox>
  );
}
