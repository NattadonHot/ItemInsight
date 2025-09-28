import { FaUser, FaHome, FaCog, FaBookmark, FaStar, FaPen, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../Styles/Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <Link to="/profile" className="sidebar-link"><FaUser /> Profile</Link>
        <Link to="/home" className="sidebar-link"><FaHome /> Home</Link>
        <Link to="/settings" className="sidebar-link"><FaCog /> Setting</Link>
        <Link to="/bookmarks" className="sidebar-link"><FaBookmark /> Bookmark</Link>
        <Link to="/favorites" className="sidebar-link"><FaStar /> Favorite</Link>
        <Link to="/write" className="sidebar-link"><FaPen /> Write</Link>

        <div className="logout">
          <Link to="/logout" className="sidebar-link"><FaSignOutAlt /> Logout</Link>
        </div>
      </div>
    </div>
  );
}
