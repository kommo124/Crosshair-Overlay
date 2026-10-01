import type { CrosshairConfig } from '@shared/config'

const BOX = 200

interface CrosshairProps {
  config: CrosshairConfig
}

export function Crosshair({ config }: CrosshairProps): JSX.Element {
  const { style, size, thickness, gap, color, opacity, outline, offset } = config
  const c = BOX / 2
  const outlineWidth = thickness + outline.width * 2

  const arms: Array<[number, number, number, number]> = []
  if (style === 'cross' || style === 'tcross') {
    arms.push([c, c - gap - size, c, c - gap])
    arms.push([c, c + gap, c, c + gap + size])
    arms.push([c - gap - size, c, c - gap, c])
    arms.push([c + gap, c, c + gap + size, c])
    if (style === 'tcross') arms.shift()
  }

  return (
    <svg
      width={BOX}
      height={BOX}
      viewBox={`0 0 ${BOX} ${BOX}`}
      style={{
        opacity,
        overflow: 'visible',
        transform: `translate(${offset.x}px, ${offset.y}px)`
      }}
    >
      {outline.enabled &&
        arms.map(([x1, y1, x2, y2], i) => (
          <line
            key={`outline-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={outline.color}
            strokeWidth={outlineWidth}
          />
        ))}
      {arms.map(([x1, y1, x2, y2], i) => (
        <line
          key={`main-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={thickness}
        />
      ))}
      {style === 'dot' && (
        <>
          {outline.enabled && (
            <circle cx={c} cy={c} r={size / 2 + outline.width} fill={outline.color} />
          )}
          <circle cx={c} cy={c} r={size / 2} fill={color} />
        </>
      )}
      {style === 'circle' && (
        <>
          {outline.enabled && (
            <circle
              cx={c}
              cy={c}
              r={size}
              fill="none"
              stroke={outline.color}
              strokeWidth={outlineWidth}
            />
          )}
          <circle cx={c} cy={c} r={size} fill="none" stroke={color} strokeWidth={thickness} />
        </>
      )}
    </svg>
  )
}
