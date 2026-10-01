export type CrosshairStyle = 'dot' | 'cross' | 'tcross' | 'circle'

export interface CrosshairConfig {
  visible: boolean
  style: CrosshairStyle
  /** Длина луча / диаметр точки, px */
  size: number
  /** Толщина линий, px */
  thickness: number
  /** Отступ от центра до начала луча, px */
  gap: number
  /** HEX-цвет */
  color: string
  /** 0..1 */
  opacity: number
  outline: {
    enabled: boolean
    color: string
    /** px */
    width: number
  }
  /** Смещение от центра экрана, px */
  offset: {
    x: number
    y: number
  }
}

export const DEFAULT_CONFIG: CrosshairConfig = {
  visible: true,
  style: 'cross',
  size: 12,
  thickness: 2,
  gap: 4,
  color: '#00ff00',
  opacity: 1,
  outline: {
    enabled: true,
    color: '#000000',
    width: 1
  },
  offset: { x: 0, y: 0 }
}
