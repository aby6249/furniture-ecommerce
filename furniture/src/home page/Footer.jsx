import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";
import "./Footer.css";

const Footer = React.memo(() => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div>
          <h2>UrbanNest</h2>
          <p>Timeless designs for your favorite space.</p>
        </div>

        <div className="footer-links">
          <h3>Useful Links</h3>
          <ul>
            <li><Link to="/shop">Find a Store</Link></li>
            <li><Link to="/cart">About Us</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        <div>
          <h3><b>Contact Us</b></h3>
          <p>Email: urbannest@311.com</p>
          <p>Phone: +91 9785646438</p>
        </div>
      </div>

      <div className="app-icons">
        <div className="icon"><FaInstagram /></div>
        <div className="icon"><FaFacebook /></div>
        <div className="icon"><FaXTwitter /></div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} UrbanNest. All rights reserved.
      </div>
    </footer>
  );
});

export default Footer;
