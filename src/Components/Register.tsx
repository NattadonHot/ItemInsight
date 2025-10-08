import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Register.css"; // ✅ ใช้ CSS ใหม่

function Register() {
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
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
      });

      setMessage("✅ Registered successfully!");
      console.log("Response:", response.data);

      // เปลี่ยนหน้าไป login หลังสมัครเสร็จ
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      if (err.response) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Cannot connect to server");
      }
    }
  };

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

export default Register;
