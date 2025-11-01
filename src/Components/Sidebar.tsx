import {
  FaUser,
  FaHome,
  FaCog,
  FaBookmark,
  FaPen,
  FaRegListAlt,   // ✅ เพิ่มไอคอนสำหรับ My Posts
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { Link } from "react-router-dom";
import "../Styles/Sidebar.css";
import type { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onLogout: () => void;
}

export default function Sidebar({ open, setOpen, onLogout }: SidebarProps) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatarUrl");
    onLogout();
  };

  return (
    <div className={`sidebar-container ${open ? "open" : ""}`}>
      <div className="sidebar">
        <Link to="/home" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaHome /> Home
        </Link>

        <Link to="/profile" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaUser /> Profile
        </Link>

        <Link to="/write" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaPen /> Write
        </Link>

        {/* ✅ เพิ่ม My Posts */}
        <Link to="/myposts" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaRegListAlt /> My Posts
        </Link>

        <Link to="/bookmarks" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaBookmark /> Bookmark
        </Link>
        
        <div
          className="sidebar-link sidebar-logout"
          onClick={() => {
            setOpen(false);
            handleLogout();
          }}
          style={{ cursor: "pointer" }}
        >
          <CiLogout /> Logout
        </div>
      </div>
    </div>
  );
}
