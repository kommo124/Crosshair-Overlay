import { useEffect, useState } from 'react'
import { DEFAULT_CONFIG, type CrosshairConfig } from '@shared/config'
import { PRESETS, STYLE_LIST } from '@shared/presets'
import { Crosshair } from '../components/Crosshair'
import { CheckboxRow, ColorRow, Section, SliderRow } from '../components/controls'

type PreviewBg = 'dark' | 'light' | 'checker'

const BG_LABELS: Record<PreviewBg, string> = {
  dark: 'Тёмный',
  light: 'Светлый',
  checker: 'Клетка'
}

export function SettingsApp(): JSX.Element | null {
  const [config, setConfig] = useState<CrosshairConfig | null>(null)
  const [previewBg, setPreviewBg] = useState<PreviewBg>('dark')

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
      <main className="left-pane">
        <div className={`preview preview-${previewBg}`}>
          <Crosshair config={config} />
        </div>

        <div className="preview-tools">
          {(Object.keys(BG_LABELS) as PreviewBg[]).map((bg) => (
            <button
              key={bg}
              className={`tool ${previewBg === bg ? 'active' : ''}`}
              onClick={() => setPreviewBg(bg)}
            >
              {BG_LABELS[bg]}
            </button>
          ))}
          <span className="spacer" />
          <button className="tool" onClick={() => update({ visible: !config.visible })}>
            {config.visible ? 'Скрыть оверлей' : 'Показать оверлей'}
          </button>
          <button className="tool danger" onClick={() => update({ ...DEFAULT_CONFIG })}>
            Сбросить
          </button>
        </div>

        <h2 className="pane-title">Пресеты</h2>
        <div className="presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="preset"
              title={preset.name}
              onClick={() => update(preset.config)}
            >
              <span className="thumb">
                <Crosshair
                  config={{
                    ...config,
                    ...preset.config,
                    offset: { x: 0, y: 0 },
                    opacity: 1
                  }}
                />
              </span>
              <span className="preset-name">{preset.name}</span>
            </button>
          ))}
        </div>
      </main>

      <aside className="controls-pane">
        <Section title="Стиль">
          <div className="style-grid">
            {STYLE_LIST.map((style) => (
              <button
                key={style.value}
                className={`thumb style-thumb ${config.style === style.value ? 'active' : ''}`}
                title={style.label}
                onClick={() => update({ style: style.value })}
              >
                <Crosshair
                  config={{
                    ...config,
                    style: style.value,
                    size: 10,
                    thickness: 2,
                    gap: 3,
                    offset: { x: 0, y: 0 },
                    opacity: 1
                  }}
                />
              </button>
            ))}
          </div>
        </Section>

        <Section title="Форма">
          <SliderRow
            label="Размер"
            min={2}
            max={40}
            value={config.size}
            onChange={(v) => update({ size: v })}
          />
          <SliderRow
            label="Толщина"
            min={1}
            max={10}
            value={config.thickness}
            onChange={(v) => update({ thickness: v })}
          />
          <SliderRow
            label="Зазор"
            min={0}
            max={30}
            value={config.gap}
            onChange={(v) => update({ gap: v })}
          />
        </Section>

        <Section title="Цвет">
          <ColorRow label="Цвет" value={config.color} onChange={(v) => update({ color: v })} />
          <SliderRow
            label="Прозрачность"
            min={0.1}
            max={1}
            step={0.05}
            value={config.opacity}
            display={`${Math.round(config.opacity * 100)}%`}
            onChange={(v) => update({ opacity: v })}
          />
        </Section>

        <Section title="Обводка">
          <CheckboxRow
            label="Включена"
            checked={config.outline.enabled}
            onChange={(v) => update({ outline: { ...config.outline, enabled: v } })}
          />
          <ColorRow
            label="Цвет"
            value={config.outline.color}
            onChange={(v) => update({ outline: { ...config.outline, color: v } })}
          />
          <SliderRow
            label="Толщина"
            min={1}
            max={4}
            value={config.outline.width}
            onChange={(v) => update({ outline: { ...config.outline, width: v } })}
          />
        </Section>

        <Section title="Тень">
          <CheckboxRow
            label="Включена"
            checked={config.shadow.enabled}
            onChange={(v) => update({ shadow: { ...config.shadow, enabled: v } })}
          />
          <ColorRow
            label="Цвет"
            value={config.shadow.color}
            onChange={(v) => update({ shadow: { ...config.shadow, color: v } })}
          />
          <SliderRow
            label="Размытие"
            min={0}
            max={10}
            value={config.shadow.blur}
            onChange={(v) => update({ shadow: { ...config.shadow, blur: v } })}
          />
        </Section>

        <Section title="Позиция">
          <SliderRow
            label="Смещение X"
            min={-100}
            max={100}
            value={config.offset.x}
            onChange={(v) => update({ offset: { ...config.offset, x: v } })}
          />
          <SliderRow
            label="Смещение Y"
            min={-100}
            max={100}
            value={config.offset.y}
            onChange={(v) => update({ offset: { ...config.offset, y: v } })}
          />
        </Section>
      </aside>
    </div>
  )
}
