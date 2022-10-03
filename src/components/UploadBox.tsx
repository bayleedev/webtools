import React, { useState } from 'react';
import { FiDownload } from 'react-icons/fi';

import './UploadBox.css';
import {
  SyntheticChangeEvent,
  SyntheticDropEvent,
  SyntheticDragEvent,
} from '../types';

export interface UploadBoxProps {
  fileType: string
  handleFile: (fileContents: string) => void
}

declare global {
  interface Window {
    ImageDecoder?: any;
    fullValue: Uint8Array
  }
}

const decodeFile = (file: any): Promise<string> => {
  const reader = file.stream().getReader();
  const items: Uint8Array[] = []
  const processText = ({done, value}: {done: boolean, value: any}) => {
    if (done) {
      const fullValue = items.reduce((memo: Uint8Array, item: Uint8Array): Uint8Array => {
        const nextMemo = new Uint8Array(memo.length + item.length)
        nextMemo.set(memo)
        nextMemo.set(item, memo.length)
        return nextMemo
      }, new Uint8Array())
      const imageDecoder = new window.ImageDecoder({
        type: "image/png",
        data: fullValue,
      })
      return imageDecoder.decode({frameIndex: 0}).then((data: any) => {
        return data.image
      })
    }
    items.push(value)
    return reader.read().then(processText)

  }
  return reader.read().then(processText)
}

export const UploadBox = (props: UploadBoxProps) => {
  const [klasses, setKlasses] = useState<string[]>(['filedrop'])
  const handleDragLeave = (e: SyntheticDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (klasses.includes('active')) {
      setKlasses(['filedrop'])
    }
  };
  const handleDragOver = (e: SyntheticDragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!klasses.includes('active')) {
      setKlasses(['filedrop', 'active'])
    }
  };
  const handleDrop = (e: SyntheticDropEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (klasses.includes('active')) {
      setKlasses(['filedrop'])
    }
    const selectedFile = e.dataTransfer.files[0]

    if (selectedFile.type.match(props.fileType)) {
      decodeFile(e.dataTransfer.files[0]).then((data: string) => {
        props.handleFile(data)
      })
    }
  };
  const handleOnChange = (e: SyntheticChangeEvent) => {
    const selectedFile = e.target.files[0]
    if (selectedFile.type.match(props.fileType)) {
      decodeFile(selectedFile).then((data: string) => {
        props.handleFile(data)
      })
    }
  }

  return (
    <>
      <div
        onDrop={e => handleDrop(e)}
        onDragOver={e => handleDragOver(e)}
        onDragLeave={e => handleDragLeave(e)}
        className={klasses.join(' ')}>
        <div className="instructions">
          <FiDownload className="drop-icon" />
          <p>Click "Choose File" or drop it here</p>
        </div>
        <input
          onChange={handleOnChange}
          type="file" />
      </div>
    </>
  );
}
