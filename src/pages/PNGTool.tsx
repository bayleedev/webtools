import React, { useState } from 'react';

import { ContentBox } from '../components/ContentBox';
import { UploadBox } from '../components/UploadBox';
import { Img } from '../components/Img';
import { ImageDataUtil } from '../util/ImageFrame';
import {
  FileFrames,
  Loading,
  VideoFrame,
} from '../types';
import './PNGTool.css';

export interface PNGToolProps {
}

export const PNGTool = (props: PNGToolProps) => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<Loading>(Loading.Unknown);
  const [frames, setFrames] = useState<ImageData[]>();
  const [repetitionCount, setRepetitionCount] = useState<number>(0);
  const [fileName, setFileName] = useState<string>();
  const [fileType, setFileType] = useState<string>();

  const handleStart = (starting: true) => {
    setLoading(Loading.Loading)
  }

  const handleError = (error: Error) => {
    setError(error)
    setLoading(Loading.Error)
  }

  const onHandleFile = (fileFrames: FileFrames) => {
    setLoading(Loading.Loaded)
    setRepetitionCount(fileFrames.repetitionCount)
    setFileName(fileFrames.name)
    setFileType(fileFrames.type)
    setFrames(fileFrames.data.map((frame: VideoFrame): ImageData => {
      return ImageDataUtil.fromVideoFrame(frame)
    }))
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
        ))}
      </div>
      <>
        {(loading === Loading.Loaded && frames) && (
          <Img
            fileName={fileName!}
            fileType={fileType!}
            repetitionCount={repetitionCount}
            frames={frames}
            setFrames={setFrames}
          />
        )}
      </>
      <>
        {(loading === Loading.Unknown) && (
          <UploadBox
            allowedFileType={/.*/}
            handleUploadStart={handleStart}
            handleUpload={onHandleFile}
            handleError={handleError}
          />
        )}
      </>
    </ContentBox>
  );
}
