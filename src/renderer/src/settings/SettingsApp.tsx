import { useEffect, useState } from 'react'
import type { CrosshairConfig, CrosshairStyle } from '@shared/config'
import { Crosshair } from '../components/Crosshair'

export function SettingsApp(): JSX.Element | null {
  const [config, setConfig] = useState<CrosshairConfig | null>(null)

  useEffect(() => {
    let mounted = true
    void window.api.getConfig().then((cfg) => {
      if (mounted) setConfig(cfg)
    })
    const unsubscribe = window.api.onConfigChanged((cfg) => setConfig(cfg))
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  if (!config) return null

  const update = (partial: Partial<CrosshairConfig>): void => {
    setConfig((prev) => (prev ? { ...prev, ...partial } : prev))
    window.api.setConfig(partial)
  }

  return (
    <div className="settings-root">
      <h1>Crosshair Overlay</h1>
      <p className="hint">Заготовка — полный редактор появится на этапе 4</p>

      <div className="preview">
        <Crosshair config={config} />
      </div>

      <label>
        Стиль
        <select
          value={config.style}
          onChange={(e) => update({ style: e.target.value as CrosshairStyle })}
        >
          <option value="cross">Крест</option>
          <option value="dot">Точка</option>
          <option value="tcross">T-крест</option>
          <option value="circle">Круг</option>
        </select>
      </label>

      <label>
        Размер
        <input
          type="range"
          min={2}
          max={40}
          value={config.size}
          onChange={(e) => update({ size: Number(e.target.value) })}
        />
      </label>

      <label>
        Толщина
        <input
          type="range"
          min={1}
          max={10}
          value={config.thickness}
          onChange={(e) => update({ thickness: Number(e.target.value) })}
        />
      </label>

      <label>
        Зазор
        <input
          type="range"
          min={0}
          max={30}
          value={config.gap}
          onChange={(e) => update({ gap: Number(e.target.value) })}
        />
      </label>

      <label>
        Цвет
        <input
          type="color"
          value={config.color}
          onChange={(e) => update({ color: e.target.value })}
        />
      </label>

      <label className="checkbox">
        <input type="checkbox" checked={config.visible} onChange={() => window.api.toggleOverlay()} />
        Показывать оверлей
      </label>
    </div>
  )
}
