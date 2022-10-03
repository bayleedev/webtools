import React, { useState } from 'react';

import { ContentBox } from '../components/ContentBox';
import { UploadBox } from '../components/UploadBox';

export interface PNGToolProps {
}

// new stuff
interface Ctx {
  drawImage: (img: any, width: number, height: number) => void
}

interface Foo extends HTMLElement {
  getContext?: (a: string) => Ctx
  width?: number
  height?: number
  save?: () => void
}

export const PNGTool = (props: PNGToolProps) => {
  const [reference] = useState(React.createRef<HTMLCanvasElement>());
  const onHandleFile = (fileContents: any) => {
    const canvas = reference.current
    if (canvas) {
      canvas.width = fileContents.displayWidth;
      canvas.height = fileContents.displayHeight;
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(fileContents,0,0);
        const topLeft = ctx.getImageData(0, 0, 1, 1)
        for (let width = 0; width < fileContents.displayWidth;width++) {
          for (let height = 0; height < fileContents.displayHeight;height++) {
            const id = ctx.getImageData(width, height, 1, 1)
            const hasR = id.data[0] === topLeft.data[0]
            const hasG = id.data[1] === topLeft.data[1]
            const hasB = id.data[2] === topLeft.data[2]
            if (hasR && hasG && hasB) {
              id.data[3] = 0
              ctx.putImageData(id, width, height)
            }
          }
        }
      }
      const dataURL = canvas.toDataURL("image/png");
      let step = 1
      if (step === 1) {
        var a:any = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        a.download = 'download.png'
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
      <canvas
        id={"viewport"}
        ref={reference}></canvas>
      <UploadBox
        fileType={"image/png"}
        handleFile={onHandleFile}
      />
    </ContentBox>
  );
}
