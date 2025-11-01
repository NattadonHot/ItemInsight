import React, { useEffect, useState } from "react";
import axios from "axios";
import type { ChangeEvent } from "react"; // ✅ ใช้ type-only import
import { useNavigate } from "react-router-dom";

const MAX_FILE_SIZE_MB = 2;
const API_URL = `${import.meta.env.VITE_URL_API}`;

const Profile: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [preview, setPreview] = useState<string>(
    localStorage.getItem("avatarUrl") ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "My Profile - ItemInsight";

    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");

    if (!storedUserId) {
      setError("❌ User not logged in");
      return;
    }

    setUserId(storedUserId);
    if (storedUsername) setUsername(storedUsername);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user/${storedUserId}`);
        const userData = res.data;

        if (userData.avatarUrl) {
          setPreview(userData.avatarUrl);
          localStorage.setItem("avatarUrl", userData.avatarUrl);
        }

        if (userData.username && !storedUsername) {
          setUsername(userData.username);
          localStorage.setItem("username", userData.username);
        }
      } catch (err) {
        console.error(err);
        setError("❌ Cannot fetch profile");
      }
    };

    fetchProfile();

    // ฟัง event อัปเดต avatar
    const handleAvatarUpdate = () => {
      const newAvatar = localStorage.getItem("avatarUrl");
      if (newAvatar) setPreview(newAvatar);
    };
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setUploadSuccess(false);

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setError("❌ Please select a valid image file (JPG or PNG only).");
      setSelectedFile(null);
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setError(`❌ File size too large (max ${MAX_FILE_SIZE_MB} MB).`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) {
      alert("Please select a file first!");
      return;
    }

    if (uploading) return;

    setUploading(true);
    setError("");
    setUploadSuccess(false);

    const data = new FormData();
    data.append("avatar", selectedFile);

    try {
      const res = await axios.put(`${API_URL}/api/avatar/${userId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAvatarUrl = res.data.avatarUrl;
      setPreview(newAvatarUrl);
      localStorage.setItem("avatarUrl", newAvatarUrl);
      window.dispatchEvent(new Event("avatarUpdated"));

      setSelectedFile(null);
      setUploadSuccess(true);

      alert("✅ Upload successful!");
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError("❌ Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 100,
      }}
    >
      <img
        src={preview}
        alt="Profile"
        style={{
          width: 170,
          height: 170,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid #3B82F6",
        }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <label
          htmlFor="file-input"
          style={{
            backgroundColor: "#6B7280",
            color: "#F9FAFB",
            padding: "8px 16px",
            borderRadius: 10,
            cursor: "pointer",
            fontFamily: "Poppins",
            fontWeight: 600,
          }}
        >
          Change
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          style={{
            backgroundColor: !selectedFile || uploading ? "#9CA3AF" : "#3B82F6",
            color: "#F9FAFB",
            padding: "8px 16px",
            borderRadius: 10,
            border: "none",
            fontFamily: "Poppins",
            fontSize: 16,
            fontWeight: 600,
            cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
            opacity: !selectedFile || uploading ? 0.6 : 1,
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {uploadSuccess && (
        <p
          style={{
            color: "green",
            marginTop: 10,
            fontFamily: "Poppins",
            fontWeight: 500,
          }}
        >
          ✅ Avatar updated successfully!
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 10, fontFamily: "Poppins" }}>
          {error}
        </p>
      )}

      <form className="profile-form">
        <div className="name-input" style={{ marginTop: "30px" }}>
          <label
            htmlFor="name"
            style={{
              fontSize: 22,
              fontFamily: "Poppins",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Username
          </label>
          <br />
          <input
            type="text"
            id="name"
            value={username}
            readOnly
            disabled
            style={{
              width: 400,
              height: 40,
              border: "2px solid #9CA3AF",
              backgroundColor: "#F3F4F6",
              paddingLeft: "10px",
              color: "#6B7280",
              cursor: "not-allowed",
            }}
            placeholder="Loading..."
          />
        </div>

        <div className="passwd-input" style={{ marginTop: "30px" }}>
          <label
            htmlFor="passwd"
            style={{
              fontSize: 22,
              fontFamily: "Poppins",
              fontWeight: "600",
              wordWrap: "break-word",
            }}
          >
            Password
          </label>
          <br />
          <div style={{ position: "relative" }}>
            <input
              type="password"
              id="passwd"
              disabled
              style={{
                width: 400,
                height: 40,
                border: "2px solid #3B82F6",
                backgroundColor: "#F9FAFB",
                paddingLeft: "10px",
                opacity: 0.7,
              }}
              placeholder="********"
            />
            <button
              type="button"
              onClick={handleChangePassword}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "transparent",
                border: "none",
                color: "#3B82F6",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                fontFamily: "Poppins",
              }}
            >
              Change Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;