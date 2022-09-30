import React, { useState } from 'react';
import './UploadBox.css';
import {
  SyntheticChangeEvent,
  SyntheticDropEvent,
  SyntheticEvent
} from '../types';

export interface UploadBoxProps {
  handleFile: (fileContents: string) => void
}

export const UploadBox = (props: UploadBoxProps) => {
  const [klasses, setKlasses] = useState<string[]>(['filedrop'])
  const decodeFile = (file: any): Promise<string> => {
    const reader = file.stream().getReader();
    return reader.read().then(({done, value}: {done: boolean, value: any}) => {
      if (!done) {
        console.error("I never made it this far...")
      }
      return new TextDecoder().decode(value)
    })
  }
  const handleDragLeave = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (klasses.includes('active')) {
      setKlasses(['filedrop'])
    }
  };
  const handleDragOver = (e: SyntheticEvent) => {
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
    const isFile = e.dataTransfer.types[0] === 'Files'
    if (!isFile) return
    decodeFile(e.dataTransfer.files[0]).then((data: string) => {
      props.handleFile(data)
    })
  };
  const handleOnChange = (e: SyntheticChangeEvent) => {
    var selectedFile = e.target.files[0];
    if (selectedFile.type.match("text/calendar")) {
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
        <input
          onChange={handleOnChange}
          type="file" />
      </div>
    </>
  );
}
