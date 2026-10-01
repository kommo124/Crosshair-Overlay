import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import type { CrosshairConfig } from '../shared/config'
import { IPC, type OverlayApi } from '../shared/ipc'

const api: OverlayApi = {
  getConfig: () => ipcRenderer.invoke(IPC.GET_CONFIG),

  setConfig: (partial) => {
    ipcRenderer.send(IPC.SET_CONFIG, partial)
  },

  toggleOverlay: () => {
    ipcRenderer.send(IPC.TOGGLE_OVERLAY)
  },

  onConfigChanged: (cb) => {
    const listener = (_event: IpcRendererEvent, cfg: CrosshairConfig): void => cb(cfg)
    ipcRenderer.on(IPC.CONFIG_CHANGED, listener)
    return () => {
      ipcRenderer.removeListener(IPC.CONFIG_CHANGED, listener)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)
