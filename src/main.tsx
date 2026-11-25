import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/black-ops-one/400.css'
import '@fontsource/teko/400.css'
import '@fontsource/teko/500.css'
import '@fontsource/teko/600.css'
import '@fontsource/teko/700.css'
import '@fontsource/noto-sans-bengali/400.css'
import '@fontsource/noto-sans-bengali/500.css'
import '@fontsource/noto-sans-bengali/600.css'
import '@fontsource/noto-sans-bengali/700.css'

import './index.css'
import './styles/theme.css'
import './styles/appearance.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)