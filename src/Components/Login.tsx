import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL_API}/api/login`, { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;
        setMessage("✅ Login successful!");

        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id); //เก็บ userId
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("avatarUrl", user.avatarUrl);
        setTimeout(() => onLogin(), 500);
      }
    } catch (err: any) {
      if (err.response) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Cannot connect to server");
      }
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">
        <span className="logo-dark">Item</span>
        <span className="logo-orange">Insight</span>
      </h1>

      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <label>Email</label>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="btn-login">LOGIN</button>

        {message && <p className="login-message">{message}</p>}

        <p className="signup-link" onClick={() => navigate("/register")}>
          Don’t have an account? Sign up
        </p>
      </form>
    </div>
  );
}
