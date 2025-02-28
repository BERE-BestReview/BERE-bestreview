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
      // URL에서 fileName 추출 (예: URL 끝부분에서 파일 이름을 추출)
      const fileName = url.split("/").pop();

      if (!fileName) {
        throw new Error("URL에서 fileName을 추출할 수 없습니다.");
      }

      // fileName을 사용해 파일 데이터 요청
      const fileUrl = `http://localhost:3000/file/${fileName}`;
      const fileResponse = await axios.get(fileUrl);

      console.log("File Data from backend:", fileResponse.data);

      // 파일 데이터 유효성 검사
      if (!fileResponse.data || fileResponse.data.accuracy == null) {
        throw new Error("파일 데이터가 유효하지 않습니다.");
      }

      // 정상 데이터일 경우 페이지 이동
      navigate("/SearchResult", {
        state: {
          accuracy: fileResponse.data.accuracy, // 파일 데이터에서 accuracy 가져오기
        },
      });
    } catch (error) {
      console.error("There was an error submitting the URL:", error);

      // 에러 메시지 설정
      let errorMessage = "요청 처리 중 오류가 발생했습니다.";

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = "서버에 응답이 없습니다. 다시 시도해주세요.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
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
