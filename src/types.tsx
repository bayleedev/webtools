export interface SyntheticEvent {
  preventDefault: () => void
  stopPropagation: () => void
}

export interface SyntheticDropEvent extends SyntheticEvent {
  dataTransfer: {
    types: readonly string[]
    files: any
  }
}

export interface SyntheticChangeEvent extends SyntheticEvent {
  target: {
    files: any
  }
}

export interface GoogleCalendarLink {
  action: string
  startTime: string
  endTime: string
  details: string
  location: string
  text: string
}
