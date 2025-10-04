import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Hello from './Components/Login'
import Home from './Home'
import Profile from './Profile'
import Sidebar from './Components/Sidebar'
import AppRoutes from './Routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Sidebar />
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
