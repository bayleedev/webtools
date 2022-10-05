import {
  DecodedFrame,
  FileBlob,
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

export const decodeImageFrames = (fileBlob: FileBlob): Promise<VideoFrame[]> => {
  const imageDecoder = new window.ImageDecoder(fileBlob)
  const selectedTrack = imageDecoder.tracks.selectedTrack
  const imageFrameCount = selectedTrack ? selectedTrack.frameCount : 1
  const imageFrames: Promise<VideoFrame>[] = []
  for (let frameIdx = 0;frameIdx < imageFrameCount; frameIdx++) {
    imageFrames.push(
      imageDecoder.decode({frameIndex: frameIdx}).then((frame: DecodedFrame) => {
        return frame.image
      })
    )
  }
  return Promise.all(imageFrames)
}

export const checkFile = (file: File): Promise<boolean> => {
  return window.ImageDecoder.isTypeSupported(file.type)
}

export const decodeFile = (file: File): Promise<VideoFrame[]> => {
  return checkFile(file).then(() => {
    return buildBits(file).then(decodeImageFrames)
  })
}
