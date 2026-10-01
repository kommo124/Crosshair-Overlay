import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps): JSX.Element {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="section-body">{children}</div>
    </section>
  )
}

interface SliderRowProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  display?: string
  onChange: (value: number) => void
}

export function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  display,
  onChange
}: SliderRowProps): JSX.Element {
  return (
    <label className="row">
      <span className="row-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <span className="row-value">{display ?? value}</span>
    </label>
  )
}

interface CheckboxRowProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxRow({ label, checked, onChange }: CheckboxRowProps): JSX.Element {
  return (
    <label className="row checkbox">
      <span className="row-label">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}

interface ColorRowProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function ColorRow({ label, value, onChange }: ColorRowProps): JSX.Element {
  return (
    <label className="row">
      <span className="row-label">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}
