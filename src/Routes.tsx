import { Routes, Route } from 'react-router-dom';
import Hello from './Components/Login';
import Profile from './Profile';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Hello />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
