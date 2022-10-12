import {
  CanvasVideoFrame,
  DecodedFrame,
  FileBlob,
  FileFrames,
  VideoFrame,
} from '../types';

export const buildBits = (file: File): Promise<FileBlob> => {
  const fileBits: Uint8Array[] = []
  // TODO typescript thinks we are node and complains about `ReadableStream`
  // which has a different API in Node vs Web.
  const stream: any|ReadableStream = file.stream()
  const reader: ReadableStreamDefaultReader = stream.getReader()
  const combine = (memo: Uint8Array, item: Uint8Array): Uint8Array => {
    const nextMemo = new Uint8Array(memo.length + item.length)
    nextMemo.set(memo)
    nextMemo.set(item, memo.length)
    return nextMemo
  }
  const processText = (result: ReadableStreamReadResult<any>): FileBlob|Promise<FileBlob> => {
    if (result.done) {
      return {
        name: file.name,
        type: file.type,
        data: fileBits.reduce(combine, new Uint8Array())
      }
    } else {
      fileBits.push(result.value)
      return reader.read().then(processText)
    }
  }
  return reader.read().then(processText)
}

export const sleep = (ms: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export const decodeImageFrames = (fileBlob: FileBlob): Promise<FileFrames> => {
  const imageDecoder = new window.ImageDecoder(fileBlob)
  return imageDecoder.completed.then(() => {
    // wait until frameCount actually shows up
    let count = 0
    const ensureSelectedTrack = (): Promise<undefined>|undefined => {
      count++
      if (!imageDecoder.tracks.selectedTrack) {
        if (count > 10) {
          throw new Error('Unable to detect frameCount')
        }
        return sleep(1).then(ensureSelectedTrack)
      } else {
        return undefined
      }
    }
    return ensureSelectedTrack()
  }).then(() => {
    const imageFrameCount = imageDecoder.tracks.selectedTrack.frameCount
    const imageFrames: Promise<VideoFrame>[] = []
    for (let frameIdx = 0;frameIdx < imageFrameCount; frameIdx++) {
      imageFrames.push(
        imageDecoder.decode({frameIndex: frameIdx}).then((frame: DecodedFrame) => {
          return frame.image
        })
      )
    }
    return Promise.all(imageFrames).then((videoFrames: VideoFrame[]): FileFrames => {
      return {
        name: fileBlob.name,
        type: fileBlob.type,
        repetitionCount: imageDecoder.tracks.selectedTrack.repetitionCount,
        data: videoFrames as CanvasVideoFrame[]
      }
    })
  })
}

export const checkFile = (file: File): Promise<boolean> => {
  return window.ImageDecoder.isTypeSupported(file.type)
}

export const decodeFile = (file: File): Promise<FileFrames> => {
  return checkFile(file).then(() => {
    return buildBits(file).then(decodeImageFrames)
  })
}
