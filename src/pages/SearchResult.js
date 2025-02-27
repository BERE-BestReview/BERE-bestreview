import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import "../component/Css/Search_Result.css";
import { Progress } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import SCBackImg from "../Search_Check_Background.png";

export const SearchResult = () => {
  const location = useLocation();
  const { accuracy, text3, text4, text5, reviews } = location.state || {};
  const navigate = useNavigate();

  const calculateGrade = (accuracy) => {
    if (accuracy >= 90) {
      return "A";
    } else if (accuracy >= 80) {
      return "B";
    } else if (accuracy >= 70) {
      return "C";
    } else if (accuracy >= 60) {
      return "D";
    } else {
      return "F";
    }
  };

  const calculateProgress = (accuracy) => {
    if (accuracy === null || accuracy === undefined) return 0;
    if (accuracy >= 90) {
      return 100;
    } else if (accuracy >= 80) {
      return 80;
    } else if (accuracy >= 70) {
      return 70;
    } else if (accuracy >= 60) {
      return 60;
    } else {
      return 50;
    }
  };

  const button1 = () => {
    navigate("/SearchResultDetails", {
      state: { reviews, accuracy },
    });
  };

  return (
    <div className="result_body">
      <Header />
      <div className="title4">조회 결과</div>
      <img src={SCBackImg} alt="" className="page-container" />
      <div className="parent">
        <button onClick={button1} className="div11">
          상세보기
        </button>

        <div className="div12">
          <Progress
            type="circle"
            percent={accuracy !== null ? calculateProgress(accuracy) : 0}
            showInfo={false}
            strokeWidth={20}
            format={() =>
              accuracy !== null
                ? `${calculateProgress(accuracy)}%`
                : "Loading..."
            }
          />
        </div>
        <div className="grade">
          {accuracy !== null ? calculateGrade(accuracy) : "Loading..."}
        </div>
        <div className="div13">{text3 || "No description available"}</div>
        <div className="div14">{text4 || "No description available"}</div>
        <div className="div15">{text5 || "No description available"}</div>
      </div>
      <Footer />
    </div>
  );
};
