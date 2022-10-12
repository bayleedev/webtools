import React, { useCallback,useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';

import { decodeFile } from '../util/Upload';
import {
  ClipEvent,
  DataTransfer,
  FileFrames,
  SyntheticChangeEvent,
  SyntheticDropEvent,
} from '../types';

import './UploadBox.css';

export interface UploadBoxProps {
  allowedFileType: string|RegExp
  handleUpload: (fileContents: FileFrames) => void
  handleError?: (error: Error) => void
  handleUploadStart?: (start: true) => void
}

export const UploadBox = (props: UploadBoxProps) => {
  const [klasses, setKlasses] = useState<string[]>(['filedrop'])
  const {
    handleError,
    handleUpload,
    handleUploadStart,
    allowedFileType,
  } = props

  const handleDataTransfer = useCallback((dataTransfer: DataTransfer) => {
    if (handleUploadStart) {
      handleUploadStart(true)
    }
    const selectedFile = dataTransfer.files[0]
    if (dataTransfer.files.length > 1 && handleError) {
        handleError(new Error('Only reading 1 file, total: ' + dataTransfer.files.length))
    }
    if (selectedFile.type.match(allowedFileType)) {
      decodeFile(dataTransfer.files[0]).then((fileFrames: FileFrames) => {
        handleUpload(fileFrames)
      })
    }
  }, [allowedFileType, handleUploadStart, handleUpload, handleError])

  useEffect(() => {
    const handlePaste = (e: any|ClipEvent) => {
      handleDataTransfer(e.clipboardData)
    }
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste)
    }
  }, [handleDataTransfer])

  return (
    <>
      <div
        onDrop={(e: SyntheticDropEvent) => {
          if (klasses.includes('active')) {
            setKlasses(['filedrop'])
          }
          handleDataTransfer(e.dataTransfer)
        }}
        onDragOver={() => {
          if (!klasses.includes('active')) {
            setKlasses(['filedrop', 'active'])
          }
        }}
        onDragLeave={() => {
          if (klasses.includes('active')) {
            setKlasses(['filedrop'])
          }
        }}
        className={klasses.join(' ')}>
        <div className="instructions">
          <FiDownload className="drop-icon" />
          <p>Click "Choose File" or drop it here</p>
        </div>
        <input
          onChange={(e: SyntheticChangeEvent) => {
            handleDataTransfer(e.target)
          }}
          type="file" />
      </div>
    </>
  );
}
