import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import Home from "./Home";
import Profile from "./Profile";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProtectedRoute from "./Components/ProtectedRoute";
import Write from "./Write";
import PostDetail from "./PostDetail";
import MyPosts from "./Myposts";
import Bookmark from "./Bookmark";
import ChangePassword from "./ChangePassword";

export default function App() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ✅ ยังคงป้องกันระดับ App ไว้
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
      <Header open={open} setOpen={setOpen} onLogout={handleLogout} />
      <Sidebar open={open} setOpen={setOpen} onLogout={handleLogout} />
      <div className="main-content" onClick={() => setOpen(false)}>
        <Routes>
          {/* ✅ เพิ่ม ProtectedRoute สำหรับแต่ละ route */}
          <Route path="/home" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/write" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Write />
            </ProtectedRoute>
          } />
          <Route path="/posts/:slug" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <PostDetail />
            </ProtectedRoute>
          } />
          <Route path="/myposts" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyPosts />
            </ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Bookmark />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}