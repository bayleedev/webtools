import React from 'react';
export interface SyntheticEvent<T> extends React.FormEvent<T> {
  preventDefault: () => void
  stopPropagation: () => void
}

export interface SyntheticDragEvent extends SyntheticEvent<HTMLDivElement> {
}

export interface SyntheticDropEvent extends SyntheticEvent<HTMLDivElement> {
  dataTransfer: {
    types: readonly string[]
    files: any
  }
}

export interface SyntheticChangeEvent extends SyntheticEvent<HTMLInputElement> {
  target: any
}

export interface GoogleCalendarLink {
  action: string
  startTime: string
  endTime: string
  details: string
  location: string
  text: string
}
