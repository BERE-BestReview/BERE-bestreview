import React from "react";
import { Link } from "react-router-dom";
import titlelogo from "../mainreview.png";
import "./Css/Header.css";
import usericon from "../usericon.png";

export const Header = () => {
  return (
    <nav id="Nav_header">
      <Link to="/" id="titlelogo-link">
        {" "}
        <img src={titlelogo} alt="mainlogo" id="titlelogo" />
      </Link>
      <Link to="/ReviewCheck" className="nav-link">
        리뷰조회
      </Link>
      <Link to="/Record" className="nav-link">
        기록조회
      </Link>
      <Link to="/Statics" className="nav-link">
        통계정보
      </Link>
      <Link to="/Login" className="nav-link">
        <img src={usericon} alt="usericon" className="usericon" />
      </Link>
    </nav>
  );
};
