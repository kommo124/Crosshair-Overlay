import React from 'react'
import { createRoot } from 'react-dom/client'
import { OverlayApp } from './OverlayApp'
import '../styles/global.css'

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <OverlayApp />
    </React.StrictMode>
  )
}
