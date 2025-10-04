import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";
import "../Styles/Header.css";
import "../Components/Sidebar"
import { useState } from "react";

export default function Header() {
    const [open,setOpen] = useState(false);
 
    return (
        <header className="header">

        <div className="header-left">
            <FaBars className="burger" onClick={() => setOpen(true)}/>
            <h1 className="logo">
            <span className="logo-white">Item</span>
            <span className="logo-orange">Insight</span>
            </h1>

            <div className="search-box">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search..." />
            </div>
        </div>

        <FaUserCircle className="user-icon" />
        </header>
    );
}
