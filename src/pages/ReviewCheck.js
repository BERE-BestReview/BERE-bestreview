import React, { useState } from "react";
import { Footer } from "../component/Footer";
import { Header } from "../component/Header";
import "../component/Css/Review_Check.css";
import logo from "../Search_Check_Back.png";
import { Input, Button, Spin } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import axios from "axios";

export const ReviewCheck = () => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // URL 입력값 처리
  const handleUrlChange = (e) => setUrl(e.target.value);

  // URL 유효성 검사
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // 데이터 요청 및 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsModalVisible(false);

    // 유효하지 않은 URL인 경우
    if (!validateUrl(url)) {
      setError(
        "유효하지 않은 URL입니다. http:// 또는 https://로 시작해야 합니다."
      );
      setIsModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      // 데이터 요청
      const response = await axios.post("http://localhost:5001/result", {
        url,
      });

      // 서버로부터 데이터를 받아온 후, SearchResult로 전달
      const { accuracy, summary, original_review, fake_or_real, reviews } =
        response.data;

      // 데이터가 유효하면 SearchResult 페이지로 데이터를 전달
      navigate("/SearchResult", {
        state: {
          accuracy,
          summary,
          original_review,
          fake_or_real,
          reviews,
        },
      });
    } catch (error) {
      console.error("Error submitting the URL:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "요청 처리 중 오류가 발생했습니다."
      );
      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫기
  const handleModalClose = () => setIsModalVisible(false);

  return (
    <div className="check">
      <Header />
      <div className="url-input-container">
        <img src={logo} alt="Logo" className="Review_Check_Logo" />
        <h1 className="Review_text">BestReview</h1>

        <form onSubmit={handleSubmit} className="check_form">
          <Input
            className="Review_Check_input"
            type="url"
            placeholder="Enter URL"
            value={url}
            onChange={handleUrlChange}
            size="large"
          />
          <Button
            icon={<RightCircleOutlined />}
            className="button"
            type="primary"
            htmlType="submit"
            disabled={loading}
          />
        </form>
      </div>

      {loading && (
        <div className="progress-container">
          <Spin spinning={loading} fullscreen />
        </div>
      )}

      <Modal
        visible={isModalVisible}
        error={error}
        onClose={handleModalClose}
      />
      <Footer />
    </div>
  );
};
