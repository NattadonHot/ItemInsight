import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Hello from './Components/Login'
import Profile from './Profile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Hello />
  </StrictMode>,
)
