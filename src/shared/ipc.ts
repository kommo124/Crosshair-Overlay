import type { CrosshairConfig } from './config'

export const IPC = {
  GET_CONFIG: 'config:get',
  SET_CONFIG: 'config:set',
  CONFIG_CHANGED: 'config:changed',
  TOGGLE_OVERLAY: 'overlay:toggle'
} as const

export interface OverlayApi {
  getConfig(): Promise<CrosshairConfig>
  setConfig(partial: Partial<CrosshairConfig>): void
  onConfigChanged(cb: (config: CrosshairConfig) => void): () => void
  toggleOverlay(): void
}
