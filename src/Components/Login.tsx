import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // ✅ ถ้า login สำเร็จ
      if (response.status === 200) {
        setMessage("✅ Login successful!");

        // เก็บ token หรือ user data ไว้ใน localStorage
        localStorage.setItem("token", response.data.token || "");
        localStorage.setItem("userEmail", email);

        // ✅ ไปหน้า Home
        setTimeout(() => navigate("/home"), 1000);
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

      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="button" className="btn-login" onClick={handleLogin}>
          LOGIN
        </button>

        {message && <p className="login-message">{message}</p>}

        <p className="signup-link" onClick={() => navigate("/register")}>
          Don’t have an account? Sign up
        </p>
      </form>
    </div>
  );
}

export default Login;
