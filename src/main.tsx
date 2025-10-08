import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Components/Login'
import Home from './Home'
import Profile from './Profile'
import Sidebar from './Components/Sidebar'
import AppRoutes from './Routes';
import Header from './Components/Header';
import Register from './Components/Register';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ให้หน้าแรก redirect ไป login */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  </StrictMode>,
)
