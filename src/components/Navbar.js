import React from "react";
import { Link } from "react-router-dom";
import "../styles.css"; // Import styles

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">SwiftShare</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="/retrieve">Retrieve</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
