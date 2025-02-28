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

  const handleUrlChange = (e) => setUrl(e.target.value);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

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
      await axios.post("http://localhost:5001/URL", { url });

      navigate("/SearchResult"); // 데이터 전달 없이 이동
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

      {loading && <Spin spinning={loading} fullscreen />}

      <Modal
        visible={isModalVisible}
        error={error}
        onClose={() => setIsModalVisible(false)}
      />
      <Footer />
    </div>
  );
};
