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

      // 응답 데이터 처리
      const { accuracy, fake_or_real, original_review } = response.data || {};

      if (typeof accuracy !== "number")
        throw new Error("accuracy 값이 숫자가 아닙니다.");

      // fake_or_real이 "real"인 경우만 리뷰 저장
      const realReviews =
        fake_or_real?.toLowerCase() === "real"
          ? [{ content: original_review }]
          : [];

      // 결과 페이지로 이동
      navigate("/SearchResult");
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
