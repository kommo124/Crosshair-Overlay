import type { CrosshairConfig, CrosshairStyle } from './config'

export interface StyleOption {
  value: CrosshairStyle
  label: string
}

export const STYLE_LIST: StyleOption[] = [
  { value: 'cross', label: 'Крест' },
  { value: 'dot', label: 'Точка' },
  { value: 'tcross', label: 'T-крест' },
  { value: 'circle', label: 'Круг' },
  { value: 'x', label: 'X' },
  { value: 'dot-circle', label: 'Точка + круг' },
  { value: 'cross-dot', label: 'Крест + точка' },
  { value: 'chevron', label: 'Стрелка' }
]

export interface Preset {
  name: string
  config: Partial<CrosshairConfig>
}

export const PRESETS: Preset[] = [
  {
    name: 'Классика',
    config: { style: 'cross', size: 12, thickness: 2, gap: 4, color: '#00ff00' }
  },
  {
    name: 'Точка',
    config: { style: 'dot', size: 6, thickness: 2, gap: 0, color: '#00ffff' }
  },
  {
    name: 'Микроточка',
    config: { style: 'dot', size: 3, thickness: 1, gap: 0, color: '#ffffff' }
  },
  {
    name: 'Круг',
    config: { style: 'circle', size: 14, thickness: 2, gap: 0, color: '#ff00ff' }
  },
  {
    name: 'Круг + точка',
    config: { style: 'dot-circle', size: 14, thickness: 2, gap: 0, color: '#00ffff' }
  },
  {
    name: 'T-крест',
    config: { style: 'tcross', size: 12, thickness: 2, gap: 3, color: '#00ff00' }
  },
  {
    name: 'Крест + точка',
    config: { style: 'cross-dot', size: 10, thickness: 2, gap: 5, color: '#ffff00' }
  },
  {
    name: 'Икс',
    config: { style: 'x', size: 12, thickness: 2, gap: 2, color: '#ff3030' }
  },
  {
    name: 'Стрелка',
    config: { style: 'chevron', size: 10, thickness: 2, gap: 6, color: '#00ff00' }
  },
  {
    name: 'Неон',
    config: {
      style: 'cross',
      size: 16,
      thickness: 3,
      gap: 6,
      color: '#ff10f0',
      shadow: { enabled: true, blur: 6, color: '#ff10f0' }
    }
  }
]
