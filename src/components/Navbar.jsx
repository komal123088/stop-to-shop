import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/img/logo.jpg";

import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="logo-group">
        {/* <img src={logo} alt="Stop and Shop Logo" className="logo" /> */}
        <span className="brand">STOP & SHOP</span>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="#categories" onClick={closeMenu}>
          Categories
        </a>
        <a href="#about" onClick={closeMenu}>
          About
        </a>
        <a href="#founder" onClick={closeMenu}>
          Founder
        </a>
        <a href="#contact" onClick={closeMenu}>
          Contact
        </a>

        <div className="nav-actions nav-actions-mobile">
          <button className="icon-btn" aria-label="Search">
            <i className="bi bi-search"></i>
          </button>
          <button className="icon-btn" aria-label="Cart">
            <i className="bi bi-cart3"></i>
          </button>
          <button className="icon-btn" aria-label="Account">
            <i className="bi bi-person-circle"></i>
          </button>
        </div>
      </div>

      <div className="nav-actions">
        <button className="icon-btn" aria-label="Search">
          <i className="bi bi-search"></i>
        </button>
        <button className="icon-btn" aria-label="Cart">
          <i className="bi bi-cart3"></i>
        </button>
        <button className="icon-btn" aria-label="Account">
          <i className="bi bi-person-circle"></i>
        </button>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <i
            className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"}`}
          ></i>
        </button>
        <button
          className="hamburger"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`}></i>
        </button>
      </div>

      {menuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;
