import React, { useCallback, useState } from 'react';
import { Buffer } from './Buffer';
import { Pixel } from '../types';
import { ImageDataUtil } from '../util/ImageFrame';
import {
  TransactionalImageData,
  TransactionalImageDataCollection,
} from '../util/TransactionalImageData';
import { MdSaveAlt } from 'react-icons/md';
import { BiCrop } from 'react-icons/bi';
import { GiFairyWand } from 'react-icons/gi';
import { RiGhostSmileLine } from 'react-icons/ri';
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiFillStepBackward,
  AiFillStepForward,
} from 'react-icons/ai';

export interface ImgProps {
  fileName: string
  fileType: string
  repetitionCount: number
  frames: ImageData[]
  setFrames: (frames: ImageData[]) => void
}

export const Img = (props: ImgProps) => {
  const {
    frames,
    setFrames,
    fileName,
    fileType,
  } = props
  const [selectedPixel, _setSelectedPixel] = useState<Pixel>();
  const [selectedFrameIdx, setSelectedFrameIdx] = useState<number>(0);
  const selectedFrame = frames[selectedFrameIdx]
  const setSelectedPixel = (pixel: Pixel) => {
    _setSelectedPixel({
      x: Math.round(pixel.x),
      y: Math.round(pixel.y),
    })
  }

  const deleteColor = useCallback((pixel: Pixel) => {
    const transaction = new TransactionalImageDataCollection(frames)
    const color = transaction.get(selectedFrameIdx).pxToRGBAColor(pixel)
    for (const setter of transaction.findByColor(color)) {
        setter({ alpha: 0 })
    }
    setFrames(transaction.commit())
  }, [selectedFrameIdx, frames, setFrames])

  const deleteMagic = useCallback((pixel: Pixel) => {
    const transaction = new TransactionalImageData(selectedFrame)
    for (const setter of transaction.findRangeByPixel(pixel)) {
        setter({ alpha: 0 })
    }
    setFrames([
      ...frames.slice(0, selectedFrameIdx),
      transaction.commit(),
      ...frames.slice(selectedFrameIdx + 1),
    ])
  }, [selectedFrame, selectedFrameIdx, frames, setFrames])

  const autoCrop = useCallback(() => {
    const transaction = new TransactionalImageData(selectedFrame)
    transaction.autoCrop();
    setFrames([
      ...frames.slice(0, selectedFrameIdx),
      transaction.commit(),
      ...frames.slice(selectedFrameIdx + 1),
    ])
  }, [selectedFrame, selectedFrameIdx, frames, setFrames])

  const save = useCallback(() => {
    ImageDataUtil.toFlatPNG({
      type: fileType,
      name: fileName,
      data: selectedFrame,
    })
  }, [fileType, fileName, selectedFrame])

  return (
    <div className="row">
      {selectedPixel && (
        <div className="col-lg-12 col-12">
          <p>
            Selected Pixel: x {selectedPixel.x}; y {selectedPixel.y}
          </p>
        </div>
      )}
      <div className="col-lg-2 col-2 button-set">
        <button
          onClick={() => {
            if (selectedPixel) {
              deleteColor(selectedPixel)
            }
          }}
          type="button"
          className="btn btn-info"
        >
          <RiGhostSmileLine /> Transparent Selected Color
        </button>
        <button
          onClick={() => {
            if (selectedPixel) {
              deleteMagic(selectedPixel)
            }
          }}
          type="button"
          className="btn btn-info"
        >
          <GiFairyWand /> Transparent Magic Wand
        </button>
        <button
          onClick={() => {
            autoCrop()
          }}
          type="button"
          className="btn btn-info"
        >
          <BiCrop /> Autocrop
        </button>
        <button
          onClick={() => {
            save()
          }}
          type="button"
          className="btn btn-info"
        >
          <MdSaveAlt /> Save
        </button>
      </div>
      <div className="col-lg-10 col-10">
        <Buffer
          buffer={selectedFrame}
          setPixel={setSelectedPixel}
        />
        { frames.length > 1 && (
          <div style={{ width: selectedFrame.width}} className="text-center">
            <AiFillStepBackward onClick={() => {
              setSelectedFrameIdx(0)
            }} />
            <AiFillCaretLeft onClick={() => {
              setSelectedFrameIdx(Math.max(0, selectedFrameIdx - 1))
            }} />
            <span>
              {selectedFrameIdx} / {frames.length - 1}
            </span>
            <AiFillCaretRight onClick={() => {
              setSelectedFrameIdx(Math.min(frames.length - 1, selectedFrameIdx + 1))
            }} />
            <AiFillStepForward onClick={() => {
              setSelectedFrameIdx(frames.length - 1)
            }} />
          </div>
        )}
      </div>
    </div>
  )
}
