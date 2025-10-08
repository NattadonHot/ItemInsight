import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Components/Login";
import Register from "./Components/Register";

export default function App() {
  const [open, setOpen] = useState(false); // sidebar state
  const [isLoggedIn, setIsLoggedIn] = useState(false); // login state

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="app">
      <Header open={open} setOpen={setOpen}  onLogout={handleLogout}/>
      <Sidebar open={open} setOpen={setOpen} onLogout={handleLogout}/>
      <div
        className="main-content"
        onClick={() => setOpen(false)}
        style={{ transition: "filter 0.3s ease", padding: "20px" ,marginTop:"65px"}}
      >
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}
