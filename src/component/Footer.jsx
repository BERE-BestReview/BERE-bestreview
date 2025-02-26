import React from "react";
import footerlogo from "../footerlogo.png";
import "./Css/Footer.css";

export const Footer = () => {
  return (
    <footer id="Footer_Nav">
      <div id="text_footer">
        <a href="/ReviewCheck" className="footer-link">
          이용약관
        </a>
        <img src={footerlogo} alt="footerlogo" id="footer-logo" />
        <a href="/Inquiry" className="footer-link">
          문의하기
        </a>
      </div>
    </footer>
  );
};
