import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";
import "../Styles/Header.css";
import type { Dispatch, SetStateAction } from "react";

interface HeaderProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onLogout: () => void;
}

export default function Header({ open, setOpen, onLogout }: HeaderProps) {
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
      <FaUserCircle className="user-icon" onClick={onLogout} />
    </header>
  );
}
