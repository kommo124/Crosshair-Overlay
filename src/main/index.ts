import { app, BrowserWindow, ipcMain, Menu, screen } from 'electron'
import { join } from 'path'
import { DEFAULT_CONFIG, type CrosshairConfig } from '../shared/config'
import { IPC } from '../shared/ipc'

let overlay: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null
let config: CrosshairConfig = { ...DEFAULT_CONFIG }

function preloadPath(): string {
  return join(__dirname, '../preload/index.js')
}

function rendererUrl(page: string): string {
  if (process.env['ELECTRON_RENDERER_URL']) {
    return `${process.env['ELECTRON_RENDERER_URL']}/${page}`
  }
  return join(__dirname, `../renderer/${page}`)
}

function createOverlayWindow(): void {
  overlay = new BrowserWindow({
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    focusable: false,
    fullscreenable: false,
    minimizable: false,
    maximizable: false,
    skipTaskbar: true,
    hasShadow: false,
    thickFrame: false,
    roundedCorners: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: preloadPath(),
      sandbox: false,
      contextIsolation: true
    }
  })

  overlay.setAlwaysOnTop(true, 'screen-saver')
  overlay.setIgnoreMouseEvents(true, { forward: true })

  const { bounds } = screen.getPrimaryDisplay()
  overlay.setBounds({ x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height })

  const url = rendererUrl('overlay.html')
  if (typeof url === 'string' && url.startsWith('http')) {
    void overlay.loadURL(url)
  } else {
    void overlay.loadFile(url)
  }

  overlay.on('closed', () => {
    overlay = null
  })
}

function createSettingsWindow(): void {
  settingsWindow = new BrowserWindow({
    width: 720,
    height: 640,
    show: false,
    autoHideMenuBar: true,
    title: 'Crosshair Overlay — Settings',
    webPreferences: {
      preload: preloadPath(),
      sandbox: false,
      contextIsolation: true
    }
  })

  settingsWindow.on('ready-to-show', () => {
    settingsWindow?.show()
  })

  settingsWindow.on('closed', () => {
    settingsWindow = null
  })

  const url = rendererUrl('settings.html')
  if (typeof url === 'string' && url.startsWith('http')) {
    void settingsWindow.loadURL(url)
  } else {
    void settingsWindow.loadFile(url)
  }
}

function applyOverlayVisibility(): void {
  if (!overlay) return
  if (config.visible) {
    overlay.showInactive()
  } else {
    overlay.hide()
  }
}

function broadcastConfig(): void {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(IPC.CONFIG_CHANGED, config)
  }
}

function registerIpc(): void {
  ipcMain.handle(IPC.GET_CONFIG, () => config)

  ipcMain.on(IPC.SET_CONFIG, (_event, partial: Partial<CrosshairConfig>) => {
    config = { ...config, ...partial }
    applyOverlayVisibility()
    broadcastConfig()
  })

  ipcMain.on(IPC.TOGGLE_OVERLAY, () => {
    config = { ...config, visible: !config.visible }
    applyOverlayVisibility()
    broadcastConfig()
  })
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null)
  registerIpc()
  createOverlayWindow()
  createSettingsWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow()
      createSettingsWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
