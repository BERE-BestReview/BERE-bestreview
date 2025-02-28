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

    if (!validateUrl(url)) {
      setError(
        "유효하지 않은 URL입니다. http:// 또는 https://로 시작해야 합니다."
      );
      setIsModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5001/URL", { url });

      // 응답이 없거나 데이터가 비어 있으면 에러 처리
      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error("서버에서 유효한 응답을 받지 못했습니다.");
      }

      // 필요한 데이터가 모두 있는지 확인
      const { accuracy, summary, original_review, fake_or_real, reviews } =
        response.data;
      if (
        !accuracy ||
        !summary ||
        !original_review ||
        !fake_or_real ||
        !reviews
      ) {
        throw new Error("서버 응답 데이터가 올바르지 않습니다.");
      }

      // 모든 데이터가 정상적으로 있으면 페이지 이동
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
          "서버에서 응답을 받지 못했습니다. 다시 시도해주세요."
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
