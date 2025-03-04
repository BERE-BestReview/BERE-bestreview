import React, { useEffect, useState } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import "../component/Css/Search_Result.css";
import { Progress } from "antd";
import { useNavigate } from "react-router-dom";
import SCBackImg from "../Search_Check_Background.png";
import axios from "axios";

export const SearchResult = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/result");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="result_body">
      <Header />
      <div className="title4">조회 결과</div>
      <img src={SCBackImg} alt="" className="page-container" />

      {loading ? (
        <div className="loding">Loading...</div>
      ) : data ? (
        <div className="parent">
          <button
            onClick={() => navigate("/SearchResultDetails")}
            className="div11"
          >
            상세보기
          </button>

          <div className="div12">
            <Progress
              type="circle"
              percent={Math.round(data.accuracy)}
              showInfo
            />
          </div>
          <div className="grade">
            {data.accuracy >= 90
              ? "A"
              : data.accuracy >= 80
                ? "B"
                : data.accuracy >= 70
                  ? "C"
                  : "F"}
          </div>
          <div className="div13">{data.summary}</div>
          <div className="div14">{data.original_review}</div>
          <div className="div15">{data.fake_or_real}</div>
        </div>
      ) : (
        <div className="error-message">데이터를 불러올 수 없습니다.</div>
      )}
      <Footer />
    </div>
  );
};
