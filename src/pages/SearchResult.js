import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import "../component/Css/Search_Result.css";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import SCBackImg from "../Search_Check_Background.png";
import axios from "axios"; // axios 임포트

export const SearchResult = () => {
  const navigate = useNavigate();

  const [accuracy, setAccuracy] = useState(null);
  const [summary, setSummary] = useState("");
  const [originalReview, setOriginalReview] = useState("");
  const [fakeOrReal, setFakeOrReal] = useState("");
  const [reviews, setReviews] = useState([]);

  // API 호출하여 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/result"); // 실제 API 엔드포인트로 교체 필요
        if (response.data) {
          const { accuracy, summary, original_review, fake_or_real, reviews } =
            response.data;

          setAccuracy(accuracy);
          setSummary(summary || "No description available");
          setOriginalReview(original_review || "No review available");
          setFakeOrReal(fake_or_real || "Unknown");
          setReviews(reviews || []); // reviews가 배열로 있다고 가정
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
        <div className="div13">{summary}</div>
        <div className="div14">{originalReview}</div>
        <div className="div15">{fakeOrReal}</div>
      </div>
      <Footer />
    </div>
  );
};
