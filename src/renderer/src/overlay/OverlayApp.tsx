import { useEffect, useState } from 'react'
import type { CrosshairConfig } from '@shared/config'
import { Crosshair } from '../components/Crosshair'

export function OverlayApp(): JSX.Element | null {
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

  return (
    <div className="overlay-root">{config.visible && <Crosshair config={config} />}</div>
  )
}
