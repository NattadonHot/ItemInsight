import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_URL_API}`;

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("❌ User not logged in.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("❌ New password and confirm password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("❌ Password must be at least 6 characters.");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/user/password/${userId}`, {
        currentPassword,
        newPassword,
      });

      setSuccess("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || "❌ Failed to change password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 100,
        fontFamily: "Poppins",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Change Password</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 30,
          width: 400,
        }}
      >
        <div>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 10,
              borderRadius: 5,
              border: "1px solid #9CA3AF",
            }}
          />
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 10,
              borderRadius: 5,
              border: "1px solid #9CA3AF",
            }}
          />
        </div>

        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              width: "100%",
              height: 40,
              paddingLeft: 10,
              borderRadius: 5,
              border: "1px solid #9CA3AF",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#3B82F6",
            color: "#F9FAFB",
            padding: "10px",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Change Password
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: 10 }}>{success}</p>}
    </div>
  );
};

export default ChangePassword;
