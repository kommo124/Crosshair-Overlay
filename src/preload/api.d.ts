import type { OverlayApi } from '../shared/ipc'

declare global {
  interface Window {
    api: OverlayApi
  }
}

export {}
