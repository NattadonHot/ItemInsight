import { FaBars, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import "../Styles/Header.css";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onLogout: () => void;
}

export default function Header({ open, setOpen }: HeaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string>(
    localStorage.getItem("avatarUrl") ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  );

  useEffect(() => {
    // ฟังก์ชันที่จะถูกเรียกเมื่อมีการอัปเดต avatar
    const handleAvatarUpdate = () => {
      const newAvatar = localStorage.getItem("avatarUrl");
      if (newAvatar) {
        setAvatarUrl(newAvatar);
      }
    };

    // เพิ่ม event listener
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    // Cleanup
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <FaBars className="burger" onClick={() => setOpen(!open)} />
        <h1 className="logo">
          <span className="logo-white">Item</span>
          <span className="logo-orange">Insight</span>
        </h1>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <Link to="/profile">
        <img
          src={avatarUrl}
          alt="Profile"
          className="user-avatar"
          style={{
            marginRight:"50px",
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
          }}
        />
      </Link>
    </header>
  );
}