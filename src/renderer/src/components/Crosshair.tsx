import type { CrosshairConfig } from '@shared/config'

const BOX = 200
const DIAG = Math.SQRT1_2

interface CrosshairProps {
  config: CrosshairConfig
}

type Line = [number, number, number, number]

interface Circle {
  cx: number
  cy: number
  r: number
  filled: boolean
}

interface Geometry {
  lines: Line[]
  circles: Circle[]
}

function geometry(config: CrosshairConfig, c: number): Geometry {
  const { style, size, thickness, gap } = config
  const lines: Line[] = []
  const circles: Circle[] = []

  const addCross = (): void => {
    lines.push([c, c - gap - size, c, c - gap])
    lines.push([c, c + gap, c, c + gap + size])
    lines.push([c - gap - size, c, c - gap, c])
    lines.push([c + gap, c, c + gap + size, c])
  }

  switch (style) {
    case 'cross':
      addCross()
      break

    case 'tcross':
      lines.push([c, c + gap, c, c + gap + size])
      lines.push([c - gap - size, c, c - gap, c])
      lines.push([c + gap, c, c + gap + size, c])
      break

    case 'x': {
      const g = gap * DIAG
      const s = (gap + size) * DIAG
      lines.push([c - s, c - s, c - g, c - g])
      lines.push([c + g, c + g, c + s, c + s])
      lines.push([c - s, c + s, c - g, c + g])
      lines.push([c + g, c - g, c + s, c - s])
      break
    }

    case 'chevron':
      lines.push([c - size, c - gap + size, c, c - gap])
      lines.push([c + size, c - gap + size, c, c - gap])
      break

    case 'dot':
      circles.push({ cx: c, cy: c, r: size / 2, filled: true })
      break

    case 'circle':
      circles.push({ cx: c, cy: c, r: size, filled: false })
      break

    case 'dot-circle':
      circles.push({ cx: c, cy: c, r: size, filled: false })
      circles.push({ cx: c, cy: c, r: thickness, filled: true })
      break

    case 'cross-dot':
      addCross()
      circles.push({ cx: c, cy: c, r: thickness, filled: true })
      break
  }

  return { lines, circles }
}

export function Crosshair({ config }: CrosshairProps): JSX.Element {
  const { color, opacity, outline, shadow, offset } = config
  const c = BOX / 2
  const { lines, circles } = geometry(config, c)
  const outlineWidth = config.thickness + outline.width * 2

  const filter = shadow.enabled
    ? `drop-shadow(0 0 ${shadow.blur}px ${shadow.color})`
    : undefined

  return (
    <svg
      width={BOX}
      height={BOX}
      viewBox={`0 0 ${BOX} ${BOX}`}
      style={{
        opacity,
        overflow: 'visible',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        filter
      }}
    >
      {outline.enabled &&
        lines.map(([x1, y1, x2, y2], i) => (
          <line
            key={`outline-line-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={outline.color}
            strokeWidth={outlineWidth}
          />
        ))}
      {outline.enabled &&
        circles.map(({ cx, cy, r, filled }, i) =>
          filled ? (
            <circle key={`outline-circle-${i}`} cx={cx} cy={cy} r={r + outline.width} fill={outline.color} />
          ) : (
            <circle
              key={`outline-circle-${i}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={outline.color}
              strokeWidth={outlineWidth}
            />
          )
        )}

      {lines.map(([x1, y1, x2, y2], i) => (
        <line
          key={`line-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={config.thickness}
        />
      ))}
      {circles.map(({ cx, cy, r, filled }, i) =>
        filled ? (
          <circle key={`circle-${i}`} cx={cx} cy={cy} r={r} fill={color} />
        ) : (
          <circle
            key={`circle-${i}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={config.thickness}
          />
        )
      )}
    </svg>
  )
}
