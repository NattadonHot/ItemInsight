import {
  FaUser,
  FaHome,
  FaCog,
  FaBookmark,
  FaStar,
  FaPen,
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

export default function Sidebar({ open, setOpen , onLogout}: SidebarProps) {
  return (
    <div className={`sidebar-container ${open ? "open" : ""}`}>
      <div className="sidebar">
        <Link to="/profile" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaUser /> Profile
        </Link>
        <Link to="/home" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaHome /> Home
        </Link>
        <Link to="/settings" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaCog /> Setting
        </Link>
        <Link to="/bookmarks" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaBookmark /> Bookmark
        </Link>
        <Link to="/favorites" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaStar /> Favorite
        </Link>
        <Link to="/write" className="sidebar-link" onClick={() => setOpen(false)}>
          <FaPen /> Write
        </Link>
        <Link to="/login" className="sidebar-link sidebar-logout" onClick={() => {setOpen(false); onLogout();}}>
          <CiLogout /> Logout
        </Link>
      </div>
    </div>
  );
}
