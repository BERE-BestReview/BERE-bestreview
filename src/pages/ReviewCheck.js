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

  // URL 입력 변경 핸들러
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // URL 유효성 검사 함수
  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // URL 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // URL 유효성 검사
    if (!validateUrl(url)) {
      setError(
        "유효하지 않은 URL입니다. http:// 또는 https://로 시작해야 합니다."
      );
      setIsModalVisible(true);
      return;
    }

    setLoading(true);

    try {
      // axios를 사용하여 POST 요청 보내기
      const response = await axios.post("http://localhost:3000/api/URL", {
        url,
      });

      console.log("Response from backend:", response.data);

      // 백엔드에서 받은 데이터를 기반으로 페이지 이동
      navigate("/SearchResult", {
        state: {
          reviews: response.data.reviews,
          accuracy: response.data.accuracy,
          text3: response.data.text3,
          text4: response.data.text4,
          text5: response.data.text5,
          url: url,
        },
      });
    } catch (error) {
      console.error("There was an error submitting the URL:", error);

      // 에러 핸들링
      if (error.response) {
        // 서버에서 응답을 보낸 경우 (400, 500 에러 등)
        setError(
          error.response.data.message || "요청 처리 중 오류가 발생했습니다."
        );
      } else if (error.request) {
        // 요청은 보내졌지만 응답이 없는 경우 (서버 다운 등)
        setError("서버에 응답이 없습니다. 다시 시도해주세요.");
      } else {
        // 요청 설정 중 오류 발생
        setError("요청을 보내는 중 오류가 발생했습니다.");
      }

      setIsModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="check">
      <Header />
      <div className="url-input-container">
        <img src={logo} alt="img" className="Review_Check_Logo" />
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
          ></Button>
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
