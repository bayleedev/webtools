import React from 'react';

declare global {
  interface Window {
    ImageDecoder?: any;
  }
}

export enum Loading {
  Unknown,
  Error,
  Loading,
  Loaded,
}

export interface SyntheticEvent<T> extends React.FormEvent<T> {
  preventDefault: () => void
  stopPropagation: () => void
}

export interface SyntheticDropEvent extends SyntheticEvent<HTMLDivElement> {
  dataTransfer: DataTransfer
}

export interface ClickEvent extends Event {
  clientX: number
  clientY: number
}

export interface SyntheticChangeEvent extends SyntheticEvent<HTMLInputElement> {
  target: any
  dataTransfer: DataTransfer
}

export type DataTransfer = {
  types: readonly string[]
  files: any
}

export type GoogleCalendarLink = {
  action: string
  startTime: string
  endTime: string
  details: string
  location: string
  text: string
}

export type ClipEvent = {
  clipboardData: DataTransfer
}

// https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame/copyTo
export type CopyToOptions = {
  rect?: {
    x?: number
    y?: number
    width?: number
    height?: number
  }
  layout?: {
    offset?: number
    stride?: number
  }
}

export type RGBAColor = {
  red: number
  green: number
  blue: number
  alpha: number
}

export type RGBColor = Pick<RGBAColor, 'red'|'green'|'blue'>

export type VideoFrame = {
  readonly format?: string
  readonly codedWidth: number
  readonly codedHeight: number
  readonly codedRect?: DOMRectReadOnly
  readonly visibleRect?: DOMRectReadOnly
  readonly displayWidth: number
  readonly displayHeight: number
  readonly duration?: number  // microseconds
  readonly timestamp?: number // microseconds
  readonly colorSpace: VideoColorSpace
  clone(): VideoFrame
  copyTo(buffer: any, options?: CopyToOptions): Promise<any>
  close(): void
  allocationSize(options?: CopyToOptions): number
}

// To get around some canvas specific issues
export type CanvasVideoFrame = VideoFrame & {
  readonly width: number
  readonly height: number
}

export type DecodedFrame = {
  complete: true
  image: VideoFrame
}

export type ReadableStreamReadResult<T> = {
  done: false
  value: T
} | {
  done: true
  value: undefined
}

export type FileBase = {
  name: string
  type: string
}

export type FileBlob = FileBase & {
  data: Uint8Array
}

export type Pixel = {
  x: number
  y: number
}

export type FileFrames = FileBase & {
  repetitionCount: number
  data: CanvasVideoFrame[]
}
