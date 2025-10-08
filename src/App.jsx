import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Home from './Home';
import Profile from './Profile';
import Login from './Components/Login';
import Register from './Components/Register';

export default function App() {
  const [open, setOpen] = useState(false); // state sidebar

  return (
    <div className="app">
      <Header open={open} setOpen={setOpen} />
      <Sidebar open={open} setOpen={setOpen} />
      <div
        className="main-content"
        onClick={() => setOpen(false)}
        style={{ transition: "filter 0.3s ease", padding: "20px" }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/home" element={<Home />} />
          {/* redirect หน้าไม่พบไป login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}
