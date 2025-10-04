import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Profile from './Profile';
import Home from './Home';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
