import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css";

interface RegisterProps {
  onRegister: () => void;
}

export default function Register({ onRegister }: RegisterProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      // 1️⃣ Register user
      const registerResponse = await axios.post(
        `${import.meta.env.VITE_URL_API}/api/register`,
        { username, email, password }
      );

      console.log("✅ Register success:", registerResponse.data);
      setMessage("✅ Registered successfully!");

      // 2️⃣ Auto-login after register
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_URL_API}/api/login`,
        { email, password }
      );

      const { token, user } = loginResponse.data;
      console.log("🔐 Login success:", user);

      // 3️⃣ Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("avatarUrl", user.avatarUrl);
      localStorage.setItem("username", user.username);

      // 4️⃣ Callback + redirect to home
      onRegister();
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      if (err.response) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Cannot connect to server");
      }
    }
  };

  useEffect(() => {
    document.title = "ItemInsight";
  }, []);

  return (
    <div className="register-container">
      <h1 className="logo">
        <span className="logo-dark">Item</span>
        <span className="logo-orange">Insight</span>
      </h1>

      <form className="register-form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirm">Confirm Password</label>
        <input
          type="password"
          id="confirm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="button" className="btn-register" onClick={handleRegister}>
          REGISTER
        </button>

        {message && <p className="register-message">{message}</p>}

        <p className="login-link" onClick={() => navigate("/login")}>
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
